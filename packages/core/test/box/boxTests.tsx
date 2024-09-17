/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import { render, screen } from "@testing-library/react";
import { expect } from "chai";
import * as React from "react";

import { Box } from "../../src";

describe("<Box>", () => {
    it("renders content", () => {
        render(<Box>Test</Box>);
        expect(screen.getByText("Test")).to.exist;
    });

    it("renders as another element", () => {
        render(<Box as="span">Test</Box>);
        expect(screen.getByText("Test").tagName).to.equal("SPAN");
    });

    it("passes through props", () => {
        render(<Box data-testid="foo">Test</Box>);
        expect(screen.getByTestId("foo")).to.exist;
    });

    it("supports className", () => {
        render(<Box className="foo">Test</Box>);
        expect(screen.getByText("Test").className).to.include("foo");
    });

    it("supports style", () => {
        render(<Box style={{ color: "red" }}>Test</Box>);
        expect(screen.getByText("Test").style.color).to.equal("red");
    });

    it("supports display", () => {
        render(<Box display="flex">Test</Box>);
        expect(screen.getByText("Test").className).to.include("flex");
    });

    it("supports margin", () => {
        render(<Box m={2}>Test</Box>);
        expect(screen.getByText("Test").className).to.include("margin-2");
    });
});
