#!/usr/bin/env bash
set -euo pipefail

prod_host="chuck"
prod_branch="master"

echo
echo "Checking environment..."

current_host=$(hostname)
if [[ "$current_host" = "$prod_host" ]]; then
    echo " - OK: Host is '$prod_host'"
else
    echo " - ERROR: Host is '$current_host', not '$prod_host'"
    exit 1
fi

current_name=$(git name-rev HEAD)
if [[ "$current_name" == *"tags/"* ]]; then
    echo " - OK: A tagged version is checked out"
else
    echo " - ERROR: Current checked out name is '$current_name', not 'HEAD tags/x.y.z'"
    exit 1
fi

if [[ -z "$(git status --porcelain)" ]]; then
    echo " - OK: Git environment is clean"
else
    echo " - ERROR: Git environment is not clean"
    exit 1
fi

echo
echo "Updating repo..."
git checkout "$prod_branch"
git pull

echo
echo "Checking out latest tag..."
git checkout $(git describe --tags $(git rev-list --tags --max-count=1))

echo
echo "Rebuilding images..."
docker-compose build

echo
echo "Starting containers..."
docker-compose up -d
