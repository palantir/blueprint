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

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";
import { spy, stub } from "sinon";

import { Classes, ITooltipProps, Overlay, Popover, Tooltip } from "../../src/index";

const TARGET_SELECTOR = `.${Classes.POPOVER_TARGET}`;
const TOOLTIP_SELECTOR = `.${Classes.TOOLTIP}`;

describe("<Tooltip>", () => {
    it("propogates class names correctly", () => {
        const tooltip = renderTooltip({
            className: "bar",
            isOpen: true,
            popoverClassName: "foo",
        });
        assert.isTrue(tooltip.find(TOOLTIP_SELECTOR).hasClass(tooltip.prop("popoverClassName")), "tooltip");
        assert.isTrue(tooltip.find(`.${Classes.POPOVER_WRAPPER}`).hasClass(tooltip.prop("className")), "wrapper");
    });

    it("wrapperTagName & targetTagName render the right elements", () => {
        const tooltip = renderTooltip({ isOpen: true, targetTagName: "address", wrapperTagName: "article" });
        assert.isTrue(tooltip.find("address").hasClass(Classes.POPOVER_TARGET));
        assert.isTrue(tooltip.find("article").hasClass(Classes.POPOVER_WRAPPER));
    });

    it("supports overlay lifecycle props", () => {
        const onOpening = spy();
        renderTooltip({ isOpen: true, onOpening });
        assert.isTrue(onOpening.calledOnce);
    });

    describe("in uncontrolled mode", () => {
        it("defaultIsOpen determines initial open state", () => {
            assert.lengthOf(renderTooltip({ defaultIsOpen: true }).find(TOOLTIP_SELECTOR), 1);
        });

        it("triggers on hover", () => {
            const tooltip = renderTooltip();
            assert.lengthOf(tooltip.find(TOOLTIP_SELECTOR), 0);

            tooltip.find(TARGET_SELECTOR).simulate("mouseenter");
            assert.lengthOf(tooltip.find(TOOLTIP_SELECTOR), 1);
        });

        it("triggers on focus", () => {
            const tooltip = renderTooltip();
            assert.lengthOf(tooltip.find(TOOLTIP_SELECTOR), 0);

            tooltip.find(TARGET_SELECTOR).simulate("focus");
            assert.lengthOf(tooltip.find(TOOLTIP_SELECTOR), 1);
        });

        it("does not trigger on focus if openOnTargetFocus={false}", () => {
            const tooltip = renderTooltip({ openOnTargetFocus: false });
            assert.lengthOf(tooltip.find(TOOLTIP_SELECTOR), 0);

            tooltip.find(Popover).simulate("focus");
            assert.lengthOf(tooltip.find(TOOLTIP_SELECTOR), 0);
        });

        it("empty content disables Popover and warns", () => {
            const warnSpy = stub(console, "warn");
            const tooltip = renderTooltip({ isOpen: true });

            function assertDisabledPopover(content?: string) {
                tooltip.setProps({ content });
                assert.isFalse(tooltip.find(Overlay).prop("isOpen"), `"${content}"`);
                assert.isTrue(warnSpy.calledOnce, "spy not called once");
                warnSpy.resetHistory();
            }

            assertDisabledPopover("");
            assertDisabledPopover("   ");
            assertDisabledPopover(null);
            warnSpy.restore();
        });

        it("setting disabled=true prevents opening tooltip", () => {
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
            const warnSpy = stub(console, "warn");
            const tooltip = renderTooltip({ content: "", isOpen: true });
            assert.isFalse(tooltip.find(Overlay).prop("isOpen"));
            assert.isTrue(warnSpy.calledOnce);
            warnSpy.restore();
        });

        describe("onInteraction()", () => {
            it("is invoked with `true` when closed tooltip target is hovered", () => {
                const handleInteraction = spy();
                renderTooltip({ isOpen: false, onInteraction: handleInteraction })
                    .find(TARGET_SELECTOR)
                    .simulate("mouseenter");
                assert.isTrue(handleInteraction.calledOnce, "called once");
                assert.isTrue(handleInteraction.calledWith(true), "call args");
            });
        });
    });

    function renderTooltip(props?: Partial<ITooltipProps>) {
        return mount<ITooltipProps>(
            <Tooltip content={<p>Text</p>} hoverOpenDelay={0} {...props} usePortal={false}>
                <button>Target</button>
            </Tooltip>,
        );
    }
});
