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

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useCallback, useState } from "react";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";
import { NumericInput } from "../forms/numericInput";

import { PanelStack } from "./panelStack";
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

const initialPanel: Panel<TestPanelInfo> = {
    props: {},
    renderPanel: TestPanel,
    title: "Test Title",
};

const emptyTitleInitialPanel: Panel<TestPanelInfo> = {
    props: {},
    renderPanel: TestPanel,
};

describe("<PanelStack>", () => {
    describe("uncontrolled mode", () => {
        it("renders a basic panel and allows opening and closing", async () => {
            const user = userEvent.setup();
            const { container } = render(<PanelStack initialPanel={initialPanel} />);

            await user.click(container.querySelector<HTMLElement>("#new-panel-button")!);

            const headings = container.querySelectorAll(`.${Classes.HEADING}`);
            expect(headings.length).toBeGreaterThanOrEqual(1);
            expect(headings[0]).toHaveTextContent("New Panel 1");

            const backButton = container.querySelector<HTMLElement>(`.${Classes.PANEL_STACK_HEADER_BACK}`);
            expect(backButton).not.toBeNull();
            await user.click(backButton!);

            const headingsAfterBack = container.querySelectorAll(`.${Classes.HEADING}`);
            // After going back, the "Test Title" heading should be present
            const headingTexts = Array.from(headingsAfterBack).map(h => h.textContent);
            expect(headingTexts).toContain("Test Title");
        });

        it("renders a panel stack without header and allows opening and closing", async () => {
            const user = userEvent.setup();
            const { container } = render(<PanelStack initialPanel={initialPanel} showPanelHeader={false} />);

            await user.click(container.querySelector<HTMLElement>("#new-panel-button")!);

            expect(container.querySelectorAll(`.${Classes.HEADING}`)).toHaveLength(0);
            expect(container.querySelector(`.${Classes.PANEL_STACK_HEADER_BACK}`)).toBeNull();

            const closePanelButtons = container.querySelectorAll<HTMLElement>("#close-panel-button");
            await user.click(closePanelButtons[closePanelButtons.length - 1]);

            expect(container.querySelectorAll(`.${Classes.HEADING}`)).toHaveLength(0);
        });

        it("does not call the callback handler onClose when there is only a single panel on the stack", async () => {
            const user = userEvent.setup();
            const onClose = vi.fn();
            const { container } = render(<PanelStack initialPanel={initialPanel} onClose={onClose} />);

            await user.click(container.querySelector<HTMLElement>("#close-panel-button")!);
            expect(onClose).not.toHaveBeenCalled();
        });

        it("calls the callback handlers onOpen and onClose", async () => {
            const user = userEvent.setup();
            const onOpen = vi.fn();
            const onClose = vi.fn();
            const { container } = render(<PanelStack initialPanel={initialPanel} onClose={onClose} onOpen={onOpen} />);

            await user.click(container.querySelector<HTMLElement>("#new-panel-button")!);
            expect(onOpen).toHaveBeenCalledOnce();
            expect(onClose).not.toHaveBeenCalled();

            const backButton = container.querySelector<HTMLElement>(`.${Classes.PANEL_STACK_HEADER_BACK}`);
            expect(backButton).not.toBeNull();
            await user.click(backButton!);
            expect(onClose).toHaveBeenCalledOnce();
            expect(onOpen).toHaveBeenCalledOnce();
        });

        it("does not have the back button when only a single panel is on the stack", () => {
            const { container } = render(<PanelStack initialPanel={initialPanel} />);
            expect(container.querySelector(`.${Classes.PANEL_STACK_HEADER_BACK}`)).toBeNull();
        });

        it("assigns the class to TransitionGroup", () => {
            const TEST_CLASS_NAME = "TEST_CLASS_NAME";
            const { container } = render(<PanelStack className={TEST_CLASS_NAME} initialPanel={initialPanel} />);

            const panelStack = container.querySelector(`.${TEST_CLASS_NAME}`);
            expect(panelStack).not.toBeNull();
            expect(panelStack!.className.indexOf(Classes.PANEL_STACK)).toBe(0);
        });

        it("can render a panel without a title", async () => {
            const user = userEvent.setup();
            const { container } = render(<PanelStack initialPanel={emptyTitleInitialPanel} />);

            await user.click(container.querySelector<HTMLElement>("#new-panel-button")!);

            const backButtons = container.querySelectorAll<HTMLElement>(`.${Classes.PANEL_STACK_HEADER_BACK}`);
            expect(backButtons).toHaveLength(1);
            expect(backButtons[0]).toHaveAttribute("aria-label", "Back");

            // Open another panel from the second panel
            const newPanelButtons = container.querySelectorAll<HTMLElement>("#new-panel-button");
            await user.click(newPanelButtons[newPanelButtons.length - 1]);

            const backButtonsAfter = container.querySelectorAll<HTMLElement>(`.${Classes.PANEL_STACK_HEADER_BACK}`);
            // The latest back button should also have the accessible label
            expect(backButtonsAfter[backButtonsAfter.length - 1]).toHaveAttribute("aria-label", "Back");
        });
    });

    describe("controlled mode", () => {
        it("can render a panel stack in controlled mode", async () => {
            const user = userEvent.setup();
            const { container } = render(<PanelStack stack={[initialPanel]} />);

            await user.click(container.querySelector<HTMLElement>("#new-panel-button")!);

            // Expect the same panel as before since onOpen is not handled
            const heading = container.querySelector(`.${Classes.HEADING}`);
            expect(heading).not.toBeNull();
            expect(heading).toHaveTextContent("Test Title");
        });

        it("can open a panel in controlled mode", async () => {
            const user = userEvent.setup();

            function ControlledPanelStack() {
                const [stack, setStack] = useState<TestPanelType[]>([initialPanel]);
                return <PanelStack onOpen={panel => setStack(prev => [...prev, panel])} stack={stack} />;
            }

            const { container } = render(<ControlledPanelStack />);

            await user.click(container.querySelector<HTMLElement>("#new-panel-button")!);

            const heading = container.querySelector(`.${Classes.HEADING}`);
            expect(heading).not.toBeNull();
            expect(heading).toHaveTextContent("New Panel 1");
        });

        it("can render a panel stack with multiple initial panels and close one", async () => {
            const user = userEvent.setup();

            function ControlledPanelStack() {
                const [stack, setStack] = useState<TestPanelType[]>([
                    initialPanel,
                    { renderPanel: TestPanel, title: "New Panel 1" },
                ]);
                return <PanelStack onClose={() => setStack(prev => prev.slice(0, -1))} stack={stack} />;
            }

            const { container } = render(<ControlledPanelStack />);

            const heading = container.querySelector(`.${Classes.HEADING}`);
            expect(heading).not.toBeNull();
            expect(heading).toHaveTextContent("New Panel 1");

            const backButton = container.querySelector<HTMLElement>(`.${Classes.PANEL_STACK_HEADER_BACK}`);
            expect(backButton).not.toBeNull();
            await user.click(backButton!);

            const firstPanelHeader = container.querySelector(`.${Classes.HEADING}`);
            expect(firstPanelHeader).not.toBeNull();
            expect(firstPanelHeader).toHaveTextContent("Test Title");
        });

        it("renders only one panel by default", () => {
            const stack: TestPanelType[] = [
                { renderPanel: TestPanel, title: "Panel A" },
                { renderPanel: TestPanel, title: "Panel B" },
            ];
            const { container } = render(<PanelStack stack={stack} />);

            const panelHeaders = container.querySelectorAll(`.${Classes.HEADING}`);
            expect(panelHeaders).toHaveLength(1);
            expect(panelHeaders[0]).toHaveTextContent("Panel B");
        });

        describe("with renderActivePanelOnly={false}", () => {
            it("renders all panels", () => {
                const stack: TestPanelType[] = [
                    { renderPanel: TestPanel, title: "Panel A" },
                    { renderPanel: TestPanel, title: "Panel B" },
                ];
                const { container } = render(<PanelStack renderActivePanelOnly={false} stack={stack} />);

                const panelHeaders = container.querySelectorAll(`.${Classes.HEADING}`);
                expect(panelHeaders).toHaveLength(2);
                expect(panelHeaders[0]).toHaveTextContent("Panel A");
                expect(panelHeaders[1]).toHaveTextContent("Panel B");
            });

            it("keeps panels mounted", async () => {
                const user = userEvent.setup();

                function ControlledPanelStack() {
                    const [stack, setStack] = useState<TestPanelType[]>([initialPanel]);
                    const handleClose = useCallback(() => setStack(prev => prev.slice(0, -1)), []);
                    const handleOpen = useCallback((panel: TestPanelType) => setStack(prev => [...prev, panel]), []);
                    return (
                        <PanelStack
                            onClose={handleClose}
                            onOpen={handleOpen}
                            renderActivePanelOnly={false}
                            stack={stack}
                        />
                    );
                }

                const { container } = render(<ControlledPanelStack />);

                await user.click(screen.getByRole("button", { name: "increment" }));

                expect(getCounterValue(container)).toBe(1);

                await user.click(container.querySelector<HTMLElement>("#new-panel-button")!);

                await user.click(screen.getAllByRole("button", { name: "Back" })[0]);

                expect(getCounterValue(container)).toBe(1);
            });
        });
    });
});

function getCounterValue(container: HTMLElement) {
    const counterValue = container.querySelector<HTMLElement>(`[aria-label="counter value"]`);
    expect(counterValue).not.toBeNull();
    return parseInt(counterValue!.textContent!.trim(), 10);
}
