/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
 */

import { render } from "@testing-library/react";
import { describe, it } from "vitest";

import { SVGIconContainer } from "./svgIconContainer";

describe("SVGIconContainer", () => {
    it("accepts generic type param specifying the type of the root element", () => {
        const handleClick: React.MouseEventHandler<HTMLSpanElement> = () => undefined;
        render(
            <SVGIconContainer<HTMLSpanElement> iconName="add" onClick={handleClick}>
                <path />
            </SVGIconContainer>,
        );
    });
});
