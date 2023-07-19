/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
 */

import { mount } from "enzyme";
import * as React from "react";

import { SVGIconContainer } from "../src/svgIconContainer";

describe("SVGIconContainer", () => {
    it("accepts generic type param specifying the type of the root element", () => {
        const handleClick: React.MouseEventHandler<HTMLSpanElement> = () => undefined;
        mount(
            <SVGIconContainer<HTMLSpanElement> iconName="add" onClick={handleClick}>
                <path />
            </SVGIconContainer>,
        );
    });
});
