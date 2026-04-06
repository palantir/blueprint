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

import { waitFor } from "@testing-library/dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";
import { Button } from "../button/buttons";

import { Dialog, type DialogProps } from "./dialog";
import { DialogBody } from "./dialogBody";
import { DialogFooter } from "./dialogFooter";

const COMMON_PROPS: DialogProps = {
    backdropProps: { role: "presentation" },
    icon: "inbox",
    isOpen: true,
    title: "Dialog header",
    transitionDuration: 0,
    usePortal: false,
};

describe("<Dialog>", () => {
    it("should render its content correctly", () => {
        render(
            <Dialog {...COMMON_PROPS}>
                <DialogBodyAndFooter />
            </Dialog>,
        );
        const dialog = screen.getByRole("dialog");

        expect(dialog).toBeInTheDocument();
        expect(dialog.querySelector(`.${Classes.DIALOG_BODY}`)).toBeInTheDocument();
        expect(dialog.querySelector(`.${Classes.DIALOG_FOOTER}`)).toBeInTheDocument();
        expect(dialog.querySelector(`.${Classes.DIALOG_FOOTER_ACTIONS}`)).toBeInTheDocument();
        expect(dialog.querySelector(`.${Classes.DIALOG_HEADER}`)).toBeInTheDocument();
    });

    it("should add portalClassName to Portal", () => {
        const TEST_CLASS = "test-class";
        render(
            <Dialog {...COMMON_PROPS} usePortal={true} portalClassName={TEST_CLASS}>
                <DialogBodyAndFooter />
            </Dialog>,
        );

        expect(document.querySelector(`.${Classes.PORTAL}.${TEST_CLASS}`)).toBeInTheDocument();
    });

    it("should render contents in specified container", () => {
        const container = document.createElement("div");
        document.body.appendChild(container);
        render(
            <Dialog {...COMMON_PROPS} usePortal={true} portalContainer={container}>
                <DialogBodyAndFooter />
            </Dialog>,
        );

        expect(container.querySelector(`.${Classes.DIALOG}`)).toBeInTheDocument();
        document.body.removeChild(container);
    });

    it("should close when overlay backdrop is clicked", async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(
            <Dialog {...COMMON_PROPS} onClose={onClose}>
                <DialogBodyAndFooter />
            </Dialog>,
        );

        const backdrop = screen.getByRole("presentation");
        await user.click(backdrop);
        expect(onClose).toHaveBeenCalledOnce();
    });

    it("should not close when canOutsideClickClose=false and backdrop is clicked", async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(
            <Dialog {...COMMON_PROPS} canOutsideClickClose={false} onClose={onClose}>
                <DialogBodyAndFooter />
            </Dialog>,
        );

        const backdrop = screen.getByRole("presentation");
        await user.click(backdrop);
        expect(onClose).not.toHaveBeenCalled();
    });

    it("should not close when canEscapeKeyClose=false and escape is pressed", async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(
            <Dialog {...COMMON_PROPS} canEscapeKeyClose={false} onClose={onClose}>
                <DialogBodyAndFooter />
            </Dialog>,
        );
        await user.keyboard("{Escape}");
        expect(onClose).not.toHaveBeenCalled();
    });

    it("should add className in only one location", () => {
        const { container } = render(<Dialog {...COMMON_PROPS} className="foo" />);
        expect(container.getElementsByClassName("foo")).toHaveLength(1);
    });

    describe("header", () => {
        it("should render header when title prop is provided", () => {
            render(
                <Dialog {...COMMON_PROPS} title="Hello!">
                    <DialogBodyAndFooter />
                </Dialog>,
            );
            const header = screen.getByText("Hello!");
            expect(header).toBeInTheDocument();
            expect(header.closest(`.${Classes.DIALOG_HEADER}`)).toBeInTheDocument();
        });

        it("should render header when title is an empty string", () => {
            render(
                <Dialog {...COMMON_PROPS} title="">
                    <DialogBodyAndFooter />
                </Dialog>,
            );
            const dialog = screen.getByRole("dialog");
            expect(dialog.querySelector(`.${Classes.DIALOG_HEADER}`)).toBeInTheDocument();
        });

        it("should not render header when title is null", () => {
            render(
                <Dialog {...COMMON_PROPS} title={null}>
                    <DialogBodyAndFooter />
                </Dialog>,
            );
            const dialog = screen.getByRole("dialog");
            expect(dialog.querySelector(`.${Classes.DIALOG_HEADER}`)).not.toBeInTheDocument();
        });

        it("should render and remove close button based on isCloseButtonShown", async () => {
            const user = userEvent.setup();
            const onClose = vi.fn();
            const { rerender } = render(
                <Dialog {...COMMON_PROPS} isCloseButtonShown={true} onClose={onClose}>
                    <DialogBodyAndFooter />
                </Dialog>,
            );

            const closeButton = screen.getByLabelText("Close");
            expect(closeButton).toBeInTheDocument();
            await user.click(closeButton);
            expect(onClose).toHaveBeenCalledOnce();

            // Test that button is removed when prop is false
            rerender(
                <Dialog {...COMMON_PROPS} isCloseButtonShown={false} onClose={onClose}>
                    <DialogBodyAndFooter />
                </Dialog>,
            );
            expect(() => screen.getByLabelText("Close")).to.throw;
        });
    });

    describe("accessibility features", () => {
        it("should render with role='dialog'", () => {
            render(
                <Dialog {...COMMON_PROPS}>
                    <DialogBodyAndFooter />
                </Dialog>,
            );
            expect(screen.getByRole("dialog")).to.exist;
        });

        it("should render with provided aria attributes", () => {
            render(
                <Dialog {...COMMON_PROPS} aria-describedby="dialog-description" aria-labelledby="dialog-title">
                    <DialogBodyAndFooter />
                </Dialog>,
            );
            const dialog = screen.getByRole("dialog");
            expect(dialog).toHaveAttribute("aria-labelledby", "dialog-title");
            expect(dialog).toHaveAttribute("aria-describedby", "dialog-description");
        });

        it("should use title as default aria-labelledby", () => {
            render(
                <Dialog {...COMMON_PROPS} title="Title by props">
                    <DialogBodyAndFooter />
                </Dialog>,
            );
            const dialog = screen.getByRole("dialog");
            expect(dialog).toHaveAttribute("aria-labelledby");
        });

        it("should not apply default aria-labelledby without title", () => {
            render(
                <Dialog {...COMMON_PROPS} title={null}>
                    <DialogBodyAndFooter />
                </Dialog>,
            );
            const dialog = screen.getByRole("dialog");
            expect(dialog).not.toHaveAttribute("aria-labelledby");
        });

        it("should support ref objects attached to container", async () => {
            const containerRef = createRef<HTMLDivElement>();
            render(
                <Dialog {...COMMON_PROPS} containerRef={containerRef}>
                    <DialogBodyAndFooter />
                </Dialog>,
            );

            await waitFor(() => {
                expect(containerRef.current).toHaveClass(Classes.DIALOG_CONTAINER);
            });
        });
    });
});

function DialogBodyAndFooter() {
    return (
        <>
            <DialogBody>
                <p id="dialog-description">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna alqua. Ut enim ad minimum veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.
                </p>
            </DialogBody>
            <DialogFooter
                actions={
                    <>
                        <Button text="Secondary" />
                        <Button className={Classes.INTENT_PRIMARY} type="submit" text="Primary" />
                    </>
                }
            />
        </>
    );
}
