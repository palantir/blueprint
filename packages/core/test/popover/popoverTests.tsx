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

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect } from "chai";
import sinon from "sinon";

import { Classes } from "../../src";
import * as Errors from "../../src/common/errors";
import { Button, PopupKind, Tooltip } from "../../src/components";
import { Popover, type PopoverInteractionKind } from "../../src/components/popover/popover";
import { hasClass } from "../utils";

describe("<Popover>", () => {
    describe("validation", () => {
        let warnSpy: sinon.SinonStub;

        // use sinon.stub to prevent warnings from appearing in the test logs
        before(() => (warnSpy = sinon.stub(console, "warn")));
        beforeEach(() => warnSpy.resetHistory());
        after(() => warnSpy.restore());

        it("throws error if given no target", () => {
            render(<Popover />);

            expect(warnSpy.calledWith(Errors.POPOVER_REQUIRES_TARGET)).to.be.true;
        });

        it("warns if given > 1 target elements", () => {
            render(
                <Popover>
                    <Button />
                    <article />
                </Popover>,
            );

            expect(warnSpy.calledWith(Errors.POPOVER_WARN_TOO_MANY_CHILDREN)).to.be.true;
        });

        it("warns if given children and renderTarget prop", () => {
            render(<Popover renderTarget={() => <span>"boom"</span>}>pow</Popover>);

            expect(warnSpy.calledWith(Errors.POPOVER_WARN_DOUBLE_TARGET)).to.be.true;
        });

        it("warns if given targetProps and renderTarget", () => {
            render(<Popover targetProps={{ role: "none" }} renderTarget={() => <span>"boom"</span>} />);
            expect(warnSpy.calledWith(Errors.POPOVER_WARN_TARGET_PROPS_WITH_RENDER_TARGET)).to.be.true;
        });

        it("warns if attempting to open a popover with empty content", () => {
            render(
                <Popover content={undefined} isOpen={true}>
                    {"target"}
                </Popover>,
            );

            expect(warnSpy.calledWith(Errors.POPOVER_WARN_EMPTY_CONTENT)).to.be.true;
        });

        it("warns if backdrop enabled when rendering inline", () => {
            render(
                <Popover content={"content"} hasBackdrop={true} usePortal={false}>
                    {"target"}
                </Popover>,
            );

            expect(warnSpy.calledWith(Errors.POPOVER_WARN_HAS_BACKDROP_INLINE)).to.be.true;
        });

        it("warns and disables if given undefined content", async () => {
            const { container } = render(
                <Popover content={undefined} isOpen={true} usePortal={false}>
                    <Button />
                </Popover>,
            );

            expect(container.querySelector(`.${Classes.OVERLAY}`)).to.be.null;
            expect(warnSpy.calledWith(Errors.POPOVER_WARN_EMPTY_CONTENT)).to.be.true;
        });

        it("warns and disables if given empty string content", () => {
            const EMPTY_STRING = "    ";
            const { container } = render(
                <Popover content={EMPTY_STRING} isOpen={true} usePortal={false}>
                    <Button />
                </Popover>,
            );

            expect(container.querySelector(`.${Classes.OVERLAY}`)).to.be.null;
            expect(warnSpy.calledWith(Errors.POPOVER_WARN_EMPTY_CONTENT)).to.be.true;
        });

        describe("throws error if backdrop enabled with non-CLICK interactionKind", () => {
            runErrorTest("hover");
            runErrorTest("hover-target");
            runErrorTest("click-target");

            it("doesn't throw error for CLICK", () => {
                expect(() => <Popover hasBackdrop={true} interactionKind="click" />).not.to.throw;
            });

            function runErrorTest(interactionKind: PopoverInteractionKind) {
                it(interactionKind, () => {
                    render(
                        <Popover content={<div />} hasBackdrop={true} interactionKind={interactionKind}>
                            <Button />
                        </Popover>,
                    );

                    expect(warnSpy.calledWith(Errors.POPOVER_HAS_BACKDROP_INTERACTION)).to.be.true;
                });
            }
        });
    });

    describe("rendering", () => {
        it("adds POPOVER_OPEN class to target when the popover is open", async () => {
            const { container } = render(
                <Popover content="content">
                    <Button text="target" />
                </Popover>,
            );
            const popoverTarget = container.querySelector(`.${Classes.POPOVER_TARGET}`);

            expect(popoverTarget).to.exist;
            expect(hasClass(popoverTarget!, Classes.POPOVER_OPEN)).to.be.false;

            userEvent.click(screen.getByRole("button", { name: "target" }));

            await waitFor(() => expect(hasClass(popoverTarget!, Classes.POPOVER_OPEN)).to.be.true);
        });

        it("renders Portal when usePortal=true", async () => {
            const { baseElement } = render(
                <Popover content="content" usePortal={true}>
                    <Button text="target" />
                </Popover>,
            );

            userEvent.click(screen.getByRole("button", { name: "target" }));

            await waitFor(() => expect(screen.getByText("content")).to.exist);
            expect(baseElement.querySelector(`.${Classes.PORTAL}`)).to.exist;
        });

        it("renders to specified container correctly", async () => {
            // setup: create a container
            const container = document.createElement("div");
            document.body.appendChild(container);

            render(
                <Popover content="content" isOpen={true} portalContainer={container}>
                    <Button text="target" />
                </Popover>,
            );

            await waitFor(() => expect(screen.getByText("content")).to.exist);
            expect(container.querySelector(`.${Classes.POPOVER_CONTENT}`)).to.exist;

            // cleanup
            document.body.removeChild(container);
        });

        it("does not render Portal when usePortal=false", async () => {
            const { container } = render(
                <Popover content="content" isOpen={true} usePortal={false}>
                    <Button text="target" />
                </Popover>,
            );

            userEvent.click(screen.getByRole("button", { name: "target" }));

            await waitFor(() => expect(screen.getByText("content")).to.exist);
            expect(container.querySelector(`.${Classes.PORTAL}`)).to.be.null;
        });

        it("hasBackdrop=true renders backdrop element", async () => {
            const { baseElement } = render(
                <Popover content="content" hasBackdrop={true} isOpen={true}>
                    <Button text="target" />
                </Popover>,
            );

            await waitFor(() => expect(screen.getByText("content")).to.exist);
            expect(baseElement.querySelector(`.${Classes.POPOVER_BACKDROP}`)).to.exist;
        });

        it("hasBackdrop=false does not render backdrop element", async () => {
            const { container } = render(
                <Popover content="content" hasBackdrop={false} isOpen={true} usePortal={false}>
                    <Button text="target" />
                </Popover>,
            );

            await waitFor(() => expect(screen.getByText("content")).to.exist);
            expect(container.querySelector(`.${Classes.POPOVER_BACKDROP}`)).to.be.null;
        });

        it("targetTagName renders the right elements", () => {
            const { container } = render(
                <Popover content="content" targetTagName="address">
                    <Button text="target" />
                </Popover>,
            );
            const popoverTarget = container.querySelector(`.${Classes.POPOVER_TARGET}`);

            expect(popoverTarget).to.exist;
            expect(popoverTarget!.tagName).to.equal("ADDRESS");
        });

        it("allows user to apply dark theme explicitly", () => {
            const { container } = render(
                <Popover content="content" isOpen={true} popoverClassName={Classes.DARK} usePortal={false}>
                    <Button text="target" />
                </Popover>,
            );
            const popoverElement = container.querySelector(`.${Classes.POPOVER}`);

            expect(popoverElement).to.exist;
            expect(hasClass(popoverElement!, Classes.DARK)).to.be.true;
        });

        it("renders with aria-haspopup attr", () => {
            const { container } = render(
                <Popover content="content" isOpen={true}>
                    <Button text="target" />
                </Popover>,
            );

            expect(container.querySelector("[aria-haspopup='menu']")).to.exist;
        });

        it("sets aria-haspopup attr base on popupKind", () => {
            const { container } = render(
                <Popover content="content" isOpen={true} popupKind={PopupKind.DIALOG}>
                    <Button text="target" />
                </Popover>,
            );

            expect(container.querySelector("[aria-haspopup='dialog']")).to.exist;
        });

        it("renders without aria-haspopup attr for hover interaction", () => {
            const { container } = render(
                <Popover content="content" interactionKind="hover-target" isOpen={true}>
                    <Button text="target" />
                </Popover>,
            );

            expect(container.querySelector("[aria-haspopup]")).to.be.null;
        });
    });

    describe("basic functionality", () => {
        it.skip("inherits dark theme from trigger ancestor", () => {
            const { baseElement } = render(
                <div className={Classes.DARK}>
                    <Popover content="content" inheritDarkTheme={true} isOpen={true}>
                        <Button text="target" />
                    </Popover>
                </div>,
            );

            const popoverElement = baseElement.querySelector(`.${Classes.POPOVER}`);

            expect(popoverElement).to.exist;
            expect(hasClass(popoverElement!, Classes.DARK)).to.be.true;
        });

        it("inheritDarkTheme=false disables inheriting dark theme from trigger ancestor", () => {
            const { baseElement } = render(
                <div className={Classes.DARK}>
                    <Popover content="content" inheritDarkTheme={false} isOpen={true}>
                        <Button text="target" />
                    </Popover>
                </div>,
            );

            const popoverElement = baseElement.querySelector(`.${Classes.POPOVER}`);

            expect(popoverElement).to.exist;
            expect(hasClass(popoverElement!, Classes.DARK)).to.be.false;
        });

        it("supports overlay lifecycle props", () => {
            const onOpening = sinon.spy();
            render(
                <Popover content="content" onOpening={onOpening}>
                    <Button text="target" />
                </Popover>,
            );

            userEvent.click(screen.getByRole("button", { name: "target" }));

            expect(onOpening.calledOnce).to.be.true;
        });

        it("escape key closes popover", async () => {
            render(
                <Popover content="content" canEscapeKeyClose={true}>
                    <Button text="target" />
                </Popover>,
            );

            userEvent.click(screen.getByRole("button", { name: "target" }));

            await waitFor(() => {
                expect(screen.getByText("content")).to.exist;
            });

            userEvent.keyboard("{Escape}");

            await waitFor(() => {
                expect(screen.queryByText("content")).not.to.exist;
            });
        });
    });

    describe("focus management when shouldReturnFocusOnClose={true}", () => {
        it("moves focus to overlay when opened and returns focus to target element when closed", async () => {
            const { container } = render(
                <Popover
                    content={<Button className={Classes.POPOVER_DISMISS}>close</Button>}
                    shouldReturnFocusOnClose={true}
                    usePortal={false}
                >
                    <Button text="target" />
                </Popover>,
            );
            const targetButton = screen.getByRole("button", { name: "target" });

            userEvent.click(targetButton);

            const overlay = container.querySelector(`.${Classes.OVERLAY}`);

            await waitFor(() => {
                expect(overlay).to.exist;
                expect(hasClass(overlay!, Classes.OVERLAY_OPEN)).to.be.true;
                expect(overlay?.contains(document.activeElement)).to.be.true;
            });

            const closeButton = screen.getByRole("button", { name: "close" });

            userEvent.click(closeButton);

            await waitFor(() => {
                expect(hasClass(overlay!, Classes.OVERLAY_OPEN)).to.be.false;
                expect(targetButton).to.equal(document.activeElement);
            });
        });
    });

    describe("openOnTargetFocus", () => {
        describe("if true (default)", () => {
            it('adds tabindex="0" to target\'s child node when interactionKind is HOVER', () => {
                render(
                    <Popover content="content" interactionKind="hover">
                        <Button text="target" />
                    </Popover>,
                );

                expect(screen.getByRole("button", { name: "target" }).getAttribute("tabindex")).to.equal("0");
            });

            it('adds tabindex="0" to target\'s child node when interactionKind is HOVER_TARGET_ONLY', () => {
                render(
                    <Popover content="content" interactionKind="hover-target">
                        <Button text="target" />
                    </Popover>,
                );

                expect(screen.getByRole("button", { name: "target" }).getAttribute("tabindex")).to.equal("0");
            });

            it("does not add tabindex to target's child node when interactionKind is CLICK", () => {
                render(
                    <Popover content="content" interactionKind="click">
                        <Button text="target" />
                    </Popover>,
                );

                expect(screen.getByRole("button", { name: "target" }).getAttribute("tabindex")).to.be.null;
            });

            it("does not add tabindex to target's child node when interactionKind is CLICK_TARGET_ONLY", () => {
                render(
                    <Popover content="content" interactionKind="click-target">
                        <Button text="target" />
                    </Popover>,
                );

                expect(screen.getByRole("button", { name: "target" }).getAttribute("tabindex")).to.be.null;
            });

            it("does not add tabindex to target's child node when disabled=true", () => {
                render(
                    <Popover content="content" interactionKind="hover" disabled={true}>
                        <Button text="target" />
                    </Popover>,
                );

                expect(screen.getByRole("button", { name: "target" }).getAttribute("tabindex")).to.be.null;
            });

            it.skip("opens popover on target focus when interactionKind is HOVER", async () => {
                render(
                    <Popover content="content" interactionKind="hover">
                        <Button text="target" />
                    </Popover>,
                );
                const targetButton = screen.getByRole("button", { name: "target" });

                targetButton.focus();

                await waitFor(() => expect(screen.getByText("content")).to.exist);
                expect(targetButton).to.equal(document.activeElement);
            });

            it.skip("opens popover on target focus when interactionKind is HOVER_TARGET_ONLY", async () => {
                render(
                    <Popover content="content" interactionKind="hover-target">
                        <Button text="target" />
                    </Popover>,
                );
                const targetButton = screen.getByRole("button", { name: "target" });

                targetButton.focus();

                await waitFor(() => {
                    expect(screen.getByText("content")).to.exist;
                    expect(targetButton).to.equal(document.activeElement);
                });
            });

            it("does not open popover on target focus when interactionKind is CLICK", async () => {
                render(
                    <Popover content="content" interactionKind="click">
                        <Button text="target" />
                    </Popover>,
                );
                const targetButton = screen.getByRole("button", { name: "target" });

                targetButton.focus();

                expect(screen.queryByText("content")).not.to.exist;
                expect(targetButton).to.equal(document.activeElement);
            });

            it("does not open popover on target focus when interactionKind is CLICK_TARGET_ONLY", () => {
                render(
                    <Popover content="content" interactionKind="click-target">
                        <Button text="target" />
                    </Popover>,
                );
                const targetButton = screen.getByRole("button", { name: "target" });

                targetButton.focus();

                expect(screen.queryByText("content")).not.to.exist;
                expect(targetButton).to.equal(document.activeElement);
            });
        });

        describe("if false", () => {
            it("does not add tabindex to target's child node when interactionKind is HOVER", () => {
                render(
                    <Popover content="content" interactionKind="hover" openOnTargetFocus={false}>
                        <Button text="target" />
                    </Popover>,
                );

                expect(screen.getByRole("button", { name: "target" }).getAttribute("tabindex")).to.be.null;
            });

            it("should not add `tabindex` to target's child node when interactionKind is `HOVER_TARGET_ONLY`", () => {
                render(
                    <Popover content="content" interactionKind="hover-target" openOnTargetFocus={false}>
                        <Button text="target" />
                    </Popover>,
                );

                expect(screen.getByRole("button", { name: "target" }).getAttribute("tabindex")).to.be.null;
            });

            it("does not add tabindex to target's child node when interactionKind is CLICK", () => {
                render(
                    <Popover content="content" interactionKind="click" openOnTargetFocus={false}>
                        <Button text="target" />
                    </Popover>,
                );

                expect(screen.getByRole("button", { name: "target" }).getAttribute("tabindex")).to.be.null;
            });

            it("does not add tabindex to target's child node when interactionKind is CLICK_TARGET_ONLY", () => {
                render(
                    <Popover content="content" interactionKind="click-target" openOnTargetFocus={false}>
                        <Button text="target" />
                    </Popover>,
                );

                expect(screen.getByRole("button", { name: "target" }).getAttribute("tabindex")).to.be.null;
            });

            it("does not open popover on target focus when interactionKind is HOVER", () => {
                render(
                    <Popover content="content" interactionKind="hover" openOnTargetFocus={false}>
                        <Button text="target" />
                    </Popover>,
                );
                const targetButton = screen.getByRole("button", { name: "target" });

                targetButton.focus();

                expect(screen.queryByText("content")).not.to.exist;
                expect(targetButton).to.equal(document.activeElement);
            });

            it("does not open popover on target focus when interactionKind is HOVER_TARGET_ONLY", () => {
                render(
                    <Popover content="content" interactionKind="hover-target" openOnTargetFocus={false}>
                        <Button text="target" />
                    </Popover>,
                );
                const targetButton = screen.getByRole("button", { name: "target" });

                targetButton.focus();

                expect(screen.queryByText("content")).not.to.exist;
                expect(targetButton).to.equal(document.activeElement);
            });

            it("does not open popover on target focus when interactionKind is CLICK", () => {
                render(
                    <Popover content="content" interactionKind="click" openOnTargetFocus={false}>
                        <Button text="target" />
                    </Popover>,
                );
                const targetButton = screen.getByRole("button", { name: "target" });

                targetButton.focus();

                expect(screen.queryByText("content")).not.to.exist;
                expect(targetButton).to.equal(document.activeElement);
            });

            it("does not open popover on target focus when interactionKind is CLICK_TARGET_ONLY", () => {
                render(
                    <Popover content="content" interactionKind="click-target" openOnTargetFocus={false}>
                        <Button text="target" />
                    </Popover>,
                );
                const targetButton = screen.getByRole("button", { name: "target" });

                targetButton.focus();

                expect(screen.queryByText("content")).not.to.exist;
                expect(targetButton).to.equal(document.activeElement);
            });
        });
    });

    describe("in controlled mode", () => {
        it("state respects isOpen prop", () => {
            const { rerender } = render(
                <Popover content="content" isOpen={false}>
                    <Button text="target" />
                </Popover>,
            );

            expect(screen.queryByText("content")).not.to.exist;

            rerender(
                <Popover content="content" isOpen={true}>
                    <Button text="target" />
                </Popover>,
            );

            expect(screen.getByText("content")).to.exist;
        });

        it("state does not update on user (click) interaction", () => {
            render(
                <Popover content="content" isOpen={false}>
                    <Button text="target" />
                </Popover>,
            );

            userEvent.click(screen.getByRole("button", { name: "target" }));

            expect(screen.queryByText("content")).not.to.exist;
        });

        it("state does not update on user (key) interaction", () => {
            render(
                <Popover content="content" canEscapeKeyClose={true} isOpen={true}>
                    <Button text="target" />
                </Popover>,
            );

            expect(screen.getByText("content")).to.exist;

            userEvent.keyboard("{Escape}");

            expect(screen.getByText("content")).to.exist;
        });

        describe("disabled=true takes precedence over isOpen=true", () => {
            it("on mount", () => {
                render(
                    <Popover content="content" disabled={true} isOpen={true}>
                        <Button text="target" />
                    </Popover>,
                );

                expect(screen.queryByText("content")).not.to.exist;
            });

            it("onInteraction not called if changing from closed to open (b/c popover is still closed)", () => {
                const onInteraction = sinon.spy();
                const { rerender } = render(
                    <Popover content="content" disabled={true} isOpen={false} onInteraction={onInteraction}>
                        <Button text="target" />
                    </Popover>,
                );

                expect(onInteraction.called).to.be.false;

                rerender(
                    <Popover content="content" disabled={true} isOpen={true} onInteraction={onInteraction}>
                        <Button text="target" />
                    </Popover>,
                );

                expect(screen.queryByText("content")).not.to.exist;
                expect(onInteraction.called).to.be.false;
            });

            it("onInteraction not called if changing from open to closed (b/c popover was already closed)", () => {
                const onInteraction = sinon.spy();
                const { rerender } = render(
                    <Popover content="content" disabled={true} isOpen={true} onInteraction={onInteraction}>
                        <Button text="target" />
                    </Popover>,
                );

                expect(onInteraction.called).to.be.false;

                rerender(
                    <Popover content="content" disabled={true} isOpen={false} onInteraction={onInteraction}>
                        <Button text="target" />
                    </Popover>,
                );

                expect(screen.queryByText("content")).not.to.exist;
                expect(onInteraction.called).to.be.false;
            });

            it("onInteraction called if open and changing to disabled (b/c popover will close)", async () => {
                const onInteraction = sinon.spy();
                const { rerender } = render(
                    <Popover content="content" disabled={false} isOpen={true} onInteraction={onInteraction}>
                        <Button text="target" />
                    </Popover>,
                );

                await waitFor(() => expect(screen.getByText("content")).to.exist);

                expect(onInteraction.called).to.be.false;

                rerender(
                    <Popover content="content" disabled={true} isOpen={true} onInteraction={onInteraction}>
                        <Button text="target" />
                    </Popover>,
                );

                await waitFor(() => expect(screen.queryByText("content")).not.to.exist);

                expect(onInteraction.called).to.be.true;
            });

            it("onInteraction called if open and changing to not-disabled (b/c popover will open)", async () => {
                const onInteraction = sinon.spy();
                const { rerender } = render(
                    <Popover content="content" disabled={true} isOpen={true} onInteraction={onInteraction}>
                        <Button text="target" />
                    </Popover>,
                );

                expect(onInteraction.called).to.be.false;

                rerender(
                    <Popover content="content" disabled={false} isOpen={true} onInteraction={onInteraction}>
                        <Button text="target" />
                    </Popover>,
                );

                await waitFor(() => expect(screen.getByText("content")).to.exist);

                expect(onInteraction.called).to.be.true;
            });
        });

        it("onClose is invoked with event when popover would close", async () => {
            const onClose = sinon.spy();
            render(
                <Popover
                    content={<Button className={Classes.POPOVER_DISMISS}>close</Button>}
                    isOpen={true}
                    onClose={onClose}
                >
                    <Button text="target" />
                </Popover>,
            );
            const closeButton = screen.getByRole("button", { name: "close" });

            await waitFor(() => expect(closeButton).to.exist);

            userEvent.click(screen.getByRole("button", { name: "close" }));

            expect(onClose.calledOnce).to.be.true;
            expect(onClose.args[0][0]).to.exist;
        });

        describe("onInteraction()", () => {
            it("is invoked with `true` when closed popover target is clicked", () => {
                const onInteraction = sinon.spy();
                render(
                    <Popover content="content" isOpen={false} onInteraction={onInteraction}>
                        <Button text="target" />
                    </Popover>,
                );

                userEvent.click(screen.getByRole("button", { name: "target" }));

                expect(onInteraction.calledOnce).to.be.true;
                expect(onInteraction.calledWith(true)).to.be.true;
            });

            it("is invoked with `false` when open popover target is clicked", () => {
                const onInteraction = sinon.spy();
                const { container } = render(
                    <Popover content="content" isOpen={true} onInteraction={onInteraction}>
                        <Button text="target" />
                    </Popover>,
                );
                const target = container.querySelector(`.${Classes.POPOVER_TARGET}`);

                expect(target).to.exist;

                userEvent.click(target!);

                expect(onInteraction.calledOnce).to.be.true;
                expect(onInteraction.calledWith(false)).to.be.true;
            });

            it("is invoked with `false` when open modal popover backdrop is clicked", () => {
                const onInteraction = sinon.spy();
                render(
                    <Popover
                        // @ts-ignore
                        backdropProps={{ "data-testid": "test-backdrop" }}
                        content="content"
                        hasBackdrop={true}
                        isOpen={true}
                        onInteraction={onInteraction}
                    >
                        <Button text="target" />
                    </Popover>,
                );
                const backdrop = screen.getByTestId("test-backdrop");

                userEvent.click(backdrop);

                expect(onInteraction.calledOnce).to.be.true;
                expect(onInteraction.calledWith(false)).to.be.true;
            });

            it("is invoked with `false` when clicking POPOVER_DISMISS", async () => {
                const onInteraction = sinon.spy();
                render(
                    <Popover
                        content={<Button className={Classes.POPOVER_DISMISS}>close</Button>}
                        isOpen={true}
                        onInteraction={onInteraction}
                    >
                        <Button text="target" />
                    </Popover>,
                );
                const closeButton = screen.getByRole("button", { name: "close" });

                await waitFor(() => expect(closeButton).to.exist);

                userEvent.click(closeButton);

                expect(onInteraction.calledOnce).to.be.true;
                expect(onInteraction.calledWith(false)).to.be.true;
            });

            it("is invoked with `false` when the document is mousedowned", () => {
                const onInteraction = sinon.spy();
                render(
                    <Popover content="content" isOpen={true} onInteraction={onInteraction}>
                        <Button text="target" />
                    </Popover>,
                );

                userEvent.click(document.documentElement);

                expect(onInteraction.calledOnce).to.be.true;
                expect(onInteraction.calledWith(false)).to.be.true;
            });
        });

        it("does not apply active class to target when open", () => {
            render(
                <Popover content="content" isOpen={true} interactionKind="click">
                    <Button text="target" />
                </Popover>,
            );
            const targetButton = screen.getByRole("button", { name: "target" });

            expect(hasClass(targetButton, Classes.ACTIVE)).to.be.false;
        });
    });

    describe("in uncontrolled mode", () => {
        it("setting defaultIsOpen=true renders open popover", async () => {
            render(
                <Popover content="content" defaultIsOpen={true}>
                    <Button text="target" />
                </Popover>,
            );

            await waitFor(() => expect(screen.getByText("content")).to.exist);
        });

        it("with defaultIsOpen=true, popover can still be closed", async () => {
            render(
                <Popover content={<Button className={Classes.POPOVER_DISMISS}>close</Button>} defaultIsOpen={true}>
                    <Button text="target" />
                </Popover>,
            );

            await waitFor(() => expect(screen.getByRole("button", { name: "close" })).to.exist);

            userEvent.click(screen.getByRole("button", { name: "close" }));

            await waitFor(() => expect(screen.queryByRole("button", { name: "close" })).not.to.exist);
        });

        it("CLICK_TARGET_ONLY works properly", async () => {
            const { container } = render(
                <Popover content="content" interactionKind="click-target">
                    <Button text="target" />
                </Popover>,
            );
            const target = container.querySelector(`.${Classes.POPOVER_TARGET}`);

            expect(target).to.exist;

            userEvent.click(target!);

            await waitFor(() => expect(screen.getByText("content")).to.exist);

            userEvent.click(target!);

            await waitFor(() => expect(screen.queryByText("content")).not.to.exist);
        });

        it("HOVER_TARGET_ONLY works properly", async () => {
            const { container } = render(
                <Popover content="content" interactionKind="hover-target">
                    <Button text="target" />
                </Popover>,
            );
            const target = container.querySelector(`.${Classes.POPOVER_TARGET}`);

            expect(target).to.exist;

            userEvent.hover(target!);

            await waitFor(() => expect(screen.getByText("content")).to.exist);

            userEvent.unhover(target!);

            await waitFor(() => expect(screen.queryByText("content")).not.to.exist);
        });

        it("inline HOVER_TARGET_ONLY works properly when openOnTargetFocus={false}", async () => {
            const { container } = render(
                <Popover content="content" interactionKind="hover-target" openOnTargetFocus={false}>
                    <Button text="target" />
                </Popover>,
            );
            const target = container.querySelector(`.${Classes.POPOVER_TARGET}`);

            expect(target).to.exist;

            userEvent.hover(target!);

            await waitFor(() => expect(screen.getByText("content")).to.exist);

            userEvent.unhover(target!);

            await waitFor(() => expect(screen.queryByText("content")).not.to.exist);
        });

        it("inline HOVER works properly", async () => {
            const { container } = render(
                <Popover content="content" interactionKind="hover">
                    <Button text="target" />
                </Popover>,
            );
            const target = container.querySelector(`.${Classes.POPOVER_TARGET}`);
            expect(target).to.exist;

            userEvent.hover(target!);

            await waitFor(() => expect(screen.getByText("content")).to.exist);

            userEvent.unhover(target!);

            await waitFor(() => expect(screen.queryByText("content")).not.to.exist);
        });

        it("clicking POPOVER_DISMISS closes popover when usePortal=true", async () => {
            render(
                <Popover
                    content={<Button className={Classes.POPOVER_DISMISS}>close</Button>}
                    defaultIsOpen={true}
                    usePortal={true}
                >
                    <Button text="target" />
                </Popover>,
            );

            await waitFor(() => expect(screen.getByRole("button", { name: "close" })).to.exist);

            userEvent.click(screen.getByRole("button", { name: "close" }));

            await waitFor(() => expect(screen.queryByRole("button", { name: "close" })).not.to.exist);
        });

        it("clicking POPOVER_DISMISS closes popover when usePortal=false", async () => {
            render(
                <Popover
                    content={<Button className={Classes.POPOVER_DISMISS}>close</Button>}
                    defaultIsOpen={true}
                    usePortal={false}
                >
                    <Button text="target" />
                </Popover>,
            );

            await waitFor(() => expect(screen.getByRole("button", { name: "close" })).to.exist);

            userEvent.click(screen.getByRole("button", { name: "close" }));

            await waitFor(() => expect(screen.queryByRole("button", { name: "close" })).not.to.exist);
        });

        it.skip("pressing Escape closes popover when canEscapeKeyClose=true and usePortal=false", async () => {
            render(
                <Popover content="content" canEscapeKeyClose={true} usePortal={false}>
                    <Button text="target" />
                </Popover>,
            );

            userEvent.click(screen.getByRole("button", { name: "target" }));

            await waitFor(() => expect(screen.getByText("content")).to.exist);

            userEvent.keyboard("{Escape}");

            await waitFor(() => expect(screen.queryByText("content")).not.to.exist);
        });

        it("setting disabled=true prevents opening popover", () => {
            render(
                <Popover content="content" disabled={true} interactionKind="click-target">
                    <Button text="target" />
                </Popover>,
            );

            userEvent.click(screen.getByRole("button", { name: "target" }));

            expect(screen.queryByText("content")).not.to.exist;
        });

        it("setting disabled=true hides open popover", async () => {
            const { rerender } = render(
                <Popover content="content" interactionKind="click-target">
                    <Button text="target" />
                </Popover>,
            );

            userEvent.click(screen.getByRole("button", { name: "target" }));

            await waitFor(() => expect(screen.getByText("content")).to.exist);

            rerender(
                <Popover content="content" interactionKind="click-target" disabled={true}>
                    <Button text="target" />
                </Popover>,
            );

            await waitFor(() => expect(screen.queryByText("content")).not.to.exist);
        });

        it("console.warns if onInteraction is set", () => {
            const warnSpy = sinon.stub(console, "warn");
            render(
                <Popover content="content" onInteraction={() => false}>
                    <Button text="target" />
                </Popover>,
            );

            expect(warnSpy.firstCall.args[0]).to.equal(Errors.POPOVER_WARN_UNCONTROLLED_ONINTERACTION);
            warnSpy.restore();
        });

        it("does apply active class to target when open", () => {
            render(
                <Popover content="content" interactionKind="click">
                    <Button text="target" />
                </Popover>,
            );

            userEvent.click(screen.getByRole("button", { name: "target" }));

            expect(hasClass(screen.getByRole("button", { name: "target" }), Classes.ACTIVE)).to.be.true;
        });
    });

    describe("when composed with <Tooltip>", () => {
        it("shows tooltip on hover", async () => {
            render(
                <Popover content="popover content">
                    <Tooltip content="tooltip content">
                        <Button text="target" />
                    </Tooltip>
                </Popover>,
            );
            const targetButton = screen.getByRole("button", { name: "target" });

            userEvent.hover(targetButton);

            await waitFor(() => expect(screen.getByText("tooltip content")).to.exist);
        });

        it("shows popover on click", async () => {
            render(
                <Popover content="popover content">
                    <Tooltip content="tooltip content">
                        <Button text="target" />
                    </Tooltip>
                </Popover>,
            );
            const targetButton = screen.getByRole("button", { name: "target" });

            userEvent.click(targetButton);

            await waitFor(() => expect(screen.getByText("popover content")).to.exist);

            expect(screen.queryByText("tooltip content")).not.to.exist;
        });

        it("the target is focusable", () => {
            render(
                <Popover content="popover content">
                    <Tooltip content="tooltip content">
                        <Button text="target" />
                    </Tooltip>
                </Popover>,
            );
            const targetButton = screen.getByRole("button", { name: "target" });

            expect(targetButton.getAttribute("tabindex")).to.equal("0");
        });

        describe("when disabled=true", () => {
            it("shows tooltip on hover", async () => {
                render(
                    <Popover content="popover content" disabled={true}>
                        <Tooltip content="tooltip content">
                            <Button text="target" />
                        </Tooltip>
                    </Popover>,
                );
                const targetButton = screen.getByRole("button", { name: "target" });

                userEvent.hover(targetButton);

                await waitFor(() => expect(screen.getByText("tooltip content")).to.exist);
            });

            it("does not show popover on click", async () => {
                render(
                    <Popover content="popover content" disabled={true}>
                        <Tooltip content="tooltip content">
                            <Button text="target" />
                        </Tooltip>
                    </Popover>,
                );
                const targetButton = screen.getByRole("button", { name: "target" });

                userEvent.click(targetButton);

                expect(screen.queryByText("popover content")).not.to.exist;
            });

            it("the target is focusable", () => {
                render(
                    <Popover content="popover content" disabled={true}>
                        <Tooltip content="tooltip content">
                            <Button text="target" />
                        </Tooltip>
                    </Popover>,
                );
                const targetButton = screen.getByRole("button", { name: "target" });

                expect(targetButton.getAttribute("tabindex")).to.equal("0");
            });
        });
    });

    describe("when composed with a disabled <Tooltip>", () => {
        it("does not show tooltip on hover", async () => {
            render(
                <Popover content="popover content">
                    <Tooltip content="tooltip content" disabled={true}>
                        <Button text="target" />
                    </Tooltip>
                </Popover>,
            );
            const targetButton = screen.getByRole("button", { name: "target" });

            userEvent.hover(targetButton);

            expect(screen.queryByText("tooltip content")).not.to.exist;
        });

        it("shows popover on click", async () => {
            render(
                <Popover content="popover content">
                    <Tooltip content="tooltip content" disabled={true}>
                        <Button text="target" />
                    </Tooltip>
                </Popover>,
            );
            const targetButton = screen.getByRole("button", { name: "target" });

            userEvent.click(targetButton);

            await waitFor(() => expect(screen.getByText("popover content")).to.exist);
        });

        it("the target is not focusable", () => {
            render(
                <Popover content="popover content">
                    <Tooltip content="tooltip content" disabled={true}>
                        <Button text="target" />
                    </Tooltip>
                </Popover>,
            );
            const targetButton = screen.getByRole("button", { name: "target" });

            expect(targetButton.getAttribute("tabindex")).to.be.null;
        });

        describe("when disabled=true", () => {
            it("does not show tooltip on hover", () => {
                render(
                    <Popover content="popover content" disabled={true}>
                        <Tooltip content="tooltip content" disabled={true}>
                            <Button text="target" />
                        </Tooltip>
                    </Popover>,
                );
                const targetButton = screen.getByRole("button", { name: "target" });

                userEvent.hover(targetButton);

                expect(screen.queryByText("tooltip content")).not.to.exist;
            });

            it("does not show popover on click", () => {
                render(
                    <Popover content="popover content" disabled={true}>
                        <Tooltip content="tooltip content" disabled={true}>
                            <Button text="target" />
                        </Tooltip>
                    </Popover>,
                );
                const targetButton = screen.getByRole("button", { name: "target" });

                userEvent.click(targetButton);

                expect(screen.queryByText("popover content")).not.to.exist;
            });

            it("the target is not focusable", () => {
                render(
                    <Popover content="popover content" disabled={true}>
                        <Tooltip content="tooltip content" disabled={true}>
                            <Button text="target" />
                        </Tooltip>
                    </Popover>,
                );
                const targetButton = screen.getByRole("button", { name: "target" });

                expect(targetButton.getAttribute("tabindex")).to.be.null;
            });
        });
    });

    describe("Popper.js integration", () => {
        it("renders arrow element by default", async () => {
            const { baseElement } = render(
                <Popover content="content" isOpen={true}>
                    <Button text="target" />
                </Popover>,
            );

            await waitFor(() => expect(baseElement.querySelector(`.${Classes.POPOVER_ARROW}`)).to.exist);
        });

        it("arrow can be disabled via modifiers", async () => {
            const { baseElement } = render(
                <Popover content="content" isOpen={true} modifiers={{ arrow: { enabled: false } }}>
                    <Button text="target" />
                </Popover>,
            );

            expect(baseElement.querySelector(`.${Classes.POPOVER_ARROW}`)).not.to.exist;
        });

        it("arrow can be disabled via minimal prop", () => {
            const { baseElement } = render(
                <Popover content="content" isOpen={true} minimal={true}>
                    <Button text="target" />
                </Popover>,
            );

            expect(baseElement.querySelector(`.${Classes.POPOVER_ARROW}`)).not.to.exist;
        });

        it("matches target width via custom modifier", () => {
            const { container } = render(
                <Popover content="content" isOpen={true} matchTargetWidth={true} placement="bottom" usePortal={false}>
                    <Button text="target" />
                </Popover>,
            );

            const targetElement = screen.getByRole("button", { name: "target" });
            const popoverElement = container.querySelector(`.${Classes.POPOVER}`);

            expect(popoverElement).to.exist;

            expect(popoverElement?.clientWidth).to.be.closeTo(
                targetElement.clientWidth,
                5,
                "content width should equal target width +/- 5px",
            );
        });
    });

    describe("closing on click", () => {
        it("Classes.POPOVER_DISMISS closes on click", async () => {
            render(
                <Popover content={<Button className={Classes.POPOVER_DISMISS}>dismiss</Button>} defaultIsOpen={true}>
                    <Button text="target" />
                </Popover>,
            );

            await waitFor(() => expect(screen.getByRole("button", { name: "dismiss" })).to.exist);

            userEvent.click(screen.getByRole("button", { name: "dismiss" }));

            await waitFor(() => expect(screen.queryByRole("button", { name: "dismiss" })).not.to.exist);
        });

        it("Classes.POPOVER_DISMISS_OVERRIDE does not close", async () => {
            render(
                <Popover
                    content={
                        <span className={Classes.POPOVER_DISMISS}>
                            <Button className={Classes.POPOVER_DISMISS_OVERRIDE}>dismiss</Button>
                        </span>
                    }
                    defaultIsOpen={true}
                >
                    <Button text="target" />
                </Popover>,
            );

            expect(screen.getByRole("button", { name: "dismiss" })).to.exist;

            userEvent.click(screen.getByRole("button", { name: "dismiss" }));

            expect(screen.getByRole("button", { name: "dismiss" })).to.exist;
        });

        it(":disabled does not close", () => {
            render(
                <Popover
                    content={<Button className={Classes.POPOVER_DISMISS} disabled={true} text="dismiss" />}
                    defaultIsOpen={true}
                >
                    <Button text="target" />
                </Popover>,
            );

            expect(screen.getByRole("button", { name: "dismiss" })).to.exist;

            userEvent.click(screen.getByRole("button", { name: "dismiss" }));

            expect(screen.getByRole("button", { name: "dismiss" })).to.exist;
        });

        it("Classes.DISABLED does not close", () => {
            render(
                <Popover
                    content={
                        // testing nested behavior too
                        <div className={Classes.DISABLED}>
                            <Button className={Classes.POPOVER_DISMISS}>dismiss</Button>
                        </div>
                    }
                    defaultIsOpen={true}
                >
                    <Button text="target" />
                </Popover>,
            );

            expect(screen.getByRole("button", { name: "dismiss" })).to.exist;

            userEvent.click(screen.getByRole("button", { name: "dismiss" }));

            expect(screen.getByRole("button", { name: "dismiss" })).to.exist;
        });

        it("captureDismiss={true} inner dismiss does not close outer popover", async () => {
            render(
                <Popover
                    captureDismiss={true}
                    defaultIsOpen={true}
                    content={
                        <Popover
                            captureDismiss={true}
                            defaultIsOpen={true}
                            usePortal={false}
                            content={<Button className={Classes.POPOVER_DISMISS} text="dismiss" />}
                        >
                            <Button text="inner target" />
                        </Popover>
                    }
                >
                    <Button text="outer target" />
                </Popover>,
            );

            expect(screen.getByRole("button", { name: "dismiss" })).to.exist;

            userEvent.click(screen.getByRole("button", { name: "dismiss" }));

            await waitFor(() => expect(screen.queryByRole("button", { name: "dismiss" })).not.to.exist);

            expect(screen.getByRole("button", { name: "inner target" })).to.exist;
        });

        it("captureDismiss={false} inner dismiss closes outer popover", async () => {
            render(
                <Popover
                    captureDismiss={true}
                    defaultIsOpen={true}
                    content={
                        <Popover
                            captureDismiss={false}
                            defaultIsOpen={true}
                            usePortal={false}
                            content={<Button className={Classes.POPOVER_DISMISS} text="dismiss" />}
                        >
                            <Button text="inner target" />
                        </Popover>
                    }
                >
                    <Button text="outer target" />
                </Popover>,
            );

            expect(screen.getByRole("button", { name: "dismiss" })).to.exist;

            userEvent.click(screen.getByRole("button", { name: "dismiss" }));

            await waitFor(() => expect(screen.queryByRole("button", { name: "dismiss" })).not.to.exist);
            await waitFor(() => expect(screen.queryByRole("button", { name: "inner target" })).not.to.exist);
        });
    });

    describe("key interactions on Button target", () => {
        describe.skip("Space key down opens click interaction popover", () => {
            it("when autoFocus={true}", async () => {
                const { container } = render(
                    <Popover content="content" autoFocus={true} usePortal={false}>
                        <Button text="target" />
                    </Popover>,
                );
                const targetButton = screen.getByRole("button", { name: "target" });

                targetButton.focus();
                userEvent.keyboard("{space}");

                await waitFor(() => expect(screen.getByText("content")).to.exist);

                const overlay = container.querySelector(`.${Classes.OVERLAY}`);
                expect(overlay?.contains(document.activeElement)).to.be.true;
            });

            it("when autoFocus={false}", async () => {
                render(
                    <Popover content="content" autoFocus={false}>
                        <Button text="target" />
                    </Popover>,
                );
                const targetButton = screen.getByRole("button", { name: "target" });

                targetButton.focus();
                userEvent.keyboard("{space}");

                await waitFor(() => expect(screen.getByText("content")).to.exist);

                expect(targetButton).to.equal(document.activeElement);
            });
        });
    });

    describe("compatibility", () => {
        it("renderTarget type definition allows sending props to child components", () => {
            render(
                <Popover
                    usePortal={false}
                    hoverCloseDelay={0}
                    hoverOpenDelay={0}
                    content="content"
                    popoverClassName={Classes.POPOVER_CONTENT_SIZING}
                    renderTarget={({ isOpen, ref, ...props }) => (
                        <Button
                            data-testid="target-button"
                            ref={ref}
                            onClick={props.onClick}
                            text="Target"
                            {...props}
                        />
                    )}
                />,
            );
        });
    });
});
