/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import { Classes, ITooltipProps, Overlay, Popover, SVGTooltip, Tooltip } from "../../src/index";

const TOOLTIP_SELECTOR = `.${Classes.TOOLTIP}`;

describe.only("<Tooltip>", () => {
    describe("in uncontrolled mode", () => {
        it("defaultIsOpen determines initial open state", () => {
            assert.lengthOf(renderTooltip({ defaultIsOpen: true }).find(TOOLTIP_SELECTOR), 1);
        });

        it("triggers on hover", () => {
            const tooltip = renderTooltip();
            assert.lengthOf(tooltip.find(TOOLTIP_SELECTOR), 0);

            tooltip.find(Popover).simulate("mouseenter");
            assert.lengthOf(tooltip.find(TOOLTIP_SELECTOR), 1);
        });

        it("triggers on focus", () => {
            const tooltip = renderTooltip();
            assert.lengthOf(tooltip.find(TOOLTIP_SELECTOR), 0);

            tooltip.find(Popover).simulate("focus");
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
            assert.lengthOf(tooltip.find(`.${Classes.TOOLTIP}.foo`), 1);
            assert.lengthOf(tooltip.find(`.${Classes.POPOVER_TARGET}.bar`), 1);
        });

        it("empty content disables Popover and warns", () => {
            const warnSpy = sinon.spy(console, "warn");
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
            const tooltip = renderTooltip({ isDisabled: true });
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
            const warnSpy = sinon.spy(console, "warn");
            const tooltip = renderTooltip({ content: "", isOpen: true });
            assert.isFalse(tooltip.find(Overlay).prop("isOpen"));
            assert.isTrue(warnSpy.calledOnce);
            warnSpy.restore();
        });

        describe("onInteraction()", () => {
            it("is invoked with `true` when closed tooltip target is hovered", () => {
                const handleInteraction = sinon.spy();
                renderTooltip({ isOpen: false, onInteraction: handleInteraction })
                    .find(Popover).simulate("mouseenter");
                assert.isTrue(handleInteraction.calledOnce);
                assert.isTrue(handleInteraction.calledWith(true));
            });
        });
    });

    it("rootElementTag prop renders the right elements", () => {
        const tooltip = renderTooltip({ isOpen: true, rootElementTag: "g" });
        assert.lengthOf(tooltip.find(`g.${Classes.POPOVER_TARGET}`), 1);
    });

    it("SVGTooltip sets rootElementTag correctly", () => {
        const TEST_CLASS_NAME = "svg-popover-target";
        const svgTooltip = mount(
            <SVGTooltip content={<p>Lorem ipsum</p>} isOpen={true}>
                <g className={TEST_CLASS_NAME}>Target</g>
            </SVGTooltip>,
        );

        assert.lengthOf(svgTooltip.find("span"), 0);
        assert.lengthOf(svgTooltip.find(`.${TEST_CLASS_NAME}`), 1);

        svgTooltip.unmount();
    });

    function renderTooltip(props?: Partial<ITooltipProps>) {
        return mount(
            <Tooltip content={<p>Text</p>} hoverOpenDelay={0} {...props} inline>
                <button>Target</button>
            </Tooltip>,
        );
    }
});
