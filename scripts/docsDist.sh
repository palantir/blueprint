#!/usr/bin/env bash

find packages/docs/node_modules/@blueprint -type l -delete

mkdir -p packages/docs/node_modules/@blueprint/core/dist
cp -fR packages/core/dist packages/docs/node_modules/@blueprint/core/build/

mkdir -p packages/docs/node_modules/@blueprint/datetime/dist
cp -fR packages/datetime/dist packages/docs/node_modules/@blueprint/datetime/build/
