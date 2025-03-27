from collections.abc import Generator
from contextlib import contextmanager
from typing import Annotated, Any, TypeAlias

from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import DeclarativeMeta
from sqlalchemy.orm import (
    InstrumentedAttribute,
    Session,
    declarative_base,
    sessionmaker,
)
from starlette.requests import Request

from app.config import config

engine = create_engine(
    url=str(config.SQLALCHEMY_DATABASE_URI), **config.SQLALCHEMY_ENGINE_ARGS
)

SessionLocal = sessionmaker(bind=engine)


class CustomBase:
    """Base class for sqlalchemy database tables."""

    def to_dict(self) -> dict[str, Any]:
        """Returns a dict representation of a model."""
        return {c.name: getattr(self, c.name) for c in self._table_.columns}  # type: ignore

    @classmethod
    def get_column(cls, column: str) -> InstrumentedAttribute[Any]:
        """Get a column from the table."""
        if not hasattr(cls, column):
            raise ValueError(f"Invalid column: {column}")
        return getattr(cls, column)  # type: ignore


Base: DeclarativeMeta = declarative_base(cls=CustomBase)


@contextmanager
def get_session() -> Generator[Session, None, None]:
    """Get the database session, rollback on error and ensure session is closed."""
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except:
        session.rollback()
        raise
    finally:
        session.close()


def get_db(request: Request) -> Any:
    """Database FastAPI dependency."""
    return request.state.db


SessionDep: TypeAlias = Annotated[Session, Depends(get_db)]
