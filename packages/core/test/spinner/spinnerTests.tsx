/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { mount, ReactWrapper } from "enzyme";
import * as React from "react";

import { Classes, Spinner, SVGSpinner } from "../../src/index";

describe("Spinner", () => {
    it("renders a spinner and two paths", () => {
        const root = mount(<Spinner />);
        assert.lengthOf(root.find(`.${Classes.SPINNER}`), 1);
        assert.lengthOf(root.find("path"), 2);
    });

    it("defaults to spinning quarter circle", () => {
        const root = mount(<Spinner />);
        assert.isFalse(root.find(`.${Classes.SPINNER}`).hasClass(Classes.SPINNER_NO_SPIN));
        assertStrokePercent(root, 0.25);
    });

    it("value sets stroke-dashoffset", () => {
        // dash offset = X * (1 - value)
        const root = mount(<Spinner value={0.35} />);
        assert.isTrue(
            root.find(`.${Classes.SPINNER}`).hasClass(Classes.SPINNER_NO_SPIN),
            `missing class ${Classes.SPINNER_NO_SPIN}`,
        );
        assertStrokePercent(root, 0.35);
    });

    it("React renders SVGSpinner", () => {
        assert.lengthOf(
            mount(
                <svg>
                    <SVGSpinner />
                </svg>,
            ).find(`.${Classes.SVG_SPINNER} svg`),
            1,
        );
    });

    function assertStrokePercent(wrapper: ReactWrapper<any, {}>, percent: number) {
        const style = wrapper.find(`.${Classes.SPINNER_HEAD}`).prop("style");
        const pathLength = parseInt(style.strokeDasharray.split(" ")[0], 10);
        assert.strictEqual(style.strokeDashoffset, pathLength * (1 - percent));
    }
});
