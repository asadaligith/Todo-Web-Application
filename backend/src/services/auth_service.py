"""Authentication service for user registration and login."""

import re
from sqlmodel import Session, select
from typing import Optional, Tuple
from uuid import UUID
from ..models.user import User, UserCreate, UserLogin
from ..core.security import hash_password, verify_password, create_access_token


def validate_email(email: str) -> Tuple[bool, Optional[str]]:
    """
    Validate email format.

    Args:
        email: Email address to validate

    Returns:
        Tuple of (is_valid, error_message)
    """
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_regex, email):
        return False, "Invalid email format"
    return True, None


def validate_password(password: str) -> Tuple[bool, Optional[str]]:
    """
    Validate password strength.
    Requirements: min 8 characters, contains letters and numbers.

    Args:
        password: Password to validate

    Returns:
        Tuple of (is_valid, error_message)
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"

    has_letter = bool(re.search(r'[a-zA-Z]', password))
    has_number = bool(re.search(r'[0-9]', password))

    if not has_letter or not has_number:
        return False, "Password must contain both letters and numbers"

    return True, None


def register_user(session: Session, user_data: UserCreate) -> Tuple[Optional[User], Optional[str]]:
    """
    Register a new user account.

    Args:
        session: Database session
        user_data: User registration data (email, password)

    Returns:
        Tuple of (user, error_message)
        - (User object, None) on success
        - (None, error_message) on failure
    """
    # Validate email format
    is_valid, error = validate_email(user_data.email)
    if not is_valid:
        return None, error

    # Validate password strength
    is_valid, error = validate_password(user_data.password)
    if not is_valid:
        return None, error

    # Check if user already exists
    statement = select(User).where(User.email == user_data.email)
    existing_user = session.exec(statement).first()

    if existing_user:
        return None, "Email already registered"

    # Hash password and create user
    hashed_password = hash_password(user_data.password)
    new_user = User(
        email=user_data.email,
        hashed_password=hashed_password,
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return new_user, None


def login_user(session: Session, credentials: UserLogin) -> Tuple[Optional[str], Optional[User], Optional[str]]:
    """
    Authenticate user and generate JWT token.

    Args:
        session: Database session
        credentials: User login credentials (email, password)

    Returns:
        Tuple of (access_token, user, error_message)
        - (token, User object, None) on success
        - (None, None, error_message) on failure
    """
    # Find user by email
    statement = select(User).where(User.email == credentials.email)
    user = session.exec(statement).first()

    if not user:
        return None, None, "Invalid email or password"

    # Verify password
    if not verify_password(credentials.password, user.hashed_password):
        return None, None, "Invalid email or password"

    # Generate JWT token with user ID in claims
    access_token = create_access_token(data={"sub": str(user.id)})

    return access_token, user, None


def get_user_by_id(session: Session, user_id: UUID) -> Optional[User]:
    """
    Get user by ID.

    Args:
        session: Database session
        user_id: User UUID

    Returns:
        User object if found, None otherwise
    """
    statement = select(User).where(User.id == user_id)
    return session.exec(statement).first()
