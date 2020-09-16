#!/usr/bin/env bash
set -euo pipefail

type="$1"
if [[ "${type}" != "latest" ]] && [[ "${type}" != "historical" ]]; then
  echo "Usage: $0 [latest|historical]"
  exit 1
fi

echo "Calling /api/exchange-rates/update-${type} @ $(date)"
curl -XPOST --fail --silent --show-error -H "Authorization: $(cat /run/secrets/cron.secret)" --url "api:3000/api/exchange-rates/update-${type}"
