#!/usr/bin/env tsx
/*
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import StyleDictionary from "style-dictionary";

import { config } from "./style-dictionary.js";

console.info("Building Blueprint design tokens...\n");

const sd = new StyleDictionary(config);
await sd.buildAllPlatforms();

console.info("✓ Design tokens built successfully!");
