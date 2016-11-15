/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { assert } from "chai";
import { ReactWrapper, mount, shallow } from "enzyme";
import * as React from "react";
import * as TestUtils from "react-addons-test-utils";

import * as Errors from "../../src/common/errors";
import * as Keys from "../../src/common/keys";
import {
    Classes,
    Popover,
    PopoverInteractionKind,
    SVGPopover,
    Tooltip,
} from "../../src/index";
import { dispatchMouseEvent } from "../common/utils";

describe("<Popover>", () => {
    let testsContainerElement: HTMLElement;
    let wrapper: IPopoverWrapper;

    beforeEach(() => {
        testsContainerElement = document.createElement("div");
        document.body.appendChild(testsContainerElement);
    });

    afterEach(() => {
        // clean up wrapper to remove Portal element from DOM
        wrapper.detach();
        testsContainerElement.remove();
    });

    describe("validation:", () => {
        it("throws error if given >1 target elements", () => {
            assert.throws(() => shallow(
                <Popover content={<p>Text</p>} hoverOpenDelay={0}>
                    <button>Target 1</button>
                    <button>Target 2</button>
                </Popover>
            ), Errors.POPOVER_ONE_CHILD);
        });

        it("throws error if isModal=true when interactionKind !== CLICK", () => {
            assert.throws(() => renderPopover({
                inline: false,
                interactionKind: PopoverInteractionKind.HOVER,
                isModal: true,
            }), Errors.POPOVER_MODAL_INTERACTION);
        });

        it("throws error if isModal=true when inline=true", () => {
            assert.throws(() => renderPopover({
                inline: true,
                isModal: true,
            }), Errors.POPOVER_MODAL_INLINE);
        });

        it("throws error if useSmartPositioning=true when inline=true", () => {
            assert.throws(() => renderPopover({
                inline: true,
                useSmartPositioning: true,
            }), Errors.POPOVER_SMART_POSITIONING_INLINE);
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

    it("lifecycle methods are called appropriately", () => {
        const popoverWillOpen = sinon.spy(() =>
            assert.lengthOf(testsContainerElement.getElementsByClassName(Classes.POPOVER), 0));
        const popoverDidOpen = sinon.spy(() =>
            assert.lengthOf(testsContainerElement.getElementsByClassName(Classes.POPOVER), 1));
        const popoverWillClose = sinon.spy(() =>
            assert.lengthOf(testsContainerElement.getElementsByClassName(Classes.POPOVER), 1));

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
        renderPopover({ inline: false, isOpen: true });
        assert.isNotNull(document.query(`.${Classes.POPOVER}.${Classes.DARK}`));
        testsContainerElement.classList.remove(Classes.DARK);
    });

    it("inheritDarkTheme=false disables inheriting .pt-dark from trigger ancestor", () => {
        testsContainerElement.classList.add(Classes.DARK);
        renderPopover({ inheritDarkTheme: false, inline: false, isOpen: true });
        assert.isNotNull(document.query(`.${Classes.POPOVER}`));
        assert.isNull(document.query(`.${Classes.POPOVER}.${Classes.DARK}`));
        testsContainerElement.classList.remove(Classes.DARK);
    });

    it("allows user to apply dark theme explicitly", () => {
        renderPopover({
            inline: true,
            isOpen: true,
            popoverClassName: Classes.DARK,
        });
        assert.isNotNull(document.query(`.${Classes.POPOVER}.${Classes.DARK}`));
    });

    it("isModal=false does not render backdrop element", () => {
        renderPopover({ inline: false, isModal: false, isOpen: true });
        assert.lengthOf(document.getElementsByClassName(Classes.POPOVER_BACKDROP), 0);
    });

    it("isModal=true renders backdrop element", () => {
        renderPopover({ inline: false, isModal: true, isOpen: true });
        assert.lengthOf(document.getElementsByClassName(Classes.POPOVER_BACKDROP), 1);
    });

    describe("in controlled mode", () => {
        it("state respects isOpen prop", () => {
            wrapper = renderPopover();
            assert.isFalse(wrapper.state("isOpen"));
            wrapper.setProps({ isOpen: true } as any);
            assert.isTrue(wrapper.state("isOpen"));
        });

        it("state does not update on user interaction", () => {
            wrapper = renderPopover({ isOpen: true }).simulateTarget("click");
            assert.isTrue(wrapper.state("isOpen"));
            wrapper.setProps({ isOpen: false }).simulateTarget("click");
            assert.isFalse(wrapper.state("isOpen"));
            wrapper = renderPopover({ canEscapeKeyClose: true, isOpen: true }).sendEscapeKey();
            assert.isTrue(wrapper.state("isOpen"));
        });

        it("setting isDisabled=true throws error", () => {
            assert.throws(() => renderPopover({
                isDisabled: true,
                isOpen: true,
            }), Errors.POPOVER_CONTROLLED_DISABLED);
        });

        it("onClose is invoked with event when popover would close", () => {
            const onClose = sinon.spy();
            renderPopover({ isOpen: true, onClose }).simulateTarget("click");
            assert.isTrue(onClose.calledOnce);
            assert.isNotNull(onClose.args[0][0]);
        });

        describe("onInteraction()", () => {
            let onInteraction: Sinon.SinonSpy;
            beforeEach(() => onInteraction = sinon.spy());

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
                TestUtils.Simulate.mouseDown(document.getElementsByClassName("test-hook")[0]);
                assert.isTrue(onInteraction.calledOnce, "A");
                assert.isTrue(onInteraction.calledWith(false), "B");
            });

            it("is invoked with `false` when clicking .pt-popover-dismiss", () => {
                renderPopover({ isOpen: true, onInteraction },
                    <button className="pt-button pt-popover-dismiss">Dismiss</button>)
                    .findClass(Classes.POPOVER_DISMISS).simulate("click");
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
            wrapper = renderPopover({ defaultIsOpen: true });
            assert.isTrue(wrapper.state("isOpen"));
        });

        it("with defaultIsOpen=true, popover can still be closed", () => {
            wrapper = renderPopover({ defaultIsOpen: true });
            assert.isTrue(wrapper.state("isOpen"));

            wrapper.simulateTarget("click");
            assert.isFalse(wrapper.state("isOpen"));
        });

        it("CLICK_TARGET_ONLY works properly", () => {
            wrapper = renderPopover({ interactionKind: PopoverInteractionKind.CLICK_TARGET_ONLY });

            wrapper.simulateTarget("click");
            assert.isTrue(wrapper.state("isOpen"));

            wrapper.simulateTarget("click");
            assert.isFalse(wrapper.state("isOpen"));
        });

        it("HOVER_TARGET_ONLY works properly", () => {
            wrapper = renderPopover({ inline: false, interactionKind: PopoverInteractionKind.HOVER_TARGET_ONLY });

            wrapper.simulateTarget("mouseenter");
            assert.isTrue(wrapper.state("isOpen"));

            wrapper.simulateTarget("mouseleave");
            assert.isFalse(wrapper.state("isOpen"));
        });

        it("inline HOVER_TARGET_ONLY works properly", () => {
            wrapper = renderPopover({ inline: true, interactionKind: PopoverInteractionKind.HOVER_TARGET_ONLY });

            wrapper.simulateTarget("mouseenter");
            assert.isTrue(wrapper.state("isOpen"));

            wrapper.findClass(Classes.POPOVER).simulate("mouseenter");
            assert.isFalse(wrapper.state("isOpen"));
        });

        it("inline HOVER works properly", () => {
            wrapper = renderPopover({ inline: true, interactionKind: PopoverInteractionKind.HOVER });

            wrapper.simulateTarget("mouseenter");
            assert.isTrue(wrapper.state("isOpen"));

            wrapper.findClass(Classes.POPOVER).simulate("mouseenter");
            assert.isTrue(wrapper.state("isOpen"));

            wrapper.findClass(Classes.POPOVER).simulate("mouseleave");
            assert.isFalse(wrapper.state("isOpen"));
        });

        it("clicking .pt-popover-dismiss closes popover when inline=false", () => {
            wrapper = renderPopover({
                inline: false,
                interactionKind: PopoverInteractionKind.CLICK_TARGET_ONLY,
            }, <button className="pt-button pt-popover-dismiss">Dismiss</button>);

            wrapper.simulateTarget("click");
            assert.isTrue(wrapper.state("isOpen"));

            TestUtils.Simulate.click(document.getElementsByClassName(Classes.POPOVER_DISMISS)[0]);
            assert.isFalse(wrapper.state("isOpen"));
        });

        it("clicking .pt-popover-dismiss closes popover when inline=true", () => {
            wrapper = renderPopover({
                inline: true,
                interactionKind: PopoverInteractionKind.CLICK_TARGET_ONLY,
            }, <button className="pt-button pt-popover-dismiss">Dismiss</button>);

            wrapper.simulateTarget("click");
            assert.isTrue(wrapper.state("isOpen"));

            wrapper.findClass(Classes.POPOVER_DISMISS).simulate("click");
            assert.isFalse(wrapper.state("isOpen"));
        });

        it("pressing Escape closes popover when canEscapeKeyClose=true and inline=true", () => {
            wrapper = renderPopover({ canEscapeKeyClose: true, inline: true });
            wrapper.simulateTarget("click");
            assert.isTrue(wrapper.state("isOpen"));
            wrapper.sendEscapeKey();
            assert.isFalse(wrapper.state("isOpen"));
        });

        it("setting isDisabled=true prevents opening popover", () => {
            wrapper = renderPopover({
                interactionKind: PopoverInteractionKind.CLICK_TARGET_ONLY,
                isDisabled: true,
            });
            wrapper.simulateTarget("click");
            assert.isFalse(wrapper.state("isOpen"));
        });

        it("setting isDisabled=true hides open popover", () => {
            wrapper = renderPopover({ interactionKind: PopoverInteractionKind.CLICK_TARGET_ONLY });
            wrapper.simulateTarget("click");
            assert.isTrue(wrapper.state("isOpen"));

            wrapper.setProps({ isDisabled: true });
            assert.isFalse(wrapper.state("isOpen"));
        });

        it("console.warns if onInteraction is set", () => {
            const warnSpy = sinon.spy(console, "warn");
            renderPopover({ onInteraction: () => false });
            assert.strictEqual(warnSpy.firstCall.args[0], Errors.POPOVER_UNCONTROLLED_ONINTERACTION);
            warnSpy.restore();
        });
    });

    describe("when composed with <Tooltip>", () => {
        let root: ReactWrapper<any, any>;
        beforeEach(() => {
            root = mount(
                <Popover content="popover" hoverOpenDelay={0} hoverCloseDelay={0} inline>
                    <Tooltip content="tooltip" hoverOpenDelay={0} hoverCloseDelay={0} inline>
                        <button>Target</button>
                    </Tooltip>
                </Popover>,
                { attachTo: testsContainerElement }
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
            { attachTo: testsContainerElement }
        );
        assert.lengthOf(root.find("g"), 1);
        root.detach();
    });

    interface IPopoverWrapper extends ReactWrapper<any, any> {
        simulateTarget(eventName: string): this;
        findClass(className: string): ReactWrapper<React.HTMLAttributes<HTMLElement>, any>;
        sendEscapeKey(): this;
    }

    function renderPopover(props: any = {}, content?: any) {
        wrapper = mount(
            <Popover inline {...props} content={<p>Text {content}</p>} hoverOpenDelay={0} hoverCloseDelay={0}>
                <button>Target</button>
            </Popover>,
            { attachTo: testsContainerElement }
        ) as IPopoverWrapper;
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
});
