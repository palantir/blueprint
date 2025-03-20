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

import { expect } from "chai";
import * as React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type SinonStub, spy, stub } from "sinon";

import { Alert, Classes } from "../../src";
import * as Errors from "../../src/common/errors";

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

        expect(document.querySelector(`.test-class`)).to.exist;
        screen.getByText("Are you sure you want to delete this file?");
        screen.getByRole("button", { name: "Cancel" });
        screen.getByRole("button", { name: "Delete" });
    });

    it("should render contents to a specified container", () => {
        const container = document.createElement("div");
        document.body.appendChild(container);

        render(<Alert isOpen={true} portalContainer={container} />);

        expect(container.getElementsByClassName(Classes.ALERT)).to.have.lengthOf(1);
        document.body.removeChild(container);
    });

    it("should render icon", () => {
        render(<Alert icon="warning-sign" isOpen={true} />);

        expect(document.querySelector(`[data-icon="warning-sign"]`)).to.exist;
    });

    it("should support overlay lifecycle props", async () => {
        const onOpening = spy();
        render(
            <Alert isOpen={true} onOpening={onOpening}>
                Alert
                <p>Are you sure you want to delete this file?</p>
                <p>There is no going back.</p>
            </Alert>,
        );
        await waitFor(() => {
            expect(onOpening.calledOnce).to.be.true;
        });
    });

    describe("confirm button", () => {
        it("should have correct text and intent", () => {
            render(<Alert intent="primary" isOpen={true} confirmButtonText="Delete" />);
            const confirmButton = screen.getByRole("button", { name: "Delete" });

            expect(confirmButton).to.exist;
            expect(confirmButton.classList.contains(Classes.INTENT_PRIMARY)).to.be.true;
        });

        it("should trigger onConfirm and onClose when clicked", async () => {
            const onConfirm = spy();
            const onClose = spy();

            render(<Alert isOpen={true} confirmButtonText="Delete" onConfirm={onConfirm} onClose={onClose} />);
            const confirmButton = screen.getByRole("button", { name: "Delete" });

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

            expect(cancelButton).to.exist;
            expect(cancelButton.classList.contains(Classes.INTENT_PRIMARY)).to.be.false;
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

        it("canEscapeKeyCancel should enable escape key", async () => {
            const onCancel = spy();

            const { rerender } = render(<Alert isOpen={true} cancelButtonText="Cancel" onCancel={onCancel} />);

            // Escape key should not trigger onCancel by default
            fireEvent.keyDown(document.querySelector(`.${Classes.OVERLAY}`)!, { key: "Escape" });

            expect(onCancel.notCalled).to.be.true;

            // Enable canEscapeKeyCancel
            rerender(<Alert isOpen={true} cancelButtonText="Cancel" onCancel={onCancel} canEscapeKeyCancel={true} />);

            // Now Escape key should trigger onCancel
            fireEvent.keyDown(document.querySelector(`.${Classes.OVERLAY}`)!, { key: "Escape" });

            expect(onCancel.calledOnce).to.be.true;
        });

        it("canOutsideClickCancel should enable outside click", async () => {
            const onCancel = spy();

            const { rerender } = render(<Alert isOpen={true} cancelButtonText="Cancel" onCancel={onCancel} />);

            // Outside click should not trigger onCancel by default
            fireEvent.mouseDown(document.querySelector(`.${Classes.OVERLAY_BACKDROP}`)!);

            expect(onCancel.notCalled).to.be.true;

            // Enable canOutsideClickCancel
            rerender(
                <Alert isOpen={true} cancelButtonText="Cancel" onCancel={onCancel} canOutsideClickCancel={true} />,
            );

            // Now outside click should trigger onCancel
            fireEvent.mouseDown(document.querySelector(`.${Classes.OVERLAY_BACKDROP}`)!);

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

            // Confirm buttons are disabled
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
