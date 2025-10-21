/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { render, screen } from "@testing-library/react";
import { expect } from "chai";
import { createRef } from "react";

import { Box, Button, Classes, H1 } from "../../src";

const NS = Classes.getClassNamespace();

describe("<Box>", () => {
    it("should render content", () => {
        render(<Box>Test</Box>);
        const box = screen.getByText(/test/i);

        expect(box).to.exist;
    });

    it("should render as a div by default", () => {
        render(<Box>Test</Box>);
        const box = screen.getByText(/test/i);

        expect(box.tagName).to.equal("DIV");
    });

    it("should pass through props", () => {
        render(<Box data-testid="foo">Test</Box>);
        const box = screen.getByTestId("foo");

        expect(box).to.exist;
    });

    it("should support className", () => {
        render(<Box className="foo">Test</Box>);
        const box = screen.getByText(/test/i);
        const classes = [...box.classList];

        expect(classes).to.include("foo");
    });

    it("should support style", () => {
        render(<Box style={{ color: "red" }}>Test</Box>);
        const box = screen.getByText(/test/i);

        expect(box.style.color).to.equal("red");
    });

    it("should support computed class names", () => {
        render(
            <Box display="flex" margin={2}>
                Test
            </Box>,
        );
        const box = screen.getByText(/test/i);
        const classes = [...box.classList];

        expect(classes).to.include(`${NS}-flex`);
        expect(classes).to.include(`${NS}-margin-2`);
    });

    it("should attach ref", () => {
        const ref = createRef<HTMLDivElement>();
        render(<Box ref={ref}>Test</Box>);

        expect(ref.current).to.exist;
        expect(ref.current).to.be.instanceOf(HTMLDivElement);
    });

    it("should not support unsupported/invalid props in types", () => {
        // "foo" is not a valid HTML attribute
        // @ts-expect-error
        render(<Box foo="bar">Test</Box>);
        const box = screen.getByText(/test/i);

        expect(box.attributes.getNamedItem("foo")).to.exist;
    });

    describe("asChild", () => {
        it("should render as child with asChild prop", () => {
            render(
                <Box asChild={true} data-testid="foo">
                    <Button intent="primary">Test</Button>
                </Box>,
            );
            const button = screen.getByRole("button", { name: /test/i });
            const classes = [...button.classList];

            expect(classes).to.include(Classes.BOX);
            expect(classes).to.include(Classes.BUTTON);
            expect(classes).to.include(Classes.INTENT_PRIMARY);
            expect(button.dataset.testid).to.equal("foo");
        });

        it("should merge styles with asChild prop", () => {
            render(
                <Box asChild={true} style={{ color: "red" }}>
                    <Button style={{ color: "blue" }}>Test</Button>
                </Box>,
            );
            const button = screen.getByRole("button", { name: /test/i });

            expect(button.style.color).to.equal("blue");
        });

        it("should remove margin on wrapped component", () => {
            render(
                <Box asChild={true} marginYEnd={0}>
                    <H1>Test</H1>
                </Box>,
            );
            const h1 = screen.getByRole("heading", { name: /test/i });

            expect(getComputedStyle(h1).marginBlockEnd).to.equal("0px");
        });
    });
});
