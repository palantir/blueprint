/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import { ProgressBar } from "../../src/index";

describe("ProgressBar", () => {
    it("renders a .pt-progress-bar", () => {
        assert.lengthOf(mount(<ProgressBar />).find(".pt-progress-bar"), 1);
    });

    it("does not set width by default", () => {
        const root = mount(<ProgressBar />);
        assert.isNull(root.find(".pt-progress-meter").prop("style").width);
    });

    it("value sets width percentage", () => {
        const root = mount(<ProgressBar value={0.35} />);
        assert.strictEqual(root.find(".pt-progress-meter").prop("style").width, "35%");
    });
});
