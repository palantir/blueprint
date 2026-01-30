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

import type { ListogramItem, ListogramItemId } from "./listogramTypes";

export const TEST_ITEMS: ListogramItem[] = [
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
].map<ListogramItem>((item, index) => ({
    ...item,
    id: index.toString() as ListogramItemId,
}));
