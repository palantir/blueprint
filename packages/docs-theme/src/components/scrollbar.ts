/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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

import { Classes } from "@blueprintjs/core";

/**
 * Inject some CSS style rules into a new `<style>` element to add padding equal to the
 * width of the scrollbar when an `Overlay` is open, such that page content will not
 * shift due to the disappearing vertical scrollbar.
 */
export function addScrollbarStyle() {
    const width = getScrollbarWidth();
    const stylesheet = createStyleSheet();
    const NS = Classes.getClassNamespace();
    stylesheet.insertRule(`.${NS}-overlay-open .docs-banner { padding-right: ${20 + width}px; }`, 0);
    stylesheet.insertRule(`.${NS}-overlay-open .docs-root { padding-right: ${width}px }`, 0);
}

function createStyleSheet() {
    const style = document.createElement("style");
    style.type = "text/css";
    document.head.appendChild(style);
    return style.sheet as CSSStyleSheet;
}

function getScrollbarWidth() {
    const scrollDiv = document.createElement("div");
    scrollDiv.style.overflow = "scroll";

    document.body.appendChild(scrollDiv);
    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);

    return scrollbarWidth;
}
