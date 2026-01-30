/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import type { IListogramItem, ListogramItemId } from "./listogramTypes";

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
