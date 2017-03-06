/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import { Classes, OverflowEllipsis } from "../../src/index";

describe("<OverflowEllipsis>", () => {
    it("renders its contents", () => {
        const textContent = "text";
        assert.lengthOf(document.getElementsByClassName(Classes.TEXT_OVERFLOW_ELLIPSIS), 0);

        const wrapper = mount(<OverflowEllipsis>{textContent}</OverflowEllipsis>);
        const element = wrapper.find(`.${Classes.TEXT_OVERFLOW_ELLIPSIS}`);
        assert.lengthOf(element, 1, `missing ${Classes.TEXT_OVERFLOW_ELLIPSIS}`);
        assert.strictEqual(element.text(), textContent);
        assert.strictEqual(element.prop("title"), textContent);
    });
});
