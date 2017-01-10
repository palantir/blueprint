/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";

import { renderLoadingSkeleton } from "../src/common/loading";
import { ReactHarness } from "./harness";

describe("Loading Skeleton", () => {
    const harness = new ReactHarness();

    afterEach(() => {
        harness.unmount();
    });

    after(() => {
        harness.destroy();
    });

    it("renders with proper class names", () => {
        const baseClassName = "some-class-name";
        const skeleton = harness.mount(renderLoadingSkeleton(baseClassName));
        expect(skeleton.element.classList.contains(`${baseClassName}-skeleton`));
    });
});
