from gotrue import User  # type: ignore
from pydantic import BaseModel, EmailStr

from app.models import KolModel


class Token(BaseModel):
    access_token: str | None = None
    refresh_token: str | None = None


class UserIn(Token, User):  # type: ignore
    pass


class UserSignUp(KolModel):
    email: EmailStr
    password: str
    redirect_url: str


class UserSignIn(KolModel):
    email: EmailStr
    password: str


class UserForgotPassword(KolModel):
    email: EmailStr
    redirect_url: str


class UserUpdate(KolModel):
    email: EmailStr
    password: str | None = None
