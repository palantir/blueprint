/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import { InputGroup } from "@blueprintjs/core";
import { DateRangeInput } from "../src/index";

describe("<DateRangeInput>", () => {
    it("renders with three children, the first two of which are input groups", () => {
        const component = mount(<DateRangeInput />);
        expect(component.childAt(0).type()).to.equal(InputGroup);
        expect(component.childAt(1).type()).to.equal(InputGroup);
        expect(component.children().length).to.equal(3);
    });
});
