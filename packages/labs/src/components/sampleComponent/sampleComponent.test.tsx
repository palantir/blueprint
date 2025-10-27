/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SampleComponent } from "./sampleComponent";

describe("SampleComponent", () => {
    it("renders with the provided name", () => {
        render(<SampleComponent name="Test User" />);
        expect(screen.getByText("Test User's Sample Component in Labs!")).toBeInTheDocument();
    });

    it("uses h1 tag by default", () => {
        const { container } = render(<SampleComponent name="Test" />);
        expect(container.querySelector("h1")).toBeInTheDocument();
    });

    it("uses custom tag when specified", () => {
        const { container } = render(<SampleComponent name="Test" tagName="h2" />);
        expect(container.querySelector("h2")).toBeInTheDocument();
    });

    it("applies the greeting className", () => {
        const { container } = render(<SampleComponent name="Test" />);
        const element = container.querySelector(".greeting");
        expect(element).toBeInTheDocument();
    });

    it("passes through HTML attributes", () => {
        const { container } = render(<SampleComponent name="Test" data-testid="custom-test" />);
        expect(container.querySelector('[data-testid="custom-test"]')).toBeInTheDocument();
    });
});
