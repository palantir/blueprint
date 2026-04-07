/*
 * Copyright 2019 Palantir Technologies, Inc. All rights reserved.
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

import sinon from "sinon";

import { beforeEach, describe, expect, it } from "@blueprintjs/test-commons/vitest";

import { executeItemsEqual } from "./listItemsProps";

describe("ListItemsProps Utils", () => {
    describe("executeItemsEqual", () => {
        // interface for a non-primitive item value
        interface ItemObject {
            id: string;
            label: string;
            listOfValues: number[];
            nullField: null;
        }

        const ITEM_OBJECT_A: ItemObject = {
            id: "A",
            label: "Item A",
            listOfValues: [1, 2],
            nullField: null,
        };

        // Exactly the same contents as ITEM_OBJECT_A, but a different object
        const ITEM_OBJECT_A_DUPLICATE: ItemObject = {
            id: "A",
            label: "Item A",
            listOfValues: [1, 2],
            nullField: null,
        };

        const ITEM_OBJECT_A_EQUIVALENT: ItemObject = {
            id: "A",
            label: "Equivalent to item A based on 'id'",
            listOfValues: [3, 4],
            nullField: null,
        };

        const ITEM_OBJECT_B: ItemObject = {
            id: "B",
            label: "Item B",
            listOfValues: [5, 6],
            nullField: null,
        };

        describe("itemsEqual is undefined", () => {
            it("treats null and undefined as distinctly different", () => {
                expect(executeItemsEqual(undefined, null, null)).toBe(true);
                expect(executeItemsEqual(undefined, undefined, undefined)).toBe(true);
                expect(executeItemsEqual(undefined, null, undefined)).toBe(false);
                expect(executeItemsEqual(undefined, undefined, null)).toBe(false);
            });

            it("compares primitives correctly", () => {
                expect(executeItemsEqual(undefined, 42, 42)).toBe(true);
                expect(executeItemsEqual(undefined, 42, 1337)).toBe(false);

                expect(executeItemsEqual(undefined, "A", "A")).toBe(true);
                expect(executeItemsEqual(undefined, "A", "B")).toBe(false);
            });

            it("uses strict equality", () => {
                expect(executeItemsEqual(undefined, ITEM_OBJECT_A, ITEM_OBJECT_A)).toBe(true);
                // Duplicate objects fail strict equality test
                expect(executeItemsEqual(undefined, ITEM_OBJECT_A, ITEM_OBJECT_A_DUPLICATE)).toBe(false);
            });
        });

        describe("itemsEqual is a property name", () => {
            it("treats null and undefined as distinctly different", () => {
                expect(executeItemsEqual<ItemObject>("id", null, null)).toBe(true);
                expect(executeItemsEqual<ItemObject>("id", undefined, undefined)).toBe(true);
                expect(executeItemsEqual<ItemObject>("id", null, undefined)).toBe(false);
                expect(executeItemsEqual<ItemObject>("id", undefined, null)).toBe(false);
            });

            it("compares primitives correctly", () => {
                expect(executeItemsEqual("id", ITEM_OBJECT_A, ITEM_OBJECT_A_EQUIVALENT)).toBe(true);
                expect(executeItemsEqual("id", ITEM_OBJECT_A, ITEM_OBJECT_B)).toBe(false);
            });

            it("uses strict equality", () => {
                expect(executeItemsEqual("listOfValues", ITEM_OBJECT_A, ITEM_OBJECT_A)).toBe(true);
                // "listOfValues" property is an array, so strict equality fails even though the
                // arrays contain the same values.
                expect(executeItemsEqual("listOfValues", ITEM_OBJECT_A, ITEM_OBJECT_A_DUPLICATE)).toBe(false);
            });

            it("does not incorrectly compare null to a property with a null value", () => {
                expect(executeItemsEqual<ItemObject>("nullField", ITEM_OBJECT_A, null)).toBe(false);
            });
        });

        describe("itemsEqual is a function", () => {
            // Simple equality comparator that compares IDs of ItemObjects.
            const equalityComparator = sinon.spy((itemA: ItemObject, itemB: ItemObject): boolean => {
                return itemA.id === itemB.id;
            });

            beforeEach(() => {
                equalityComparator.resetHistory();
            });

            it("treats null and undefined as distinctly different", () => {
                expect(executeItemsEqual<ItemObject>(equalityComparator, null, null)).toBe(true);
                expect(executeItemsEqual<ItemObject>(equalityComparator, undefined, undefined)).toBe(true);
                expect(executeItemsEqual<ItemObject>(equalityComparator, null, undefined)).toBe(false);
                expect(executeItemsEqual<ItemObject>(equalityComparator, undefined, null)).toBe(false);

                expect(equalityComparator.called).toBeFalsy();
            });

            it("calls the function and uses its result (true)", () => {
                expect(executeItemsEqual<ItemObject>(equalityComparator, ITEM_OBJECT_A, ITEM_OBJECT_A_EQUIVALENT)).toBe(
                    true,
                );
                expect(equalityComparator.calledWith(ITEM_OBJECT_A, ITEM_OBJECT_A_EQUIVALENT)).toBeTruthy();
                expect(equalityComparator.returned(true)).toBeTruthy();
            });

            it("calls the function and uses its result (false)", () => {
                expect(executeItemsEqual<ItemObject>(equalityComparator, ITEM_OBJECT_A, ITEM_OBJECT_B)).toBe(false);
                expect(equalityComparator.calledWith(ITEM_OBJECT_A, ITEM_OBJECT_B)).toBeTruthy();
                expect(equalityComparator.returned(false)).toBeTruthy();
            });

            it("does not call the function if one param is null/undefined", () => {
                expect(executeItemsEqual<ItemObject>(equalityComparator, ITEM_OBJECT_A, null)).toBe(false);
                expect(executeItemsEqual<ItemObject>(equalityComparator, ITEM_OBJECT_A, undefined)).toBe(false);
                expect(executeItemsEqual<ItemObject>(equalityComparator, null, ITEM_OBJECT_A)).toBe(false);
                expect(executeItemsEqual<ItemObject>(equalityComparator, undefined, ITEM_OBJECT_A)).toBe(false);

                expect(equalityComparator.called).toBeFalsy();
            });
        });
    });
});
