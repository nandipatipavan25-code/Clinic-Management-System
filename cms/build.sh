#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install backend dependencies
pip install -r ../requirements.txt

# Collect static files
python manage.py collectstatic --no-input

# Apply database migrations
python manage.py migrate

# Seed dummy demo accounts & all roles
python seed_all_roles.py
