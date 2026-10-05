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

/**
 * Whether the native `inert` attribute is supported in the current environment.
 */
function supportsInert(): boolean {
    return typeof HTMLElement !== "undefined" && "inert" in HTMLElement.prototype;
}

interface HiddenSiblingRecord {
    element: Element;
    hadAriaHidden: string | null;
    hadInert: boolean;
}

let hiddenSiblings: HiddenSiblingRecord[] = [];
let hideCount = 0;

/**
 * Hides all siblings of `container` (within its parent) from assistive technology by
 * applying `aria-hidden` and, where supported, the `inert` attribute.
 *
 * Safe to call from multiple concurrently-open modal overlays: only the first (outermost)
 * call actually mutates the DOM. Each call must be paired with exactly one
 * `unhideSiblingNodes()` call.
 */
export function hideSiblingNodes(container: HTMLElement) {
    hideCount++;
    if (hideCount > 1) {
        // a modal overlay is already open; siblings are already hidden
        return;
    }

    const root = container.parentElement;
    if (root == null) {
        return;
    }

    const useInert = supportsInert();
    for (const sibling of Array.from(root.children)) {
        if (sibling === container) {
            continue;
        }
        // don't clobber elements that are already hidden for some other reason
        if (sibling.hasAttribute("aria-hidden") || (useInert && (sibling as HTMLElement).inert)) {
            continue;
        }
        hiddenSiblings.push({
            element: sibling,
            hadAriaHidden: sibling.getAttribute("aria-hidden"),
            hadInert: useInert ? (sibling as HTMLElement).inert : false,
        });
        sibling.setAttribute("aria-hidden", "true");
        if (useInert) {
            (sibling as HTMLElement).inert = true;
        }
    }
}

/**
 * Reverses the effect of `hideSiblingNodes()`. Only restores the DOM once the matching
 * number of calls have been made (i.e. once the last modal overlay has closed).
 */
export function unhideSiblingNodes() {
    hideCount = Math.max(0, hideCount - 1);
    if (hideCount > 0) {
        return;
    }

    for (const { element, hadAriaHidden, hadInert } of hiddenSiblings) {
        if (hadAriaHidden == null) {
            element.removeAttribute("aria-hidden");
        } else {
            element.setAttribute("aria-hidden", hadAriaHidden);
        }
        if (supportsInert()) {
            (element as HTMLElement).inert = hadInert;
        }
    }
    hiddenSiblings = [];
}
