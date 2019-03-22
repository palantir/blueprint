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
 * Customize querying of individual items.
 *
 * __Filtering a list of items.__ This function is invoked to filter the list of
 * items as a query is typed. Return `true` to keep the item, or `false` to
 * hide. This method is invoked once for each item, so it should be performant.
 * For more complex queries, use `itemListPredicate` to operate once on the
 * entire array. For the purposes of filtering the list, this prop is ignored if
 * `itemListPredicate` is also defined.
 *
 * __Matching a pasted value to an item.__ This function is also invoked to
 * match a pasted value to an existing item if possible. In this case, the
 * function will receive `exactMatch=true`, and the function should return true
 * only if the item _exactly_ matches the query. For the purposes of matching
 * pasted values, this prop will be invoked even if `itemListPredicate` is
 * defined.
 */
export type ItemPredicate<T> = (query: string, item: T, index?: number, exactMatch?: boolean) => boolean;
