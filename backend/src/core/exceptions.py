"""Custom exception classes for application errors."""


class ValidationError(Exception):
    """Raised when input validation fails (400 Bad Request)."""

    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)


class NotFoundError(Exception):
    """Raised when a resource is not found (404 Not Found)."""

    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)


class ForbiddenError(Exception):
    """Raised when user lacks permission to access a resource (403 Forbidden)."""

    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)


class UnauthorizedError(Exception):
    """Raised when authentication fails (401 Unauthorized)."""

    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)
