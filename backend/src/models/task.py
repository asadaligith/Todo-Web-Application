"""Task model for todo items."""

from sqlmodel import Field, Relationship, SQLModel
from datetime import datetime
from uuid import UUID, uuid4
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from .user import User


class Task(SQLModel, table=True):
    """
    Task model representing a todo item owned by a user.

    Attributes:
        id: Unique task identifier (UUID)
        user_id: Foreign key to the owning user (required)
        title: Task title (required, max 200 characters)
        description: Task description (optional, max 2000 characters)
        is_completed: Completion status (default: False)
        created_at: Task creation timestamp
        updated_at: Last task update timestamp
    """

    __tablename__ = "tasks"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", nullable=False, index=True)
    title: str = Field(max_length=200, nullable=False)
    description: Optional[str] = Field(default=None, max_length=2000)
    is_completed: bool = Field(default=False, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False, index=True)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # Relationship: Each task belongs to exactly one user
    owner: Optional["User"] = Relationship(back_populates="tasks")

    def __repr__(self) -> str:
        return f"<Task(id={self.id}, title='{self.title}', completed={self.is_completed})>"


class TaskCreate(SQLModel):
    """Schema for task creation request."""

    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)


class TaskUpdate(SQLModel):
    """Schema for task update request (all fields optional)."""

    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)
    is_completed: Optional[bool] = None


class TaskResponse(SQLModel):
    """Schema for task response."""

    id: UUID
    user_id: UUID
    title: str
    description: Optional[str]
    is_completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
