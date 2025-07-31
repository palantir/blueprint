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
import { expect } from "chai";
import { type SinonStub, spy, stub } from "sinon";

import { Alert, Classes } from "../../src";
import * as Errors from "../../src/common/errors";
import { hasClass } from "../utils";

describe("<Alert>", () => {
    it("should render contents", () => {
        render(
            <Alert
                className="test-class"
                isOpen={true}
                confirmButtonText="Delete"
                cancelButtonText="Cancel"
                onClose={spy}
                onCancel={spy}
            >
                <p>Are you sure you want to delete this file?</p>
            </Alert>,
        );
        const alert = screen.getByRole("alertdialog");

        expect(hasClass(alert, "test-class")).to.be.true;
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

        expect(dialog.querySelector(`.${Classes.ICON}`)).to.not.exist;
    });

    it("should render icon when provided", () => {
        render(<Alert icon="warning-sign" isOpen={true} />);
        const dialog = screen.getByRole("alertdialog");

        expect(dialog.querySelector(`.${Classes.ICON}`)).to.exist;
    });

    it("should support overlay lifecycle props", async () => {
        const onOpening = spy();
        render(<Alert isOpen={true} onOpening={onOpening} />);

        await waitFor(() => expect(onOpening.calledOnce).to.be.true);
    });

    describe("confirm button", () => {
        it("should have correct text and intent", () => {
            render(<Alert intent="primary" isOpen={true} confirmButtonText="Confirm" />);
            const confirmButton = screen.getByRole("button", { name: "Confirm" });

            expect(hasClass(confirmButton, Classes.INTENT_PRIMARY)).to.be.true;
        });

        it("should trigger onConfirm and onClose when clicked", async () => {
            const onConfirm = spy();
            const onClose = spy();
            render(<Alert isOpen={true} confirmButtonText="Confirm" onConfirm={onConfirm} onClose={onClose} />);
            const confirmButton = screen.getByRole("button", { name: "Confirm" });

            await userEvent.click(confirmButton);

            expect(onConfirm.calledOnce).to.be.true;
            expect(onClose.calledOnce).to.be.true;
            expect(onClose.args[0][0]).to.be.true;
        });
    });

    describe("cancel button", () => {
        it("should have correct text and no intent", () => {
            render(<Alert intent="primary" isOpen={true} cancelButtonText="Cancel" onCancel={spy} />);
            const cancelButton = screen.getByRole("button", { name: "Cancel" });

            expect(hasClass(cancelButton, Classes.INTENT_PRIMARY)).to.be.false;
        });

        it("should trigger 'onCancel' and 'onClose' when clicked", async () => {
            const onCancel = spy();
            const onClose = spy();
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

            await userEvent.click(cancelButton);

            expect(onCancel.calledOnce).to.be.true;
            expect(onClose.calledOnce).to.be.true;
            expect(onClose.args[0][0]).to.be.false;
        });

        it("should not be escape key cancelable by default", () => {
            const onCancel = spy();
            render(<Alert isOpen={true} cancelButtonText="Cancel" onCancel={spy} />);
            const dialog = screen.getByRole("alertdialog");

            fireEvent.keyDown(dialog, { key: "Escape" });

            expect(onCancel.notCalled).to.be.true;
        });

        it("should be escape key cancelable when canEscapeKeyCancel is true", async () => {
            const onCancel = spy();
            render(<Alert isOpen={true} cancelButtonText="Cancel" onCancel={onCancel} canEscapeKeyCancel={true} />);
            const dialog = screen.getByRole("alertdialog");

            fireEvent.keyDown(dialog, { key: "Escape" });

            expect(onCancel.calledOnce).to.be.true;
        });

        it("should not allow outside click by default", async () => {
            const onCancel = spy();
            const { baseElement } = render(<Alert isOpen={true} cancelButtonText="Cancel" onCancel={onCancel} />);

            // using baseElement since overlay is rendered in a portal
            const backdrop = baseElement.querySelector(`.${Classes.OVERLAY_BACKDROP}`);

            expect(backdrop).to.exist;

            await userEvent.click(backdrop!);

            expect(onCancel.notCalled).to.be.true;
        });

        it("should allow outside click when canOutsideClickCancel is true", async () => {
            const onCancel = spy();
            const { baseElement } = render(
                <Alert isOpen={true} cancelButtonText="Cancel" onCancel={onCancel} canOutsideClickCancel={true} />,
            );

            const backdrop = baseElement.querySelector(`.${Classes.OVERLAY_BACKDROP}`);

            expect(backdrop).to.exist;

            await userEvent.click(backdrop!);

            expect(onCancel.calledOnce).to.be.true;
        });
    });

    describe("loading", () => {
        it("should display loading state on buttons", async () => {
            const onCancel = spy();
            const onClose = spy();

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

            await userEvent.click(cancelButton);
            await userEvent.click(confirmButton!);

            // Confirm that the buttons are disabled
            expect(onCancel.called).to.be.false;
            expect(onClose.called).to.be.false;
        });
    });

    describe("warnings", () => {
        let warnSpy: SinonStub;
        before(() => (warnSpy = stub(console, "warn")));
        afterEach(() => warnSpy.resetHistory());
        after(() => warnSpy.restore());

        it("cancelButtonText without cancel handler", () => {
            render(<Alert cancelButtonText="cancel" isOpen={false} />);

            expect(warnSpy.calledOnceWithExactly(Errors.ALERT_WARN_CANCEL_PROPS)).to.be.true;
        });

        it("canEscapeKeyCancel without cancel handler", () => {
            render(<Alert canEscapeKeyCancel={true} isOpen={false} />);

            expect(warnSpy.calledOnceWithExactly(Errors.ALERT_WARN_CANCEL_ESCAPE_KEY)).to.be.true;
        });

        it("canOutsideClickCancel without cancel handler", () => {
            render(<Alert canOutsideClickCancel={true} isOpen={false} />);

            expect(warnSpy.calledOnceWithExactly(Errors.ALERT_WARN_CANCEL_OUTSIDE_CLICK)).to.be.true;
        });
    });
});
