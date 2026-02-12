/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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
            it("should treat null and undefined as distinctly different", () => {
                expect(executeItemsEqual(undefined, null, null)).to.be.true;
                expect(executeItemsEqual(undefined, undefined, undefined)).to.be.true;
                expect(executeItemsEqual(undefined, null, undefined)).to.be.false;
                expect(executeItemsEqual(undefined, undefined, null)).to.be.false;
            });

            it("should compare primitives correctly", () => {
                expect(executeItemsEqual(undefined, 42, 42)).to.be.true;
                expect(executeItemsEqual(undefined, 42, 1337)).to.be.false;

                expect(executeItemsEqual(undefined, "A", "A")).to.be.true;
                expect(executeItemsEqual(undefined, "A", "B")).to.be.false;
            });

            it("should use strict equality", () => {
                expect(executeItemsEqual(undefined, ITEM_OBJECT_A, ITEM_OBJECT_A)).to.be.true;
                expect(executeItemsEqual(undefined, ITEM_OBJECT_A, ITEM_OBJECT_A_DUPLICATE)).to.be.false;
            });
        });

        describe("itemsEqual is a property name", () => {
            it("should treat null and undefined as distinctly different", () => {
                expect(executeItemsEqual<ItemObject>("id", null, null)).to.be.true;
                expect(executeItemsEqual<ItemObject>("id", undefined, undefined)).to.be.true;
                expect(executeItemsEqual<ItemObject>("id", null, undefined)).to.be.false;
                expect(executeItemsEqual<ItemObject>("id", undefined, null)).to.be.false;
            });

            it("should compare primitives correctly", () => {
                expect(executeItemsEqual("id", ITEM_OBJECT_A, ITEM_OBJECT_A_EQUIVALENT)).to.be.true;
                expect(executeItemsEqual("id", ITEM_OBJECT_A, ITEM_OBJECT_B)).to.be.false;
            });

            it("should use strict equality", () => {
                expect(executeItemsEqual("listOfValues", ITEM_OBJECT_A, ITEM_OBJECT_A)).to.be.true;
                expect(executeItemsEqual("listOfValues", ITEM_OBJECT_A, ITEM_OBJECT_A_DUPLICATE)).to.be.false;
            });

            it("should not incorrectly compare null to a property with a null value", () => {
                expect(executeItemsEqual<ItemObject>("nullField", ITEM_OBJECT_A, null)).to.be.false;
            });
        });

        describe("itemsEqual is a function", () => {
            const equalityComparator = sinon.spy((itemA: ItemObject, itemB: ItemObject): boolean => {
                return itemA.id === itemB.id;
            });

            beforeEach(() => {
                equalityComparator.resetHistory();
            });

            it("should treat null and undefined as distinctly different", () => {
                expect(executeItemsEqual<ItemObject>(equalityComparator, null, null)).to.be.true;
                expect(executeItemsEqual<ItemObject>(equalityComparator, undefined, undefined)).to.be.true;
                expect(executeItemsEqual<ItemObject>(equalityComparator, null, undefined)).to.be.false;
                expect(executeItemsEqual<ItemObject>(equalityComparator, undefined, null)).to.be.false;

                expect(equalityComparator.called).to.be.false;
            });

            it("should call the function and use its result (true)", () => {
                expect(executeItemsEqual<ItemObject>(equalityComparator, ITEM_OBJECT_A, ITEM_OBJECT_A_EQUIVALENT)).to.be
                    .true;
                expect(equalityComparator.calledWith(ITEM_OBJECT_A, ITEM_OBJECT_A_EQUIVALENT)).to.be.true;
                expect(equalityComparator.returned(true)).to.be.true;
            });

            it("should call the function and use its result (false)", () => {
                expect(executeItemsEqual<ItemObject>(equalityComparator, ITEM_OBJECT_A, ITEM_OBJECT_B)).to.be.false;
                expect(equalityComparator.calledWith(ITEM_OBJECT_A, ITEM_OBJECT_B)).to.be.true;
                expect(equalityComparator.returned(false)).to.be.true;
            });

            it("should not call the function if one param is null/undefined", () => {
                expect(executeItemsEqual<ItemObject>(equalityComparator, ITEM_OBJECT_A, null)).to.be.false;
                expect(executeItemsEqual<ItemObject>(equalityComparator, ITEM_OBJECT_A, undefined)).to.be.false;
                expect(executeItemsEqual<ItemObject>(equalityComparator, null, ITEM_OBJECT_A)).to.be.false;
                expect(executeItemsEqual<ItemObject>(equalityComparator, undefined, ITEM_OBJECT_A)).to.be.false;

                expect(equalityComparator.called).to.be.false;
            });
        });
    });
});
