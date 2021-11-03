#!/usr/bin/env bash

# Reason: provide a public API to import Sass variables
# Usage: copy-scss
#   set INPUT / OUTPUT env varibles to change directories

INPUT="${INPUT:-src}"
OUTPUT="${OUTPUT:-lib/scss}"

mkdir -p "$OUTPUT"
cp "$INPUT/generated/variables.scss" "$OUTPUT/variables.scss"
