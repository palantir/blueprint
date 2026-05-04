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

import { fireEvent, render } from "@testing-library/react";

type RenderResult = ReturnType<typeof render>;
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
    let result: RenderResult | undefined;

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
        result?.unmount();
        result = undefined;
        containerElement.remove();
    });

    function renderPanelStack(props: PanelStackProps<TestPanelType>) {
        const r = render(<PanelStack {...props} />, { container: containerElement });
        result = r;
        return r;
    }

    function findAll(selector: string): HTMLElement[] {
        return Array.from(result!.container.querySelectorAll<HTMLElement>(selector));
    }

    function findFirst(selector: string): HTMLElement | null {
        return result!.container.querySelector<HTMLElement>(selector);
    }

    describe("uncontrolled mode", () => {
        it("renders a basic panel and allows opening and closing", () => {
            renderPanelStack({ initialPanel });
            fireEvent.click(findFirst("#new-panel-button")!);
            const headers = findAll(`.${Classes.HEADING}`);
            expect(headers[0].textContent).toBe("New Panel 1");

            fireEvent.click(findFirst(`.${Classes.PANEL_STACK_HEADER_BACK}`)!);
            const headers2 = findAll(`.${Classes.HEADING}`);
            // After back, the previous panel becomes active again. Its header reads "Test Title".
            expect(headers2[headers2.length - 1].textContent).toBe("Test Title");
        });

        it("renders a panel stack without header and allows opening and closing", () => {
            renderPanelStack({ initialPanel, showPanelHeader: false });
            fireEvent.click(findFirst("#new-panel-button")!);
            expect(findAll(`.${Classes.HEADING}`)).toHaveLength(0);
            expect(findAll(`.${Classes.PANEL_STACK_HEADER_BACK}`)).toHaveLength(0);

            const closeButtons = findAll("#close-panel-button");
            fireEvent.click(closeButtons[closeButtons.length - 1]);
            expect(findAll(`.${Classes.HEADING}`)).toHaveLength(0);
        });

        it("does not call the callback handler onClose when there is only a single panel on the stack", () => {
            const onClose = vi.fn();
            renderPanelStack({ initialPanel, onClose });
            fireEvent.click(findFirst("#close-panel-button")!);
            expect(onClose).not.toHaveBeenCalled();
        });

        it("calls the callback handlers onOpen and onClose", () => {
            const onOpen = vi.fn();
            const onClose = vi.fn();
            renderPanelStack({ initialPanel, onClose, onOpen });

            fireEvent.click(findFirst("#new-panel-button")!);
            expect(onOpen).toHaveBeenCalledOnce();
            expect(onClose).not.toHaveBeenCalled();

            fireEvent.click(findFirst(`.${Classes.PANEL_STACK_HEADER_BACK}`)!);
            expect(onClose).toHaveBeenCalledOnce();
            expect(onOpen).toHaveBeenCalledOnce();
        });

        it("does not have the back button when only a single panel is on the stack", () => {
            renderPanelStack({ initialPanel });
            expect(findAll(`.${Classes.PANEL_STACK_HEADER_BACK}`)).toHaveLength(0);
        });

        it("assigns the class to TransitionGroup", () => {
            const TEST_CLASS_NAME = "TEST_CLASS_NAME";
            renderPanelStack({ className: TEST_CLASS_NAME, initialPanel });
            const root = findFirst(`.${TEST_CLASS_NAME}`);
            expect(root).not.toBeNull();
            expect(root!.classList.contains(Classes.PANEL_STACK)).toBe(true);
        });

        it("can render a panel without a title", () => {
            renderPanelStack({ initialPanel: emptyTitleInitialPanel });
            fireEvent.click(findFirst("#new-panel-button")!);

            const backButtons = findAll(`.${Classes.PANEL_STACK_HEADER_BACK}`);
            expect(
                backButtons[0].getAttribute("aria-label"),
                "expected icon-only back button to have accessible label",
            ).toBe("Back");

            const newPanelButtons = findAll("#new-panel-button");
            fireEvent.click(newPanelButtons[1]);

            const backButtonsAfter = findAll(`.${Classes.PANEL_STACK_HEADER_BACK}`);
            expect(
                backButtonsAfter[backButtonsAfter.length - 1].getAttribute("aria-label"),
                "expected icon-only back button to have accessible label",
            ).toBe("Back");
        });
    });

    describe("controlled mode", () => {
        it("can render a panel stack in controlled mode", () => {
            const stack = [initialPanel];
            renderPanelStack({ stack });

            fireEvent.click(findFirst("#new-panel-button")!);

            // Expect the same panel as before since onOpen is not handled
            const headers = findAll(`.${Classes.HEADING}`);
            expect(headers[0].textContent).toBe("Test Title");
        });

        it("can open a panel in controlled mode", () => {
            let stack = [initialPanel];
            const props: PanelStackProps<TestPanelType> = {
                onOpen: panel => {
                    stack = [...stack, panel];
                },
                stack,
            };
            renderPanelStack(props);

            fireEvent.click(findFirst("#new-panel-button")!);
            // Re-render with new stack
            result?.rerender(<PanelStack {...{ ...props, stack }} />);

            const headers = findAll(`.${Classes.HEADING}`);
            expect(headers[0].textContent).toBe("New Panel 1");
        });

        it("can render a panel stack with multiple initial panels and close one", () => {
            let stack: Array<Panel<TestPanelInfo>> = [initialPanel, { renderPanel: TestPanel, title: "New Panel 1" }];
            const props: PanelStackProps<TestPanelType> = {
                onClose: () => {
                    stack = stack.slice(0, -1);
                },
                stack,
            };
            renderPanelStack(props);

            expect(findAll(`.${Classes.HEADING}`)[0].textContent).toBe("New Panel 1");

            fireEvent.click(findFirst(`.${Classes.PANEL_STACK_HEADER_BACK}`)!);
            result?.rerender(<PanelStack {...{ ...props, stack }} />);

            expect(findAll(`.${Classes.HEADING}`)[0].textContent).toBe("Test Title");
        });

        it("renders only one panel by default", () => {
            const stack = [
                { renderPanel: TestPanel, title: "Panel A" },
                { renderPanel: TestPanel, title: "Panel B" },
            ];
            renderPanelStack({ stack });

            const headers = findAll(`.${Classes.HEADING}`);
            expect(headers).toHaveLength(1);
            expect(headers[0].textContent).toBe(stack[1].title);
        });

        describe("with renderActivePanelOnly={false}", () => {
            it("renders all panels", () => {
                const stack = [
                    { renderPanel: TestPanel, title: "Panel A" },
                    { renderPanel: TestPanel, title: "Panel B" },
                ];
                renderPanelStack({ renderActivePanelOnly: false, stack });

                const headers = findAll(`.${Classes.HEADING}`);
                expect(headers).toHaveLength(2);
                expect(headers[0].textContent).toBe(stack[0].title);
                expect(headers[1].textContent).toBe(stack[1].title);
            });

            it("keeps panels mounted", () => {
                let stack = [initialPanel];
                const props: PanelStackProps<TestPanelType> = {
                    onClose: () => {
                        stack = stack.slice(0, -1);
                    },
                    onOpen: panel => {
                        stack = [...stack, panel];
                    },
                    renderActivePanelOnly: false,
                    stack,
                };
                renderPanelStack(props);

                fireEvent.mouseDown(findFirst('[aria-label="increment"]')!);
                expect(getFirstPanelCounterValue(), "clicking increment button should increase counter").toBe(1);

                fireEvent.click(findAll("#new-panel-button")[0]);
                result?.rerender(<PanelStack {...{ ...props, stack }} />);

                fireEvent.click(findFirst('[aria-label="Back"]')!);
                result?.rerender(<PanelStack {...{ ...props, stack }} />);

                expect(
                    getFirstPanelCounterValue(),
                    "first panel should retain its counter state when we return to it",
                ).toBe(1);
            });

            function getFirstPanelCounterValue() {
                const counterValue = findFirst('[aria-label="counter value"]');
                return parseInt(counterValue!.textContent!.trim(), 10);
            }
        });
    });
});
