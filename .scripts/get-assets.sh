#!/usr/bin/env bash
set -euo pipefail

script_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
source "${script_dir}/remote-settings.sh"

assets=(
  fortawesome-pro-light-svg-icons-5.14.0.tgz
)

for asset in ${assets[@]}; do
  echo "Getting ${asset}"
  rsync -avz "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_ASSET_DIR}/${asset}" "${script_dir}/../assets/."
done
