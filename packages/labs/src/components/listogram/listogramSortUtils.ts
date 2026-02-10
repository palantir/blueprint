/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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

import { lruMemoize } from "reselect";

import {
    type ListogramItem,
    type ListogramItemGroupBase,
    type ListogramSortKindLabels,
    type ListogramSortDirection,
    type ListogramSortKind,
    ListogramSortDirection as SortDirection,
    ListogramSortKind as SortKind,
} from "./listogramTypes";

export interface ListogramSortProps {
    sortKindLabels?: ListogramSortKindLabels;
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
    items: ListogramItem[],
    sortDirection: ListogramSortDirection,
    sortKind: ListogramSortKind,
) {
    const sortComparator = SORT_COMPARATOR[sortKind];
    return sortDirection === SortDirection.DESCENDING
        ? items.sort((a, b) => sortComparator(b, a))
        : items.sort(sortComparator);
}

const SORT_COMPARATOR: {
    [kind in ListogramSortKind]: (a: ListogramItem, b: ListogramItem) => number;
} = {
    [SortKind.TITLE]: compareText,
    [SortKind.COUNT]: compareTotals,
};

function compareText(a: ListogramItem, b: ListogramItem) {
    if (typeof a.title === "string" && typeof b.title === "string") {
        return a.title.localeCompare(b.title);
    } else {
        return (a.titleText || "").localeCompare(b.titleText || "");
    }
}

export function areItemsTextComparable(items: ListogramItemGroupBase[]) {
    return items.some(item => item.titleText !== undefined || typeof item.title === "string");
}

function compareTotals(a: ListogramItem, b: ListogramItem) {
    return a.count - b.count;
}
