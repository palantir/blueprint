/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { MouseEventHandler } from "react";

export interface IItemModifiers {
    /** Whether this is the "active" (focused) item, meaning keyboard interactions will act upon it. */
    active: boolean;

    /** Whether this item is disabled and should ignore interactions. */
    disabled: boolean;

    /** Whether this item matches the predicate. A typical renderer could hide `false` values. */
    matchesPredicate: boolean;
}

/**
 * An object describing how to render a particular item.
 * An `itemRenderer` receives the item as its first argument, and this object as its second argument.
 */
export interface IItemRendererProps {
    /** Click event handler to select this item. */
    handleClick: MouseEventHandler<HTMLElement>;

    index?: number;

    /** Modifiers that describe how to render this item, such as `active` or `disabled`. */
    modifiers: IItemModifiers;

    /** The current query string used to filter the items. */
    query: string;
}

/** Type alias for a function that receives an item and props and renders a JSX element (or `null`). */
export type ItemRenderer<T> = (item: T, itemProps: IItemRendererProps) => JSX.Element | null;
