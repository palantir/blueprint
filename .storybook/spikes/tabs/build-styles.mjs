/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

// Use the same Sass compiler as Blueprint's CSS build, without adding a dependency.
const require = createRequire(new URL("../../../packages/node-build-scripts/package.json", import.meta.url));
const sass = require("sass");
const root = new URL("./", import.meta.url);
await mkdir(new URL("generated/", root), { recursive: true });
for (const version of ["original", "existing", "semantic"]) {
    const result = await sass.compileAsync(fileURLToPath(new URL(`${version}.scss`, root)), {
        loadPaths: [fileURLToPath(new URL("../../../packages/core/node_modules", root))],
        // Imported legacy Blueprint Sass still uses @import and global built-ins.
        silenceDeprecations: ["import", "global-builtin", "color-functions"],
    });
    await writeFile(new URL(`generated/${version}.css`, root), result.css);
}
