import time
from collections.abc import Awaitable, Callable
from contextvars import ContextVar
from typing import Final
from uuid import uuid1

from fastapi import APIRouter, FastAPI
from fastapi.exceptions import HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import scoped_session, sessionmaker
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import Response

from app.config import config
from app.database.core import engine
from app.enums import Environment
from app.fixture_forecasts.api import router as fixture_forecasts_router
from app.logger import logger

app = FastAPI(
    title=config.PROJECT_NAME,
    openapi_url=f"{config.API_V1_STR}/openapi.json",
    generate_unique_id_function=lambda r: f"{r.tags[0]}_{r.name}",
    debug=config.ENVIRONMENT != Environment.PROD,
)

REQUEST_ID_CTX_KEY: Final[str] = "request_id"
_request_id_ctx_var: ContextVar[str | None] = ContextVar(
    REQUEST_ID_CTX_KEY, default=None
)


def get_request_id() -> str | None:
    return _request_id_ctx_var.get()


@app.exception_handler(HTTPException)
async def http_exception_handler(
    request: Request,  # noqa: ARG001
    exc: HTTPException,
) -> JSONResponse:
    logger.error(f"Request ID: {get_request_id()} raised an exception: {exc}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail},
    )


@app.middleware("http")
async def db_session_middleware(
    request: Request, call_next: Callable[[Request], Awaitable[Response]]
) -> Response:
    request_id = str(uuid1())
    ctx_token = _request_id_ctx_var.set(request_id)

    try:
        session = scoped_session(sessionmaker(bind=engine), scopefunc=get_request_id)
        request.state.db = session
        response = await call_next(request)
    except Exception as e:
        logger.error(f"Request ID: {request_id} raised an exception: {e}")
        raise e from None
    finally:
        request.state.db.close()

    _request_id_ctx_var.reset(ctx_token)
    return response


@app.middleware("http")
async def add_process_time_header(
    request: Request, call_next: Callable[[Request], Awaitable[Response]]
) -> Response:
    start_time = time.perf_counter()
    response = await call_next(request)
    process_time = time.perf_counter() - start_time
    process_time_ms = f"{process_time * 1000:.0f}ms"
    response.headers["X-Process-Time"] = process_time_ms
    return response


if config.ALL_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=config.ALL_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["X-Process-Time"],
    )


api_router = APIRouter()
api_router.include_router(fixture_forecasts_router)

app.include_router(api_router, prefix=config.API_V1_STR)
