"""Test configurations and fixtures."""

import datetime as dt
import os
from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import Column, Date, Engine, Integer, String
from sqlalchemy.orm import Session, declarative_base

os.environ["ENVIRONMENT"] = "test"

from app.database.core import Base, CustomBase, engine, get_db
from app.main import app

TestBase = declarative_base(cls=CustomBase)


@pytest.fixture(scope="session")
def test_engine() -> Generator[Engine, None, None]:
    """Initialise, run and then destroy a test database for the session."""
    Base.metadata.create_all(bind=engine)
    TestBase.metadata.create_all(bind=engine)

    yield engine

    TestBase.metadata.drop_all(bind=engine)
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function", autouse=True)
def session(test_engine) -> Generator[Session, None, None]:
    """For each test, take the session db, create a transaction, perform the test and
    then rollback the changes to the original state."""
    connection = test_engine.connect()
    connection.begin()
    session = Session(bind=connection)
    try:
        yield session
    finally:
        session.rollback()
        session.close()
        connection.close()


@pytest.fixture(scope="function")
def client(session: Session) -> Generator[TestClient, None, None]:
    """Create a test client with overridden dependencies."""
    app.dependency_overrides[get_db] = lambda: session

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


class MockTable(TestBase):
    __tablename__ = "mock_table"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String)
    created_at = Column(Date)


@pytest.fixture
def mock_table(session: Session) -> None:
    test_data = [
        MockTable(
            id=1,
            name="Apple",
            description="A red fruit",
            created_at=dt.date(2023, 1, 15),
        ),
        MockTable(
            id=2,
            name="Banana",
            description="A yellow fruit",
            created_at=dt.date(2023, 2, 20),
        ),
        MockTable(
            id=3,
            name="Orange",
            description="An orange citrus fruit",
            created_at=dt.date(2023, 3, 10),
        ),
        MockTable(
            id=4,
            name="Grape",
            description="A small purple fruit",
            created_at=dt.date(2023, 4, 5),
        ),
        MockTable(
            id=5,
            name="Watermelon",
            description="A large green fruit with red flesh",
            created_at=dt.date(2023, 5, 25),
        ),
    ]
    session.add_all(test_data)
    session.commit()
