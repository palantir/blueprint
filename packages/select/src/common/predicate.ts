/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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

/**
 * A custom predicate for returning an entirely new `items` array based on the provided query.
 * See usage sites in `IListItemsProps`.
 */
export type ItemListPredicate<T> = (query: string, items: T[]) => T[];

/**
 * A custom predicate for filtering items based on the provided query.
 * See usage sites in `IListItemsProps`.
 */
export type ItemPredicate<T> = (query: string, item: T, index?: number, exactMatch?: boolean) => boolean;
