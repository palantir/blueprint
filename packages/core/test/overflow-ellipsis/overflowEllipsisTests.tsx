/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import { OverflowEllipsis } from "../../src/index";

describe("<OverflowEllipsis>", () => {
    it("renders its contents", () => {
        const ptTextOverflow = "pt-text-overflow-ellipsis";
        const textContent = "text";
        assert.lengthOf(document.getElementsByClassName(ptTextOverflow), 0);

        const wrapper = mount(<OverflowEllipsis>{textContent}</OverflowEllipsis>);
        const element = wrapper.find(`.${ptTextOverflow}`);
        assert.lengthOf(element, 1, `missing ${ptTextOverflow}`);
        assert.strictEqual(element.text(), textContent);
        assert.strictEqual(element.prop("title"), textContent);
    });
});
