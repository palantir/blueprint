/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { render } from "@testing-library/react";

import { type IconName, Icons, IconSize } from "@blueprintjs/icons";
import { Add, Airplane, Calendar, Graph } from "@blueprintjs/icons/lib/cjs/generated/16px/paths";
import { afterEach, beforeAll, describe, expect, it, type MockInstance, vi } from "@blueprintjs/test-commons/vitest";
import { assertElement } from "@blueprintjs/test-commons/vitest-utils";

import { Classes, Intent } from "../../common";

import { Icon, type IconProps } from "./icon";

describe("<Icon>", () => {
    let iconLoader: MockInstance;

    beforeAll(() => {
        vi.spyOn(Icons, "load").mockResolvedValue(undefined);
        // stub the dynamic icon loader with a synchronous, static one
        iconLoader = vi.spyOn(Icons, "getPaths").mockImplementation((name: string) => {
            switch (name) {
                case "add":
                    return Add;
                case "airplane":
                    return Airplane;
                case "calendar":
                    return Calendar;
                case "graph":
                    return Graph;
                default:
                    return undefined;
            }
        });
    });

    afterEach(() => {
        iconLoader?.mockClear();
    });

    it("tagName dictates HTML tag", () => {
        const { container } = render(<Icon icon="calendar" tagName="i" />);
        expect(container.querySelector("i")).toBeInTheDocument();
    });

    it("size=16 renders standard size", () =>
        assertIconSize(<Icon icon="graph" size={IconSize.STANDARD} />, IconSize.STANDARD));

    it("size=20 renders large size", () =>
        assertIconSize(<Icon icon="graph" size={IconSize.LARGE} />, IconSize.LARGE));

    it("renders intent class", () => {
        const { container } = render(<Icon icon="add" intent={Intent.DANGER} />);
        expect(container.querySelector(`.${Classes.INTENT_DANGER}`)).toBeInTheDocument();
    });

    it.skip("renders icon name", () => {
        assertIconHasPath(<Icon icon="calendar" />, "calendar");
    });

    it("renders icon without color", () => {
        assertIconColor(<Icon icon="add" />);
    });

    it("renders icon color", () => {
        assertIconColor(<Icon icon="add" color="red" />, "red");
    });

    it("unknown icon name renders blank icon", () => {
        const { container } = render(<Icon icon={"unknown" as any} />);
        expect(container.querySelectorAll("path")).toHaveLength(0);
    });

    it("prefixed icon renders blank icon", () => {
        const { container } = render(<Icon icon={Classes.iconClass("airplane") as any} />);
        expect(container.querySelectorAll("path")).toHaveLength(0);
    });

    it("icon element passes through unchanged", () => {
        const { container } = render(<Icon icon={<article />} />);
        expect(container.querySelector("article")).toBeInTheDocument();
    });

    it("icon=undefined renders nothing", () => {
        const { container } = render(<Icon icon={undefined} />);
        expect(container.innerHTML).toBe("");
    });

    it("title sets content of <title> element", () => {
        const { container } = render(<Icon icon="airplane" title="bird" />);
        expect(container.querySelector("title")).toHaveTextContent("bird");
    });

    it("does not add desc if title is not provided", () => {
        const { container } = render(<Icon icon="airplane" />);
        expect(container.querySelectorAll("desc")).toHaveLength(0);
    });

    it("applies aria-hidden=true if title is not defined", () => {
        const { container } = render(<Icon icon="airplane" />);
        expect(container.querySelector(`.${Classes.ICON}`)).toHaveAttribute("aria-hidden", "true");
    });

    it("supports mouse event handlers of type React.MouseEventHandler", () => {
        const handleClick: React.MouseEventHandler = () => undefined;
        render(<Icon icon="add" onClick={handleClick} />);
    });

    it("accepts HTML attributes", () => {
        render(<Icon<HTMLSpanElement> icon="drag-handle-vertical" draggable={false} />);
    });

    it("accepts generic type param specifying the type of the root element", () => {
        const handleClick: React.MouseEventHandler<HTMLSpanElement> = () => undefined;
        render(<Icon<HTMLSpanElement> icon="add" onClick={handleClick} />);
    });

    it("allows specifying the root element as <svg> when tagName={null}", () => {
        const { container } = render(<Icon<SVGSVGElement> icon="add" onClick={() => undefined} tagName={null} />);
        expect(container.querySelector("span")).not.toBeInTheDocument();
    });

    /** Asserts that rendered icon has an SVG path. */
    function assertIconHasPath(icon: React.ReactElement<IconProps>, _iconName: IconName) {
        const { container } = render(icon);
        expect(container.querySelectorAll("path").length, "should find at least one path element").toBeGreaterThan(0);
    }

    /** Asserts that rendered icon has width/height equal to size. */
    function assertIconSize(icon: React.ReactElement<IconProps>, size: number) {
        const { container } = render(icon);
        const svg = assertElement(container, "svg");
        expect(svg).toHaveAttribute("width", String(size));
        expect(svg).toHaveAttribute("height", String(size));
    }

    /** Asserts that rendered icon has color equal to color. */
    function assertIconColor(icon: React.ReactElement<IconProps>, color?: string) {
        const { container } = render(icon);
        const svg = assertElement(container, "svg");
        if (color) {
            expect(svg).toHaveAttribute("fill", color);
        } else {
            expect(svg.getAttribute("fill")).toBeNull();
        }
    }
});
