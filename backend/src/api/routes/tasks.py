"""Task management API routes."""

from fastapi import APIRouter, Depends, status
from sqlmodel import Session
from uuid import UUID
from typing import List

from ...models.task import Task, TaskCreate, TaskUpdate, TaskResponse
from ...services import task_service
from ...core.database import get_session
from ...middleware.auth_middleware import get_current_user_id

router = APIRouter()


@router.post(
    "/tasks",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new task"
)
async def create_task(
    task_data: TaskCreate,
    db: Session = Depends(get_session),
    current_user_id: UUID = Depends(get_current_user_id)
) -> Task:
    """
    Create a new task for the authenticated user.

    **Request Body:**
    - `title` (required): Task title, max 200 characters, cannot be empty or whitespace
    - `description` (optional): Task description, max 2000 characters

    **Returns:**
    - Created task with ID, timestamps, and completion status

    **Errors:**
    - `400 Bad Request`: Title is empty, contains only whitespace, or exceeds length limits
    - `401 Unauthorized`: Invalid or missing authentication token
    """
    task = task_service.create_task(db, task_data, current_user_id)
    return task


@router.get(
    "/tasks",
    response_model=List[TaskResponse],
    status_code=status.HTTP_200_OK,
    summary="Get all tasks for authenticated user"
)
async def get_tasks(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_session),
    current_user_id: UUID = Depends(get_current_user_id)
) -> List[Task]:
    """
    Retrieve all tasks belonging to the authenticated user.

    **Implements strict user isolation**: Only returns tasks where user_id matches the authenticated user.

    **Query Parameters:**
    - `skip` (optional): Number of tasks to skip for pagination (default: 0)
    - `limit` (optional): Maximum number of tasks to return (default: 100, max: 100)

    **Returns:**
    - List of tasks ordered by creation date (newest first)
    - Empty list if user has no tasks

    **Errors:**
    - `401 Unauthorized`: Invalid or missing authentication token
    """
    tasks = task_service.get_user_tasks(db, current_user_id, skip, limit)
    return tasks


@router.get(
    "/tasks/{task_id}",
    response_model=TaskResponse,
    status_code=status.HTTP_200_OK,
    summary="Get a specific task by ID"
)
async def get_task(
    task_id: UUID,
    db: Session = Depends(get_session),
    current_user_id: UUID = Depends(get_current_user_id)
) -> Task:
    """
    Retrieve a specific task by ID, ensuring it belongs to the authenticated user.

    **Path Parameters:**
    - `task_id`: UUID of the task to retrieve

    **Returns:**
    - Task details

    **Errors:**
    - `401 Unauthorized`: Invalid or missing authentication token
    - `404 Not Found`: Task doesn't exist or doesn't belong to the authenticated user
    """
    task = task_service.get_task_by_id(db, task_id, current_user_id)
    return task


@router.put(
    "/tasks/{task_id}",
    response_model=TaskResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a task"
)
async def update_task(
    task_id: UUID,
    task_data: TaskUpdate,
    db: Session = Depends(get_session),
    current_user_id: UUID = Depends(get_current_user_id)
) -> Task:
    """
    Update an existing task (partial updates allowed).

    **Path Parameters:**
    - `task_id`: UUID of the task to update

    **Request Body (all fields optional):**
    - `title`: New task title (max 200 characters, cannot be empty or whitespace)
    - `description`: New task description (max 2000 characters)
    - `is_completed`: Completion status (true/false)

    **Returns:**
    - Updated task with new updated_at timestamp

    **Errors:**
    - `400 Bad Request`: Title is empty or contains only whitespace
    - `401 Unauthorized`: Invalid or missing authentication token
    - `404 Not Found`: Task doesn't exist or doesn't belong to the authenticated user
    """
    task = task_service.update_task(db, task_id, task_data, current_user_id)
    return task


@router.delete(
    "/tasks/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a task"
)
async def delete_task(
    task_id: UUID,
    db: Session = Depends(get_session),
    current_user_id: UUID = Depends(get_current_user_id)
) -> None:
    """
    Delete a task permanently.

    **Path Parameters:**
    - `task_id`: UUID of the task to delete

    **Returns:**
    - 204 No Content on successful deletion

    **Errors:**
    - `401 Unauthorized`: Invalid or missing authentication token
    - `404 Not Found`: Task doesn't exist or doesn't belong to the authenticated user
    """
    task_service.delete_task(db, task_id, current_user_id)
    return None
