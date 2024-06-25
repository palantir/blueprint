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

import { Classes } from "../../src/common";
import * as Errors from "../../src/common/errors";
import { Button, Overlay2 } from "../../src/components";
import { Popover } from "../../src/components/popover/popover";
import { Tooltip, type TooltipProps } from "../../src/components/tooltip/tooltip";

const TARGET_SELECTOR = `.${Classes.POPOVER_TARGET}`;
const TOOLTIP_SELECTOR = `.${Classes.TOOLTIP}`;

describe("<Tooltip>", () => {
    describe("validation", () => {
        let warnSpy: sinon.SinonStub;

        // use sinon.stub to prevent warnings from appearing in the test logs
        before(() => (warnSpy = stub(console, "warn")));
        beforeEach(() => warnSpy.resetHistory());
        after(() => warnSpy.restore());

        it("throws error if given no target", () => {
            mount(<Tooltip content={<p>Text</p>} usePortal={false} />);
            assert.isTrue(warnSpy.calledWith(Errors.POPOVER_REQUIRES_TARGET));
        });

        it("warns if given > 1 target elements", () => {
            mount(
                <Tooltip>
                    <Button />
                    <Button />
                </Tooltip>,
            );
            assert.isTrue(warnSpy.calledWith(Errors.POPOVER_WARN_TOO_MANY_CHILDREN));
        });

        it("warns if given children and renderTarget prop", () => {
            mount(<Tooltip renderTarget={() => <span>"boom"</span>}>pow</Tooltip>);
            assert.isTrue(warnSpy.calledWith(Errors.POPOVER_WARN_DOUBLE_TARGET));
        });

        it("warns if given targetProps and renderTarget", () => {
            mount(<Tooltip targetProps={{ role: "none" }} renderTarget={() => <span>"boom"</span>} />);
            assert.isTrue(warnSpy.calledWith(Errors.POPOVER_WARN_TARGET_PROPS_WITH_RENDER_TARGET));
        });

        it("warns if attempting to open with empty content", () => {
            renderTooltip({ content: undefined, isOpen: true });
            assert.isTrue(warnSpy.calledWith(Errors.POPOVER_WARN_EMPTY_CONTENT));
        });

        it("warns and disables if given empty content", () => {
            const tooltip = renderTooltip({ content: undefined, isOpen: true });

            assert.isFalse(tooltip.find(Overlay2).exists(), "not open for undefined content");
            assert.equal(warnSpy.callCount, 2);

            tooltip.setProps({ content: "    " });
            assert.isFalse(tooltip.find(Overlay2).exists(), "not open for white-space string content");
            assert.equal(warnSpy.callCount, 3);
        });
    });

    describe("rendering", () => {
        it("propogates class names correctly", () => {
            const tooltip = renderTooltip({
                className: "bar",
                isOpen: true,
                popoverClassName: "foo",
            });
            assert.isTrue(tooltip.find(TOOLTIP_SELECTOR).hasClass(tooltip.prop("popoverClassName")!), "tooltip");
            assert.isTrue(tooltip.find(`.${Classes.POPOVER_TARGET}`).hasClass(tooltip.prop("className")!), "wrapper");
        });

        it("targetTagName renders the right elements", () => {
            const tooltip = renderTooltip({
                isOpen: true,
                targetTagName: "address",
            });
            assert.isTrue(tooltip.find("address").hasClass(Classes.POPOVER_TARGET));
        });

        it("applies minimal class & hides arrow when minimal is true", () => {
            const tooltip = renderTooltip({ isOpen: true, minimal: true });
            assert.isTrue(tooltip.find(TOOLTIP_SELECTOR).hasClass(Classes.MINIMAL));
            assert.isFalse(tooltip.find(Popover).props().modifiers!.arrow!.enabled);
        });

        it("does not apply minimal class & shows arrow when minimal is false", () => {
            const tooltip = renderTooltip({ isOpen: true });
            // Minimal should be false by default.
            assert.isFalse(tooltip.props().minimal);
            assert.isFalse(tooltip.find(TOOLTIP_SELECTOR).hasClass(Classes.MINIMAL));
            assert.isTrue(tooltip.find(Popover).props().modifiers!.arrow!.enabled);
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

            tooltip.find(Popover).simulate("focus");
            assert.lengthOf(tooltip.find(TOOLTIP_SELECTOR), 0);
        });

        it("empty content disables Popover and warns", () => {
            const warnSpy = stub(console, "warn");
            const tooltip = renderTooltip({ isOpen: true, content: "" });

            function assertDisabledPopover(content: string) {
                tooltip.setProps({ content });
                assert.isFalse(tooltip.find(Overlay2).exists(), `"${content}"`);
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
            assert.isFalse(tooltip.find(Overlay2).exists());
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

    function renderTooltip(props?: Partial<TooltipProps>) {
        return mount<TooltipProps>(
            <Tooltip content={<p>Text</p>} hoverOpenDelay={0} {...props} usePortal={false}>
                <Button text="target" />
            </Tooltip>,
        );
    }
});
