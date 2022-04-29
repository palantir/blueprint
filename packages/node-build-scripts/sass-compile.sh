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

# in source maps, paths to blueprint packages should be direct, rather than
# going through node_modules. https://github.com/palantir/blueprint/issues/3500
if [[ -d $OUTPUT ]]; then
  if [[ $OSTYPE == 'darwin'* ]]; then
    sed -i '' 's/..\/node_modules\/@blueprintjs\///' $OUTPUT/*.css.map
  else
    sed -i 's/..\/node_modules\/@blueprintjs\///' $OUTPUT/*.css.map
  fi
fi
