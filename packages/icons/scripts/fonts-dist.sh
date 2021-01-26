#!/usr/bin/env bash

# Usage: fonts-dist
# set INPUT / OUTPUT env varibles to change directories
# fonts must exist in output dir for CSS to reference them

INPUT="${INPUT:-src/generated}"
OUTPUT="${OUTPUT:-lib/css}"

mkdir -p "$OUTPUT"

iconSizes=(16 20)

for size in "${iconSizes[@]}"; do
    for font in "$INPUT"/"$size"px/*.{eot,svg,ttf,woff,woff2}; do
        cp "$font" "$OUTPUT/"
    done
done
