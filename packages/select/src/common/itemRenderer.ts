/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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
