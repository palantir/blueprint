#!/usr/bin/env bash

set -e
set -o pipefail

if [ $# -eq 0 ]; then
  echo "Usage: [OUTPUT=dir] sass-compile <directory> [...args]"
  exit 1
fi

node_build_scripts_dir="$( dirname "$(readlink -f "$0")" )"

# set OUTPUT env varible to change output directory
OUTPUT="${OUTPUT:-lib/css/}"

# the `dart-sass` CLI doesn't support custom functions or importers, but the JS API does, so delegate to node
node $node_build_scripts_dir/sass-compile.mjs --output $OUTPUT $@
