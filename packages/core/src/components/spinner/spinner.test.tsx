/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { render, screen } from "@testing-library/react";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";
import { SPINNER_WARN_CLASSES_SIZE } from "../../common/errors";

import { Spinner, SpinnerSize } from "./spinner";

describe("Spinner", () => {
    it("renders a spinner and two paths", () => {
        render(<Spinner />);
        const spinner = screen.getByRole("progressbar");
        expect(spinner).toHaveClass(Classes.SPINNER);
        expect(spinner.querySelectorAll("path")).toHaveLength(2);
    });

    describe("accessibility", () => {
        it("sets 'aria-valuenow' attribute", () => {
            const VALUE = 0.4;
            render(<Spinner value={VALUE} />);
            const spinner = screen.getByRole("progressbar");
            expect(spinner).toHaveAttribute("aria-valuenow", String(VALUE * 100));
        });

        it("supports arbitrary ARIA HTML attributes", () => {
            const LABEL = "widget loading";
            render(<Spinner aria-label={LABEL} />);
            const spinner = screen.getByRole("progressbar");
            expect(spinner).toHaveAttribute("aria-label", LABEL);
        });
    });

    it("tagName determines both container elements", () => {
        render(<Spinner tagName="article" />);
        const spinner = screen.getByRole("progressbar");
        expect(spinner.tagName.toLowerCase()).toBe("article");
        expect(spinner.firstElementChild).toBeInTheDocument();
        expect(spinner.firstElementChild!.tagName.toLowerCase()).toBe("article");
    });

    it("Classes.SMALL determines default size", () => {
        const { container } = render(<Spinner className={Classes.SMALL} />);
        expect(container.querySelector("svg")).toHaveAttribute("height", String(SpinnerSize.SMALL));
    });

    it("Classes.LARGE determines default size", () => {
        const { container } = render(<Spinner className={Classes.LARGE} />);
        expect(container.querySelector("svg")).toHaveAttribute("height", String(SpinnerSize.LARGE));
    });

    it("size overrides Classes.LARGE/SMALL uses size prop and warns", () => {
        const warnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());
        const { container } = render(<Spinner className={Classes.SMALL} size={32} />);
        expect(container.querySelector("svg")).toHaveAttribute("height", "32");
        expect(warnSpy).toHaveBeenCalledWith(SPINNER_WARN_CLASSES_SIZE);
        warnSpy.mockRestore();
    });

    it("defaults to spinning quarter circle", () => {
        render(<Spinner />);
        const spinner = screen.getByRole("progressbar");
        expect(spinner).not.toHaveClass(Classes.SPINNER_NO_SPIN);
        expectStrokePercent(spinner, 0.25);
    });

    it("value sets stroke-dashoffset", () => {
        render(<Spinner value={0.35} />);
        const spinner = screen.getByRole("progressbar");
        expect(spinner).toHaveClass(Classes.SPINNER_NO_SPIN);
        expectStrokePercent(spinner, 0.35);
    });

    describe("viewBox adjusts based on size", () => {
        it("adjusts viewBox for small size", () => {
            render(<Spinner size={SpinnerSize.SMALL} />);
            const spinner = screen.getByRole("progressbar");
            expect(spinner.querySelector("svg")!.getAttribute("viewBox")).toBe("-3.00 -3.00 106.00 106.00");
        });

        it("adjusts viewBox for large size", () => {
            render(<Spinner size={SpinnerSize.LARGE} />);
            const spinner = screen.getByRole("progressbar");
            expect(spinner.querySelector("svg")!.getAttribute("viewBox")).toBe("3.00 3.00 94.00 94.00");
        });
    });
});

function expectStrokePercent(container: HTMLElement, percent: number) {
    const head = container.querySelector<SVGPathElement>(`.${Classes.SPINNER_HEAD}`);
    expect(head).not.toBeNull();
    // strokeDasharray is "X X", parseInt terminates at non-numeric character
    const pathLength = parseInt(head!.getAttribute("stroke-dasharray")!, 10);
    const offset = Number(head!.getAttribute("stroke-dashoffset"));
    expect(offset).toBe(pathLength * (1 - percent));
}
