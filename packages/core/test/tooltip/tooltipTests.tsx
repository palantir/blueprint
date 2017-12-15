/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";
import { Target } from "react-popper";
import { spy } from "sinon";

import { Classes, ITooltipProps, Overlay, Popover, Tooltip } from "../../src/index";

const TOOLTIP_SELECTOR = `.${Classes.TOOLTIP}`;

describe("<Tooltip>", () => {
    describe("in uncontrolled mode", () => {
        it("defaultIsOpen determines initial open state", () => {
            assert.lengthOf(renderTooltip({ defaultIsOpen: true }).find(TOOLTIP_SELECTOR), 1);
        });

        it("triggers on hover", () => {
            const tooltip = renderTooltip();
            assert.lengthOf(tooltip.find(TOOLTIP_SELECTOR), 0);

            tooltip.find(Target).simulate("mouseenter");
            assert.lengthOf(tooltip.find(TOOLTIP_SELECTOR), 1);
        });

        it("triggers on focus", () => {
            const tooltip = renderTooltip();
            assert.lengthOf(tooltip.find(TOOLTIP_SELECTOR), 0);

            tooltip.find(Target).simulate("focus");
            assert.lengthOf(tooltip.find(TOOLTIP_SELECTOR), 1);
        });

        it("does not trigger on focus if openOnTargetFocus={false}", () => {
            const tooltip = renderTooltip({ openOnTargetFocus: false });
            assert.lengthOf(tooltip.find(TOOLTIP_SELECTOR), 0);

            tooltip.find(Popover).simulate("focus");
            assert.lengthOf(tooltip.find(TOOLTIP_SELECTOR), 0);
        });

        it("propogates class names correctly", () => {
            const tooltip = renderTooltip({
                className: "bar",
                isOpen: true,
                tooltipClassName: "foo",
            });
            assert.lengthOf(tooltip.find(`.${Classes.TOOLTIP}.foo`).hostNodes(), 1, "tooltip");
            assert.lengthOf(tooltip.find(`.${Classes.POPOVER_WRAPPER}.bar`).hostNodes(), 1, "popover wrapper");
        });

        it("empty content disables Popover and warns", () => {
            const warnSpy = spy(console, "warn");
            const tooltip = renderTooltip({ isOpen: true });

            function assertDisabledPopover(content?: string) {
                tooltip.setProps({ content });
                assert.isFalse(tooltip.find(Overlay).prop("isOpen"), `"${content}"`);
                assert.isTrue(warnSpy.calledOnce, "spy not called once");
                warnSpy.reset();
            }

            assertDisabledPopover("");
            assertDisabledPopover("   ");
            assertDisabledPopover(null);
            warnSpy.restore();
        });

        it("setting isDisabled=true prevents opening tooltip", () => {
            const tooltip = renderTooltip({ disabled: true });
            tooltip.find(Popover).simulate("mouseenter");
            assert.lengthOf(tooltip.find(TOOLTIP_SELECTOR), 0);
        });
    });

    describe("in controlled mode", () => {
        it("renders when open", () => {
            const tooltip = renderTooltip({ isOpen: true });
            assert.lengthOf(tooltip.find(TOOLTIP_SELECTOR), 1);
        });

        it("doesn't render when not open", () => {
            const tooltip = renderTooltip({ isOpen: false });
            assert.lengthOf(tooltip.find(TOOLTIP_SELECTOR), 0);
        });

        it("empty content disables Popover and warns", () => {
            const warnSpy = spy(console, "warn");
            const tooltip = renderTooltip({ content: "", isOpen: true });
            assert.isFalse(tooltip.find(Overlay).prop("isOpen"));
            assert.isTrue(warnSpy.calledOnce);
            warnSpy.restore();
        });

        describe("onInteraction()", () => {
            it("is invoked with `true` when closed tooltip target is hovered", () => {
                const handleInteraction = spy();
                renderTooltip({ isOpen: false, onInteraction: handleInteraction })
                    .find(Target)
                    .simulate("mouseenter");
                assert.isTrue(handleInteraction.calledOnce, "called once");
                assert.isTrue(handleInteraction.calledWith(true), "call args");
            });
        });
    });

    it("rootElementTag prop renders the right elements", () => {
        const tooltip = renderTooltip({ isOpen: true, rootElementTag: "section" });
        assert.lengthOf(tooltip.find(`section.${Classes.POPOVER_WRAPPER}`), 1);
    });

    function renderTooltip(props?: Partial<ITooltipProps>) {
        return mount(
            <Tooltip content={<p>Text</p>} hoverOpenDelay={0} {...props} inline={true}>
                <button>Target</button>
            </Tooltip>,
        );
    }
});
