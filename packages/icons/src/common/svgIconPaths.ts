/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 */

/**
 * Compact representation of an SVG icon.
 * - `[0]`: name
 * - `[1]`: 16px SVG path
 * - `[2]`: 20px SVG path
 */
export type SVGIconPaths = [string, string[], string[]];
