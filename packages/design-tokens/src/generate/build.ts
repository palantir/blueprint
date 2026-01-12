#!/usr/bin/env node
/**
 * @license Copyright 2025 Palantir Technologies, Inc. All rights reserved.
 */

import StyleDictionary from "style-dictionary";

import config from "./config.ts";

console.info("🎨 Building design tokens with Style Dictionary...\n");

try {
    const sd = new StyleDictionary(config);

    // Build all platforms
    await sd.buildAllPlatforms();

    console.info("\n✔︎ Style Dictionary build complete!");
    console.info("   Generated: TypeScript, CSS, SCSS, Less\n");
} catch (error) {
    console.error("✗ Style Dictionary build failed:");
    console.error(error);
    process.exit(1);
}
