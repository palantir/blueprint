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

import { CopyToClipboardButton } from "@blueprintjs/docs-theme";

const roots: Array<{ root: Root; wrapper: HTMLSpanElement }> = [];

/**
 * Find all `.docs-copyable-import` containers in the DOM and mount a copy button into each one.
 * Follows the same post-render enhancement pattern as {@link highlightCodeBlocks}.
 */
export function addCopyButtonsToImportBlocks() {
    // Clean up any previously mounted roots and their DOM wrapper elements
    for (const { root, wrapper } of roots) {
        root.unmount();
        wrapper.remove();
    }
    roots.length = 0;

    const containers = document.querySelectorAll<HTMLElement>(".docs-copyable-import");
    for (const container of Array.from(containers)) {
        const pre = container.querySelector("pre");
        if (pre == null) {
            continue;
        }

        const text = pre.textContent ?? "";
        const wrapper = document.createElement("span");
        wrapper.className = "docs-copy-import-btn";
        container.appendChild(wrapper);

        const root = createRoot(wrapper);
        root.render(<CopyToClipboardButton text={text} variant="outlined" />);
        roots.push({ root, wrapper });
    }
}
