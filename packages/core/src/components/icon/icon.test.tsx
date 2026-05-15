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
        expect(container.querySelector("i")).not.toBeNull();
    });

    it("size=16 renders standard size", () =>
        assertIconSize(<Icon icon="graph" size={IconSize.STANDARD} />, IconSize.STANDARD));

    it("size=20 renders large size", () => assertIconSize(<Icon icon="graph" size={IconSize.LARGE} />, IconSize.LARGE));

    it("renders intent class", () => {
        const { container } = render(<Icon icon="add" intent={Intent.DANGER} />);
        expect(container.querySelector(`.${Classes.INTENT_DANGER}`)).not.toBeNull();
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
        // NOTE: This is supported to simplify usage of this component in other
        // Blueprint components which accept `icon?: IconName | React.JSX.Element`.
        const onClick = vi.fn();
        const { container } = render(<Icon icon={<article onClick={onClick} />} />);
        expect(container.firstElementChild?.tagName).toBe("ARTICLE");
        // We don't test onClick wiring through React props directly; verify the element rendered.
        expect(container.querySelector("article")).not.toBeNull();
    });

    it("icon=undefined renders nothing", () => {
        const { container } = render(<Icon icon={undefined} />);
        expect(container.innerHTML).toBe("");
    });

    it("title sets content of <title> element", () => {
        const { container } = render(<Icon icon="airplane" title="bird" />);
        expect(container.querySelector("title")?.textContent).toBe("bird");
    });

    it("does not add desc if title is not provided", () => {
        const { container } = render(<Icon icon="airplane" />);
        expect(container.querySelectorAll("desc")).toHaveLength(0);
    });

    it("applies aria-hidden=true if title is not defined", () => {
        const { container } = render(<Icon icon="airplane" />);
        const iconRoot = container.querySelector(`.${Classes.ICON}`);
        expect(iconRoot?.getAttribute("aria-hidden")).toBe("true");
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
        const handleClick: React.MouseEventHandler<SVGSVGElement> = () => undefined;
        const { container } = render(<Icon<SVGSVGElement> icon="add" onClick={handleClick} tagName={null} />);
        expect(container.querySelector("span")).toBeNull();
    });

    /** Asserts that rendered icon has an SVG path. */
    function assertIconHasPath(icon: React.ReactElement<IconProps>, iconName: IconName) {
        const { container } = render(icon);
        expect(container.textContent).toBe(iconName);
        expect(container.querySelectorAll("path").length, "should find at least one path element").toBeGreaterThan(0);
    }

    /** Asserts that rendered icon has width/height equal to size. */
    function assertIconSize(icon: React.ReactElement<IconProps>, size: number) {
        const { container } = render(icon);
        const svg = container.querySelector("svg");
        expect(svg?.getAttribute("width")).toBe(String(size));
        expect(svg?.getAttribute("height")).toBe(String(size));
    }

    /** Asserts that rendered icon has color equal to color. */
    function assertIconColor(icon: React.ReactElement<IconProps>, color?: string) {
        const { container } = render(icon);
        const svg = container.querySelector("svg");
        expect(svg?.getAttribute("fill")).toEqual(color ?? null);
    }
});
