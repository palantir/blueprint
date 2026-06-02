/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { render, screen } from "@testing-library/react";
import { createRef } from "react";

import { describe, expect, test } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";

import { Layer } from "./layer";
import { Surface } from "./surface";

describe("<Surface>", () => {
    test("renders a div with the base and default-kind classes", () => {
        render(<Surface data-testid="surface" />);
        const el = screen.getByTestId("surface");
        expect(el.tagName).toBe("DIV");
        expect(el).toHaveClass(Classes.SURFACE);
        expect(el).toHaveClass(`${Classes.SURFACE}-opaque`);
    });

    test("applies kind, intent, and shadow classes", () => {
        render(<Surface data-testid="surface" kind="glass" intent="primary" shadow={2} />);
        const el = screen.getByTestId("surface");
        expect(el).toHaveClass(`${Classes.SURFACE}-glass`);
        expect(el).toHaveClass(`${Classes.SURFACE}-intent-primary`);
        expect(el).toHaveClass(`${Classes.SURFACE}-shadow-2`);
    });

    test("applies shadow-0 (falsy index) when shadow is 0", () => {
        render(<Surface data-testid="surface" shadow={0} />);
        expect(screen.getByTestId("surface")).toHaveClass(`${Classes.SURFACE}-shadow-0`);
    });

    test("omits intent and shadow classes when not provided", () => {
        render(<Surface data-testid="surface" />);
        const el = screen.getByTestId("surface");
        expect(el.className).not.toMatch(/-surface-intent-/);
        expect(el.className).not.toMatch(/-surface-shadow-/);
    });

    test("merges a user className", () => {
        render(<Surface className="custom" data-testid="surface" />);
        const el = screen.getByTestId("surface");
        expect(el).toHaveClass("custom");
        expect(el).toHaveClass(Classes.SURFACE);
    });

    test("asChild merges into the child without an extra DOM node", () => {
        render(
            <Surface asChild shadow={2}>
                <section data-testid="child">content</section>
            </Surface>,
        );
        const el = screen.getByTestId("child");
        expect(el.tagName).toBe("SECTION");
        expect(el).toHaveClass(Classes.SURFACE);
        expect(el).toHaveClass(`${Classes.SURFACE}-shadow-2`);
    });

    test("forwards ref to the rendered element", () => {
        const ref = createRef<HTMLDivElement>();
        render(<Surface ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
        expect(ref.current).toHaveClass(Classes.SURFACE);
    });
});

describe("<Layer>", () => {
    test("renders a div with the none wash by default", () => {
        render(<Layer data-testid="layer" />);
        const el = screen.getByTestId("layer");
        expect(el.tagName).toBe("DIV");
        expect(el).toHaveClass(Classes.LAYER);
        expect(el).toHaveClass(`${Classes.LAYER}-none`);
        expect(el).toHaveAttribute("data-layer-index", "0");
    });

    test("applies the intent wash and forwards index", () => {
        render(
            <Layer data-testid="layer" intent="success" index={3} />,
        );
        const el = screen.getByTestId("layer");
        expect(el).toHaveClass(`${Classes.LAYER}-success`);
        expect(el).toHaveAttribute("data-layer-index", "3");
    });

    test("nests layers, each rendering its own wash", () => {
        render(
            <Layer data-testid="outer" intent="primary" index={1}>
                <Layer data-testid="inner" intent="primary" index={2} />
            </Layer>,
        );
        expect(screen.getByTestId("outer")).toHaveClass(`${Classes.LAYER}-primary`);
        const inner = screen.getByTestId("inner");
        expect(inner).toHaveClass(`${Classes.LAYER}-primary`);
        expect(inner).toHaveAttribute("data-layer-index", "2");
    });

    test("asChild merges into the child without an extra DOM node", () => {
        render(
            <Layer asChild intent="danger">
                <header data-testid="child">content</header>
            </Layer>,
        );
        const el = screen.getByTestId("child");
        expect(el.tagName).toBe("HEADER");
        expect(el).toHaveClass(`${Classes.LAYER}-danger`);
    });

    test("forwards ref to the rendered element", () => {
        const ref = createRef<HTMLDivElement>();
        render(<Layer ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
        expect(ref.current).toHaveClass(Classes.LAYER);
    });
});
