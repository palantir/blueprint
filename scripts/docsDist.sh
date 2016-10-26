#!/usr/bin/env bash

# Circle does not handle symlinks in artifacts so we must turn lerna's symlinked local deps into actual directories.

find packages/docs/node_modules/@blueprint -type l -delete

mkdir -p packages/docs/node_modules/@blueprint/core/
mkdir -p packages/docs/node_modules/@blueprint/datetime/

cp -fR packages/core packages/datetime packages/docs/node_modules/@blueprint/
