"""Task service for business logic related to task operations."""

from sqlmodel import Session, select
from uuid import UUID
from datetime import datetime
from typing import List, Optional

from ..models.task import Task, TaskCreate, TaskUpdate
from ..core.exceptions import ValidationError, NotFoundError, ForbiddenError


def create_task(
    db: Session,
    task_data: TaskCreate,
    user_id: UUID
) -> Task:
    """
    Create a new task for the authenticated user.

    Args:
        db: Database session
        task_data: Task creation data (title, description)
        user_id: ID of the authenticated user (task owner)

    Returns:
        Created Task object

    Raises:
        ValidationError: If title is empty or contains only whitespace
    """
    # Validate title is not empty or whitespace
    if not task_data.title or not task_data.title.strip():
        raise ValidationError("Task title cannot be empty or contain only whitespace")

    # Create task with user_id
    task = Task(
        user_id=user_id,
        title=task_data.title.strip(),
        description=task_data.description.strip() if task_data.description else None,
        is_completed=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task


def get_user_tasks(
    db: Session,
    user_id: UUID,
    skip: int = 0,
    limit: int = 100
) -> List[Task]:
    """
    Retrieve all tasks belonging to the authenticated user.

    Implements strict user isolation by filtering WHERE user_id = current_user.

    Args:
        db: Database session
        user_id: ID of the authenticated user
        skip: Number of tasks to skip (pagination)
        limit: Maximum number of tasks to return (pagination)

    Returns:
        List of Task objects owned by the user, ordered by creation date (newest first)
    """
    statement = (
        select(Task)
        .where(Task.user_id == user_id)
        .order_by(Task.created_at.desc())
        .offset(skip)
        .limit(limit)
    )

    tasks = db.exec(statement).all()
    return list(tasks)


def get_task_by_id(
    db: Session,
    task_id: UUID,
    user_id: UUID
) -> Task:
    """
    Retrieve a specific task by ID, ensuring it belongs to the authenticated user.

    Args:
        db: Database session
        task_id: Task UUID
        user_id: ID of the authenticated user

    Returns:
        Task object

    Raises:
        NotFoundError: If task doesn't exist or doesn't belong to user
    """
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    task = db.exec(statement).first()

    if not task:
        raise NotFoundError(f"Task with ID {task_id} not found or does not belong to you")

    return task


def update_task(
    db: Session,
    task_id: UUID,
    task_data: TaskUpdate,
    user_id: UUID
) -> Task:
    """
    Update an existing task, validating ownership before update.

    Args:
        db: Database session
        task_id: Task UUID
        task_data: Task update data (partial updates allowed)
        user_id: ID of the authenticated user

    Returns:
        Updated Task object

    Raises:
        NotFoundError: If task doesn't exist or doesn't belong to user
        ValidationError: If title is empty or contains only whitespace
    """
    # Fetch task and validate ownership
    task = get_task_by_id(db, task_id, user_id)

    # Update only provided fields
    if task_data.title is not None:
        if not task_data.title.strip():
            raise ValidationError("Task title cannot be empty or contain only whitespace")
        task.title = task_data.title.strip()

    if task_data.description is not None:
        task.description = task_data.description.strip() if task_data.description else None

    if task_data.is_completed is not None:
        task.is_completed = task_data.is_completed

    # Update timestamp
    task.updated_at = datetime.utcnow()

    db.add(task)
    db.commit()
    db.refresh(task)

    return task


def delete_task(
    db: Session,
    task_id: UUID,
    user_id: UUID
) -> None:
    """
    Delete a task, validating ownership before deletion.

    Args:
        db: Database session
        task_id: Task UUID
        user_id: ID of the authenticated user

    Raises:
        NotFoundError: If task doesn't exist or doesn't belong to user
    """
    # Fetch task and validate ownership
    task = get_task_by_id(db, task_id, user_id)

    db.delete(task)
    db.commit()
