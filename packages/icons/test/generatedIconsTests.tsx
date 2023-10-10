/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
 */

import { mount } from "enzyme";
import * as React from "react";

import { Add } from "../src/generated/components";

describe("<Add> icon component", () => {
    it("allows attaching an event handler", () => {
        const handleClick: React.MouseEventHandler<HTMLSpanElement> = () => undefined;
        mount(<Add onClick={handleClick} />);
    });

    it("disallows child elements", () => {
        const handleClick: React.MouseEventHandler<HTMLSpanElement> = () => undefined;
        mount(
            <Add onClick={handleClick}>
                {/* @ts-expect-error */}
                <path />
            </Add>,
        );
    });
});
