#!/usr/bin/env bash
set -euo pipefail

script_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

assets=(
  fortawesome-pro-light-svg-icons-5.14.0.tgz
)

for asset in ${assets[@]}; do
    echo "Getting ${asset}"
  rsync -avz "deploy@142.93.47.93:/var/web/assets/${asset}" "${script_dir}/../assets/."
done
