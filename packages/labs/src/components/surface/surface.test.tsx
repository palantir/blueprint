/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { render, screen } from "@testing-library/react";
import { createRef } from "react";

import { describe, expect, test } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";

import { Layer, Surface } from "./surface";

describe("<Surface>", () => {
    test("renders a div with the base class and default data-kind", () => {
        render(<Surface data-testid="surface" />);
        const el = screen.getByTestId("surface");
        expect(el.tagName).toBe("DIV");
        expect(el).toHaveClass(Classes.SURFACE);
        expect(el).toHaveAttribute("data-kind", "opaque");
    });

    test("applies kind, intent, and shadow as data attributes", () => {
        render(<Surface data-testid="surface" kind="glass" intent="primary" shadow={2} />);
        const el = screen.getByTestId("surface");
        expect(el).toHaveAttribute("data-kind", "glass");
        expect(el).toHaveAttribute("data-intent", "primary");
        expect(el).toHaveAttribute("data-shadow", "2");
    });

    test("applies data-shadow=0 (falsy value) when shadow is 0", () => {
        render(<Surface data-testid="surface" shadow={0} />);
        expect(screen.getByTestId("surface")).toHaveAttribute("data-shadow", "0");
    });

    test("omits intent and shadow attributes when not provided", () => {
        render(<Surface data-testid="surface" />);
        const el = screen.getByTestId("surface");
        expect(el).not.toHaveAttribute("data-intent");
        expect(el).not.toHaveAttribute("data-shadow");
    });

    test("merges a user className", () => {
        render(<Surface className="custom" data-testid="surface" />);
        const el = screen.getByTestId("surface");
        expect(el).toHaveClass("custom");
        expect(el).toHaveClass(Classes.SURFACE);
    });

    test("asChild merges into the child without an extra DOM node", () => {
        render(
            <Surface asChild={true} shadow={2}>
                <section data-testid="child">content</section>
            </Surface>,
        );
        const el = screen.getByTestId("child");
        expect(el.tagName).toBe("SECTION");
        expect(el).toHaveClass(Classes.SURFACE);
        expect(el).toHaveAttribute("data-shadow", "2");
    });

    test("forwards ref to the rendered element", () => {
        const ref = createRef<HTMLDivElement>();
        render(<Surface ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
        expect(ref.current).toHaveClass(Classes.SURFACE);
    });

    test("elevation sets the --bp-surface-elevation custom property", () => {
        render(<Surface data-testid="surface" elevation={3} />);
        expect(screen.getByTestId("surface").style.getPropertyValue("--bp-surface-elevation")).toBe(
            "3",
        );
    });

    test("defaults elevation to 0 when not provided", () => {
        render(<Surface data-testid="surface" />);
        expect(screen.getByTestId("surface").style.getPropertyValue("--bp-surface-elevation")).toBe(
            "0",
        );
    });

    test("renders no extra layer DOM node for elevation (CSS-only wash)", () => {
        const { container } = render(<Surface elevation={3} />);
        expect(container.querySelector(`.${Classes.LAYER}`)).toBeNull();
    });

    test("preserves a caller style alongside --bp-surface-elevation", () => {
        render(<Surface data-testid="surface" elevation={2} style={{ width: 200 }} />);
        const el = screen.getByTestId("surface");
        expect(el.style.width).toBe("200px");
        expect(el.style.getPropertyValue("--bp-surface-elevation")).toBe("2");
    });

    test("renders children as direct content", () => {
        render(
            <Surface elevation={2}>
                <span data-testid="content">hello</span>
            </Surface>,
        );
        expect(screen.getByTestId("content")).toHaveTextContent("hello");
    });
});

describe("<Layer>", () => {
    test("renders a div with the none wash by default", () => {
        render(<Layer data-testid="layer" />);
        const el = screen.getByTestId("layer");
        expect(el.tagName).toBe("DIV");
        expect(el).toHaveClass(Classes.LAYER);
        expect(el).toHaveAttribute("data-intent", "none");
        expect(el).toHaveAttribute("data-layer-index", "0");
    });

    test("applies the intent wash and forwards index", () => {
        render(<Layer data-testid="layer" intent="success" index={3} />);
        const el = screen.getByTestId("layer");
        expect(el).toHaveAttribute("data-intent", "success");
        expect(el).toHaveAttribute("data-layer-index", "3");
    });

    test("nests layers, each rendering its own wash", () => {
        render(
            <Layer data-testid="outer" intent="primary" index={1}>
                <Layer data-testid="inner" intent="primary" index={2} />
            </Layer>,
        );
        expect(screen.getByTestId("outer")).toHaveAttribute("data-intent", "primary");
        const inner = screen.getByTestId("inner");
        expect(inner).toHaveAttribute("data-intent", "primary");
        expect(inner).toHaveAttribute("data-layer-index", "2");
    });

    test("asChild merges into the child without an extra DOM node", () => {
        render(
            <Layer asChild={true} intent="danger">
                <header data-testid="child">content</header>
            </Layer>,
        );
        const el = screen.getByTestId("child");
        expect(el.tagName).toBe("HEADER");
        expect(el).toHaveAttribute("data-intent", "danger");
    });

    test("forwards ref to the rendered element", () => {
        const ref = createRef<HTMLDivElement>();
        render(<Layer ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
        expect(ref.current).toHaveClass(Classes.LAYER);
    });
});
