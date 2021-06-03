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
import { mount } from "enzyme";
import * as React from "react";
import { spy, stub } from "sinon";

import { Button, Classes as CoreClasses, Overlay } from "@blueprintjs/core";

import { Classes } from "../src";
import { Popover2 } from "../src/popover2";
import { ITooltip2Props, Tooltip2 } from "../src/tooltip2";

const TARGET_SELECTOR = `.${Classes.POPOVER2_TARGET}`;
const TOOLTIP_SELECTOR = `.${Classes.TOOLTIP2}`;
const TEST_TARGET_ID = "test-target";

describe("<Tooltip2>", () => {
    describe("rendering", () => {
        it("propogates class names correctly", () => {
            const tooltip = renderTooltip({
                className: "bar",
                isOpen: true,
                popoverClassName: "foo",
            });
            assert.isTrue(tooltip.find(TOOLTIP_SELECTOR).hasClass(tooltip.prop("popoverClassName")!), "tooltip");
            assert.isTrue(tooltip.find(`.${Classes.POPOVER2_TARGET}`).hasClass(tooltip.prop("className")!), "wrapper");
        });

        it("targetTagName renders the right elements", () => {
            const tooltip = renderTooltip({
                isOpen: true,
                targetTagName: "address",
            });
            assert.isTrue(tooltip.find("address").hasClass(Classes.POPOVER2_TARGET));
        });

        it("applies minimal class & hides arrow when minimal is true", () => {
            const tooltip = renderTooltip({ isOpen: true, minimal: true });
            assert.isTrue(tooltip.find(TOOLTIP_SELECTOR).hasClass(CoreClasses.MINIMAL));
            assert.isFalse(tooltip.find(Popover2).props().modifiers!.arrow!.enabled);
        });

        it("does not apply minimal class & shows arrow when minimal is false", () => {
            const tooltip = renderTooltip({ isOpen: true });
            // Minimal should be false by default.
            assert.isFalse(tooltip.props().minimal);
            assert.isFalse(tooltip.find(TOOLTIP_SELECTOR).hasClass(CoreClasses.MINIMAL));
            assert.isTrue(tooltip.find(Popover2).props().modifiers!.arrow!.enabled);
        });
    });

    describe("basic functionality", () => {
        it("supports overlay lifecycle props", () => {
            const onOpening = spy();
            renderTooltip({ isOpen: true, onOpening });
            assert.isTrue(onOpening.calledOnce);
        });
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

            tooltip.find(Popover2).simulate("focus");
            assert.lengthOf(tooltip.find(TOOLTIP_SELECTOR), 0);
        });

        it("empty content disables Popover2 and warns", () => {
            const warnSpy = stub(console, "warn");
            const tooltip = renderTooltip({ isOpen: true, content: "" });

            function assertDisabledPopover(content: string) {
                tooltip.setProps({ content });
                assert.isFalse(tooltip.find(Overlay).exists(), `"${content}"`);
                assert.isTrue(warnSpy.called, "spy not called");
                warnSpy.resetHistory();
            }

            assertDisabledPopover("");
            assertDisabledPopover("   ");
            // @ts-expect-error
            assertDisabledPopover(null);
            warnSpy.restore();
        });

        it("setting disabled=true prevents opening tooltip", () => {
            const tooltip = renderTooltip({ disabled: true });
            tooltip.find(Popover2).simulate("mouseenter");
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

        it("empty content disables Popover2 and warns", () => {
            const warnSpy = stub(console, "warn");
            const tooltip = renderTooltip({ content: "", isOpen: true });
            assert.isFalse(tooltip.find(Overlay).exists());
            assert.isTrue(warnSpy.called);
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

    function renderTooltip(props?: Partial<ITooltip2Props>) {
        return mount<ITooltip2Props>(
            <Tooltip2 content={<p>Text</p>} hoverOpenDelay={0} {...props} usePortal={false}>
                <Button id={TEST_TARGET_ID} text="target" />
            </Tooltip2>,
        );
    }
});
