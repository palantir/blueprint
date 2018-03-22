/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

/**
 * Customize querying of entire `items` array. Return new list of items.
 * This method can reorder, add, or remove items at will.
 * (Supports filter algorithms that operate on the entire set, rather than individual items.)
 *
 * If defined with `itemPredicate`, this prop takes priority and the other will be ignored.
 */
export type ItemListPredicate<T> = (query: string, items: T[]) => T[];

/**
 * Customize querying of individual items. Return `true` to keep the item, `false` to hide.
 * This method will be invoked once for each item, so it should be performant. For more complex
 * queries, use `itemListPredicate` to operate once on the entire array.
 *
 * If defined with `itemListPredicate`, this prop will be ignored.
 */
export type ItemPredicate<T> = (query: string, item: T, index?: number) => boolean;
