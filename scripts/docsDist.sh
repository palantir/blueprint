#!/usr/bin/env bash

# Circle does not handle symlinks in artifacts so we must turn Lerna's symlinked
# local deps into actual directories.

DOCS_PATH=packages/docs-site/node_modules/@blueprintjs

find $DOCS_PATH -type l -delete

mkdir -p $DOCS_PATH/core/
mkdir -p $DOCS_PATH/datetime/
mkdir -p $DOCS_PATH/docs/
mkdir -p $DOCS_PATH/table/

cp -fR packages/core packages/datetime packages/docs packages/table $DOCS_PATH/
