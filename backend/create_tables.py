"""
Script to create database tables using SQLModel.
This is an alternative to running Alembic migrations.
"""

import sys
from pathlib import Path

# Add src directory to Python path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from sqlmodel import SQLModel, create_engine
from src.core.config import settings
from src.models.user import User
from src.models.task import Task

def create_tables():
    """Create all database tables."""
    print(f"Connecting to database: {settings.DATABASE_URL.split('@')[-1]}")

    engine = create_engine(settings.DATABASE_URL, echo=True)

    print("\nCreating tables...")
    SQLModel.metadata.create_all(engine)

    print("\n[SUCCESS] Tables created successfully!")
    print("  - users")
    print("  - tasks")

if __name__ == "__main__":
    try:
        create_tables()
    except Exception as e:
        print(f"\n[ERROR] Error creating tables: {e}")
        sys.exit(1)
