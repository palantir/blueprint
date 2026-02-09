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

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Button, Classes, Dialog, DialogBody, DialogFooter, type DialogProps } from "../../src";

const COMMON_PROPS: Partial<DialogProps> = {
    icon: "inbox",
    isOpen: true,
    title: "Dialog header",
    transitionDuration: 0,
    usePortal: false,
};

describe("<Dialog>", () => {
    it("renders its content correctly", () => {
        const { container } = render(<Dialog {...COMMON_PROPS}>{renderDialogBodyAndFooter()}</Dialog>);
        [
            Classes.DIALOG,
            Classes.DIALOG_BODY,
            Classes.DIALOG_FOOTER,
            Classes.DIALOG_FOOTER_ACTIONS,
            Classes.DIALOG_HEADER,
            Classes.OVERLAY_BACKDROP,
        ].forEach(className => {
            expect(container.querySelector(`.${className}`)).toBeInTheDocument();
        });
    });

    it("portalClassName appears on Portal", () => {
        const TEST_CLASS = "test-class";
        const { unmount } = render(
            <Dialog {...COMMON_PROPS} usePortal={true} portalClassName={TEST_CLASS}>
                {renderDialogBodyAndFooter()}
            </Dialog>,
        );
        expect(document.querySelector(`.${Classes.PORTAL}.${TEST_CLASS}`)).toBeInTheDocument();
        unmount();
    });

    it("renders contents to specified container correctly", () => {
        const portalContainer = document.createElement("div");
        document.body.appendChild(portalContainer);
        render(
            <Dialog {...COMMON_PROPS} usePortal={true} portalContainer={portalContainer}>
                {renderDialogBodyAndFooter()}
            </Dialog>,
        );
        expect(portalContainer.getElementsByClassName(Classes.DIALOG)).toHaveLength(1);
        document.body.removeChild(portalContainer);
    });

    it("attempts to close when overlay backdrop element is moused down", async () => {
        const onClose = vi.fn();
        const { container } = render(
            <Dialog {...COMMON_PROPS} onClose={onClose}>
                {renderDialogBodyAndFooter()}
            </Dialog>,
        );
        const backdrop = container.querySelector<HTMLElement>(`.${Classes.OVERLAY_BACKDROP}`);
        expect(backdrop).toBeInTheDocument();
        await userEvent.click(backdrop!);
        expect(onClose).toHaveBeenCalledOnce();
    });

    it("doesn't close when canOutsideClickClose=false and overlay backdrop element is moused down", async () => {
        const onClose = vi.fn();
        const { container } = render(
            <Dialog {...COMMON_PROPS} canOutsideClickClose={false} onClose={onClose}>
                {renderDialogBodyAndFooter()}
            </Dialog>,
        );
        const backdrop = container.querySelector<HTMLElement>(`.${Classes.OVERLAY_BACKDROP}`);
        expect(backdrop).toBeInTheDocument();
        await userEvent.click(backdrop!);
        expect(onClose).not.toHaveBeenCalled();
    });

    it("doesn't close when canEscapeKeyClose=false and escape key is pressed", async () => {
        const onClose = vi.fn();
        render(
            <Dialog {...COMMON_PROPS} canEscapeKeyClose={false} onClose={onClose}>
                {renderDialogBodyAndFooter()}
            </Dialog>,
        );
        await userEvent.keyboard("{Escape}");
        expect(onClose).not.toHaveBeenCalled();
    });

    it("supports overlay lifecycle props", () => {
        const onOpening = vi.fn();
        render(
            <Dialog {...COMMON_PROPS} onOpening={onOpening}>
                body
            </Dialog>,
        );
        expect(onOpening).toHaveBeenCalledOnce();
    });

    describe("header", () => {
        it(`renders .${Classes.DIALOG_HEADER} if title prop is given`, () => {
            render(
                <Dialog {...COMMON_PROPS} title="Hello!">
                    dialog body
                </Dialog>,
            );
            const heading = screen.getByText("Hello!");
            const header = heading.parentElement!;
            expect(header).toHaveClass(Classes.DIALOG_HEADER);
        });

        it("clicking close button triggers onClose", async () => {
            const onClose = vi.fn();
            render(
                <Dialog {...COMMON_PROPS} isCloseButtonShown={true} onClose={onClose}>
                    dialog body
                </Dialog>,
            );
            const closeButton = screen.getByRole("button", { name: "Close" });
            await userEvent.click(closeButton);
            expect(onClose).toHaveBeenCalledOnce();
        });

        it("does not render close button if isCloseButtonShown={false}", () => {
            render(
                <Dialog {...COMMON_PROPS} isCloseButtonShown={false}>
                    dialog body
                </Dialog>,
            );
            expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
        });
    });

    it("only adds its className in one location", () => {
        const { container } = render(<Dialog {...COMMON_PROPS} className="foo" />);
        expect(container.querySelectorAll(".foo")).toHaveLength(1);
    });

    describe("accessibility features", () => {
        const renderDialog = (props: Partial<DialogProps>) => {
            return render(
                <Dialog {...COMMON_PROPS} {...props}>
                    {renderDialogBodyAndFooter()}
                </Dialog>,
            );
        };

        it("renders with role={dialog}", () => {
            renderDialog({ className: "check-role" });
            const dialogElement = screen.getByRole("dialog");
            expect(dialogElement).toBeInTheDocument();
        });

        it("renders with provided aria-labelledby and aria-described by from props", () => {
            renderDialog({
                "aria-describedby": "dialog-description",
                "aria-labelledby": "dialog-title",
                className: "renders-with-props",
            });
            const dialogElement = screen.getByRole("dialog");
            expect(dialogElement).toHaveAttribute("aria-labelledby", "dialog-title");
            expect(dialogElement).toHaveAttribute("aria-describedby", "dialog-description");
        });

        it("uses title as default aria-labelledby", () => {
            renderDialog({ className: "default-title", title: "Title by props" });
            const dialogElement = screen.getByRole("dialog");
            // test existence here because id is generated
            expect(dialogElement).toHaveAttribute("aria-labelledby");
        });

        it("does not apply default aria-labelledby if no title", () => {
            renderDialog({ className: "no-default-if-no-title", title: null });
            const dialogElement = screen.getByRole("dialog");
            // test existence here because id is generated
            expect(dialogElement).not.toHaveAttribute("aria-labelledby");
        });

        it("supports ref objects attached to container", async () => {
            const containerRef = createRef<HTMLDivElement>();
            renderDialog({ containerRef });

            // wait for the whole lifecycle to run
            await waitFor(() => {
                expect(containerRef.current).toHaveClass(Classes.DIALOG_CONTAINER);
            });
        });
    });

    // N.B. everything else about Dialog is tested by Overlay2

    function renderDialogBodyAndFooter(): React.JSX.Element[] {
        return [
            <DialogBody key="body">
                <p id="dialog-description">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna alqua. Ut enim ad minimum veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.
                </p>
            </DialogBody>,
            <DialogFooter
                key="footer"
                actions={
                    <>
                        <Button text="Secondary" />
                        <Button className={Classes.INTENT_PRIMARY} type="submit" text="Primary" />
                    </>
                }
            />,
        ];
    }
});
