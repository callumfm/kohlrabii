from pydantic import EmailStr

from app.models import KolModel


class User(KolModel):
    id: str
    email: EmailStr
    role: str


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
