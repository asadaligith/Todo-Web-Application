"""Authentication API routes for user registration and login."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from ...core.database import get_session
from ...models.user import UserCreate, UserLogin, UserResponse
from ...services.auth_service import register_user, login_user


router = APIRouter()


@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    session: Session = Depends(get_session),
):
    """
    Register a new user account.

    Args:
        user_data: User registration data (email, password)
        session: Database session

    Returns:
        Success message and user data (without password)

    Raises:
        HTTPException 400: If email format is invalid or password is weak
        HTTPException 409: If email is already registered
    """
    user, error = register_user(session, user_data)

    if error:
        # Determine appropriate status code
        if "already registered" in error.lower():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=error,
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error,
            )

    return {
        "message": "User registered successfully",
        "user": UserResponse.model_validate(user),
    }


@router.post("/login", response_model=dict, status_code=status.HTTP_200_OK)
async def login(
    credentials: UserLogin,
    session: Session = Depends(get_session),
):
    """
    Authenticate user and return JWT token.

    Args:
        credentials: User login credentials (email, password)
        session: Database session

    Returns:
        JWT access token and user data

    Raises:
        HTTPException 401: If email or password is incorrect
    """
    access_token, user, error = login_user(session, credentials)

    if error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=error,
            headers={"WWW-Authenticate": "Bearer"},
        )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.model_validate(user),
    }
