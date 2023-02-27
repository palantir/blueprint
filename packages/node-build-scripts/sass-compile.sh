#!/usr/bin/env bash

if [ $# -eq 0 ]; then
  echo "Usage: [OUTPUT=dir] sass-compile <directory> [...args]"
  exit 1
fi

# set OUTPUT env varible to change output directory
OUTPUT="${OUTPUT:-lib/css/}"

# the `dart-sass` CLI doesn't support custom functions or importers, but the JS API does, so delegate to node
node ../node-build-scripts/sass-compile.mjs --output $OUTPUT $@
