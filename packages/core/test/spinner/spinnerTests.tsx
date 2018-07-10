/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { mount, ReactWrapper } from "enzyme";
import * as React from "react";
import { stub } from "sinon";

import { SPINNER_WARN_CLASSES_SIZE } from "../../src/common/errors";
import { Classes, Spinner } from "../../src/index";

describe("Spinner", () => {
    it("renders a spinner and two paths", () => {
        const root = mount(<Spinner />);
        assert.lengthOf(root.find(`.${Classes.SPINNER}`), 1);
        assert.lengthOf(root.find("path"), 2);
    });

    it("Classes.LARGE/SMALL determine default size", () => {
        const root = mount(<Spinner className={Classes.SMALL} />);
        assert.equal(root.find("svg").prop("height"), Spinner.SIZE_SMALL, "small");

        root.setProps({ className: Classes.LARGE });
        assert.equal(root.find("svg").prop("height"), Spinner.SIZE_LARGE, "large");
    });

    it("size overrides Classes.LARGE/SMALL", () => {
        const warnSpy = stub(console, "warn");
        const root = mount(<Spinner className={Classes.SMALL} size={32} />);
        assert.equal(root.find("svg").prop("height"), 32, "size prop");
        assert.equal(warnSpy.args[0][0], SPINNER_WARN_CLASSES_SIZE);
        warnSpy.restore();
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

    function assertStrokePercent(wrapper: ReactWrapper<any, {}>, percent: number) {
        const head = wrapper.find(`.${Classes.SPINNER_HEAD}`);
        // NOTE: strokeDasharray is string "X X", but parseInt terminates at non-numeric character
        const pathLength = parseInt(head.prop("strokeDasharray").toString(), 10);
        const offset = head.prop("strokeDashoffset");
        assert.strictEqual(offset, pathLength * (1 - percent));
    }
});
