from typing import Annotated, TypeAlias

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt.exceptions import InvalidTokenError
from pydantic import ValidationError

from app.auth.models import User
from app.config import config

auth_scheme = HTTPBearer()
CredentialDep: TypeAlias = Annotated[HTTPAuthorizationCredentials, Depends(auth_scheme)]


async def get_current_user(credentials: CredentialDep) -> User:
    """Authenticate user from http bearer token."""
    try:
        token = credentials.credentials
        payload = jwt.decode(
            token,
            config.SUPABASE_JWT_SECRET,
            algorithms=[config.SUPABASE_JWT_ALGORITHM],
            audience=config.SUPABASE_JWT_AUDIENCE,
        )
        return User(
            id=payload["sub"],
            email=payload["email"],
            role=payload["role"],
        )
    except (InvalidTokenError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )


CurrentUserDep: TypeAlias = Annotated[User, Depends(get_current_user)]
