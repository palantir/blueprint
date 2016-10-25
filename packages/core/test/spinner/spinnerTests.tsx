/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { assert } from "chai";
import { ReactWrapper, mount } from "enzyme";
import * as React from "react";

import { Classes, SVGSpinner, Spinner } from "../../src/index";

describe("Spinner", () => {
    it("renders a .pt-spinner and two paths", () => {
        const root = mount(<Spinner />);
        assert.lengthOf(root.find(`.${Classes.SPINNER}`), 1);
        assert.lengthOf(root.find("path"), 2);
    });

    it("defaults to spinning quarter circle", () => {
        const root = mount(<Spinner />);
        assert.isFalse(root.find(`.${Classes.SPINNER}`).hasClass("pt-no-spin"));
        assertStrokePercent(root, 0.25);
    });

    it("value sets stroke-dashoffset", () => {
        // dash offset = X * (1 - value)
        const root = mount(<Spinner value={0.35}/>);
        assert.isTrue(root.find(`.${Classes.SPINNER}`).hasClass("pt-no-spin"), "missing class pt-no-spin");
        assertStrokePercent(root, 0.35);
    });

    it("React renders SVGSpinner", () => {
        assert.lengthOf(mount(<svg><SVGSpinner/></svg>).find(`.${Classes.SVG_SPINNER} svg`), 1);
    });

    function assertStrokePercent(wrapper: ReactWrapper<any, {}>, percent: number) {
        const style = wrapper.find(".pt-spinner-head").prop("style");
        const pathLength = parseInt(style.strokeDasharray.split(" ")[0], 10);
        assert.strictEqual(style.strokeDashoffset, pathLength * (1 - percent));
    }
});
