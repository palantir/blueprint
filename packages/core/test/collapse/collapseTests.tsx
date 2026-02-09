/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { render } from "@testing-library/react";

import { assert, describe, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes, MenuItem } from "../../src";
import { Collapse } from "../../src/components/collapse/collapse";

describe("<Collapse>", () => {
    it("has the correct className", () => {
        const { container } = render(<Collapse />);
        const collapse = container.querySelector<HTMLElement>(`.${Classes.COLLAPSE}`);
        assert.isNotNull(collapse, "Expected to find an element with Classes.COLLAPSE");
    });

    it("is closed", () => {
        const { container } = render(<Collapse isOpen={false}>Body</Collapse>);
        const collapse = container.querySelector<HTMLElement>(`.${Classes.COLLAPSE}`);
        assert.isNotNull(collapse);
        // When closed, the component should have height: 0px or be hidden
        // Note: height might be empty string initially, then set to "0px" after componentDidMount
        // We just check that it's either "" (initial render) or "0px" (after mount)
        const height = collapse!.style.height;
        assert.isTrue(height === "" || height === "0px", `Expected height to be "" or "0px", got "${height}"`);
    });

    it("is open", () => {
        const { container } = render(<Collapse isOpen={true}>Body</Collapse>);
        const collapse = container.querySelector<HTMLElement>(`.${Classes.COLLAPSE}`);
        assert.isNotNull(collapse);
        // When open, the component should have height: auto
        // The height style is managed internally via component state
        assert.strictEqual(collapse!.style.height, "auto");
    });

    it("is opening", () => {
        // jsdom doesn't compute layout, so clientHeight is always 0.
        // Mock it to return a non-zero value so Collapse can measure content height during the opening animation.
        const clientHeightSpy = vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(40);

        const { container, rerender } = render(<Collapse isOpen={false}>Body</Collapse>);
        const collapse = container.querySelector<HTMLElement>(`.${Classes.COLLAPSE}`);
        assert.isNotNull(collapse);

        // Initially closed - height might be "" or "0px"
        const initialHeight = collapse!.style.height;
        assert.isTrue(initialHeight === "" || initialHeight === "0px");

        // Trigger opening by updating props
        rerender(<Collapse isOpen={true}>Body</Collapse>);

        // When transitioning to open, height should be set to a pixel value (not "0px" or "auto")
        // This tests that the animation state is OPENING (height set to measured content height)
        const height = collapse!.style.height;
        assert.notStrictEqual(height, "0px");
        assert.notStrictEqual(height, "auto");
        assert.match(height, /^\d+px$/);

        clientHeightSpy.mockRestore();
    });

    it("supports custom intrinsic element", () => {
        const { container } = render(<Collapse component="article" />);
        const collapse = container.querySelector<HTMLElement>(`.${Classes.COLLAPSE}`);
        assert.isNotNull(collapse);
        assert.strictEqual(collapse!.tagName.toLowerCase(), "article");
    });

    it("supports custom Component", () => {
        const { container } = render(<Collapse component={MenuItem} />);
        // MenuItem renders as an <li> with the submenu class
        const collapse = container.querySelector<HTMLElement>(`.${Classes.MENU_SUBMENU}`);
        assert.isNotNull(collapse);
        assert.strictEqual(collapse!.tagName.toLowerCase(), "li");
    });

    it("unmounts children by default", () => {
        const { container } = render(
            <Collapse isOpen={false}>
                <div className="removed-child" />
            </Collapse>,
        );
        const removedChild = container.querySelector(".removed-child");
        assert.isNull(removedChild);
    });

    it("keepChildrenMounted keeps child mounted", () => {
        const { container } = render(
            <Collapse isOpen={false} keepChildrenMounted={true}>
                <div className="hidden-child" />
            </Collapse>,
        );
        const hiddenChild = container.querySelector(".hidden-child");
        assert.isNotNull(hiddenChild);
    });
});
