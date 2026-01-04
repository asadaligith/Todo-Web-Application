"""Main FastAPI application entry point."""

from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
from .core.config import settings
from .middleware.error_handler import (
    validation_exception_handler,
    database_exception_handler,
    generic_exception_handler,
    custom_validation_exception_handler,
    not_found_exception_handler,
    forbidden_exception_handler,
    unauthorized_exception_handler,
)
from .core.exceptions import ValidationError, NotFoundError, ForbiddenError, UnauthorizedError


# Create FastAPI application
app = FastAPI(
    title="Todo API",
    description="Multi-user Todo application with JWT authentication",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)


# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register exception handlers
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(ValidationError, custom_validation_exception_handler)
app.add_exception_handler(NotFoundError, not_found_exception_handler)
app.add_exception_handler(ForbiddenError, forbidden_exception_handler)
app.add_exception_handler(UnauthorizedError, unauthorized_exception_handler)
app.add_exception_handler(SQLAlchemyError, database_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)


# Health check endpoint
@app.get("/health", status_code=status.HTTP_200_OK, tags=["Health"])
async def health_check():
    """
    Health check endpoint for monitoring and deployment verification.

    Returns:
        dict: Status message indicating the service is healthy
    """
    return {"status": "healthy", "service": "todo-api"}


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint providing API information.

    Returns:
        dict: Welcome message and documentation links
    """
    return {
        "message": "Todo API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
    }


# Import and register routers
from .api.routes import auth, tasks

app.include_router(
    auth.router,
    prefix=f"{settings.API_V1_PREFIX}/auth",
    tags=["Authentication"]
)

app.include_router(
    tasks.router,
    prefix=settings.API_V1_PREFIX,
    tags=["Tasks"]
)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "src.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True,
    )
