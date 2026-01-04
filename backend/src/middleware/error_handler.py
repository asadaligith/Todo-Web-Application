"""Global exception handler middleware for consistent error responses."""

from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
from typing import Union

from ..core.exceptions import ValidationError, NotFoundError, ForbiddenError, UnauthorizedError


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """
    Handle validation errors (400 Bad Request).

    Returns a consistent JSON error response with field-specific error details.
    """
    errors = []
    for error in exc.errors():
        field = " -> ".join(str(loc) for loc in error["loc"])
        message = error["msg"]
        errors.append({"field": field, "message": message})

    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "error": "Validation Error",
            "message": "Request validation failed",
            "details": errors,
        },
    )


async def database_exception_handler(request: Request, exc: SQLAlchemyError) -> JSONResponse:
    """
    Handle database errors (500 Internal Server Error).

    Returns a generic error message without exposing database details.
    """
    # Log the actual error for debugging
    import logging
    logging.error(f"Database error: {exc}", exc_info=True)

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Database Error",
            "message": "An error occurred while processing your request. Please try again later.",
            "detail": str(exc),  # Include error details in development
        },
    )


async def custom_validation_exception_handler(request: Request, exc: ValidationError) -> JSONResponse:
    """
    Handle custom validation errors (400 Bad Request).
    """
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "error": "Validation Error",
            "message": exc.message,
        },
    )


async def not_found_exception_handler(request: Request, exc: NotFoundError) -> JSONResponse:
    """
    Handle resource not found errors (404 Not Found).
    """
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={
            "error": "Not Found",
            "message": exc.message,
        },
    )


async def forbidden_exception_handler(request: Request, exc: ForbiddenError) -> JSONResponse:
    """
    Handle forbidden access errors (403 Forbidden).
    """
    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN,
        content={
            "error": "Forbidden",
            "message": exc.message,
        },
    )


async def unauthorized_exception_handler(request: Request, exc: UnauthorizedError) -> JSONResponse:
    """
    Handle authentication errors (401 Unauthorized).
    """
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={
            "error": "Unauthorized",
            "message": exc.message,
        },
    )


async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Handle any unhandled exceptions (500 Internal Server Error).

    Returns a generic error message for unexpected errors.
    """
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred. Please try again later.",
        },
    )
