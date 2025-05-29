# Backend

This directory contains the serverside code for the Kohlrabii web-app.

## Stack

| Component               | Technology |
|-------------------------|------------|
| Web Framework           | [FastAPI](https://github.com/fastapi/fastapi) |
| Database                | [Supabase](https://github.com/supabase/supabase) |
| Data Validation         | [Pydantic](https://github.com/pydantic/pydantic) |
| ORM                     | [SQLAlchemy](https://github.com/sqlalchemy/sqlalchemy) |
| Database Migrations     | [Alembic](https://github.com/sqlalchemy/alembic) |
| Error Tracking          | [Sentry](https://github.com/getsentry/sentry) |
| Containerisation        | [Docker](https://www.docker.com) |
| Python package manager  | [uv](https://github.com/astral-sh/uv) |
| Linter                  | [ruff](https://github.com/astral-sh/ruff) |
| Type-checker            | [mypy](https://github.com/python/mypy) |
| Deployment              | [fly.io](https://fly.io/) |


## Quick Start

Install the dependencies:
```bash
uv sync
```

Activate the virtual environment:
```bash
source .venv/bin/activate
```

Install the pre-commit hooks:
```bash
uv run pre-commit install
```

Create a `.env.dev` file using the `.env.test` template and populate with your own secrets.
```bash
cp .env.test .env.dev
```

To run the server locally, start docker desktop and run:
```bash
docker compose --env-file .env.dev watch
```
