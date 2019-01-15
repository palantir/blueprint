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

export function removeElement(childNode: ChildNode) {
    // Remark: IE11 does not support childNode.remove()
    const parent = childNode.parentNode;
    if (parent !== null) {
        parent.removeChild(childNode);
    }
}
