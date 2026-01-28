/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import type { IListogramItem, IListogramSerieMetadata, IMultiListogramItem, ListogramItemId } from "./listogramTypes";

export const TEST_ITEMS: IListogramItem[] = [
    {
        count: 5,
        countSubtotal: 2,
        title: "item text 0",
    },
    {
        count: 4,
        countSubtotal: 0,
        title: "item text 1",
    },
    {
        count: 2,
        countSubtotal: 2,
        title: "item text 2",
    },
    {
        count: 2,
        title: "item text 3",
    },
    {
        count: 1,
        title: "item text 4",
    },
    {
        count: 3,
        disabled: true,
        title: "item text 5",
    },
].map<IListogramItem>((item, index) => ({
    ...item,
    id: index.toString() as ListogramItemId,
}));

export const MULTI_TEST_ITEMS: IMultiListogramItem[] = [
    {
        series: [
            { count: 5, countSubtotal: 2, key: "series1" },
            { count: 3, countSubtotal: 3, key: "series2" },
        ],
        title: "item text 0",
    },
    {
        series: [
            { count: 4, countSubtotal: 0, key: "series2" },
            { count: 1, countSubtotal: 2, key: "series1" },
        ],
        title: "item text 1",
    },
    {
        series: [{ count: 2, countSubtotal: 2, key: "series1" }],
        title: "item text 2",
    },
    {
        series: [{ count: 2, key: "series2" }],
        title: "item text 3",
    },
    {
        series: [{ count: 1, key: "series3" }],
        title: "item text 4",
    },
    {
        disabled: true,
        series: [
            { count: 3, key: "series1" },
            { count: 4, countSubtotal: 3, key: "series2" },
            { count: 8, countSubtotal: 0, key: "series3" },
        ],
        title: "item text 5",
    },
].map<IMultiListogramItem>((item, id) => ({
    ...item,
    id: id.toString() as ListogramItemId,
}));

export const MULTI_TEST_SERIES_METADATA: IListogramSerieMetadata[] = [
    { key: "series1" },
    { key: "series2" },
    { key: "series3" },
];
