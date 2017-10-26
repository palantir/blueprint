/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
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
        const element = wrapper.find(`.${className}`);
        assert.lengthOf(element, 1, `expected to find 1 .${className}`);
        assert.strictEqual(element.text(), textContent, "content incorrect value");
    });

    describe("if ellipsize true", () => {
        it("truncates string children", () => {
            const textContent = "textContent";
            const wrapper = mount(<Text ellipsize={true}>{textContent}</Text>);
            const element = wrapper.find(`.${Classes.TEXT_OVERFLOW_ELLIPSIS}`);
            assert.lengthOf(element, 1, `missing ${Classes.TEXT_OVERFLOW_ELLIPSIS}`);
            assert.strictEqual(element.text(), textContent, "content incorrect value");
        });

        it("truncates jsx children", () => {
            const children = (
                <span>
                    {"computed text "}
                    <span>text in a span</span>
                </span>
            );
            const textContent = "computed text text in a span";
            const wrapper = mount(<Text ellipsize={true}>{children}</Text>);
            const element = wrapper.find(`.${Classes.TEXT_OVERFLOW_ELLIPSIS}`);
            assert.lengthOf(element, 1, `missing ${Classes.TEXT_OVERFLOW_ELLIPSIS}`);
            assert.strictEqual(element.text(), textContent, "content incorrect value");
        });

        describe("title behavior", () => {
            let testsContainerElement: HTMLElement;
            before(() => {
                testsContainerElement = document.createElement("div");
                document.documentElement.appendChild(testsContainerElement);
            });

            after(() => {
                testsContainerElement.remove();
            });

            it("adds the title attribute when text overflows", () => {
                const textContent = new Array(100).join("this will overflow ");
                const wrapper = mount(<Text ellipsize={true}>{textContent}</Text>, { attachTo: testsContainerElement });
                const actualTitle = wrapper.find(`.${Classes.TEXT_OVERFLOW_ELLIPSIS}`).prop("title");
                assert.strictEqual(actualTitle, textContent, "title should equal full text content");
            });

            it("does not add the title attribute when text does not overflow", () => {
                const textContent = "this doesn't overflow";
                const wrapper = mount(<Text ellipsize={true}>{textContent}</Text>, { attachTo: testsContainerElement });
                const actualTitle = wrapper.find(`.${Classes.TEXT_OVERFLOW_ELLIPSIS}`).prop("title");
                assert.strictEqual(actualTitle, undefined, "title should be undefined");
            });
        });
    });

    describe("if ellipsize false", () => {
        it("doesn't truncate string children", () => {
            const textContent = "textContent";
            const wrapper = mount(<Text>{textContent}</Text>);
            const element = wrapper.find(`.${Classes.TEXT_OVERFLOW_ELLIPSIS}`);
            assert.lengthOf(element, 0, `unexpected ${Classes.TEXT_OVERFLOW_ELLIPSIS}`);
        });
    });
});
