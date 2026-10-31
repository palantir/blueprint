/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import camelCase from "lodash/camelCase";

/**
 * Maps a docs example component export name (PascalCase) to its `.tsx` source file name on disk.
 * Uses lodash `camelCase` so leading acronyms like `HTMLSelect` become `htmlSelect`, not `hTMLSelect`.
 */
export function exampleExportNameToSourceFileName(exportName: string): string {
    return `${camelCase(exportName)}.tsx`;
}
