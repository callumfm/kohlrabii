from fastapi import APIRouter, FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.config import config
from app.enums import Environment
from app.exceptions import add_exception_handlers
from app.fixtures.api import router as fixtures_router
from app.middleware import DbSessionMiddleware, ProcessTimeMiddleware
from app.seasons.api import router as seasons_router
from app.sentry import configure_sentry
from app.teams.api import router as teams_router

configure_sentry()

app = FastAPI(
    title=config.PROJECT_NAME,
    openapi_url=f"{config.API_V1_STR}/openapi.json",
    generate_unique_id_function=lambda r: f"{r.tags[0]}_{r.name}",
    debug=config.ENVIRONMENT != Environment.PROD,
)

# Exception handlers
add_exception_handlers(app)

# Middleware
app.add_middleware(DbSessionMiddleware)
app.add_middleware(ProcessTimeMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[config.FRONTEND_URL],
    allow_origin_regex=config.FRONTEND_PREVIEW_URL,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Process-Time"],
)

# API routes
api_router = APIRouter()
api_router.include_router(fixtures_router)
api_router.include_router(teams_router)
api_router.include_router(seasons_router)

app.include_router(api_router, prefix=config.API_V1_STR)
