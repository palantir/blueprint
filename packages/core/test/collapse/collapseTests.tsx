/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { render } from "@testing-library/react";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes, MenuItem } from "../../src";
import { Collapse } from "../../src/components/collapse/collapse";

describe("<Collapse>", () => {
    it("has the correct className", () => {
        const { container } = render(<Collapse />);
        const collapse = container.querySelector<HTMLElement>(`.${Classes.COLLAPSE}`);
        expect(collapse).toBeInTheDocument();
    });

    it("is closed", () => {
        const { container } = render(<Collapse isOpen={false}>Body</Collapse>);
        const collapse = container.querySelector<HTMLElement>(`.${Classes.COLLAPSE}`);
        expect(collapse).toBeInTheDocument();
        // When closed, the component should have height: 0px or be hidden
        // Note: height might be empty string initially, then set to "0px" after componentDidMount
        // We just check that it's either "" (initial render) or "0px" (after mount)
        const height = collapse!.style.height;
        expect(height === "" || height === "0px").toBe(true);
    });

    it("is open", () => {
        const { container } = render(<Collapse isOpen={true}>Body</Collapse>);
        const collapse = container.querySelector<HTMLElement>(`.${Classes.COLLAPSE}`);
        expect(collapse).toBeInTheDocument();
        // When open, the component should have height: auto
        // The height style is managed internally via component state
        expect(collapse).toHaveStyle({ height: "auto" });
    });

    it("is opening", () => {
        // jsdom doesn't compute layout, so clientHeight is always 0.
        // Mock it to return a non-zero value so Collapse can measure content height during the opening animation.
        const clientHeightSpy = vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(40);

        const { container, rerender } = render(<Collapse isOpen={false}>Body</Collapse>);
        const collapse = container.querySelector<HTMLElement>(`.${Classes.COLLAPSE}`);
        expect(collapse).toBeInTheDocument();

        // Initially closed - height might be "" or "0px"
        const initialHeight = collapse!.style.height;
        expect(initialHeight === "" || initialHeight === "0px").toBe(true);

        // Trigger opening by updating props
        rerender(<Collapse isOpen={true}>Body</Collapse>);

        // When transitioning to open, height should be set to a pixel value (not "0px" or "auto")
        // This tests that the animation state is OPENING (height set to measured content height)
        const height = collapse!.style.height;
        expect(height).not.toBe("0px");
        expect(height).not.toBe("auto");
        expect(height).toMatch(/^\d+px$/);

        clientHeightSpy.mockRestore();
    });

    it("supports custom intrinsic element", () => {
        const { container } = render(<Collapse component="article" />);
        const collapse = container.querySelector<HTMLElement>(`.${Classes.COLLAPSE}`);
        expect(collapse).toBeInTheDocument();
        expect(collapse!.tagName.toLowerCase()).toBe("article");
    });

    it("supports custom Component", () => {
        const { container } = render(<Collapse component={MenuItem} />);
        // MenuItem renders as an <li> with the submenu class
        const collapse = container.querySelector<HTMLElement>(`.${Classes.MENU_SUBMENU}`);
        expect(collapse).toBeInTheDocument();
        expect(collapse!.tagName.toLowerCase()).toBe("li");
    });

    it("unmounts children by default", () => {
        const { container } = render(
            <Collapse isOpen={false}>
                <div className="removed-child" />
            </Collapse>,
        );
        const removedChild = container.querySelector(".removed-child");
        expect(removedChild).not.toBeInTheDocument();
    });

    it("keepChildrenMounted keeps child mounted", () => {
        const { container } = render(
            <Collapse isOpen={false} keepChildrenMounted={true}>
                <div className="hidden-child" />
            </Collapse>,
        );
        const hiddenChild = container.querySelector(".hidden-child");
        expect(hiddenChild).toBeInTheDocument();
    });
});
