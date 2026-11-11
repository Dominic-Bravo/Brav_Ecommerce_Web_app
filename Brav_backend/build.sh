
#!/usr/bin/env bash

set -o errexit

uv sync --frozen --no-dev

uv run --frozen python manage.py collectstatic --no-input

uv run --frozen python manage.py migrate
