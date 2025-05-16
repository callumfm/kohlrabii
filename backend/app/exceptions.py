from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import HTTPException, RequestValidationError
from fastapi.responses import JSONResponse
from starlette.requests import Request


class NotFoundError(Exception):
    code = "not_found"
    msg_template = "{msg}"


async def request_validation_error_handler(
    request: Request,  # noqa: ARG001
    exc: RequestValidationError,
) -> JSONResponse:
    # logger.error(
    #     f"Request ID: {get_request_id()} raised a validation exception: {exc}"
    # )
    return JSONResponse(
        status_code=422,
        content={
            "error": type(exc).__name__,
            "detail": jsonable_encoder(exc.errors()),
        },
    )


async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:  # noqa: ARG001
    # logger.error(f"Request ID: {get_request_id()} raised an http exception: {exc}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail},
    )


def add_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(
        RequestValidationError,
        request_validation_error_handler,  # type: ignore
    )
    app.add_exception_handler(
        HTTPException,
        http_exception_handler,  # type: ignore
    )
