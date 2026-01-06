"""Database configuration and session management."""

from sqlmodel import create_engine, SQLModel, Session
from typing import Generator
from .config import settings


# Get and validate DATABASE_URL
database_url = settings.DATABASE_URL

# Remove any quotes that might have been added accidentally
if database_url:
    database_url = database_url.strip().strip('"').strip("'")

# Validate URL
if not database_url:
    raise ValueError("DATABASE_URL is empty or not set")

# Convert DATABASE_URL to use psycopg (psycopg3) instead of psycopg2
if database_url.startswith("postgresql://"):
    database_url = database_url.replace("postgresql://", "postgresql+psycopg://", 1)
elif not database_url.startswith("postgresql+psycopg://"):
    raise ValueError(f"Invalid DATABASE_URL format. Must start with 'postgresql://'. Got: {database_url[:50]}...")

# Create database engine with connection pooling
try:
    engine = create_engine(
        database_url,
        echo=True,  # Enable SQL query logging for debugging
        pool_pre_ping=True,  # Verify connections before using
        pool_size=5,
        max_overflow=10,
    )
except Exception as e:
    raise ValueError(f"Failed to create database engine. URL format: {database_url[:50]}... Error: {str(e)}")


def init_db() -> None:
    """
    Initialize database tables.
    This is useful for testing but in production use Alembic migrations.
    """
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """
    Dependency function to get database session.
    Use this in FastAPI route dependencies.

    Usage:
        @app.get("/items")
        def get_items(session: Session = Depends(get_session)):
            ...
    """
    with Session(engine) as session:
        yield session
