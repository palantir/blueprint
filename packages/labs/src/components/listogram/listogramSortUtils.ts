/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import { lruMemoize } from "reselect";

import type {
    IListogramItem,
    IListogramItemGroupBase,
    IListogramSortKindLabels,
    ListogramSortDirection,
    ListogramSortKind,
} from "./listogramTypes";
import { ListogramSortDirection as SortDirection, ListogramSortKind as SortKind } from "./listogramTypes";

export interface IListogramSortProps {
    sortKindLabels?: IListogramSortKindLabels;
    onSortChange: (sortKind: ListogramSortKind, sortDirection: ListogramSortDirection) => void;
    sortDirection: ListogramSortDirection;
    sortKind?: ListogramSortKind;
    areTitlesSortable: boolean;
}

export function getSortDirection(isDescending: boolean) {
    return isDescending ? SortDirection.DESCENDING : SortDirection.ASCENDING;
}

export const sortItems = lruMemoize(unmemoizedSortItems);

function unmemoizedSortItems(
    items: IListogramItem[],
    sortDirection: ListogramSortDirection,
    sortKind: ListogramSortKind,
) {
    const sortComparator = SORT_COMPARATOR[sortKind];
    return sortDirection === SortDirection.DESCENDING
        ? items.sort((a, b) => sortComparator(b, a))
        : items.sort(sortComparator);
}

const SORT_COMPARATOR: {
    [kind in ListogramSortKind]: (a: IListogramItem, b: IListogramItem) => number;
} = {
    [SortKind.SUBTOTAL]: compareSubtotals,
    [SortKind.TITLE]: compareText,
    [SortKind.COUNT]: compareTotals,
};

function compareText(a: IListogramItem, b: IListogramItem) {
    if (typeof a.title === "string" && typeof b.title === "string") {
        return a.title.localeCompare(b.title);
    } else {
        return (a.titleText || "").localeCompare(b.titleText || "");
    }
}

export function areItemsTextComparable(items: IListogramItemGroupBase[]) {
    return items.some(item => item.titleText !== undefined || typeof item.title === "string");
}

function compareSubtotals(a: IListogramItem, b: IListogramItem) {
    return (a.countSubtotal || 0) - (b.countSubtotal || 0);
}

function compareTotals(a: IListogramItem, b: IListogramItem) {
    return a.count - b.count;
}
