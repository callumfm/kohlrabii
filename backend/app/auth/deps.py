from typing import Annotated

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from supabase import AsyncClientOptions
from supabase._async.client import AsyncClient, create_client

from app.auth.models import UserIn
from app.config import config
from app.logger import logger


async def get_supabase_client() -> AsyncClient:
    """for validation access_token init at life span event"""
    supabase_client = await create_client(
        supabase_url=config.SUPABASE_URL,
        supabase_key=config.SUPABASE_SERVICE_KEY,
        options=AsyncClientOptions(
            postgrest_client_timeout=10, storage_client_timeout=10
        ),
    )
    if not supabase_client:
        raise HTTPException(status_code=500, detail="Super client not initialized")
    return supabase_client


SupabaseClient = Annotated[AsyncClient, Depends(get_supabase_client)]


reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{config.API_V1_STR}/login/access-token"
)
TokenDep = Annotated[str, Depends(reusable_oauth2)]


async def get_current_user(token: TokenDep, supabase_client: SupabaseClient) -> UserIn:
    """get current user from token and  validate same time"""
    user_rsp = await supabase_client.auth.get_user(jwt=token)
    if not user_rsp:
        logger.error("User not found")
        raise HTTPException(status_code=404, detail="User not found")
    return UserIn(**user_rsp.user.model_dump(), access_token=token)
