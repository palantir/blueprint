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

import { createRoot, type Root } from "react-dom/client";

import { PackageDownloadOptions, parseBlueprintPackage } from "./packageDownloadOptions";

const roots: Array<{ root: Root; container: HTMLElement }> = [];

/**
 * Find all `.docs-package-install` containers in the DOM and mount a
 * {@link PackageDownloadOptions} component into each one. Follows the same
 * post-render enhancement pattern as {@link addCopyButtonsToImportBlocks}.
 */
export function mountPackageDownloadOptions() {
    // Clean up previously mounted roots
    for (const { root } of roots) {
        root.unmount();
    }
    roots.length = 0;

    const containers = document.querySelectorAll<HTMLElement>(".docs-package-install");
    for (const container of Array.from(containers)) {
        const pre = container.querySelector("pre");
        if (pre == null) {
            continue;
        }

        const pkg = parseBlueprintPackage(pre.textContent ?? "");
        if (pkg == null) {
            continue;
        }

        // Clear the container (removes the original <pre>) and mount the React component
        container.innerHTML = "";
        const root = createRoot(container);
        root.render(<PackageDownloadOptions package={pkg} />);
        roots.push({ root, container });
    }
}
