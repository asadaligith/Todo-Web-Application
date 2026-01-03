"""Dependency injection functions for FastAPI routes."""

from fastapi import Depends
from sqlmodel import Session
from uuid import UUID
from ..core.database import get_session
from ..middleware.auth_middleware import get_current_user_id


# Re-export commonly used dependencies for convenience
def get_db() -> Session:
    """
    Get database session dependency.

    Usage:
        @app.get("/items")
        def get_items(db: Session = Depends(get_db)):
            ...
    """
    return Depends(get_session)


def get_current_user() -> UUID:
    """
    Get current authenticated user ID dependency.

    Usage:
        @app.get("/protected")
        def protected_route(current_user_id: UUID = Depends(get_current_user)):
            ...
    """
    return Depends(get_current_user_id)
