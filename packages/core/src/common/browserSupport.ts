/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

export function elementClosest(element: Element, selector: string): Element | null {
    let ancestor: Element | null = element;
    while (ancestor !== null && !ancestor.matches(selector)) {
        ancestor = element.parentElement;
    }

    return ancestor;
}

export function addDomTokenListItems(classList: DOMTokenList, classes: string[]) {
    // Remark: IE11 does not support calling classList.add() with more than one argument
    for (const item of classes) {
        classList.add(item);
    }
}
