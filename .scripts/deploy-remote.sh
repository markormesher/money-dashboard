#!/usr/bin/env bash
set -euo pipefail

prod_host="chuck"
prod_branch="react-front-end" # TODO: change to "master"

echo "Checking environment..."

current_host=$(hostname)
if [[ "$current_host" = "$prod_branch" ]]; then
    echo " - OK: Running on $prod_host"
else
    echo " - ERROR: Running on $current_host, not $prod_host"
    exit 1
fi

current_branch=$(git rev-parse --abbrev-ref HEAD)
if [[ "$current_branch" = "$prod_branch" ]]; then
    echo " - OK: Checked out branch is $prod_branch"
else
    echo " - ERROR: Checked out branch is $current_branch, not $prod_branch"
    exit 1
fi

if [[ -z "$(git status --porcelain)" ]]; then
    echo " - OK: Git environment is clean"
else
    echo " - ERROR: Git environment is not clean"
    exit 1
fi
