/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import { Classes, ProgressBar } from "../../src/index";

describe("ProgressBar", () => {
    it("renders a PROGRESS_BAR", () => {
        assert.lengthOf(mount(<ProgressBar />).find("." + Classes.PROGRESS_BAR), 1);
    });

    it("does not set width by default", () => {
        const root = mount(<ProgressBar />);
        assert.isNull(root.find("." + Classes.PROGRESS_METER).prop("style").width);
    });

    it("value sets width percentage", () => {
        const root = mount(<ProgressBar value={0.35} />);
        assert.strictEqual(root.find("." + Classes.PROGRESS_METER).prop("style").width, "35%");
    });
});
