/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import React from "react";
import sinon from "sinon";
import { IItemListRendererProps, renderFilteredItems } from "../src";

describe("renderFilteredItems()", () => {
    const PROPS: IItemListRendererProps<string> = {
        activeItem: "one",
        filteredItems: ["one"],
        items: ["one", "two", "three"],
        itemsParentRef: sinon.stub(),
        query: "x",
        renderItem: () => <div />,
    };
    const noResults = <strong />;
    const initialContent = <article />;

    it("returns noResults if filtered items is empty", () => {
        const element = renderFilteredItems({ ...PROPS, filteredItems: [] }, noResults);
        assert.equal(element, noResults);
    });

    it("returns initialContent if query is empty", () => {
        const element = renderFilteredItems({ ...PROPS, query: "" }, noResults, initialContent);
        assert.equal(element, initialContent);
    });

    it("returns filteredItems mapped through renderItem", () => {
        const elements = renderFilteredItems(PROPS) as JSX.Element[];
        assert.lengthOf(elements, PROPS.filteredItems.length);
    });
});
