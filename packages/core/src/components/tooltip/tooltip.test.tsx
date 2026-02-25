/**
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Button } from "..";
import { Classes } from "../../common";

import { Tooltip } from "./tooltip";

describe("<Tooltip>", () => {
    describe("rendering", () => {
        it("propogates class names correctly", () => {
            const { container } = render(
                <Tooltip
                    className="bar"
                    content="content"
                    hoverOpenDelay={0}
                    isOpen={true}
                    popoverClassName="foo"
                    usePortal={false}
                >
                    <Button text="target" />
                </Tooltip>,
            );

            expect(container.querySelector(`.${Classes.TOOLTIP}.foo`)).to.exist;
            expect(container.querySelector(`.${Classes.POPOVER_TARGET}.bar`)).to.exist;
        });

        it("targetTagName renders the right elements", () => {
            const { container } = render(
                <Tooltip content="content" hoverOpenDelay={0} isOpen={true} targetTagName="address" usePortal={false}>
                    <Button text="target" />
                </Tooltip>,
            );

            expect(container.querySelector(`address.${Classes.POPOVER_TARGET}`)).to.exist;
        });

        it("applies minimal class when minimal is true", () => {
            const { container } = render(
                <Tooltip content="content" hoverOpenDelay={0} isOpen={true} minimal={true} usePortal={false}>
                    <Button text="target" />
                </Tooltip>,
            );

            expect(container.querySelector(`.${Classes.TOOLTIP}.${Classes.MINIMAL}`)).to.exist;
        });

        it("does not apply minimal class when minimal is false", () => {
            const { container } = render(
                <Tooltip content="content" hoverOpenDelay={0} isOpen={true} usePortal={false}>
                    <Button text="target" />
                </Tooltip>,
            );

            expect(container.querySelector(`.${Classes.TOOLTIP}.${Classes.MINIMAL}`)).not.toBeInTheDocument();
        });
    });

    describe("basic functionality", () => {
        it("supports overlay lifecycle props", () => {
            const onOpening = vi.fn();
            render(
                <Tooltip content="content" hoverOpenDelay={0} isOpen={true} onOpening={onOpening}>
                    <Button text="target" />
                </Tooltip>,
            );

            expect(onOpening).toHaveBeenCalledOnce();
        });
    });

    describe("in uncontrolled mode", () => {
        it("defaultIsOpen determines initial open state", async () => {
            render(
                <Tooltip content="content" defaultIsOpen={true} hoverOpenDelay={0}>
                    <Button text="target" />
                </Tooltip>,
            );

            await waitFor(() => expect(screen.getByText("content")).to.exist);
        });

        it("triggers on hover", async () => {
            const user = userEvent.setup();
            render(
                <Tooltip content="content" hoverOpenDelay={0}>
                    <Button text="target" />
                </Tooltip>,
            );

            expect(screen.queryByText("content")).not.toBeInTheDocument();

            await user.hover(screen.getByText("target"));

            await waitFor(() => expect(screen.getByText("content")).to.exist);
        });

        it("triggers on focus", async () => {
            render(
                <Tooltip content="content" hoverOpenDelay={0}>
                    <Button text="target" />
                </Tooltip>,
            );
            const button = screen.getByText("target");

            expect(screen.queryByText("content")).not.toBeInTheDocument();

            fireEvent.focus(button);

            await waitFor(() => expect(screen.getByText("content")).to.exist);
        });

        it("does not trigger on focus if openOnTargetFocus={false}", async () => {
            render(
                <Tooltip content="content" hoverOpenDelay={0} openOnTargetFocus={false}>
                    <Button text="target" />
                </Tooltip>,
            );
            const button = screen.getByText("target");

            expect(screen.queryByText("content")).not.toBeInTheDocument();

            fireEvent.focus(button);

            // Wait a bit to ensure tooltip doesn't appear
            await new Promise(resolve => setTimeout(resolve, 50));

            expect(screen.queryByText("content")).not.toBeInTheDocument();
        });

        it("empty content disables Popover and warns with empty string", () => {
            const warnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());
            render(
                <Tooltip content="" hoverOpenDelay={0} isOpen={true}>
                    <Button text="target" />
                </Tooltip>,
            );

            expect(screen.queryByText("content")).not.toBeInTheDocument();
            expect(warnSpy).toHaveBeenCalled();

            warnSpy.mockRestore();
        });

        it("empty content disables Popover and warns with whitespace", () => {
            const warnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());
            render(
                <Tooltip content="   " hoverOpenDelay={0} isOpen={true}>
                    <Button text="target" />
                </Tooltip>,
            );

            expect(screen.queryByText("content")).not.toBeInTheDocument();
            expect(warnSpy).toHaveBeenCalled();

            warnSpy.mockRestore();
        });

        it("setting disabled=true prevents opening tooltip", async () => {
            const user = userEvent.setup();
            render(
                <Tooltip content="content" disabled={true} hoverOpenDelay={0}>
                    <Button text="target" />
                </Tooltip>,
            );

            await user.hover(screen.getByText("target"));

            expect(screen.queryByText("content")).not.toBeInTheDocument();
        });
    });

    describe("in controlled mode", () => {
        it("renders when open", () => {
            render(
                <Tooltip content="content" hoverOpenDelay={0} isOpen={true}>
                    <Button text="target" />
                </Tooltip>,
            );

            expect(screen.getByText("content")).to.exist;
        });

        it("doesn't render when not open", () => {
            render(
                <Tooltip content="content" hoverOpenDelay={0} isOpen={false}>
                    <Button text="target" />
                </Tooltip>,
            );

            expect(screen.queryByText("content")).not.toBeInTheDocument();
        });

        it("empty content disables Popover and warns", () => {
            const warnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());
            render(
                <Tooltip content="" hoverOpenDelay={0} isOpen={true}>
                    <Button text="target" />
                </Tooltip>,
            );

            expect(screen.queryByText("content")).not.toBeInTheDocument();
            expect(warnSpy).toHaveBeenCalled();

            warnSpy.mockRestore();
        });

        describe("onInteraction()", () => {
            it("is invoked with `true` when closed tooltip target is hovered", async () => {
                const user = userEvent.setup();
                const onInteraction = vi.fn();
                render(
                    <Tooltip content="content" hoverOpenDelay={0} isOpen={false} onInteraction={onInteraction}>
                        <Button text="target" />
                    </Tooltip>,
                );

                await user.hover(screen.getByText("target"));

                expect(onInteraction).toHaveBeenCalledOnce();
                expect(onInteraction).toHaveBeenCalledWith(true, expect.anything());
            });
        });
    });

    it("Escape key closes tooltip", async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(
            <Tooltip content="content" hoverOpenDelay={0} isOpen={true} onClose={onClose}>
                <Button text="target" />
            </Tooltip>,
        );

        expect(screen.getByText("content")).to.exist;

        await user.keyboard("{Escape}");

        expect(onClose).toHaveBeenCalledOnce();
    });

    it("Escape key closes only the most recently opened tooltip when multiple are open", async () => {
        const user = userEvent.setup();
        render(
            <div>
                <Tooltip content="first tooltip" defaultIsOpen={true} hoverOpenDelay={0}>
                    <Button text="first target" />
                </Tooltip>
                <Tooltip content="second tooltip" hoverOpenDelay={0}>
                    <Button text="second target" />
                </Tooltip>
            </div>,
        );

        // Wait for first tooltip to be open
        await waitFor(() => expect(screen.getByText("first tooltip")).to.exist);

        // Hover second tooltip to open it
        await user.hover(screen.getByText("second target"));
        await waitFor(() => expect(screen.getByText("second tooltip")).to.exist);

        // Both tooltips should be visible
        expect(screen.getByText("first tooltip")).to.exist;
        expect(screen.getByText("second tooltip")).to.exist;

        // Press Escape to close second (most recent) tooltip
        await user.keyboard("{Escape}");

        await waitFor(() => expect(screen.queryByText("second tooltip")).not.toBeInTheDocument());
        expect(screen.getByText("first tooltip")).to.exist;

        // Press Escape again to close the first tooltip
        await user.keyboard("{Escape}");

        await waitFor(() => expect(screen.queryByText("first tooltip")).not.toBeInTheDocument());
    });
});
