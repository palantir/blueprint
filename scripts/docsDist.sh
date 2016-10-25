#!/usr/bin/env bash

find packages/docs/node_modules/@blueprint -type l -delete

mkdir -p packages/docs/node_modules/@blueprint/core/build/src
cp -fR packages/core/build/src packages/docs/node_modules/@blueprint/core/build/

mkdir -p packages/docs/node_modules/@blueprint/datetime/build/src
cp -fR packages/datetime/build/src packages/docs/node_modules/@blueprint/datetime/build/
