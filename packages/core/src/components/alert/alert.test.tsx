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

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { afterAll, afterEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";
import * as Errors from "../../common/errors";

import { Alert } from "./alert";

describe("<Alert>", () => {
    it("should render contents", () => {
        render(
            <Alert
                className="test-class"
                isOpen={true}
                confirmButtonText="Delete"
                cancelButtonText="Cancel"
                onClose={vi.fn()}
                onCancel={vi.fn()}
            >
                <p>Are you sure you want to delete this file?</p>
            </Alert>,
        );
        const alert = screen.getByRole("alertdialog");

        expect(alert).toHaveClass("test-class");
        screen.getByText("Are you sure you want to delete this file?");
        screen.getByRole("button", { name: "Cancel" });
        screen.getByRole("button", { name: "Delete" });
    });

    it("should render contents to a specified container", () => {
        const container = document.createElement("div");
        document.body.appendChild(container);

        render(<Alert isOpen={true} portalContainer={container} />);

        expect(container.querySelector(`.${Classes.ALERT}`)).to.exist;
        document.body.removeChild(container);
    });

    it("should not render icon by default", () => {
        render(<Alert isOpen={true} />);
        const dialog = screen.getByRole("alertdialog");

        expect(dialog.querySelector(`.${Classes.ICON}`)).not.toBeInTheDocument();
    });

    it("should render icon when provided", () => {
        render(<Alert icon="warning-sign" isOpen={true} />);
        const dialog = screen.getByRole("alertdialog");

        expect(dialog.querySelector(`.${Classes.ICON}`)).to.exist;
    });

    it("should support overlay lifecycle props", async () => {
        const onOpening = vi.fn();
        render(<Alert isOpen={true} onOpening={onOpening} />);

        await waitFor(() => expect(onOpening).toHaveBeenCalledOnce());
    });

    describe("confirm button", () => {
        it("should have correct text and intent", () => {
            render(<Alert intent="primary" isOpen={true} confirmButtonText="Confirm" />);
            const confirmButton = screen.getByRole("button", { name: "Confirm" });

            expect(confirmButton).toHaveClass(Classes.INTENT_PRIMARY);
        });

        it("should trigger onConfirm and onClose when clicked", async () => {
            const user = userEvent.setup();
            const onConfirm = vi.fn();
            const onClose = vi.fn();
            render(<Alert isOpen={true} confirmButtonText="Confirm" onConfirm={onConfirm} onClose={onClose} />);
            const confirmButton = screen.getByRole("button", { name: "Confirm" });

            await user.click(confirmButton);

            expect(onConfirm).toHaveBeenCalledOnce();
            expect(onClose).toHaveBeenCalledOnce();
            expect(onClose.mock.calls[0][0]).toBe(true);
        });
    });

    describe("cancel button", () => {
        it("should have correct text and no intent", () => {
            render(<Alert intent="primary" isOpen={true} cancelButtonText="Cancel" onCancel={vi.fn()} />);
            const cancelButton = screen.getByRole("button", { name: "Cancel" });

            expect(cancelButton).not.toHaveClass(Classes.INTENT_PRIMARY);
        });

        it("should trigger 'onCancel' and 'onClose' when clicked", async () => {
            const user = userEvent.setup();
            const onCancel = vi.fn();
            const onClose = vi.fn();
            render(
                <Alert
                    intent="primary"
                    isOpen={true}
                    cancelButtonText="Cancel"
                    onCancel={onCancel}
                    onClose={onClose}
                />,
            );
            const cancelButton = screen.getByText("Cancel");

            await user.click(cancelButton);

            expect(onCancel).toHaveBeenCalledOnce();
            expect(onClose).toHaveBeenCalledOnce();
            expect(onClose.mock.calls[0][0]).toBe(false);
        });

        it("should not be escape key cancelable by default", () => {
            const onCancel = vi.fn();
            render(<Alert isOpen={true} cancelButtonText="Cancel" onCancel={vi.fn()} />);
            const dialog = screen.getByRole("alertdialog");

            fireEvent.keyDown(dialog, { key: "Escape" });

            expect(onCancel).not.toHaveBeenCalled();
        });

        it("should be escape key cancelable when canEscapeKeyCancel is true", async () => {
            const onCancel = vi.fn();
            render(<Alert isOpen={true} cancelButtonText="Cancel" onCancel={onCancel} canEscapeKeyCancel={true} />);
            const dialog = screen.getByRole("alertdialog");

            fireEvent.keyDown(dialog, { key: "Escape" });

            expect(onCancel).toHaveBeenCalledOnce();
        });

        it("should not allow outside click by default", async () => {
            const user = userEvent.setup();
            const onCancel = vi.fn();
            const { baseElement } = render(<Alert isOpen={true} cancelButtonText="Cancel" onCancel={onCancel} />);

            // using baseElement since overlay is rendered in a portal
            const backdrop = baseElement.querySelector(`.${Classes.OVERLAY_BACKDROP}`);

            expect(backdrop).to.exist;

            await user.click(backdrop!);

            expect(onCancel).not.toHaveBeenCalled();
        });

        it("should allow outside click when canOutsideClickCancel is true", async () => {
            const user = userEvent.setup();
            const onCancel = vi.fn();
            const { baseElement } = render(
                <Alert isOpen={true} cancelButtonText="Cancel" onCancel={onCancel} canOutsideClickCancel={true} />,
            );

            const backdrop = baseElement.querySelector(`.${Classes.OVERLAY_BACKDROP}`);

            expect(backdrop).to.exist;

            await user.click(backdrop!);

            expect(onCancel).toHaveBeenCalledOnce();
        });
    });

    describe("loading", () => {
        it("should display loading state on buttons", async () => {
            const user = userEvent.setup();
            const onCancel = vi.fn();
            const onClose = vi.fn();

            render(
                <Alert
                    isOpen={true}
                    loading={true}
                    cancelButtonText="Cancel"
                    confirmButtonText="Delete"
                    onCancel={onCancel}
                    onClose={onClose}
                />,
            );
            const cancelButton = screen.getByRole("button", { name: "Cancel" });
            const confirmButton = screen.getByRole("progressbar", { name: "loading" }).closest("button");

            await user.click(cancelButton);
            await user.click(confirmButton!);

            // Confirm that the buttons are disabled
            expect(onCancel).not.toHaveBeenCalled();
            expect(onClose).not.toHaveBeenCalled();
        });
    });

    describe("warnings", () => {
        const warnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());
        afterEach(() => warnSpy.mockClear());
        afterAll(() => warnSpy.mockRestore());

        it("cancelButtonText without cancel handler", () => {
            render(<Alert cancelButtonText="cancel" isOpen={false} />);

            expect(warnSpy).toHaveBeenCalledExactlyOnceWith(Errors.ALERT_WARN_CANCEL_PROPS);
        });

        it("canEscapeKeyCancel without cancel handler", () => {
            render(<Alert canEscapeKeyCancel={true} isOpen={false} />);

            expect(warnSpy).toHaveBeenCalledExactlyOnceWith(Errors.ALERT_WARN_CANCEL_ESCAPE_KEY);
        });

        it("canOutsideClickCancel without cancel handler", () => {
            render(<Alert canOutsideClickCancel={true} isOpen={false} />);

            expect(warnSpy).toHaveBeenCalledExactlyOnceWith(Errors.ALERT_WARN_CANCEL_OUTSIDE_CLICK);
        });
    });
});
