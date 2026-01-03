"""Authentication middleware for JWT token validation."""

from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from uuid import UUID
from ..core.security import verify_token


# HTTP Bearer token security scheme
security = HTTPBearer()


def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> UUID:
    """
    Extract and validate JWT token from Authorization header.
    Returns the authenticated user ID from token claims.

    This dependency should be used on protected routes that require authentication.

    Usage:
        @app.get("/protected")
        def protected_route(user_id: UUID = Depends(get_current_user_id)):
            # user_id is guaranteed to be valid UUID of authenticated user
            ...

    Raises:
        HTTPException 401: If token is missing, invalid, or expired
    """
    token = credentials.credentials

    # Verify token and extract payload
    payload = verify_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Extract user ID from 'sub' claim
    user_id_str: Optional[str] = payload.get("sub")

    if user_id_str is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        user_id = UUID(user_id_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user ID in token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user_id
