/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { expect } from "chai";
import * as React from "react";

import { Classes } from "@blueprintjs/core";

import { LoadableContent } from "../src/common/loadableContent";
import { ReactHarness } from "./harness";

describe("LoadableContent", () => {
    const harness = new ReactHarness();

    afterEach(() => {
        harness.unmount();
    });

    after(() => {
        harness.destroy();
    });

    it("can render single child", () => {
        const someText = "some text";
        const loadableContentHarness = harness.mount(
            <LoadableContent loading={false}>
                <span>{someText}</span>
            </LoadableContent>,
        );

        expect(loadableContentHarness.element.textContent).to.equal(someText);
    });

    it("renders skeleton instead of child when loading", () => {
        const loadableContentHarness = harness.mount(
            <LoadableContent loading={true}>
                <span>some text</span>
            </LoadableContent>,
        );
        const skeletonElement = loadableContentHarness.element.children[0];

        expect(loadableContentHarness.element.textContent).to.be.string("");
        expect(skeletonElement.children.length).to.equal(0);
        expect(skeletonElement.classList.contains(Classes.SKELETON));
    });
});
