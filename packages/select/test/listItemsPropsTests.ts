/*
 * Copyright 2019 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import * as sinon from "sinon";
import { executeItemsEqual } from "../src/common/listItemsProps";


describe("IListItemsProps Utils", () => {
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
                assert.isTrue(executeItemsEqual(undefined, null, null));
                assert.isTrue(executeItemsEqual(undefined, undefined, undefined));
                assert.isFalse(executeItemsEqual(undefined, null, undefined));
                assert.isFalse(executeItemsEqual(undefined, undefined, null));
            });

            it("compares primitives correctly", () => {
                assert.isTrue(executeItemsEqual(undefined, 42, 42));
                assert.isFalse(executeItemsEqual(undefined, 42, 1337));

                assert.isTrue(executeItemsEqual(undefined, "A", "A"));
                assert.isFalse(executeItemsEqual(undefined, "A", "B"));
            });

            it("uses strict equality", () => {
                assert.isTrue(executeItemsEqual(undefined, ITEM_OBJECT_A, ITEM_OBJECT_A));
                // Duplicate objects fail strict equality test
                assert.isFalse(executeItemsEqual(undefined, ITEM_OBJECT_A, ITEM_OBJECT_A_DUPLICATE));
            });
        });

        describe("itemsEqual is a property name", () => {
            it("treats null and undefined as distinctly different", () => {
                assert.isTrue(executeItemsEqual<ItemObject>("id", null, null));
                assert.isTrue(executeItemsEqual<ItemObject>("id", undefined, undefined));
                assert.isFalse(executeItemsEqual<ItemObject>("id", null, undefined));
                assert.isFalse(executeItemsEqual<ItemObject>("id", undefined, null));
            });

            it("compares primitives correctly", () => {
                assert.isTrue(executeItemsEqual("id", ITEM_OBJECT_A, ITEM_OBJECT_A_EQUIVALENT));
                assert.isFalse(executeItemsEqual("id", ITEM_OBJECT_A, ITEM_OBJECT_B));
            });

            it("uses strict equality", () => {
                assert.isTrue(executeItemsEqual("listOfValues", ITEM_OBJECT_A, ITEM_OBJECT_A));
                // "listOfValues" property is an array, so strict equality fails even though the
                // arrays contain the same values.
                assert.isFalse(executeItemsEqual("listOfValues", ITEM_OBJECT_A, ITEM_OBJECT_A_DUPLICATE));
            });

            it("does not incorrectly compare null to a property with a null value", () => {
                assert.isFalse(executeItemsEqual<ItemObject>("nullField", ITEM_OBJECT_A, null));
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
                assert.isTrue(executeItemsEqual<ItemObject>(equalityComparator, null, null));
                assert.isTrue(executeItemsEqual<ItemObject>(equalityComparator, undefined, undefined));
                assert.isFalse(executeItemsEqual<ItemObject>(equalityComparator, null, undefined));
                assert.isFalse(executeItemsEqual<ItemObject>(equalityComparator, undefined, null));

                assert(!equalityComparator.called);
            });

            it("calls the function and uses its result (true)", () => {
                assert.isTrue(
                    executeItemsEqual<ItemObject>(equalityComparator, ITEM_OBJECT_A, ITEM_OBJECT_A_EQUIVALENT),
                );
                assert(equalityComparator.calledWith(ITEM_OBJECT_A, ITEM_OBJECT_A_EQUIVALENT));
                assert(equalityComparator.returned(true));
            });

            it("calls the function and uses its result (false)", () => {
                assert.isFalse(executeItemsEqual<ItemObject>(equalityComparator, ITEM_OBJECT_A, ITEM_OBJECT_B));
                assert(equalityComparator.calledWith(ITEM_OBJECT_A, ITEM_OBJECT_B));
                assert(equalityComparator.returned(false));
            });

            it("does not call the function if one param is null/undefined", () => {
                assert.isFalse(executeItemsEqual<ItemObject>(equalityComparator, ITEM_OBJECT_A, null));
                assert.isFalse(executeItemsEqual<ItemObject>(equalityComparator, ITEM_OBJECT_A, undefined));
                assert.isFalse(executeItemsEqual<ItemObject>(equalityComparator, null, ITEM_OBJECT_A));
                assert.isFalse(executeItemsEqual<ItemObject>(equalityComparator, undefined, ITEM_OBJECT_A));

                assert(!equalityComparator.called);
            });
        });
    });
});
