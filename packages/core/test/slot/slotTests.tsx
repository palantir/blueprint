/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { render, screen } from "@testing-library/react";
import { expect } from "chai";
import { createRef } from "react";

import { Slot } from "../../src/components/slot/slot";

describe("<Slot>", () => {
    it("merges props into a single child", () => {
        render(
            <Slot id="foo" data-testid="bar">
                <button>Test</button>
            </Slot>,
        );
        const button = screen.getByRole("button", { name: /test/i });
        expect(button.id).to.equal("foo");
        expect(button.dataset.testid).to.equal("bar");
    });

    it("merges className and style", () => {
        render(
            <Slot className="outer" style={{ color: "red" }}>
                <button className="inner" style={{ background: "blue" }}>
                    Test
                </button>
            </Slot>,
        );
        const button = screen.getByRole("button", { name: /test/i });
        expect(button.className).to.contain("outer");
        expect(button.className).to.contain("inner");
        expect(button.style.color).to.equal("red");
        expect(button.style.background).to.equal("blue");
    });

    it("forwards ref to the child", () => {
        const ref = createRef<HTMLButtonElement>();
        render(
            <Slot ref={ref}>
                <button>Test</button>
            </Slot>,
        );
        expect(ref.current).to.exist;
        expect(ref.current?.tagName).to.equal("BUTTON");
    });

    it("returns null if no children are provided", () => {
        const { container } = render(<Slot />);
        expect(container.firstChild).to.be.null;
    });
});
