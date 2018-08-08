/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { EnzymePropSelector, mount, ReactWrapper } from "enzyme";
import * as React from "react";

import { HTMLSelect, IOptionProps } from "../../src/index";

describe("<HtmlSelect>", () => {
    const emptyHandler = () => {
        return;
    };

    it("renders options without CSS classes by default", () => {
        const OPTIONS: string[] = ["a", "b"];
        const group = mount(<HTMLSelect onChange={emptyHandler} options={OPTIONS} />);
        assert.isUndefined(findOption(group, { value: "a" }).prop("className"));
        assert.isUndefined(findOption(group, { value: "b" }).prop("className"));
    });

    it("passes custom classNames to options", () => {
        const OPTIONS: IOptionProps[] = [{ className: "apple", value: "a" }, { className: "banana", value: "b" }];
        const group = mount(<HTMLSelect onChange={emptyHandler} options={OPTIONS} />);
        assert.strictEqual(findOption(group, { value: "a" }).prop("className"), "apple");
        assert.strictEqual(findOption(group, { value: "b" }).prop("className"), "banana");
    });

    function findOption(wrapper: ReactWrapper<any, any>, props: EnzymePropSelector) {
        return wrapper.find("option").filter(props);
    }
});
