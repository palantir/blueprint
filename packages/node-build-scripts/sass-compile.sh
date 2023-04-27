#!/usr/bin/env bash

if [ $# -eq 0 ]; then
  echo "Usage: [OUTPUT=dir] sass-compile <directory> [...args]"
  exit 1
fi

# set OUTPUT env varible to change output directory
OUTPUT="${OUTPUT:-lib/css/}"

# dependencies are hoisted to root node_modules, so load packages from there
ROOT_NM=../../node_modules

# the `dart-sass` CLI doesn't support custom functions or importers, but the JS API does, so delegate to node
$ROOT_NM/.bin/ts-node -O "{ \"esModuleInterop\": true }" ../node-build-scripts/sass-compile.ts --output $OUTPUT $@
