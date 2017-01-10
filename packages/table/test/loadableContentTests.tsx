/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Classes, Intent } from "@blueprintjs/core";

import { expect } from "chai";
import * as React from "react";

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

    it("does not render child when loading", () => {
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
