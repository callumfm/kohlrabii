# Backend

## Dependencies

* [Docker](https://www.docker.com) - Containerisation
* [uv](https://docs.astral.sh/uv/) - Python package management

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
