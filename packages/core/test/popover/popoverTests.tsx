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

import { assert } from "chai";
import { mount, ReactWrapper, shallow } from "enzyme";
import React from "react";
import sinon from "sinon";

import { dispatchMouseEvent } from "@blueprintjs/test-commons";

import { Classes, Keys } from "../../src/common";
import * as Errors from "../../src/common/errors";
import { Menu, MenuItem, Overlay, Portal } from "../../src/components";
import { PopoverProps, PopoverState, Popover, PopoverInteractionKind } from "../../src/components/popover/popover";
import { PopoverArrow } from "../../src/components/popover/popoverArrow";
import { Tooltip } from "../../src/components/tooltip/tooltip";

describe("<Popover>", () => {
    let testsContainerElement: HTMLElement;
    let wrapper: PopoverWrapper | undefined;
    const onInteractionSpy = sinon.spy();

    beforeEach(() => {
        testsContainerElement = document.createElement("div");
        document.body.appendChild(testsContainerElement);
    });

    afterEach(() => {
        if (wrapper !== undefined) {
            // clean up wrapper to remove Portal element from DOM
            wrapper?.unmount();
            wrapper?.detach();
            wrapper = undefined;
        }
        testsContainerElement.remove();
        onInteractionSpy.resetHistory();
    });

    describe("validation", () => {
        let warnSpy: sinon.SinonStub;

        // use sinon.stub to prevent warnings from appearing in the test logs
        before(() => (warnSpy = sinon.stub(console, "warn")));
        beforeEach(() => warnSpy.resetHistory());
        after(() => warnSpy.restore());

        it("throws error if given no target", () => {
            shallow(<Popover />);
            assert.isTrue(warnSpy.calledWith(Errors.POPOVER_REQUIRES_TARGET));
        });

        it("warns if given > 1 target elements", () => {
            shallow(
                <Popover>
                    <button />
                    <article />
                </Popover>,
            );
            assert.isTrue(warnSpy.calledWith(Errors.POPOVER_WARN_TOO_MANY_CHILDREN));
        });

        it("warns if given children and target prop", () => {
            shallow(<Popover renderTarget={() => <span>"boom"</span>}>pow</Popover>);
            assert.isTrue(warnSpy.calledWith(Errors.POPOVER_WARN_DOUBLE_TARGET));
        });

        it("warns if attempting to open a popover with empty content", () => {
            shallow(
                <Popover content={undefined} isOpen={true}>
                    {"target"}
                </Popover>,
            );
            assert.isTrue(warnSpy.calledWith(Errors.POPOVER_WARN_EMPTY_CONTENT));
        });

        it("warns if backdrop enabled when rendering inline", () => {
            shallow(
                <Popover content={"content"} hasBackdrop={true} usePortal={false}>
                    {"target"}
                </Popover>,
            );
            assert.isTrue(warnSpy.calledWith(Errors.POPOVER_WARN_HAS_BACKDROP_INLINE));
        });

        it("warns and disables if given empty content", () => {
            const popover = mount(
                <Popover content={undefined} isOpen={true}>
                    <button />
                </Popover>,
            );
            assert.isFalse(popover.find(Overlay).exists(), "not open for undefined content");
            assert.equal(warnSpy.callCount, 1);

            popover.setProps({ content: "    " });
            assert.isFalse(popover.find(Overlay).exists(), "not open for white-space string content");
            assert.equal(warnSpy.callCount, 2);
        });

        describe("throws error if backdrop enabled with non-CLICK interactionKind", () => {
            runErrorTest("HOVER");
            runErrorTest("HOVER_TARGET_ONLY");
            runErrorTest("CLICK_TARGET_ONLY");

            it("doesn't throw error for CLICK", () => {
                assert.doesNotThrow(() => <Popover hasBackdrop={true} interactionKind="click" />);
            });

            function runErrorTest(interactionKindKey: keyof typeof PopoverInteractionKind) {
                it(interactionKindKey, () => {
                    mount(
                        <Popover
                            content={<div />}
                            hasBackdrop={true}
                            interactionKind={PopoverInteractionKind[interactionKindKey]}
                        >
                            <button />
                        </Popover>,
                    );
                    assert.isTrue(warnSpy.calledWith(Errors.POPOVER_HAS_BACKDROP_INTERACTION));
                });
            }
        });
    });

    describe("rendering", () => {
        it("adds POPOVER_OPEN class to target when the popover is open", () => {
            wrapper = renderPopover();
            assert.isFalse(wrapper.findClass(Classes.POPOVER_TARGET).hasClass(Classes.POPOVER_OPEN));
            wrapper.setState({ isOpen: true });
            assert.isTrue(wrapper.findClass(Classes.POPOVER_TARGET).hasClass(Classes.POPOVER_OPEN));
        });

        it("renders Portal when usePortal=true", () => {
            wrapper = renderPopover({ isOpen: true, usePortal: true });
            assert.lengthOf(wrapper.find(Portal), 1);
        });

        it("renders to specified container correctly", () => {
            const container = document.createElement("div");
            document.body.appendChild(container);
            wrapper = renderPopover({ isOpen: true, usePortal: true, portalContainer: container });
            assert.lengthOf(container.getElementsByClassName(Classes.POPOVER_CONTENT), 1);
            document.body.removeChild(container);
        });

        it("does not render Portal when usePortal=false", () => {
            wrapper = renderPopover({ isOpen: true, usePortal: false });
            assert.lengthOf(wrapper.find(Portal), 0);
        });

        it("hasBackdrop=true renders backdrop element", () => {
            wrapper = renderPopover({ hasBackdrop: true, isOpen: true, usePortal: false });
            wrapper.assertFindClass(Classes.POPOVER_BACKDROP, true);
        });

        it("hasBackdrop=false does not render backdrop element", () => {
            wrapper = renderPopover({ hasBackdrop: false, isOpen: true, usePortal: false });
            wrapper.assertFindClass(Classes.POPOVER_BACKDROP, false);
        });

        it("targetTagName renders the right elements", () => {
            wrapper = renderPopover({
                isOpen: true,
                targetTagName: "address",
            });
            assert.isTrue(wrapper.find("address").hasClass(Classes.POPOVER_TARGET));
        });

        it("allows user to apply dark theme explicitly", () => {
            const { popoverElement } = renderPopover({
                isOpen: true,
                popoverClassName: Classes.DARK,
                usePortal: false,
            });
            assert.isNotNull(popoverElement.matches(`.${Classes.DARK}`));
        });

        it("renders with aria-haspopup attr", () => {
            wrapper = renderPopover({ isOpen: true });
            assert.isTrue(wrapper.find("[aria-haspopup='true']").exists());
        });
    });

    describe("basic functionality", () => {
        it("inherits dark theme from trigger ancestor", () => {
            testsContainerElement.classList.add(Classes.DARK);
            wrapper = renderPopover({ inheritDarkTheme: true, isOpen: true, usePortal: true });
            assert.exists(wrapper.find(Portal).find(`.${Classes.DARK}`));
            testsContainerElement.classList.remove(Classes.DARK);
        });

        it("inheritDarkTheme=false disables inheriting dark theme from trigger ancestor", () => {
            testsContainerElement.classList.add(Classes.DARK);
            renderPopover({ inheritDarkTheme: false, isOpen: true, usePortal: true }).assertFindClass(
                Classes.DARK,
                false,
            );
            testsContainerElement.classList.remove(Classes.DARK);
        });

        it("supports overlay lifecycle props", () => {
            const onOpening = sinon.spy();
            wrapper = renderPopover({ isOpen: true, onOpening });
            assert.isTrue(onOpening.calledOnce);
        });
    });

    describe("openOnTargetFocus", () => {
        describe("if true (default)", () => {
            it('adds tabindex="0" to target\'s child node when interactionKind is HOVER', () => {
                assertPopoverTargetTabIndex(true, {
                    interactionKind: "hover",
                    openOnTargetFocus: true,
                });
            });

            it('adds tabindex="0" to target\'s child node when interactionKind is HOVER_TARGET_ONLY', () => {
                assertPopoverTargetTabIndex(true, {
                    interactionKind: "hover-target",
                    openOnTargetFocus: true,
                });
            });

            it("does not add tabindex to target's child node when interactionKind is CLICK", () => {
                assertPopoverTargetTabIndex(false, {
                    interactionKind: "click",
                    openOnTargetFocus: true,
                });
            });

            it("does not add tabindex to target's child node when interactionKind is CLICK_TARGET_ONLY", () => {
                assertPopoverTargetTabIndex(false, {
                    interactionKind: "click-target",
                    openOnTargetFocus: true,
                });
            });

            it("opens popover on target focus when interactionKind is HOVER", () => {
                assertPopoverOpenStateForInteractionKind("hover", true);
            });

            it("opens popover on target focus when interactionKind is HOVER_TARGET_ONLY", () => {
                assertPopoverOpenStateForInteractionKind("hover-target", true);
            });

            it("does not open popover on target focus when interactionKind is CLICK", () => {
                assertPopoverOpenStateForInteractionKind("click", false);
            });

            it("does not open popover on target focus when interactionKind is CLICK_TARGET_ONLY", () => {
                assertPopoverOpenStateForInteractionKind("click-target", false);
            });

            it("closes popover on target blur if autoFocus={false}", () => {
                assertPopoverOpenStateForInteractionKind("click", false, {
                    autoFocus: false,
                });
            });

            it("popover remains open after target focus if autoFocus={true}", () => {
                wrapper = renderPopover({
                    autoFocus: true,
                    interactionKind: "hover",
                    usePortal: true,
                });
                const targetElement = wrapper.findClass(Classes.POPOVER_TARGET);
                targetElement.simulate("focus");
                targetElement.simulate("blur");
                assert.isTrue(wrapper.state("isOpen"));
            });
        });

        describe("if false", () => {
            it("does not add tabindex to target's child node when interactionKind is HOVER", () => {
                assertPopoverTargetTabIndex(false, {
                    interactionKind: "hover",
                    openOnTargetFocus: false,
                });
            });

            it("does not add tabindex to target's child node when interactionKind is HOVER_TARGET_ONLY", () => {
                assertPopoverTargetTabIndex(false, {
                    interactionKind: "hover-target",
                    openOnTargetFocus: false,
                });
            });

            it("does not add tabindex to target's child node when interactionKind is CLICK", () => {
                assertPopoverTargetTabIndex(false, {
                    interactionKind: "click",
                    openOnTargetFocus: false,
                });
            });

            it("does not add tabindex to target's child node when interactionKind is CLICK_TARGET_ONLY", () => {
                assertPopoverTargetTabIndex(false, {
                    interactionKind: "click-target",
                    openOnTargetFocus: false,
                });
            });

            it("does not open popover on target focus when interactionKind is HOVER", () => {
                assertPopoverOpenStateForInteractionKind("hover", false, {
                    openOnTargetFocus: false,
                });
            });

            it("does not open popover on target focus when interactionKind is HOVER_TARGET_ONLY", () => {
                assertPopoverOpenStateForInteractionKind("hover-target", false, {
                    openOnTargetFocus: false,
                });
            });

            it("does not open popover on target focus when interactionKind is CLICK", () => {
                assertPopoverOpenStateForInteractionKind("click", false, {
                    openOnTargetFocus: false,
                });
            });

            it("does not open popover on target focus when interactionKind is CLICK_TARGET_ONLY", () => {
                assertPopoverOpenStateForInteractionKind("click-target", false, {
                    openOnTargetFocus: false,
                });
            });
        });

        function assertPopoverOpenStateForInteractionKind(
            interactionKind: PopoverInteractionKind,
            isOpen: boolean,
            extraProps?: {
                autoFocus?: boolean;
                openOnTargetFocus?: boolean;
            },
        ) {
            wrapper = renderPopover({
                interactionKind,
                openOnTargetFocus: extraProps?.openOnTargetFocus,
                usePortal: true,
            });
            const targetElement = wrapper.findClass(Classes.POPOVER_TARGET);
            targetElement.simulate("focus");
            assert.equal(wrapper.state("isOpen"), isOpen);
        }

        function assertPopoverTargetTabIndex(shouldTabIndexExist: boolean, popoverProps: Partial<PopoverProps>) {
            wrapper = renderPopover({ ...popoverProps, usePortal: true });
            const targetElement = wrapper.find("[data-testid='target-button']").getDOMNode();

            if (shouldTabIndexExist) {
                assert.equal(targetElement.getAttribute("tabindex"), "0");
            } else {
                assert.isNull(targetElement.getAttribute("tabindex"));
            }
        }
    });

    describe("in controlled mode", () => {
        it("state respects isOpen prop", () => {
            renderPopover().assertIsOpen(false).setProps({ isOpen: true }).update().assertIsOpen();
        });

        it("state does not update on user (click) interaction", () => {
            renderPopover({ isOpen: true })
                .simulateTarget("click")
                .assertIsOpen()
                .setProps({ isOpen: false })
                .simulateTarget("click")
                .assertIsOpen(false);
        });

        it("state does not update on user (key) interaction", () => {
            renderPopover({ canEscapeKeyClose: true, isOpen: true }).sendEscapeKey().assertIsOpen();
        });

        describe("disabled=true takes precedence over isOpen=true", () => {
            it("on mount", () => {
                renderPopover({ disabled: true, isOpen: true }).assertIsOpen(false);
            });

            it("onInteraction not called if changing from closed to open (b/c popover is still closed)", () => {
                renderPopover({ disabled: true, isOpen: false, onInteraction: onInteractionSpy })
                    .assertOnInteractionCalled(false)
                    .setProps({ isOpen: true })
                    .assertIsOpen(false)
                    .assertOnInteractionCalled(false);
            });

            it("onInteraction not called if changing from open to closed (b/c popover was already closed)", () => {
                renderPopover({ disabled: true, isOpen: true, onInteraction: onInteractionSpy })
                    .assertOnInteractionCalled(false)
                    .setProps({ isOpen: false })
                    .assertOnInteractionCalled(false);
            });

            it("onInteraction called if open and changing to disabled (b/c popover will close)", () => {
                renderPopover({ disabled: false, isOpen: true, onInteraction: onInteractionSpy })
                    .assertIsOpen()
                    .assertOnInteractionCalled(false)
                    .setProps({ disabled: true })
                    .assertOnInteractionCalled();
            });

            it("onInteraction called if open and changing to not-disabled (b/c popover will open)", () => {
                renderPopover({ disabled: true, isOpen: true, onInteraction: onInteractionSpy })
                    .assertOnInteractionCalled(false)
                    .setProps({ disabled: false })
                    .update()
                    .assertIsOpen()
                    .assertOnInteractionCalled();
            });
        });

        it("onClose is invoked with event when popover would close", () => {
            const onClose = sinon.spy();
            renderPopover({ isOpen: true, onClose }).simulateTarget("click");
            assert.isTrue(onClose.calledOnce);
            assert.isNotNull(onClose.args[0][0]);
        });

        describe("onInteraction()", () => {
            let onInteraction: sinon.SinonSpy;
            beforeEach(() => (onInteraction = sinon.spy()));

            it("is invoked with `true` when closed popover target is clicked", () => {
                renderPopover({ isOpen: false, onInteraction }).simulateTarget("click");
                assert.isTrue(onInteraction.calledOnce);
                assert.isTrue(onInteraction.calledWith(true));
            });

            it("is invoked with `false` when open popover target is clicked", () => {
                renderPopover({ isOpen: true, onInteraction }).simulateTarget("click");
                assert.isTrue(onInteraction.calledOnce);
                assert.isTrue(onInteraction.calledWith(false));
            });

            it("is invoked with `false` when open modal popover backdrop is clicked", () => {
                renderPopover({
                    backdropProps: { className: "test-hook" },
                    hasBackdrop: true,
                    isOpen: true,
                    onInteraction,
                    usePortal: true,
                });
                dispatchMouseEvent(document.getElementsByClassName("test-hook")[0], "mousedown");
                assert.isTrue(onInteraction.calledOnce, "A");
                assert.isTrue(onInteraction.calledWith(false), "B");
            });

            it("is invoked with `false` when clicking POPOVER_DISMISS", () => {
                renderPopover(
                    { isOpen: true, onInteraction },
                    <button className={Classes.POPOVER_DISMISS}>Dismiss</button>,
                )
                    .findClass(Classes.POPOVER_DISMISS)
                    .simulate("click");
                assert.isTrue(onInteraction.calledOnce);
                assert.isTrue(onInteraction.calledWith(false));
            });

            it("is invoked with `false` when the document is mousedowned", () => {
                renderPopover({ isOpen: true, onInteraction });
                dispatchMouseEvent(document.documentElement, "mousedown");
                assert.isTrue(onInteraction.calledOnce);
                assert.isTrue(onInteraction.calledWith(false));
            });
        });

        it("does not apply active class to target when open", () => {
            wrapper = renderPopover({
                interactionKind: "click",
                isOpen: true,
            });
            wrapper.assertFindClass(Classes.ACTIVE, false);
        });
    });

    describe("in uncontrolled mode", () => {
        it("setting defaultIsOpen=true renders open popover", () => {
            renderPopover({ defaultIsOpen: true }).assertIsOpen();
        });

        it("with defaultIsOpen=true, popover can still be closed", () => {
            renderPopover({ defaultIsOpen: true }).assertIsOpen().simulateTarget("click").assertIsOpen(false);
        });

        it("CLICK_TARGET_ONLY works properly", () => {
            renderPopover({ interactionKind: "click-target" })
                .simulateTarget("click")
                .assertIsOpen()
                .simulateTarget("click")
                .assertIsOpen(false);
        });

        it("HOVER_TARGET_ONLY works properly", done => {
            renderPopover({
                interactionKind: "hover-target",
                usePortal: true,
            })
                .simulateTarget("mouseenter")
                .assertIsOpen()
                .simulateTarget("mouseleave")
                .then(popover => popover.assertIsOpen(false), done);
        });

        it("inline HOVER_TARGET_ONLY works properly when openOnTargetFocus={false}", done => {
            wrapper = renderPopover({
                interactionKind: "hover-target",
                openOnTargetFocus: false,
                usePortal: false,
            });

            wrapper.simulateTarget("mouseenter").assertIsOpen();
            wrapper.findClass(Classes.POPOVER).simulate("mouseenter");
            // Popover defers popover closing, so need to defer this check
            wrapper.then(() => wrapper!.assertIsOpen(false), done);
        });

        it("inline HOVER works properly", done => {
            wrapper = renderPopover({
                interactionKind: "hover",
                usePortal: false,
            });

            wrapper.simulateTarget("mouseenter").assertIsOpen();

            wrapper.findClass(Classes.POPOVER).simulate("mouseenter");
            wrapper.assertIsOpen();

            wrapper.findClass(Classes.POPOVER).simulate("mouseleave");
            // Popover defers popover closing, so need to defer this check
            wrapper.then(() => wrapper!.assertIsOpen(false), done);
        });

        it("clicking POPOVER_DISMISS closes popover when usePortal=true", () => {
            wrapper = renderPopover(
                { defaultIsOpen: true, usePortal: true },
                <button className={Classes.POPOVER_DISMISS}>Dismiss</button>,
            );
            wrapper.find(Portal).find(`.${Classes.POPOVER_DISMISS}`).simulate("click");
            wrapper.update().assertIsOpen(false);
        });

        it("clicking POPOVER_DISMISS closes popover when usePortal=false", () => {
            wrapper = renderPopover(
                { defaultIsOpen: true, usePortal: false },
                <button className={Classes.POPOVER_DISMISS}>Dismiss</button>,
            );
            wrapper.findClass(Classes.POPOVER_DISMISS).simulate("click");
            wrapper.assertIsOpen(false);
        });

        it("pressing Escape closes popover when canEscapeKeyClose=true and usePortal=false", () => {
            renderPopover({ canEscapeKeyClose: true, usePortal: false })
                .simulateTarget("click")
                .assertIsOpen()
                .sendEscapeKey()
                .assertIsOpen(false);
        });

        it("setting disabled=true prevents opening popover", () => {
            renderPopover({
                disabled: true,
                interactionKind: "click-target",
            })
                .simulateTarget("click")
                .assertIsOpen(false);
        });

        it("setting disabled=true hides open popover", () => {
            renderPopover({ interactionKind: "click-target" })
                .simulateTarget("click")
                .assertIsOpen()
                .setProps({ disabled: true })
                .update()
                .assertIsOpen(false);
        });

        it("console.warns if onInteraction is set", () => {
            const warnSpy = sinon.stub(console, "warn");
            renderPopover({ onInteraction: () => false });
            assert.strictEqual(warnSpy.firstCall.args[0], Errors.POPOVER_WARN_UNCONTROLLED_ONINTERACTION);
            warnSpy.restore();
        });

        it("does apply active class to target when open", () => {
            wrapper = renderPopover({ interactionKind: "click" });
            wrapper.simulateTarget("click");
            wrapper.assertFindClass(Classes.ACTIVE, true);
        });
    });

    describe("when composed with <Tooltip>", () => {
        let root: ReactWrapper<any, any>;
        beforeEach(() => {
            root = mount(
                <Popover content="popover" hoverOpenDelay={0} hoverCloseDelay={0} usePortal={false}>
                    <Tooltip content="tooltip" hoverOpenDelay={0} hoverCloseDelay={0} usePortal={false}>
                        <button>Target</button>
                    </Tooltip>
                </Popover>,
                { attachTo: testsContainerElement },
            );
        });
        afterEach(() => root.detach());

        it("shows tooltip on hover", () => {
            root.find(`.${Classes.POPOVER_TARGET}`).last().simulate("mouseenter");
            assert.lengthOf(root.find(`.${Classes.TOOLTIP}`), 1);
        });

        it("shows popover on click", () => {
            root.find(`.${Classes.POPOVER_TARGET}`).first().simulate("click");
            assert.lengthOf(root.find(`.${Classes.POPOVER}`), 1);
        });
    });

    describe("Popper.js integration", () => {
        it("renders arrow element by default", () => {
            wrapper = renderPopover({ isOpen: true });
            assert.lengthOf(wrapper.find(PopoverArrow), 1);
        });

        it("arrow can be disabled via modifiers", () => {
            wrapper = renderPopover({ isOpen: true, modifiers: { arrow: { enabled: false } } });
            assert.lengthOf(wrapper.find(PopoverArrow), 0);
        });

        it("arrow can be disabled via minimal prop", () => {
            wrapper = renderPopover({ minimal: true, isOpen: true });
            assert.lengthOf(wrapper.find(PopoverArrow), 0);
        });
    });

    describe("closing on click", () => {
        it("Classes.POPOVER_DISMISS closes on click", () =>
            assertClickToClose(
                <button className={Classes.POPOVER_DISMISS} id="btn">
                    Dismiss
                </button>,
                false,
            ));

        it("Classes.POPOVER_DISMISS_OVERRIDE does not close", () =>
            assertClickToClose(
                <span className={Classes.POPOVER_DISMISS}>
                    <button className={Classes.POPOVER_DISMISS_OVERRIDE} id="btn">
                        Dismiss
                    </button>
                </span>,
                true,
            ));

        it(":disabled does not close", () =>
            assertClickToClose(
                <button className={Classes.POPOVER_DISMISS} disabled={true} id="btn">
                    Dismiss
                </button>,
                true,
            ));

        it("Classes.DISABLED does not close", () =>
            assertClickToClose(
                // testing nested behavior too
                <div className={Classes.DISABLED}>
                    <button className={Classes.POPOVER_DISMISS} id="btn">
                        Dismiss
                    </button>
                </div>,
                true,
            ));

        it("captureDismiss={true} inner dismiss does not close outer popover", () =>
            assertClickToClose(
                <Popover
                    captureDismiss={true}
                    defaultIsOpen={true}
                    usePortal={false}
                    content={
                        <button className={Classes.POPOVER_DISMISS} id="btn">
                            Dismiss
                        </button>
                    }
                >
                    <button>Target</button>
                </Popover>,
                true,
            ));

        it("captureDismiss={false} inner dismiss closes outer popover", () =>
            assertClickToClose(
                <Popover
                    captureDismiss={false}
                    defaultIsOpen={true}
                    usePortal={false}
                    content={
                        <button className={Classes.POPOVER_DISMISS} id="btn">
                            Dismiss
                        </button>
                    }
                >
                    <button>Target</button>
                </Popover>,
                false,
            ));

        function assertClickToClose(children: React.ReactNode, expectedIsOpen: boolean) {
            wrapper = renderPopover({ defaultIsOpen: true }, children);
            wrapper.find("#btn").simulate("click");
            wrapper.assertIsOpen(expectedIsOpen);
        }
    });

    describe("clicking on target", () => {
        /**
         * @see https://github.com/palantir/blueprint/issues/3010
         */
        it("does not close a HOVER interaction popover", done => {
            const onCloseSpy = sinon.spy();
            const setOpenStateSpy = sinon.spy(Popover.prototype as any, "setOpenState");

            wrapper = renderPopover({
                interactionKind: "hover",
                onClose: onCloseSpy,
                usePortal: true,
            })
                .simulateTarget("mouseenter")
                .assertIsOpen();

            wrapper.then(() => {
                setOpenStateSpy.resetHistory();
                // need to trigger a real event because the click handler will be on the document
                dispatchMouseEvent(wrapper!.targetElement);

                assert(onCloseSpy.notCalled, "onClose prop callback should not be called");
                assert(setOpenStateSpy.notCalled, "setOpenState private method should not be called");

                setOpenStateSpy.restore();
            }, done);
        });
    });

    // these tests can be removed once Popover is merged into core in v4.0
    describe("compatibility", () => {
        it("MenuItem from core package is able to dismiss open Popover", () => {
            wrapper = renderPopover(
                { defaultIsOpen: true, usePortal: false },
                <Menu>
                    <MenuItem text="Close" />
                </Menu>,
            );
            wrapper.find(`.${Classes.MENU_ITEM}`).simulate("click");
            wrapper.assertIsOpen(false);
        });
    });

    interface PopoverWrapper extends ReactWrapper<PopoverProps, PopoverState> {
        popoverElement: HTMLElement;
        targetElement: HTMLElement;
        assertFindClass(className: string, expected?: boolean, msg?: string): this;
        assertIsOpen(isOpen?: boolean): this;
        assertOnInteractionCalled(called?: boolean): this;
        simulateTarget(eventName: string): this;
        findClass(className: string): ReactWrapper<React.HTMLAttributes<HTMLElement>, any>;
        sendEscapeKey(): this;
        then(next: (wrap: PopoverWrapper) => void, done: Mocha.Done): this;
    }

    function renderPopover(props: Partial<PopoverProps> = {}, content?: any) {
        wrapper = mount(
            <Popover
                usePortal={false}
                {...props}
                hoverCloseDelay={0}
                hoverOpenDelay={0}
                content={<div>Text {content}</div>}
            >
                <button data-testid="target-button">Target</button>
            </Popover>,
            { attachTo: testsContainerElement },
        ) as PopoverWrapper;

        const instance = wrapper.instance() as Popover<React.HTMLProps<HTMLButtonElement>>;
        wrapper.popoverElement = instance.popoverElement!;
        wrapper.targetElement = instance.targetElement!;
        wrapper.assertFindClass = (className: string, expected = true, msg = className) => {
            const actual = wrapper!.findClass(className);
            if (expected) {
                assert.isTrue(actual.exists(), msg);
            } else {
                assert.isFalse(actual.exists(), msg);
            }
            return wrapper!;
        };
        wrapper.assertIsOpen = (isOpen = true, index = 0) => {
            const overlay = wrapper!.find(Overlay).at(index);
            assert.equal(overlay.prop("isOpen"), isOpen, "assertIsOpen");
            return wrapper!;
        };
        wrapper.assertOnInteractionCalled = (called = true) => {
            assert.strictEqual(onInteractionSpy.called, called, "assertOnInteractionCalled");
            return wrapper!;
        };
        wrapper.findClass = (className: string) => wrapper!.find(`.${className}`).hostNodes();
        wrapper.simulateTarget = (eventName: string) => {
            wrapper!.findClass(Classes.POPOVER_TARGET).simulate(eventName);
            return wrapper!;
        };
        wrapper.sendEscapeKey = () => {
            wrapper!.findClass(Classes.OVERLAY_OPEN).simulate("keydown", {
                nativeEvent: new KeyboardEvent("keydown"),
                which: Keys.ESCAPE,
            });
            return wrapper!;
        };
        wrapper.then = (next, done) => {
            setTimeout(() => {
                wrapper!.update();
                next(wrapper!);
                done();
            });
            return wrapper!;
        };
        return wrapper;
    }
});
