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
    it("renders jsx text children", () => {
        const children = (
            <span>
                {"computed text "}
                <span>
                    text in a span
                </span>
            </span>
        );
        const textContent = "computed text text in a span";
        assert.lengthOf(document.getElementsByClassName(Classes.TEXT_OVERFLOW_ELLIPSIS), 0);

        const wrapper = mount(<Text ellipsize>{children}</Text>);
        const element = wrapper.find(`.${Classes.TEXT_OVERFLOW_ELLIPSIS}`);
        assert.lengthOf(element, 1, `missing ${Classes.TEXT_OVERFLOW_ELLIPSIS}`);
        assert.strictEqual(element.text(), textContent, "content incorrect value");
    });
});
