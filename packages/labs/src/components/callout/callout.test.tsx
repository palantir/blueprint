/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { render, screen } from "@testing-library/react";
import { createRef } from "react";

import { Classes as CoreClasses, H4, Intent } from "@blueprintjs/core";
import { describe, expect, test } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";

import { Callout } from "./callout";

describe("<Callout>", () => {
    test("renders its children", () => {
        render(<Callout>Test content</Callout>);
        expect(screen.getByText(/test content/i)).toBeInTheDocument();
    });

    test("applies the single callout class", () => {
        const { container } = render(<Callout>Test</Callout>);
        const callout = container.firstElementChild!;
        expect(callout).toHaveClass(Classes.CALLOUT);
        // Only the base class (plus any user className) — no intent/minimal/compact modifier classes.
        expect(callout.className.split(/\s+/).filter(Boolean)).toEqual([Classes.CALLOUT]);
    });

    test("supports a custom className", () => {
        const { container } = render(<Callout className="foo">Test</Callout>);
        expect(container.firstElementChild).toHaveClass("foo");
        expect(container.firstElementChild).toHaveClass(Classes.CALLOUT);
    });

    test("renders a title", () => {
        render(<Callout title="My title">Body</Callout>);
        expect(screen.getByRole("heading", { name: /my title/i })).toBeInTheDocument();
    });

    test("supports JSX title via children", () => {
        render(
            <Callout>
                <H4>JSX title</H4>
            </Callout>,
        );
        expect(screen.getByRole("heading", { name: /jsx title/i })).toBeInTheDocument();
    });

    describe("intent", () => {
        test("drives the solid background, no layer, and white foreground via CSS variables", () => {
            const { container } = render(<Callout intent={Intent.PRIMARY}>Test</Callout>);
            const callout = container.firstElementChild as HTMLElement;
            expect(callout.style.getPropertyValue("--callout-background-color")).toBe("var(--bp-intent-primary)");
            expect(callout.style.getPropertyValue("--callout-layer")).toBe("none");
            expect(callout.style.getPropertyValue("--callout-color")).toBe("var(--bp-palette-white-1000)");
        });

        test("falls back to the neutral intent fill when no intent is set", () => {
            const { container } = render(<Callout>Test</Callout>);
            const callout = container.firstElementChild as HTMLElement;
            expect(callout.style.getPropertyValue("--callout-background-color")).toBe("var(--bp-intent-neutral)");
            expect(callout.style.getPropertyValue("--callout-layer")).toBe("none");
            expect(callout.style.getPropertyValue("--callout-color")).toBe("var(--bp-palette-white-1000)");
        });
    });

    describe("minimal", () => {
        test("sets the intent tint layer over the base surface with neutral body text", () => {
            const { container } = render(
                <Callout intent={Intent.SUCCESS} minimal={true}>
                    Test
                </Callout>,
            );
            const callout = container.firstElementChild as HTMLElement;
            expect(callout.style.getPropertyValue("--callout-background-color")).toBe(
                "var(--bp-surface-background-color-base-rest)",
            );
            // The stylesheet stacks this single tint token several times to reach a visible fill.
            expect(callout.style.getPropertyValue("--callout-layer")).toBe("var(--bp-surface-layer-success-rest)");
            expect(callout.style.getPropertyValue("--callout-color")).toBe("var(--bp-typography-color-base)");
        });
    });

    describe("compact", () => {
        test("reduces the padding variable", () => {
            const { container } = render(<Callout compact={true}>Test</Callout>);
            const callout = container.firstElementChild as HTMLElement;
            expect(callout.style.getPropertyValue("--callout-padding")).toBe("calc(var(--bp-surface-spacing) * 2)");
        });

        test("uses the larger padding by default", () => {
            const { container } = render(<Callout>Test</Callout>);
            const callout = container.firstElementChild as HTMLElement;
            expect(callout.style.getPropertyValue("--callout-padding")).toBe("calc(var(--bp-surface-spacing) * 4)");
        });
    });

    describe("icon", () => {
        test("renders a default icon from the intent and sets data-has-icon", () => {
            const { container } = render(<Callout intent={Intent.DANGER}>Test</Callout>);
            const callout = container.firstElementChild as HTMLElement;
            expect(callout).toHaveAttribute("data-has-icon", "true");
            expect(callout.querySelector(`.${CoreClasses.ICON}`)).toBeInTheDocument();
        });

        test("renders an explicit named icon", () => {
            const { container } = render(<Callout icon="airplane">Test</Callout>);
            expect(container.querySelector(`.${CoreClasses.ICON}`)).toBeInTheDocument();
        });

        test("renders no icon when icon is null, even with an intent", () => {
            const { container } = render(
                <Callout icon={null} intent={Intent.DANGER}>
                    Test
                </Callout>,
            );
            const callout = container.firstElementChild as HTMLElement;
            expect(callout).not.toHaveAttribute("data-has-icon");
            expect(callout.querySelector(`.${CoreClasses.ICON}`)).not.toBeInTheDocument();
        });
    });

    test("sets data-has-body-content when there are children", () => {
        const { container } = render(<Callout title="Title">Body</Callout>);
        expect(container.firstElementChild).toHaveAttribute("data-has-body-content", "true");
    });

    test("does not set data-has-body-content when there is no body", () => {
        const { container } = render(<Callout title="Title only" />);
        expect(container.firstElementChild).not.toHaveAttribute("data-has-body-content");
    });

    test("merges user-provided inline styles", () => {
        const { container } = render(<Callout style={{ marginTop: 12 }}>Test</Callout>);
        expect(container.firstElementChild).toHaveStyle({ marginTop: "12px" });
    });

    test("forwards a ref to the root element", () => {
        const ref = createRef<HTMLDivElement>();
        render(<Callout ref={ref}>Test</Callout>);
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
        expect(ref.current).toHaveClass(Classes.CALLOUT);
    });

    test("passes through arbitrary HTML attributes", () => {
        const { container } = render(<Callout data-testid="my-callout">Test</Callout>);
        expect(container.firstElementChild).toHaveAttribute("data-testid", "my-callout");
    });
});
