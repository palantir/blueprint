/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { render, screen } from "@testing-library/react";
import { expect } from "chai";

import { Button, Classes, Flex } from "../../src";

const NS = Classes.getClassNamespace();

describe("<Flex>", () => {
    it("should render content", () => {
        render(<Flex>Test</Flex>);

        expect(screen.getByText(/test/i)).to.exist;
    });

    it("should always set display flex", () => {
        render(<Flex>Test</Flex>);
        const flex = screen.getByText(/test/i);
        const classes = [...flex.classList];

        expect(classes).to.include(`${NS}-flex`);
    });

    it("should pass through Box props", () => {
        render(
            <Flex gap={2} flexDirection="column" data-testid="flex-test">
                Test
            </Flex>,
        );
        const flex = screen.getByTestId("flex-test");
        const classes = [...flex.classList];

        expect(classes).to.include(`${NS}-gap-2`);
        expect(classes).to.include(`${NS}-flex-column`);
    });

    it("should support className", () => {
        render(<Flex className="custom-class">Test</Flex>);
        const flex = screen.getByText(/test/i);
        const classes = [...flex.classList];

        expect(classes).to.include("custom-class");
        expect(classes).to.include(Classes.BOX);
    });

    it("should support style prop", () => {
        render(<Flex style={{ color: "red" }}>Test</Flex>);
        const flex = screen.getByText(/test/i);

        expect(flex.style.color).to.equal("red");
    });

    it("should support asChild prop", () => {
        render(
            <Flex asChild={true} gap={2}>
                <Button intent="primary">Test</Button>
            </Flex>,
        );
        const button = screen.getByRole("button", { name: /test/i });
        const classes = [...button.classList];

        expect(classes).to.include(Classes.BOX);
        expect(classes).to.include(Classes.BUTTON);
        expect(classes).to.include(`${NS}-flex`);
        expect(classes).to.include(`${NS}-gap-2`);
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
        const classes = [...flex.classList];

        expect(classes).to.include(`${NS}-flex-row`);
        expect(classes).to.include(`${NS}-flex-wrap`);
        expect(classes).to.include(`${NS}-justify-center`);
        expect(classes).to.include(`${NS}-items-center`);
        expect(classes).to.include(`${NS}-gap-3`);
    });
});
