from fastapi import APIRouter
from fastapi.exceptions import HTTPException
from gotrue.errors import AuthApiError

from app.auth.deps import SupabaseClient
from app.auth.models import UserForgotPassword, UserSignIn, UserSignUp, UserUpdate
from app.models import Message

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/sign-up")
async def sign_up(supabase_client: SupabaseClient, form_data: UserSignUp) -> Message:
    if not form_data.email or not form_data.password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    try:
        await supabase_client.auth.sign_up(
            {
                "email": form_data.email,
                "password": form_data.password,
                "options": {"email_redirect_to": form_data.redirect_url},
            }
        )
    except AuthApiError as e:
        raise HTTPException(status_code=e.status, detail=e.message)

    return Message(message="User successfully signed up")


@router.post("/sign-in")
async def sign_in(supabase_client: SupabaseClient, form_data: UserSignIn) -> Message:
    try:
        await supabase_client.auth.sign_in_with_password(
            {"email": form_data.email, "password": form_data.password}
        )
    except AuthApiError as e:
        raise HTTPException(status_code=e.status, detail=e.message)

    return Message(message="User successfully signed in")


@router.post("/sign-out")
async def sign_out(supabase_client: SupabaseClient) -> None:
    await supabase_client.auth.sign_out()


@router.post("/forgot-password")
async def forgot_password(
    supabase_client: SupabaseClient, form_data: UserForgotPassword
) -> Message:
    try:
        await supabase_client.auth.reset_password_for_email(
            email=form_data.email,
            options={"redirect_to": form_data.redirect_url},
        )
    except AuthApiError as e:
        raise HTTPException(status_code=e.status, detail=e.message)

    return Message(message="Password recovery email sent")


@router.patch("/user/update")
async def update_user(supabase_client: SupabaseClient, user_in: UserUpdate) -> Message:
    try:
        await supabase_client.auth.update_user(user_in.model_dump(exclude_unset=True))
    except AuthApiError as e:
        raise HTTPException(status_code=e.status, detail=e.message)

    return Message(message="User successfully updated")
