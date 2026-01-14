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
import { spy, stub } from "sinon";
import { describe, expect, test as it } from "vitest";

import { Classes } from "../../src/common";
import { Button } from "../../src/components";
import { Tooltip } from "../../src/components/tooltip/tooltip";

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

            expect(container.querySelector(`.${Classes.TOOLTIP}.foo`)).toBeDefined();
            expect(container.querySelector(`.${Classes.POPOVER_TARGET}.bar`)).toBeDefined();
        });

        it("targetTagName renders the right elements", () => {
            const { container } = render(
                <Tooltip content="content" hoverOpenDelay={0} isOpen={true} targetTagName="address" usePortal={false}>
                    <Button text="target" />
                </Tooltip>,
            );

            expect(container.querySelector(`address.${Classes.POPOVER_TARGET}`)).toBeDefined();
        });

        it("applies minimal class when minimal is true", () => {
            const { container } = render(
                <Tooltip content="content" hoverOpenDelay={0} isOpen={true} minimal={true} usePortal={false}>
                    <Button text="target" />
                </Tooltip>,
            );

            expect(container.querySelector(`.${Classes.TOOLTIP}.${Classes.MINIMAL}`)).toBeDefined();
        });

        it("does not apply minimal class when minimal is false", () => {
            const { container } = render(
                <Tooltip content="content" hoverOpenDelay={0} isOpen={true} usePortal={false}>
                    <Button text="target" />
                </Tooltip>,
            );

            expect(container.querySelector(`.${Classes.TOOLTIP}.${Classes.MINIMAL}`)).toBeNull();
        });
    });

    describe("basic functionality", () => {
        it("supports overlay lifecycle props", () => {
            const onOpening = spy();
            render(
                <Tooltip content="content" hoverOpenDelay={0} isOpen={true} onOpening={onOpening}>
                    <Button text="target" />
                </Tooltip>,
            );

            expect(onOpening.calledOnce).toBe(true);
        });
    });

    describe("in uncontrolled mode", () => {
        it("defaultIsOpen determines initial open state", async () => {
            render(
                <Tooltip content="content" defaultIsOpen={true} hoverOpenDelay={0}>
                    <Button text="target" />
                </Tooltip>,
            );

            await waitFor(() => expect(screen.getByText("content")).toBeDefined());
        });

        it("triggers on hover", async () => {
            render(
                <Tooltip content="content" hoverOpenDelay={0}>
                    <Button text="target" />
                </Tooltip>,
            );

            expect(screen.queryByText("content")).toBeNull();

            await userEvent.hover(screen.getByText("target"));

            await waitFor(() => expect(screen.getByText("content")).toBeDefined());
        });

        it("triggers on focus", async () => {
            render(
                <Tooltip content="content" hoverOpenDelay={0}>
                    <Button text="target" />
                </Tooltip>,
            );
            const button = screen.getByText("target");

            expect(screen.queryByText("content")).toBeNull();

            fireEvent.focus(button);

            await waitFor(() => expect(screen.getByText("content")).toBeDefined());
        });

        it("does not trigger on focus if openOnTargetFocus={false}", async () => {
            render(
                <Tooltip content="content" hoverOpenDelay={0} openOnTargetFocus={false}>
                    <Button text="target" />
                </Tooltip>,
            );
            const button = screen.getByText("target");

            expect(screen.queryByText("content")).toBeNull();

            fireEvent.focus(button);

            // Wait a bit to ensure tooltip doesn't appear
            await new Promise(resolve => setTimeout(resolve, 50));

            expect(screen.queryByText("content")).toBeNull();
        });

        it("empty content disables Popover and warns with empty string", () => {
            const warnSpy = stub(console, "warn");
            render(
                <Tooltip content="" hoverOpenDelay={0} isOpen={true}>
                    <Button text="target" />
                </Tooltip>,
            );

            expect(screen.queryByText("content")).toBeNull();
            expect(warnSpy.called).toBe(true);

            warnSpy.restore();
        });

        it("empty content disables Popover and warns with whitespace", () => {
            const warnSpy = stub(console, "warn");
            render(
                <Tooltip content="   " hoverOpenDelay={0} isOpen={true}>
                    <Button text="target" />
                </Tooltip>,
            );

            expect(screen.queryByText("content")).toBeNull();
            expect(warnSpy.called).toBe(true);

            warnSpy.restore();
        });

        it("setting disabled=true prevents opening tooltip", async () => {
            render(
                <Tooltip content="content" disabled={true} hoverOpenDelay={0}>
                    <Button text="target" />
                </Tooltip>,
            );

            await userEvent.hover(screen.getByText("target"));

            expect(screen.queryByText("content")).toBeNull();
        });
    });

    describe("in controlled mode", () => {
        it("renders when open", () => {
            render(
                <Tooltip content="content" hoverOpenDelay={0} isOpen={true}>
                    <Button text="target" />
                </Tooltip>,
            );

            expect(screen.getByText("content")).toBeDefined();
        });

        it("doesn't render when not open", () => {
            render(
                <Tooltip content="content" hoverOpenDelay={0} isOpen={false}>
                    <Button text="target" />
                </Tooltip>,
            );

            expect(screen.queryByText("content")).toBeNull();
        });

        it("empty content disables Popover and warns", () => {
            const warnSpy = stub(console, "warn");
            render(
                <Tooltip content="" hoverOpenDelay={0} isOpen={true}>
                    <Button text="target" />
                </Tooltip>,
            );

            expect(screen.queryByText("content")).toBeNull();
            expect(warnSpy.called).toBe(true);

            warnSpy.restore();
        });

        describe("onInteraction()", () => {
            it("is invoked with `true` when closed tooltip target is hovered", async () => {
                const onInteraction = spy();
                render(
                    <Tooltip content="content" hoverOpenDelay={0} isOpen={false} onInteraction={onInteraction}>
                        <Button text="target" />
                    </Tooltip>,
                );

                await userEvent.hover(screen.getByText("target"));

                expect(onInteraction.calledOnce).toBe(true);
                expect(onInteraction.calledWith(true)).toBe(true);
            });
        });
    });

    it("Escape key closes tooltip", async () => {
        const onClose = spy();
        render(
            <Tooltip content="content" hoverOpenDelay={0} isOpen={true} onClose={onClose}>
                <Button text="target" />
            </Tooltip>,
        );

        expect(screen.getByText("content")).toBeDefined();

        await userEvent.keyboard("{Escape}");

        expect(onClose.calledOnce).toBe(true);
    });

    it("Escape key closes only the most recently opened tooltip when multiple are open", async () => {
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
        await waitFor(() => expect(screen.getByText("first tooltip")).toBeDefined());

        // Hover second tooltip to open it
        await userEvent.hover(screen.getByText("second target"));
        await waitFor(() => expect(screen.getByText("second tooltip")).toBeDefined());

        // Both tooltips should be visible
        expect(screen.getByText("first tooltip")).toBeDefined();
        expect(screen.getByText("second tooltip")).toBeDefined();

        // Press Escape to close second (most recent) tooltip
        await userEvent.keyboard("{Escape}");

        await waitFor(() => expect(screen.queryByText("second tooltip")).toBeNull());
        expect(screen.getByText("first tooltip")).toBeDefined();

        // Press Escape again to close the first tooltip
        await userEvent.keyboard("{Escape}");

        await waitFor(() => expect(screen.queryByText("first tooltip")).toBeNull());
    });
});
