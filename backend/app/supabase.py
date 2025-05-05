from typing import Annotated

from fastapi import Depends, HTTPException
from supabase import AsyncClientOptions, Client, create_client
from supabase._async.client import AsyncClient
from supabase._async.client import create_client as create_async_client

from app.config import config


async def get_async_supabase_client() -> AsyncClient:
    """Async supabase client."""
    supabase_client = await create_async_client(
        supabase_url=config.SUPABASE_URL,
        supabase_key=config.SUPABASE_SERVICE_KEY,
        options=AsyncClientOptions(
            postgrest_client_timeout=10, storage_client_timeout=10
        ),
    )
    if not supabase_client:
        raise HTTPException(
            status_code=500, detail="Async Supabase client not initialized"
        )
    return supabase_client


AsyncSupabaseClient = Annotated[AsyncClient, Depends(get_async_supabase_client)]


def get_supabase_client() -> Client:
    """Sync supabase client."""
    supabase_client = create_client(
        supabase_url=config.SUPABASE_URL,
        supabase_key=config.SUPABASE_SERVICE_KEY,
    )
    if not supabase_client:
        raise HTTPException(status_code=500, detail="Supabase client not initialized")
    return supabase_client


SupabaseClient = Annotated[Client, Depends(get_supabase_client)]
