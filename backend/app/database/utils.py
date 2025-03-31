import math
from typing import Any, TypeVar

from sqlalchemy.orm import Query

from app.database.core import Base
from app.models import BaseQuery

T = TypeVar("T")


def apply_sort(
    query: Query[T], table: type[Base], sort_by: str, sort_desc: bool
) -> Query[T]:
    """Apply sorting to a query based on column name and direction."""
    sort_column = table.get_column(sort_by)
    order_by_clause = sort_column.desc() if sort_desc else sort_column.asc()
    return query.order_by(order_by_clause)


def apply_pagination(query: Query[T], page: int, page_size: int) -> Query[T]:
    """Apply pagination to a query."""
    return query.offset(page * page_size).limit(page_size)


def sort_and_paginate(
    query: Query[T],
    table: type[Base],
    query_in: BaseQuery,
) -> dict[str, Any]:
    """Sort and paginate a query."""
    total = query.count()
    total_pages = math.ceil(total / query_in.page_size)

    if query_in.sort_by:
        query = apply_sort(
            query=query,
            table=table,
            sort_by=query_in.sort_by,
            sort_desc=query_in.sort_desc,
        )

    query = apply_pagination(
        query=query, page=query_in.page, page_size=query_in.page_size
    )
    return {
        "items": query.all(),
        "page_size": query_in.page_size,
        "page": query_in.page,
        "total": total,
        "total_pages": total_pages,
    }
