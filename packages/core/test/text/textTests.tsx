/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import { Classes, Text } from "../../src/index";

describe("<Text>", () => {
    it("adds the className prop", () => {
        const textContent = "textContent";
        const className = "bp-test-class";
        const wrapper = mount(<Text className={className}>{textContent}</Text>);
        let element = wrapper.find(`.${className}`);
        assert.lengthOf(element, 1, `expected to find 1 .${className}`);
        assert.strictEqual(element.text(), textContent, "content incorrect value");
    });

    describe("if ellipsize true", () => {
        it("truncates string children", () => {
            const textContent = "textContent";
            const wrapper = mount(<Text ellipsize>{textContent}</Text>);
            const element = wrapper.find(`.${Classes.TEXT_OVERFLOW_ELLIPSIS}`);
            assert.lengthOf(element, 1, `missing ${Classes.TEXT_OVERFLOW_ELLIPSIS}`);
            assert.strictEqual(element.text(), textContent, "content incorrect value");
        });

        it("truncates jsx children", () => {
            const children = (
                <span>
                    {"computed text "}
                    <span>
                        text in a span
                    </span>
                </span>
            );
            const textContent = "computed text text in a span";
            const wrapper = mount(<Text ellipsize>{children}</Text>);
            const element = wrapper.find(`.${Classes.TEXT_OVERFLOW_ELLIPSIS}`);
            assert.lengthOf(element, 1, `missing ${Classes.TEXT_OVERFLOW_ELLIPSIS}`);
            assert.strictEqual(element.text(), textContent, "content incorrect value");
        });
    });

    describe("if ellipsize false", () => {
        it("doesn't truncate string children", () => {
            const textContent = "textContent";
            const wrapper = mount(<Text>{textContent}</Text>);
            let element = wrapper.find(`.${Classes.TEXT_OVERFLOW_ELLIPSIS}`);
            assert.lengthOf(element, 0, `unexpected ${Classes.TEXT_OVERFLOW_ELLIPSIS}`);
        });
    });
});
