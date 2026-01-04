"""User model for authentication and task ownership."""

from sqlmodel import Field, Relationship, SQLModel
from datetime import datetime
from uuid import UUID, uuid4
from typing import Optional, List, TYPE_CHECKING

if TYPE_CHECKING:
    from .task import Task


class User(SQLModel, table=True):
    """
    User model representing an authenticated account holder.

    Attributes:
        id: Unique user identifier (UUID)
        email: User's email address (unique, used for login)
        hashed_password: Bcrypt-hashed password (never returned in API responses)
        created_at: Account creation timestamp
        updated_at: Last account update timestamp
    """

    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(max_length=255, unique=True, index=True, nullable=False)
    hashed_password: str = Field(max_length=255, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # Relationship: One user owns many tasks (cascade delete)
    tasks: List["Task"] = Relationship(back_populates="owner", cascade_delete=True)

    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email})>"


class UserCreate(SQLModel):
    """Schema for user registration request."""

    email: str = Field(max_length=255)
    password: str = Field(min_length=8)


class UserLogin(SQLModel):
    """Schema for user login request."""

    email: str
    password: str


class UserResponse(SQLModel):
    """Schema for user response (excludes password)."""

    id: UUID
    email: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
