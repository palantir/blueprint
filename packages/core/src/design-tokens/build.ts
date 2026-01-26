#!/usr/bin/env node
/**
 * @license Copyright 2026 Palantir Technologies, Inc. All rights reserved.
 */

import StyleDictionary from "style-dictionary";

import { config } from "./sd.config.ts";

async function build() {
    console.info("🎨 Building design tokens...\n");

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
}

build();
