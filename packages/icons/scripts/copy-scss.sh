#!/usr/bin/env bash

# Reason: provide a public API to import Sass variables
# Usage: copy-scss
#   set INPUT / OUTPUT env varibles to change directories

INPUT="${INPUT:-src}"
OUTPUT="${OUTPUT:-lib/scss}"

mkdir -p "$OUTPUT"
cp "$INPUT/generated/16px/_icon-variables.scss" "$OUTPUT/blueprint-icons-16.scss"
cp "$INPUT/generated/20px/_icon-variables.scss" "$OUTPUT/blueprint-icons-20.scss"

cp "$INPUT/templates/_lib_variables.scss" "$OUTPUT/variables.scss"
