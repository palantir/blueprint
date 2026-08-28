/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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

import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { StrictMode } from "react";

import { HouseIcon, type IconPaths, IconSize, IconsNext } from "@blueprintjs/icons/next";
import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from "@blueprintjs/test-commons/vitest";

import { Classes, Intent } from "../../common";

import { IconNext } from "./iconNext";

describe("<IconNext>", () => {
    let consoleError: MockInstance;
    let load: MockInstance;
    let pathsByKey: Map<string, IconPaths>;

    beforeEach(() => {
        pathsByKey = new Map();
        consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
        vi.spyOn(IconsNext, "getPaths").mockImplementation((icon, variant = "outlined") =>
            pathsByKey.get(`${icon}:${variant}`),
        );
        load = vi.spyOn(IconsNext, "load").mockResolvedValue(undefined);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("renders a cached icon", () => {
        pathsByKey.set("house:outlined", ["house-path"]);

        const { container } = render(<IconNext icon="house" />);

        expect(container.querySelector("path")).toHaveAttribute("d", "house-path");
        expect(load).not.toHaveBeenCalled();
    });

    it("renders a correctly sized SVG placeholder with DOM attributes while loading", () => {
        const onClick = vi.fn();

        render(
            <IconNext
                className="custom-icon"
                color="red"
                data-testid="loading-icon"
                htmlTitle="Loading house"
                icon="house"
                intent={Intent.DANGER}
                onClick={onClick}
                size={32}
                svgProps={{ className: "custom-svg" }}
            />,
        );

        const wrapper = screen.getByTestId("loading-icon");
        const svg = wrapper.querySelector("svg");
        expect(wrapper).toHaveClass(Classes.ICON, Classes.iconClass("house"), Classes.INTENT_DANGER, "custom-icon");
        expect(wrapper).toHaveAttribute("title", "Loading house");
        expect(wrapper).not.toBeEmptyDOMElement();
        expect(svg).toHaveClass("custom-svg");
        expect(svg).toHaveAttribute("data-icon", "house");
        expect(svg).toHaveAttribute("fill", "red");
        expect(svg).toHaveAttribute("height", "32");
        expect(svg).toHaveAttribute("width", "32");
        expect(svg?.querySelector("path")).toBeNull();

        fireEvent.click(wrapper);
        expect(onClick).toHaveBeenCalledOnce();
    });

    it("renders the loading placeholder as the root SVG when tagName is null", () => {
        render(<IconNext data-testid="loading-icon" icon="house" size={24} tagName={null} />);

        const svg = screen.getByTestId("loading-icon");
        expect(svg.tagName).toBe("svg");
        expect(svg).toHaveAttribute("data-icon", "house");
        expect(svg).toHaveAttribute("height", "24");
        expect(svg).toHaveAttribute("width", "24");
        expect(svg.querySelector("path")).toBeNull();
    });

    it("does not show paths from the previous icon while the current icon loads", async () => {
        pathsByKey.set("house:outlined", ["house-path"]);
        let finishLoad: (() => void) | undefined;
        load.mockImplementation(
            () =>
                new Promise<void>(resolve => {
                    finishLoad = () => {
                        pathsByKey.set("star:outlined", ["star-path"]);
                        resolve();
                    };
                }),
        );

        const { container, rerender } = render(<IconNext icon="house" />);
        expect(container.querySelector("path")).toHaveAttribute("d", "house-path");

        rerender(<IconNext icon="star" />);
        expect(container.querySelector("svg")).toHaveAttribute("data-icon", "star");
        expect(container.querySelector("path")).toBeNull();

        await act(async () => finishLoad?.());
        expect(container.querySelector("path")).toHaveAttribute("d", "star-path");
    });

    it("does not show paths from the previous variant while the current variant loads", async () => {
        pathsByKey.set("play:outlined", ["outlined-path"]);
        let finishLoad: (() => void) | undefined;
        load.mockImplementation(
            () =>
                new Promise<void>(resolve => {
                    finishLoad = () => {
                        pathsByKey.set("play:filled", ["filled-path"]);
                        resolve();
                    };
                }),
        );

        const { container, rerender } = render(<IconNext icon="play" />);
        expect(container.querySelector("path")).toHaveAttribute("d", "outlined-path");

        rerender(<IconNext icon="play" variant="filled" />);
        expect(container.querySelector("path")).toBeNull();

        await act(async () => finishLoad?.());
        expect(container.querySelector("path")).toHaveAttribute("d", "filled-path");
    });

    it("retains the empty placeholder and does not load when autoLoad is false", () => {
        const { container } = render(<IconNext autoLoad={false} icon="house" />);

        expect(container.querySelector("svg")).toHaveAttribute("data-icon", "house");
        expect(container.querySelector("path")).toBeNull();
        expect(load).not.toHaveBeenCalled();
        expect(consoleError).toHaveBeenCalledOnce();
        expect(consoleError).toHaveBeenCalledWith(
            "[Blueprint] Next icon 'house' (outlined) is not loaded yet and autoLoad={false}, " +
                "did you call IconsNext.load('house', 'outlined')?",
        );
    });

    it("renders a cache entry populated externally on a later parent rerender", () => {
        const { container, rerender } = render(<IconNext autoLoad={false} className="before" icon="house" />);
        expect(container.querySelector("path")).toBeNull();

        pathsByKey.set("house:outlined", ["externally-loaded-house"]);
        rerender(<IconNext autoLoad={false} className="after" icon="house" />);

        expect(container.querySelector("path")).toHaveAttribute("d", "externally-loaded-house");
    });

    it("catches and logs a loader rejection once", async () => {
        const error = new Error("loader failed");
        load.mockRejectedValue(error);

        render(
            <StrictMode>
                <IconNext icon="house" />
            </StrictMode>,
        );

        await waitFor(() => expect(consoleError).toHaveBeenCalledOnce());
        expect(consoleError).toHaveBeenCalledWith(
            "[Blueprint] Next icon 'house' (outlined) could not be loaded.",
            error,
        );
    });

    it("forwards DOM attributes, size, and color to a Blueprint element icon", () => {
        const onClick = vi.fn();

        render(
            <IconNext
                aria-label="house"
                className="parent-class"
                color="red"
                icon={<HouseIcon className="child-class" />}
                intent={Intent.DANGER}
                onClick={onClick}
                size={IconSize.LARGE}
            />,
        );

        const wrapper = screen.getByLabelText("house");
        const svg = wrapper.querySelector("svg");
        expect(wrapper).toHaveClass("child-class", "parent-class", Classes.INTENT_DANGER);
        expect(svg).toHaveAttribute("fill", "red");
        expect(svg).toHaveAttribute("height", `${IconSize.LARGE}`);
        expect(svg).toHaveAttribute("width", `${IconSize.LARGE}`);

        fireEvent.click(wrapper);
        expect(onClick).toHaveBeenCalledOnce();
    });

    it("gives a Blueprint element icon's own size and color precedence", () => {
        render(
            <IconNext
                aria-label="house"
                color="red"
                icon={<HouseIcon color="blue" size={12} />}
                size={IconSize.LARGE}
            />,
        );

        const svg = screen.getByLabelText("house").querySelector("svg");
        expect(svg).toHaveAttribute("fill", "blue");
        expect(svg).toHaveAttribute("height", "12");
        expect(svg).toHaveAttribute("width", "12");
    });

    it("only merges class names and intent onto an arbitrary element icon", () => {
        const onClick = vi.fn();

        function CustomIcon(props: { className?: string; color?: string; size?: number }) {
            return <svg className={props.className} fill={props.color} height={props.size} width={props.size} />;
        }

        const { container } = render(
            <IconNext
                className="parent-class"
                color="red"
                icon={<CustomIcon className="child-class" />}
                intent={Intent.DANGER}
                onClick={onClick}
                size={IconSize.LARGE}
            />,
        );

        const svg = container.querySelector("svg");
        expect(svg).toHaveClass("child-class", "parent-class", Classes.INTENT_DANGER);
        expect(svg).not.toHaveAttribute("fill");
        expect(svg).not.toHaveAttribute("height");
        expect(svg).not.toHaveAttribute("width");

        fireEvent.click(svg!);
        expect(onClick).not.toHaveBeenCalled();
    });
});
