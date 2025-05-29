from sqlalchemy.orm import Session

from app.database.utils import apply_sort, sort_and_paginate
from app.models import BaseQuery
from tests.conftest import MockTable


def test_apply_sort_ascending(session: Session, mock_table):
    """Test sorting in ascending order."""
    query = session.query(MockTable)
    sorted_query = apply_sort(query, MockTable, "name", False)
    results = sorted_query.all()

    assert [item.name for item in results] == [
        "Apple",
        "Banana",
        "Grape",
        "Orange",
        "Watermelon",
    ]


def test_apply_sort_descending(session: Session, mock_table):
    """Test sorting in descending order."""
    query = session.query(MockTable)
    sorted_query = apply_sort(query, MockTable, "name", True)
    results = sorted_query.all()

    assert [item.name for item in results] == [
        "Watermelon",
        "Orange",
        "Grape",
        "Banana",
        "Apple",
    ]


def test_apply_sort_by_date(session: Session, mock_table):
    """Test sorting by date column."""
    query = session.query(MockTable)
    sorted_query = apply_sort(query, MockTable, "created_at", False)
    results = sorted_query.all()

    created_dates = [item.created_at for item in results]
    assert created_dates == sorted(created_dates)
    assert [item.id for item in results] == [1, 2, 3, 4, 5]


def test_sort_and_paginate_pagination(session: Session, mock_table):
    """Test pagination functionality."""
    # First page
    base_query = BaseQuery(sort_by="name", sort_desc=True, page=0, page_size=2)

    query = session.query(MockTable)
    result = sort_and_paginate(query, MockTable, base_query)

    assert len(result["items"]) == 2
    assert result["items"][0].name == "Watermelon"
    assert result["items"][1].name == "Orange"

    # Second page
    base_query.page = 1
    result = sort_and_paginate(query, MockTable, base_query)

    assert len(result["items"]) == 2
    assert result["page"] == 1
    assert result["items"][0].name == "Grape"


def test_sort_and_paginate(session: Session, mock_table):
    """Test with no filters applied."""
    empty_query = BaseQuery(page=0, page_size=10)
    query = session.query(MockTable)
    result = sort_and_paginate(query, MockTable, empty_query)

    assert len(result["items"]) == 5
    assert result["total"] == 5
    assert result["total_pages"] == 1
    assert result["page_size"] == 10
    assert result["page"] == 0
