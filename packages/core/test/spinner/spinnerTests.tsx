/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

import { assert } from "chai";
import { mount, ReactWrapper } from "enzyme";
import * as React from "react";

import { Classes, Spinner, SVGSpinner } from "../../src/index";

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
        const root = mount(<Spinner value={0.35} />);
        assert.isTrue(root.find(`.${Classes.SPINNER}`).hasClass("pt-no-spin"), "missing class pt-no-spin");
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
        const style = wrapper.find(".pt-spinner-head").prop("style");
        const pathLength = parseInt(style.strokeDasharray.split(" ")[0], 10);
        assert.strictEqual(style.strokeDashoffset, pathLength * (1 - percent));
    }
});
