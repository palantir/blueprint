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
    it("renders with two InputGroup children", () => {
        const component = mount(<DateRangeInput />);
        expect(component.find(InputGroup).length).to.equal(2);
    });

    it("startInputProps.inputRef receives reference to HTML input element", () => {
        const inputRef = sinon.spy();
        // full DOM rendering here so the ref handler is invoked
        mount(<DateRangeInput startInputProps={{ inputRef }} />);
        expect(inputRef.calledOnce).to.be.true;
        expect(inputRef.firstCall.args[0]).to.be.an.instanceOf(HTMLInputElement);
    });

    it("endInputProps.inputRef receives reference to HTML input element", () => {
        const inputRef = sinon.spy();
        // full DOM rendering here so the ref handler is invoked
        mount(<DateRangeInput endInputProps={{ inputRef }} />);
        expect(inputRef.calledOnce).to.be.true;
        expect(inputRef.firstCall.args[0]).to.be.an.instanceOf(HTMLInputElement);
    });
});
