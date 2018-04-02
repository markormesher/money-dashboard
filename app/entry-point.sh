#!/usr/bin/env bash

./wait-for-it/wait-for-it.sh postgres:5432 --timeout=30 --strict &
waitForPostgres=$!

./wait-for-it/wait-for-it.sh redis:6379 --timeout=30 --strict &
waitForRedis=$!

wait ${waitForPostgres}
wait ${waitForRedis}

exec node ./dist/app.js
