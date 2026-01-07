/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button, Classes as CoreClasses } from "@blueprintjs/core";

import { Classes } from "../../common";

import { Flex } from "./flex";

const NS = Classes.getClassNamespace();

describe("<Flex>", () => {
    it("should render content", () => {
        render(<Flex>Test</Flex>);
        const flex = screen.getByText<HTMLDivElement>(/test/i);

        expect(flex).toBeInTheDocument();
    });

    it("should always set display flex", () => {
        render(<Flex>Test</Flex>);
        const flex = screen.getByText<HTMLDivElement>(/test/i);

        expect(flex).toHaveClass(`${NS}-flex`);
    });

    it("should pass through Box props", () => {
        render(
            <Flex gap={2} flexDirection="column" data-testid="flex-test">
                Test
            </Flex>,
        );
        const flex = screen.getByTestId("flex-test");

        expect(flex).toHaveClass(`${NS}-gap-2`);
        expect(flex).toHaveClass(`${NS}-flex-column`);
    });

    it("should support className", () => {
        render(<Flex className="custom-class">Test</Flex>);
        const flex = screen.getByText<HTMLDivElement>(/test/i);

        expect(flex).toHaveClass("custom-class");
        expect(flex).toHaveClass(Classes.BOX);
    });

    it("should support style prop", () => {
        render(<Flex style={{ fontWeight: 700 }}>Test</Flex>);
        const flex = screen.getByText<HTMLDivElement>(/test/i);

        expect(flex).toHaveStyle({ fontWeight: 700 });
    });

    it("should support asChild prop", () => {
        render(
            <Flex asChild={true} gap={2}>
                <Button intent="primary">Test</Button>
            </Flex>,
        );
        const button = screen.getByRole<HTMLButtonElement>("button", { name: /test/i });

        expect(button).toHaveClass(Classes.BOX);
        expect(button).toHaveClass(CoreClasses.BUTTON);
        expect(button).toHaveClass(`${NS}-flex`);
        expect(button).toHaveClass(`${NS}-gap-2`);
    });

    it("should support all flex-related props", () => {
        render(
            <Flex
                flexDirection="row"
                flexWrap="wrap"
                justifyContent="center"
                alignItems="center"
                gap={3}
                data-testid="flex-all-props"
            >
                Test
            </Flex>,
        );
        const flex = screen.getByTestId("flex-all-props");

        expect(flex).toHaveClass(`${NS}-flex-row`);
        expect(flex).toHaveClass(`${NS}-flex-wrap`);
        expect(flex).toHaveClass(`${NS}-justify-center`);
        expect(flex).toHaveClass(`${NS}-items-center`);
        expect(flex).toHaveClass(`${NS}-gap-3`);
    });
});
