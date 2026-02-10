/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { render, screen } from "@testing-library/react";
import { createRef } from "react";

import { Button, Classes as CoreClasses, H1 } from "@blueprintjs/core";
import { describe, expect, test } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";

import { Box } from "./box";

const NS = Classes.getClassNamespace();

describe("<Box>", () => {
    test("should render content", () => {
        render(<Box>Test</Box>);
        const box = screen.getByText<HTMLDivElement>(/test/i);

        expect(box).toBeInTheDocument();
    });

    test("should render as a div by default", () => {
        render(<Box>Test</Box>);
        const box = screen.getByText<HTMLDivElement>(/test/i);

        expect(box.tagName).toBe("DIV");
    });

    test("should pass through data attributes", () => {
        render(<Box data-test="foo">Test</Box>);
        const box = screen.getByText<HTMLDivElement>(/test/i);

        expect(box.dataset.test).toBe("foo");
    });

    test("should support className", () => {
        render(<Box className="foo">Test</Box>);
        const box = screen.getByText<HTMLDivElement>(/test/i);

        expect(box).toHaveClass("foo");
    });

    test("should support style", () => {
        render(<Box style={{ fontWeight: 700 }}>Test</Box>);
        const box = screen.getByText<HTMLDivElement>(/test/i);

        expect(box).toHaveStyle({ fontWeight: 700 });
    });

    test("should support computed class names", () => {
        render(
            <Box display="flex" margin={2}>
                Test
            </Box>,
        );
        const box = screen.getByText<HTMLDivElement>(/test/i);

        expect(box).toHaveClass(`${NS}-flex`);
        expect(box).toHaveClass(`${NS}-margin-2`);
    });

    test("should attach ref", () => {
        const ref = createRef<HTMLDivElement>();
        render(<Box ref={ref}>Test</Box>);

        expect(ref.current).toBeInstanceOf(HTMLDivElement);
        expect(ref.current).toBeInTheDocument();
    });

    test("should not support unsupported/invalid props in types", () => {
        // "foo" is not a valid HTML attribute
        // @ts-expect-error
        render(<Box foo="bar">Test</Box>);
        const box = screen.getByText<HTMLDivElement>(/test/i);

        expect(box).toHaveAttribute("foo", "bar");
    });

    describe("asChild", () => {
        test("should render as child with asChild prop", () => {
            render(
                <Box asChild={true} data-test="foo">
                    <Button intent="primary">Test</Button>
                </Box>,
            );
            const button = screen.getByRole<HTMLButtonElement>("button", { name: /test/i });

            expect(button).toHaveClass(Classes.BOX);
            expect(button).toHaveClass(CoreClasses.BUTTON);
            expect(button).toHaveClass(CoreClasses.INTENT_PRIMARY);
            expect(button).toHaveAttribute("data-test", "foo");
        });

        test("should merge styles with asChild prop", () => {
            render(
                <Box asChild={true} style={{ fontWeight: 700 }}>
                    <Button style={{ color: "blue" }}>Test</Button>
                </Box>,
            );
            const button = screen.getByRole<HTMLButtonElement>("button", { name: /test/i });

            expect(button).toHaveStyle({ fontWeight: 700 });
        });

        test("should remove margin on wrapped component", () => {
            render(
                <Box asChild={true} marginYEnd={0}>
                    <H1>Test</H1>
                </Box>,
            );
            const h1 = screen.getByRole<HTMLHeadingElement>("heading", { name: /test/i });

            expect(h1).toHaveClass(`${NS}-margin-block-end-0`);
        });
    });
});
