#!/usr/bin/env bash
set -euo pipefail

./wait-for-it/wait-for-it.sh postgres_master:5432 --timeout=30 --strict &
./wait-for-it/wait-for-it.sh postgres_slave_1:5432 --timeout=30 --strict &
./wait-for-it/wait-for-it.sh postgres_slave_2:5432 --timeout=30 --strict &
./wait-for-it/wait-for-it.sh redis:6379 --timeout=30 --strict &

wait

exec "$@"