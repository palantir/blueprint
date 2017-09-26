/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";
import { mount, ReactWrapper, shallow } from "enzyme";
import * as React from "react";
// tslint:disable-next-line:no-submodule-imports
import { Simulate } from "react-dom/test-utils";

import * as Errors from "../../src/common/errors";
import * as Keys from "../../src/common/keys";
import { Classes, IPopoverProps, Overlay, Popover, PopoverInteractionKind, SVGPopover, Tooltip } from "../../src/index";
import { dispatchMouseEvent } from "../common/utils";

describe("<Popover>", () => {
    let testsContainerElement: HTMLElement;
    let wrapper: IPopoverWrapper;

    beforeEach(() => {
        testsContainerElement = document.createElement("div");
        document.body.appendChild(testsContainerElement);
    });

    afterEach(() => {
        if (wrapper !== undefined) {
            // clean up wrapper to remove Portal element from DOM
            wrapper.detach();
            wrapper = undefined;
        }
        testsContainerElement.remove();
    });

    describe("validation:", () => {
        it("throws error if given no target", () => {
            assert.throws(() => shallow(<Popover />), Errors.POPOVER_REQUIRES_TARGET);
        });

        it("warns if given > 2 target elements", () => {
            const warnSpy = sinon.spy(console, "warn");
            shallow(
                <Popover>
                    <h1 />
                    <h2 />
                    {"h3"}
                </Popover>,
            );
            assert.isTrue(warnSpy.calledWith(Errors.POPOVER_WARN_TOO_MANY_CHILDREN));
            warnSpy.restore();
        });

        it("warns if given children and target prop", () => {
            const warnSpy = sinon.spy(console, "warn");
            shallow(<Popover target="boom">pow</Popover>);
            assert.isTrue(warnSpy.calledWith(Errors.POPOVER_WARN_DOUBLE_TARGET));
            warnSpy.restore();
        });

        it("warns if given two children and content prop", () => {
            const warnSpy = sinon.spy(console, "warn");
            shallow(
                <Popover content="boom">
                    {"pow"}
                    {"jab"}
                </Popover>,
            );
            assert.isTrue(warnSpy.calledWith(Errors.POPOVER_WARN_DOUBLE_CONTENT));
            warnSpy.restore();
        });
    });

    it("propogates class names correctly", () => {
        wrapper = renderPopover({
            className: "bar",
            interactionKind: PopoverInteractionKind.CLICK_TARGET_ONLY,
            popoverClassName: "foo",
        }).simulateTarget("click");
        assert.isTrue(wrapper.findClass(Classes.POPOVER).hasClass("foo"));
        assert.isTrue(wrapper.findClass(Classes.POPOVER_TARGET).hasClass("bar"));
    });

    it("adds .pt-popover-open class to target when the popover is open", () => {
        wrapper = renderPopover();
        assert.isFalse(wrapper.findClass(Classes.POPOVER_TARGET).hasClass(Classes.POPOVER_OPEN));
        wrapper.setState({ isOpen: true });
        assert.isTrue(wrapper.findClass(Classes.POPOVER_TARGET).hasClass(Classes.POPOVER_OPEN));
    });

    it("renders inside target container when inline=true", () => {
        wrapper = renderPopover({ inline: true, isOpen: true });
        assert.lengthOf(wrapper.find(`.${Classes.POPOVER_TARGET} .${Classes.POPOVER}`), 1);
    });

    it("does not render inside target container when inline=false", () => {
        wrapper = renderPopover({ inline: false, isOpen: true });
        assert.lengthOf(wrapper.find(`.${Classes.POPOVER_TARGET} .${Classes.POPOVER}`), 0);
    });

    it("empty content disables it and warns", () => {
        const warnSpy = sinon.spy(console, "warn");
        const popover = mount(
            <Popover content={undefined} isOpen={true}>
                <button />
            </Popover>,
        );
        assert.isFalse(popover.find(Overlay).prop("isOpen"));

        popover.setProps({ content: "    " });
        assert.isFalse(popover.find(Overlay).prop("isOpen"));

        assert.equal(warnSpy.callCount, 2);
        warnSpy.restore();
    });

    it("lifecycle methods are called appropriately", () => {
        const popoverWillOpen = sinon.spy(() =>
            assert.lengthOf(testsContainerElement.getElementsByClassName(Classes.POPOVER), 0),
        );
        const popoverDidOpen = sinon.spy(() =>
            assert.lengthOf(testsContainerElement.getElementsByClassName(Classes.POPOVER), 1),
        );
        const popoverWillClose = sinon.spy(() =>
            assert.lengthOf(testsContainerElement.getElementsByClassName(Classes.POPOVER), 1),
        );

        wrapper = renderPopover({
            interactionKind: PopoverInteractionKind.CLICK_TARGET_ONLY,
            popoverDidOpen,
            popoverWillClose,
            popoverWillOpen,
        }).simulateTarget("click");
        assert.isTrue(popoverWillOpen.calledOnce);
        assert.isTrue(popoverDidOpen.calledOnce);
        assert.isTrue(popoverWillClose.notCalled);

        wrapper.simulateTarget("click");
        assert.isTrue(popoverDidOpen.calledOnce);
        assert.isTrue(popoverWillOpen.calledOnce);
        assert.isTrue(popoverWillClose.calledOnce);
    });

    it("popoverDidOpen is called even if popoverWillOpen is not specified", () => {
        const popoverDidOpen = sinon.spy();
        renderPopover({
            interactionKind: PopoverInteractionKind.CLICK_TARGET_ONLY,
            popoverDidOpen,
        }).simulateTarget("click");

        assert.isTrue(popoverDidOpen.calledOnce);
    });

    it("inherits .pt-dark from trigger ancestor", () => {
        testsContainerElement.classList.add(Classes.DARK);
        const { popover } = renderPopover({ inline: false, isOpen: true });
        assert.isNotNull(popover.query(`.${Classes.POPOVER}.${Classes.DARK}`));
        testsContainerElement.classList.remove(Classes.DARK);
    });

    it("inheritDarkTheme=false disables inheriting .pt-dark from trigger ancestor", () => {
        testsContainerElement.classList.add(Classes.DARK);
        const { popover } = renderPopover({ inheritDarkTheme: false, inline: false, isOpen: true });
        assert.isNotNull(popover.query(`.${Classes.POPOVER}`));
        assert.isNull(popover.query(`.${Classes.POPOVER}.${Classes.DARK}`));
        testsContainerElement.classList.remove(Classes.DARK);
    });

    it("allows user to apply dark theme explicitly", () => {
        const { popover } = renderPopover({
            inline: true,
            isOpen: true,
            popoverClassName: Classes.DARK,
        });
        assert.isNotNull(popover.query(`.${Classes.POPOVER}.${Classes.DARK}`));
    });

    it("isModal=false does not render backdrop element", () => {
        const { popover } = renderPopover({ inline: false, isModal: false, isOpen: true });
        assert.lengthOf(popover.parentElement.getElementsByClassName(Classes.POPOVER_BACKDROP), 0);
    });

    it("isModal=true renders backdrop element", () => {
        const { popover } = renderPopover({ inline: false, isModal: true, isOpen: true });
        assert.lengthOf(popover.parentElement.getElementsByClassName(Classes.POPOVER_BACKDROP), 1);
    });

    it("useSmartPositioning does not mutate defaultProps", () => {
        renderPopover({ inline: false, isOpen: true, useSmartPositioning: true });
        assert.isUndefined(Popover.defaultProps.tetherOptions);
    });

    describe("openOnTargetFocus", () => {
        describe("if true (default)", () => {
            it('adds tabindex="0" to target\'s child node when interactionKind is HOVER', () => {
                assertPopoverTargetTabIndex(PopoverInteractionKind.HOVER, true, true);
            });

            it('adds tabindex="0" to target\'s child node when interactionKind is HOVER_TARGET_ONLY', () => {
                assertPopoverTargetTabIndex(PopoverInteractionKind.HOVER_TARGET_ONLY, true, true);
            });

            it("does not add tabindex to target's child node when interactionKind is CLICK", () => {
                assertPopoverTargetTabIndex(PopoverInteractionKind.CLICK, false, true);
            });

            it("does not add tabindex to target's child node when interactionKind is CLICK_TARGET_ONLY", () => {
                assertPopoverTargetTabIndex(PopoverInteractionKind.CLICK_TARGET_ONLY, false, true);
            });

            it("opens popover on target focus when interactionKind is HOVER", () => {
                assertPopoverOpenStateForInteractionKind(PopoverInteractionKind.HOVER, true);
            });

            it("opens popover on target focus when interactionKind is HOVER_TARGET_ONLY", () => {
                assertPopoverOpenStateForInteractionKind(PopoverInteractionKind.HOVER_TARGET_ONLY, true);
            });

            it("does not open popover on target focus when interactionKind is CLICK", () => {
                assertPopoverOpenStateForInteractionKind(PopoverInteractionKind.CLICK, false);
            });

            it("does not open popover on target focus when interactionKind is CLICK_TARGET_ONLY", () => {
                assertPopoverOpenStateForInteractionKind(PopoverInteractionKind.CLICK_TARGET_ONLY, false);
            });

            it.skip("closes popover on target blur if autoFocus={false}", () => {
                // TODO (clewis): This is really tricky to test given the setTimeout in the onBlur implementation.
            });

            it("popover remains open after target focus if autoFocus={true}", () => {
                wrapper = renderPopover({
                    autoFocus: true,
                    inline: false,
                    interactionKind: PopoverInteractionKind.HOVER,
                });
                const targetElement = wrapper.find(`.${Classes.POPOVER_TARGET}`);
                targetElement.simulate("focus");
                targetElement.simulate("blur");
                assert.isTrue(wrapper.state("isOpen"));
            });
        });

        describe("if false", () => {
            it("does not add tabindex to target's child node when interactionKind is HOVER", () => {
                assertPopoverTargetTabIndex(PopoverInteractionKind.HOVER, false, false);
            });

            it("does not add tabindex to target's child node when interactionKind is HOVER_TARGET_ONLY", () => {
                assertPopoverTargetTabIndex(PopoverInteractionKind.HOVER_TARGET_ONLY, false, false);
            });

            it("does not add tabindex to target's child node when interactionKind is CLICK", () => {
                assertPopoverTargetTabIndex(PopoverInteractionKind.CLICK, false, false);
            });

            it("does not add tabindex to target's child node when interactionKind is CLICK_TARGET_ONLY", () => {
                assertPopoverTargetTabIndex(PopoverInteractionKind.CLICK_TARGET_ONLY, false, false);
            });

            it("does not open popover on target focus when interactionKind is HOVER", () => {
                assertPopoverOpenStateForInteractionKind(PopoverInteractionKind.HOVER, false, false);
            });

            it("does not open popover on target focus when interactionKind is HOVER_TARGET_ONLY", () => {
                assertPopoverOpenStateForInteractionKind(PopoverInteractionKind.HOVER_TARGET_ONLY, false, false);
            });

            it("does not open popover on target focus when interactionKind is CLICK", () => {
                assertPopoverOpenStateForInteractionKind(PopoverInteractionKind.CLICK, false, false);
            });

            it("does not open popover on target focus when interactionKind is CLICK_TARGET_ONLY", () => {
                assertPopoverOpenStateForInteractionKind(PopoverInteractionKind.CLICK_TARGET_ONLY, false, false);
            });
        });

        function assertPopoverOpenStateForInteractionKind(
            interactionKind: PopoverInteractionKind,
            isOpen: boolean,
            openOnTargetFocus?: boolean,
        ) {
            wrapper = renderPopover({
                inline: false,
                interactionKind,
                openOnTargetFocus,
            });
            const targetElement = wrapper.find(`.${Classes.POPOVER_TARGET}`);
            targetElement.simulate("focus");
            assert.equal(wrapper.state("isOpen"), isOpen);
        }

        function assertPopoverTargetTabIndex(
            interactionKind: PopoverInteractionKind,
            shouldTabIndexExist: boolean,
            openOnTargetFocus?: boolean,
        ) {
            wrapper = renderPopover({ inline: false, interactionKind, openOnTargetFocus });
            const targetElement = wrapper.find(`.${Classes.POPOVER_TARGET}`);
            // accessing an html attribute in enyzme is a pain (see
            // https://github.com/airbnb/enzyme/issues/336), so we have to go down to the vanilla
            // DOM node. however, enzyme elements don't expose their `node` property, so we have to
            // cast as `any` to get to it.
            const targetOnlyChildElement = getNode(targetElement.childAt(0));

            if (shouldTabIndexExist) {
                assert.equal(targetOnlyChildElement.getAttribute("tabindex"), "0");
            } else {
                assert.isNull(targetOnlyChildElement.getAttribute("tabindex"));
            }
        }
    });

    describe("in controlled mode", () => {
        it("state respects isOpen prop", () => {
            renderPopover()
                .assertIsOpen(false)
                .setProps({ isOpen: true })
                .assertIsOpen();
        });

        it("state does not update on user interaction", () => {
            renderPopover({ isOpen: true })
                .simulateTarget("click")
                .assertIsOpen()
                .setProps({ isOpen: false })
                .simulateTarget("click")
                .assertIsOpen(false);
            renderPopover({ canEscapeKeyClose: true, isOpen: true })
                .sendEscapeKey()
                .assertIsOpen();
        });

        it("isDisabled is ignored", () => {
            renderPopover({ isDisabled: true, isOpen: true }).assertIsOpen();
        });

        it("onClose is invoked with event when popover would close", () => {
            const onClose = sinon.spy();
            renderPopover({ isOpen: true, onClose }).simulateTarget("click");
            assert.isTrue(onClose.calledOnce);
            assert.isNotNull(onClose.args[0][0]);
        });

        describe("onInteraction()", () => {
            let onInteraction: Sinon.SinonSpy;
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
                    inline: false,
                    isModal: true,
                    isOpen: true,
                    onInteraction,
                });
                Simulate.mouseDown(document.getElementsByClassName("test-hook")[0]);
                assert.isTrue(onInteraction.calledOnce, "A");
                assert.isTrue(onInteraction.calledWith(false), "B");
            });

            it("is invoked with `false` when clicking .pt-popover-dismiss", () => {
                renderPopover(
                    { isOpen: true, onInteraction },
                    <button className="pt-button pt-popover-dismiss">Dismiss</button>,
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
    });

    describe("in uncontrolled mode", () => {
        it("setting defaultIsOpen=true renders open popover", () => {
            renderPopover({ defaultIsOpen: true }).assertIsOpen();
        });

        it("with defaultIsOpen=true, popover can still be closed", () => {
            renderPopover({ defaultIsOpen: true })
                .assertIsOpen()
                .simulateTarget("click")
                .assertIsOpen(false);
        });

        it("CLICK_TARGET_ONLY works properly", () => {
            renderPopover({ interactionKind: PopoverInteractionKind.CLICK_TARGET_ONLY })
                .simulateTarget("click")
                .assertIsOpen()
                .simulateTarget("click")
                .assertIsOpen(false);
        });

        it("HOVER_TARGET_ONLY works properly", () => {
            renderPopover({ inline: false, interactionKind: PopoverInteractionKind.HOVER_TARGET_ONLY })
                .simulateTarget("mouseenter")
                .assertIsOpen()
                .simulateTarget("mouseleave")
                .assertIsOpen(false);
        });

        it("inline HOVER_TARGET_ONLY works properly when openOnTargetFocus={false}", () => {
            wrapper = renderPopover({
                inline: true,
                interactionKind: PopoverInteractionKind.HOVER_TARGET_ONLY,
                openOnTargetFocus: false,
            });

            wrapper.simulateTarget("mouseenter").assertIsOpen();

            wrapper.findClass(Classes.POPOVER).simulate("mouseenter");
            wrapper.assertIsOpen(false);
        });

        it("inline HOVER works properly", () => {
            wrapper = renderPopover({ inline: true, interactionKind: PopoverInteractionKind.HOVER });

            wrapper.simulateTarget("mouseenter").assertIsOpen();

            wrapper.findClass(Classes.POPOVER).simulate("mouseenter");
            wrapper.assertIsOpen();

            wrapper.findClass(Classes.POPOVER).simulate("mouseleave");
            wrapper.assertIsOpen(false);
        });

        it("clicking .pt-popover-dismiss closes popover when inline=false", () => {
            wrapper = renderPopover(
                {
                    inline: false,
                    interactionKind: PopoverInteractionKind.CLICK_TARGET_ONLY,
                },
                <button className="pt-button pt-popover-dismiss">Dismiss</button>,
            );

            wrapper.simulateTarget("click").assertIsOpen();

            Simulate.click(document.getElementsByClassName(Classes.POPOVER_DISMISS)[0]);
            wrapper.assertIsOpen(false);
        });

        it("clicking .pt-popover-dismiss closes popover when inline=true", () => {
            wrapper = renderPopover(
                {
                    inline: true,
                    interactionKind: PopoverInteractionKind.CLICK_TARGET_ONLY,
                },
                <button className="pt-button pt-popover-dismiss">Dismiss</button>,
            );

            wrapper.simulateTarget("click").assertIsOpen();

            wrapper.findClass(Classes.POPOVER_DISMISS).simulate("click");
            wrapper.assertIsOpen(false);
        });

        it("pressing Escape closes popover when canEscapeKeyClose=true and inline=true", () => {
            renderPopover({ canEscapeKeyClose: true, inline: true })
                .simulateTarget("click")
                .assertIsOpen()
                .sendEscapeKey()
                .assertIsOpen(false);
        });

        it("setting isDisabled=true prevents opening popover", () => {
            renderPopover({
                interactionKind: PopoverInteractionKind.CLICK_TARGET_ONLY,
                isDisabled: true,
            })
                .simulateTarget("click")
                .assertIsOpen(false);
        });

        it("setting isDisabled=true hides open popover", () => {
            renderPopover({ interactionKind: PopoverInteractionKind.CLICK_TARGET_ONLY })
                .simulateTarget("click")
                .assertIsOpen()
                .setProps({ isDisabled: true })
                .assertIsOpen(false);
        });

        it("console.warns if onInteraction is set", () => {
            const warnSpy = sinon.spy(console, "warn");
            renderPopover({ onInteraction: () => false });
            assert.strictEqual(warnSpy.firstCall.args[0], Errors.POPOVER_WARN_UNCONTROLLED_ONINTERACTION);
            warnSpy.restore();
        });
    });

    describe("when composed with <Tooltip>", () => {
        let root: ReactWrapper<any, any>;
        beforeEach(() => {
            root = mount(
                <Popover content="popover" hoverOpenDelay={0} hoverCloseDelay={0} inline={true}>
                    <Tooltip content="tooltip" hoverOpenDelay={0} hoverCloseDelay={0} inline={true}>
                        <button>Target</button>
                    </Tooltip>
                </Popover>,
                { attachTo: testsContainerElement },
            );
        });
        afterEach(() => root.detach());

        it("shows tooltip on hover", () => {
            root
                .find(`.${Classes.POPOVER_TARGET}`)
                .last()
                .simulate("mouseenter");
            assert.lengthOf(root.find(`.${Classes.TOOLTIP}`), 1);
        });

        it("shows popover on click", () => {
            root
                .find(`.${Classes.POPOVER_TARGET}`)
                .first()
                .simulate("click");
            assert.lengthOf(root.find(`.${Classes.POPOVER}`), 1);
        });
    });

    it("rootElementTag prop renders the right elements", () => {
        wrapper = renderPopover({ isOpen: true, rootElementTag: "g" });
        assert.strictEqual(wrapper.findClass(Classes.POPOVER_TARGET).type(), "g");
    });

    it("SVGPopover sets rootElementTag correctly", () => {
        const TEST_CLASS_NAME = "svg-popover-target";
        const root = mount(
            <SVGPopover content={<p>Lorem ipsum</p>} isOpen={true}>
                <button className={TEST_CLASS_NAME}>Target</button>
            </SVGPopover>,
            { attachTo: testsContainerElement },
        );
        assert.lengthOf(root.find("g"), 1);
        root.detach();
    });

    it("componentDOMChange updates targetHeight/targetWidth state when useSmartArrowPositioning=true", () => {
        const root = renderPopover({
            useSmartArrowPositioning: true,
        });
        assert.notEqual(0, root.state().targetWidth, "targetWidth should not equal 0");
        assert.notEqual(0, root.state().targetHeight, "targetHeight should not equal 0");
    });

    it("componentDOMChange does not update targetHeight/targetWidth state when useSmartArrowPositioning=false", () => {
        const root = renderPopover({
            useSmartArrowPositioning: false,
        });
        assert.equal(0, root.state().targetWidth, "targetWidth should equal 0");
        assert.equal(0, root.state().targetHeight, "targetHeight should equal 0");
    });

    interface IPopoverWrapper extends ReactWrapper<any, any> {
        popover: HTMLElement;
        assertIsOpen(isOpen?: boolean): this;
        simulateTarget(eventName: string): this;
        findClass(className: string): ReactWrapper<React.HTMLAttributes<HTMLElement>, any>;
        sendEscapeKey(): this;
    }

    function renderPopover(props: Partial<IPopoverProps> = {}, content?: any) {
        wrapper = mount(
            <Popover inline={true} {...props} content={<p>Text {content}</p>} hoverCloseDelay={0} hoverOpenDelay={0}>
                <button>Target</button>
            </Popover>,
            { attachTo: testsContainerElement },
        ) as IPopoverWrapper;
        wrapper.popover = (wrapper.instance() as Popover).popoverElement;
        wrapper.assertIsOpen = (isOpen = true) => {
            assert.equal(wrapper.find(Overlay).prop("isOpen"), isOpen);
            return wrapper;
        };
        wrapper.findClass = (className: string) => wrapper.find(`.${className}`);
        wrapper.simulateTarget = (eventName: string) => {
            wrapper.findClass(Classes.POPOVER_TARGET).simulate(eventName);
            return wrapper;
        };
        wrapper.sendEscapeKey = () => {
            wrapper.findClass(Classes.OVERLAY_OPEN).simulate("keydown", {
                nativeEvent: new KeyboardEvent("keydown"),
                which: Keys.ESCAPE,
            });
            return wrapper;
        };
        return wrapper;
    }

    function getNode(element: ReactWrapper<React.HTMLAttributes<{}>, any>) {
        return (element as any).node as Element;
    }
});
