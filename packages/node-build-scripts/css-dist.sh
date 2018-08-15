#!/usr/bin/env bash

# Usage: css-dist
# set OUTPUT env varible to change directory

OUTPUT="${OUTPUT:-lib/css/}"

postcss $OUTPUT/*.css --use autoprefixer --use postcss-discard-comments --replace --map
