import time
from collections.abc import Awaitable, Callable
from contextvars import ContextVar
from typing import Final
from uuid import uuid1

from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import HTTPException, RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.orm import scoped_session, sessionmaker
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from app.database.core import engine
from app.logger import logger

REQUEST_ID_CTX_KEY: Final[str] = "request_id"
_request_id_ctx_var: ContextVar[str | None] = ContextVar(
    REQUEST_ID_CTX_KEY, default=None
)


def get_request_id() -> str | None:
    return _request_id_ctx_var.get()


class HttpExceptionHandler:
    @staticmethod
    async def handle(
        request: Request,  # noqa: ARG001
        exc: HTTPException,
    ) -> JSONResponse:
        logger.error(f"Request ID: {get_request_id()} raised an http exception: {exc}")
        return JSONResponse(
            status_code=exc.status_code,
            content={"message": exc.detail},
        )


class RequestValidationHandler:
    @staticmethod
    async def handle(
        request: Request,  # noqa: ARG001
        exc: RequestValidationError,
    ) -> JSONResponse:
        logger.error(
            f"Request ID: {get_request_id()} raised a validation exception: {exc}"
        )
        return JSONResponse(
            status_code=422,
            content={
                "error": type(exc).__name__,
                "detail": jsonable_encoder(exc.errors()),
            },
        )


class ProcessTimeMiddleware(BaseHTTPMiddleware):
    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        start_time = time.perf_counter()
        response = await call_next(request)
        process_time = time.perf_counter() - start_time
        process_time_ms = f"{process_time * 1000:.0f}ms"
        response.headers["X-Process-Time"] = process_time_ms
        return response


class DbSessionMiddleware(BaseHTTPMiddleware):
    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        request_id = str(uuid1())
        ctx_token = _request_id_ctx_var.set(request_id)

        try:
            session = scoped_session(
                sessionmaker(bind=engine), scopefunc=get_request_id
            )
            request.state.db = session
            response = await call_next(request)
        except Exception as e:
            logger.error(f"Request ID: {request_id} raised an exception: {e}")
            raise e from None
        finally:
            request.state.db.close()

        _request_id_ctx_var.reset(ctx_token)
        return response
