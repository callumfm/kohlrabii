import logging
import sys

logging.getLogger("httpx").setLevel(logging.ERROR)
logger = logging.getLogger("app")
logger.propagate = False

if not logger.handlers:
    handler = logging.StreamHandler(sys.stdout)
    formatter = logging.Formatter(
        fmt="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)

uvicorn_logger = logging.getLogger("uvicorn")
for handler in logger.handlers:  # type: ignore[assignment]
    if handler not in uvicorn_logger.handlers:
        uvicorn_logger.addHandler(handler)
