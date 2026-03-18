/*
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

import { mount, type ReactWrapper } from "enzyme";
import { useState } from "react";

import { afterEach, beforeEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";
import { NumericInput } from "../forms/numericInput";

import { PanelStack, type PanelStackProps } from "./panelStack";
import { type Panel, type PanelProps } from "./panelTypes";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type TestPanelInfo = {};
type TestPanelType = Panel<TestPanelInfo>;

const TestPanel: React.FC<PanelProps<TestPanelInfo>> = props => {
    const [counter, setCounter] = useState(0);
    const newPanel = { renderPanel: TestPanel, title: "New Panel 1" };

    return (
        <div>
            <button id="new-panel-button" onClick={() => props.openPanel(newPanel)} />
            {/* eslint-disable-next-line @typescript-eslint/unbound-method */}
            <button id="close-panel-button" onClick={props.closePanel} />
            <span aria-label="counter value">{counter}</span>
            <NumericInput value={counter} stepSize={1} onValueChange={setCounter} />
        </div>
    );
};

describe("<PanelStack>", () => {
    let containerElement: HTMLElement;
    let panelStackWrapper: PanelStackWrapper<TestPanelType>;

    const initialPanel: Panel<TestPanelInfo> = {
        props: {},
        renderPanel: TestPanel,
        title: "Test Title",
    };

    const emptyTitleInitialPanel: Panel<TestPanelInfo> = {
        props: {},
        renderPanel: TestPanel,
    };

    beforeEach(() => {
        containerElement = document.createElement("div");
        document.body.appendChild(containerElement);
    });

    afterEach(() => {
        panelStackWrapper?.unmount();
        panelStackWrapper?.detach();
        containerElement.remove();
    });

    describe("uncontrolled mode", () => {
        it("renders a basic panel and allows opening and closing", () => {
            panelStackWrapper = renderPanelStack({ initialPanel });
            expect(panelStackWrapper).toBeDefined();

            const newPanelButton = panelStackWrapper.find("#new-panel-button");
            expect(newPanelButton).toBeDefined();
            newPanelButton.simulate("click");

            const newPanelHeader = panelStackWrapper.findClass(Classes.HEADING);
            expect(newPanelHeader).toBeDefined();
            expect(newPanelHeader.at(0).text()).toBe("New Panel 1");

            const backButton = panelStackWrapper.findClass(Classes.PANEL_STACK_HEADER_BACK);
            expect(backButton).toBeDefined();
            backButton.simulate("click");

            const oldPanelHeader = panelStackWrapper.findClass(Classes.HEADING);
            expect(oldPanelHeader).toBeDefined();
            expect(oldPanelHeader.at(1).text()).toBe("Test Title");
        });

        it("renders a panel stack without header and allows opening and closing", () => {
            panelStackWrapper = renderPanelStack({ initialPanel, showPanelHeader: false });
            expect(panelStackWrapper).toBeDefined();

            const newPanelButton = panelStackWrapper.find("#new-panel-button");
            expect(newPanelButton).toBeDefined();
            newPanelButton.simulate("click");

            const newPanelHeader = panelStackWrapper.findClass(Classes.HEADING);
            expect(newPanelHeader).toHaveLength(0);

            const backButton = panelStackWrapper.findClass(Classes.PANEL_STACK_HEADER_BACK);
            expect(backButton).toHaveLength(0);

            const closePanel = panelStackWrapper.find("#close-panel-button");
            expect(closePanel).toBeDefined();
            closePanel.last().simulate("click");

            const oldPanelHeader = panelStackWrapper.findClass(Classes.HEADING);
            expect(oldPanelHeader).toHaveLength(0);
        });

        it("does not call the callback handler onClose when there is only a single panel on the stack", () => {
            const onClose = vi.fn();
            panelStackWrapper = renderPanelStack({ initialPanel, onClose });

            const closePanel = panelStackWrapper.find("#close-panel-button");
            expect(closePanel).toBeDefined();

            closePanel.simulate("click");
            expect(onClose).not.toHaveBeenCalled();
        });

        it("calls the callback handlers onOpen and onClose", () => {
            const onOpen = vi.fn();
            const onClose = vi.fn();
            panelStackWrapper = renderPanelStack({ initialPanel, onClose, onOpen });

            const newPanelButton = panelStackWrapper.find("#new-panel-button");
            expect(newPanelButton).toBeDefined();
            newPanelButton.simulate("click");
            expect(onOpen).toHaveBeenCalledOnce();
            expect(onClose).not.toHaveBeenCalled();

            const backButton = panelStackWrapper.findClass(Classes.PANEL_STACK_HEADER_BACK);
            expect(backButton).toBeDefined();
            backButton.simulate("click");
            expect(onClose).toHaveBeenCalledOnce();
            expect(onOpen).toHaveBeenCalledOnce();
        });

        it("does not have the back button when only a single panel is on the stack", () => {
            panelStackWrapper = renderPanelStack({ initialPanel });
            const backButton = panelStackWrapper.findClass(Classes.PANEL_STACK_HEADER_BACK);
            expect(backButton).toHaveLength(0);
        });

        it("assigns the class to TransitionGroup", () => {
            const TEST_CLASS_NAME = "TEST_CLASS_NAME";
            panelStackWrapper = renderPanelStack({ className: TEST_CLASS_NAME, initialPanel });
            expect(panelStackWrapper.hasClass(TEST_CLASS_NAME)).toBe(true);

            const transitionGroupClassName = panelStackWrapper.findClass(TEST_CLASS_NAME).props().className;
            expect(transitionGroupClassName).toBeDefined();
            expect(transitionGroupClassName!.indexOf(Classes.PANEL_STACK)).toBe(0);
        });

        it("can render a panel without a title", () => {
            panelStackWrapper = renderPanelStack({ initialPanel: emptyTitleInitialPanel });
            expect(panelStackWrapper).toBeDefined();

            const newPanelButton = panelStackWrapper.find("#new-panel-button");
            expect(newPanelButton).toBeDefined();
            newPanelButton.simulate("click");

            const backButtonWithoutTitle = panelStackWrapper.findClass(Classes.PANEL_STACK_HEADER_BACK);
            expect(
                backButtonWithoutTitle.prop("aria-label"),
                "expected icon-only back button to have accessible label",
            ).toBe("Back");

            const newPanelButtonOnNotEmpty = panelStackWrapper.find("#new-panel-button").hostNodes().at(1);
            expect(newPanelButtonOnNotEmpty).toBeDefined();
            newPanelButtonOnNotEmpty.simulate("click");

            const backButtonWithTitle = panelStackWrapper.findClass(Classes.PANEL_STACK_HEADER_BACK).hostNodes().at(1);
            expect(
                backButtonWithTitle.prop("aria-label"),
                "expected icon-only back button to have accessible label",
            ).toBe("Back");
        });
    });

    describe("controlled mode", () => {
        it("can render a panel stack in controlled mode", () => {
            const stack = [initialPanel];
            panelStackWrapper = renderPanelStack({ stack });
            expect(panelStackWrapper).toBeDefined();

            const newPanelButton = panelStackWrapper.find("#new-panel-button");
            expect(newPanelButton).toBeDefined();
            newPanelButton.simulate("click");

            // Expect the same panel as before since onOpen is not handled
            const newPanelHeader = panelStackWrapper.findClass(Classes.HEADING);
            expect(newPanelHeader).toBeDefined();
            expect(newPanelHeader.at(0).text()).toBe("Test Title");
        });

        it("can open a panel in controlled mode", () => {
            let stack = [initialPanel];
            panelStackWrapper = renderPanelStack({
                onOpen: panel => {
                    stack = [...stack, panel];
                },
                stack,
            });
            expect(panelStackWrapper).toBeDefined();

            const newPanelButton = panelStackWrapper.find("#new-panel-button");
            expect(newPanelButton).toBeDefined();
            newPanelButton.simulate("click");
            panelStackWrapper.setProps({ stack });

            const newPanelHeader = panelStackWrapper.findClass(Classes.HEADING);
            expect(newPanelHeader).toBeDefined();
            expect(newPanelHeader.at(0).text()).toBe("New Panel 1");
        });

        it("can render a panel stack with multiple initial panels and close one", () => {
            let stack: Array<Panel<TestPanelInfo>> = [initialPanel, { renderPanel: TestPanel, title: "New Panel 1" }];
            panelStackWrapper = renderPanelStack({
                onClose: () => {
                    stack = stack.slice(0, -1);
                },
                stack,
            });
            expect(panelStackWrapper).toBeDefined();

            const panelHeader = panelStackWrapper.findClass(Classes.HEADING);
            expect(panelHeader).toBeDefined();
            expect(panelHeader.at(0).text()).toBe("New Panel 1");

            const backButton = panelStackWrapper.findClass(Classes.PANEL_STACK_HEADER_BACK);
            expect(backButton).toBeDefined();
            backButton.simulate("click");
            panelStackWrapper.setProps({ stack });

            const firstPanelHeader = panelStackWrapper.findClass(Classes.HEADING);
            expect(firstPanelHeader).toBeDefined();
            expect(firstPanelHeader.at(0).text()).toBe("Test Title");
        });

        it("renders only one panel by default", () => {
            const stack = [
                { renderPanel: TestPanel, title: "Panel A" },
                { renderPanel: TestPanel, title: "Panel B" },
            ];
            panelStackWrapper = renderPanelStack({ stack });

            const panelHeaders = panelStackWrapper.findClass(Classes.HEADING);
            expect(panelHeaders).toBeDefined();
            expect(panelHeaders).toHaveLength(1);
            expect(panelHeaders.at(0).text()).toBe(stack[1].title);
        });

        describe("with renderActivePanelOnly={false}", () => {
            it("renders all panels", () => {
                const stack = [
                    { renderPanel: TestPanel, title: "Panel A" },
                    { renderPanel: TestPanel, title: "Panel B" },
                ];
                panelStackWrapper = renderPanelStack({ renderActivePanelOnly: false, stack });

                const panelHeaders = panelStackWrapper.findClass(Classes.HEADING);
                expect(panelHeaders).toBeDefined();
                expect(panelHeaders).toHaveLength(2);
                expect(panelHeaders.at(0).text()).toBe(stack[0].title);
                expect(panelHeaders.at(1).text()).toBe(stack[1].title);
            });

            it("keeps panels mounted", () => {
                let stack = [initialPanel];
                panelStackWrapper = renderPanelStack({
                    onClose: () => {
                        stack = stack.slice(0, -1);
                    },
                    onOpen: panel => {
                        stack = [...stack, panel];
                    },
                    renderActivePanelOnly: false,
                    stack,
                });

                const incrementButton = panelStackWrapper.find(`[aria-label="increment"]`);
                expect(incrementButton).toBeDefined();
                incrementButton.hostNodes().simulate("mousedown");
                expect(getFirstPanelCounterValue(), "clicking increment button should increase counter").toBe(1);

                const newPanelButton = panelStackWrapper.find("#new-panel-button");
                newPanelButton.hostNodes().simulate("click");
                panelStackWrapper.setProps({ stack });

                const backButton = panelStackWrapper.find(`[aria-label="Back"]`);
                backButton.hostNodes().simulate("click");
                panelStackWrapper.setProps({ stack });
                expect(
                    getFirstPanelCounterValue(),
                    "first panel should retain its counter state when we return to it",
                ).toBe(1);
            });

            function getFirstPanelCounterValue() {
                const counterValue = panelStackWrapper.find(`[aria-label="counter value"]`);
                expect(counterValue).toBeDefined();
                return parseInt(counterValue.hostNodes().first().text().trim(), 10);
            }
        });
    });

    interface PanelStackWrapper<T extends Panel<object>> extends ReactWrapper<PanelStackProps<T>, any> {
        findClass(className: string): ReactWrapper<React.HTMLAttributes<HTMLElement>, any>;
    }

    function renderPanelStack(props: PanelStackProps<TestPanelType>): PanelStackWrapper<TestPanelType> {
        panelStackWrapper = mount(<PanelStack {...props} />, {
            attachTo: containerElement,
        }) as PanelStackWrapper<TestPanelType>;
        panelStackWrapper.findClass = (className: string) => panelStackWrapper.find(`.${className}`).hostNodes();
        return panelStackWrapper;
    }
});
