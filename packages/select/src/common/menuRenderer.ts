/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

/**
 * An object describing how to render the contents of a dropdown.
 * A `menuRenderer` receives this object as its sole argument.
 */
export interface IMenuRendererProps<T> {
    /** Array of all items in the list. */
    items: T[];

    /**
     * A ref handler that should be attached to the dropdown's outermost HTML element.
     * This is required for the active item to scroll into view automatically.
     */
    itemsParentRef: (ref: HTMLElement) => void;

    /**
     * Call this function to render an item.
     * This retrieves the modifiers for the item and delegates actual rendering
     * to the owner component's `itemRenderer` prop.
     */
    renderItem: (item: T, index?: number) => JSX.Element | null;

    /** React child to render when filtering items returns zero results. */
    noResults?: React.ReactChild;

    /** React child to render when query is empty. */
    initialContent?: React.ReactChild;
}

/** Type alias for a function that renders the contents of a Dropdown. */
export type MenuRenderer<T> = (dropdownProps: IMenuRendererProps<T>) => JSX.Element;
