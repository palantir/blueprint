/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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
import { mount, ReactWrapper } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

import { Classes, IPanel, IPanelProps, IPanelStackProps, PanelStack } from "../../src/index";

export class TestPanel extends React.Component<IPanelProps> {
    public render() {
        return (
            <div>
                <button id="new-panel-button" onClick={this.openPanel} />
                <button id="close-panel-button" onClick={this.props.closePanel} />
            </div>
        );
    }

    private openPanel = () => this.props.openPanel({ component: TestPanel, title: "New Panel 1" });
}

describe("<PanelStack>", () => {
    let testsContainerElement: HTMLElement;
    let panelStackWrapper: IPanelStackWrapper;

    const initialPanel: IPanel = {
        component: TestPanel,
        props: {},
        title: "Test Title",
    };

    const emptyTitleInitialPanel: IPanel = {
        component: TestPanel,
        props: {},
    };

    beforeEach(() => {
        testsContainerElement = document.createElement("div");
        document.body.appendChild(testsContainerElement);
    });

    afterEach(() => {
        if (panelStackWrapper !== undefined) {
            panelStackWrapper.unmount();
            panelStackWrapper.detach();
            panelStackWrapper = undefined;
        }
        testsContainerElement.remove();
    });

    it("renders a basic panel and allows opening and closing", () => {
        panelStackWrapper = renderPanelStack({ initialPanel });
        assert.exists(panelStackWrapper);

        const newPanelButton = panelStackWrapper.find("#new-panel-button");
        assert.exists(newPanelButton);
        newPanelButton.simulate("click");

        const newPanelHeader = panelStackWrapper.findClass(Classes.HEADING);
        assert.exists(newPanelHeader);
        assert.equal(newPanelHeader.at(0).text(), "New Panel 1");

        const backButton = panelStackWrapper.findClass(Classes.PANEL_STACK_HEADER_BACK);
        assert.exists(backButton);
        backButton.simulate("click");

        const oldPanelHeader = panelStackWrapper.findClass(Classes.HEADING);
        assert.exists(oldPanelHeader);
        assert.equal(oldPanelHeader.at(1).text(), "Test Title");
    });

    it("renders a panel stack without header and allows opening and closing", () => {
        panelStackWrapper = renderPanelStack({ initialPanel, showPanelHeader: false });
        assert.exists(panelStackWrapper);

        const newPanelButton = panelStackWrapper.find("#new-panel-button");
        assert.exists(newPanelButton);
        newPanelButton.simulate("click");

        const newPanelHeader = panelStackWrapper.findClass(Classes.HEADING);
        assert.lengthOf(newPanelHeader, 0);

        const backButton = panelStackWrapper.findClass(Classes.PANEL_STACK_HEADER_BACK);
        assert.lengthOf(backButton, 0);

        const closePanel = panelStackWrapper.find("#close-panel-button");
        assert.exists(closePanel);
        closePanel.last().simulate("click");

        const oldPanelHeader = panelStackWrapper.findClass(Classes.HEADING);
        assert.lengthOf(oldPanelHeader, 0);
    });

    it("does not call the callback handler onClose when there is only a single panel on the stack", () => {
        const onClose = spy();
        panelStackWrapper = renderPanelStack({ initialPanel, onClose });

        const closePanel = panelStackWrapper.find("#close-panel-button");
        assert.exists(closePanel);

        closePanel.simulate("click");
        assert.equal(onClose.callCount, 0);
    });

    it("calls the callback handlers onOpen and onClose", () => {
        const onOpen = spy();
        const onClose = spy();
        panelStackWrapper = renderPanelStack({ initialPanel, onClose, onOpen });

        const newPanelButton = panelStackWrapper.find("#new-panel-button");
        assert.exists(newPanelButton);
        newPanelButton.simulate("click");
        assert.isTrue(onOpen.calledOnce);
        assert.isFalse(onClose.calledOnce);

        const backButton = panelStackWrapper.findClass(Classes.PANEL_STACK_HEADER_BACK);
        assert.exists(backButton);
        backButton.simulate("click");
        assert.isTrue(onClose.calledOnce);
        assert.isTrue(onOpen.calledOnce);
    });

    it("does not have the back button when only a single panel is on the stack", () => {
        panelStackWrapper = renderPanelStack({ initialPanel });
        const backButton = panelStackWrapper.findClass(Classes.PANEL_STACK_HEADER_BACK);
        assert.equal(backButton.length, 0);
    });

    it("assigns the class to TransitionGroup", () => {
        const TEST_CLASS_NAME = "TEST_CLASS_NAME";
        panelStackWrapper = renderPanelStack({ initialPanel, className: TEST_CLASS_NAME });
        assert.isTrue(panelStackWrapper.hasClass(TEST_CLASS_NAME));

        const transitionGroupClassName = panelStackWrapper.findClass(TEST_CLASS_NAME).props().className;
        assert.exists(transitionGroupClassName);
        assert.equal(transitionGroupClassName.indexOf(Classes.PANEL_STACK), 0);
    });

    it("can render a panel without a title", () => {
        panelStackWrapper = renderPanelStack({ initialPanel: emptyTitleInitialPanel });
        assert.exists(panelStackWrapper);

        const newPanelButton = panelStackWrapper.find("#new-panel-button");
        assert.exists(newPanelButton);
        newPanelButton.simulate("click");

        const backButtonWithoutTitle = panelStackWrapper.findClass(Classes.PANEL_STACK_HEADER_BACK);
        assert.equal(backButtonWithoutTitle.text(), "chevron-left");

        const newPanelButtonOnNotEmpty = panelStackWrapper
            .find("#new-panel-button")
            .hostNodes()
            .at(1);
        assert.exists(newPanelButtonOnNotEmpty);
        newPanelButtonOnNotEmpty.simulate("click");

        const backButtonWithTitle = panelStackWrapper
            .findClass(Classes.PANEL_STACK_HEADER_BACK)
            .hostNodes()
            .at(1);
        assert.equal(backButtonWithTitle.text(), "chevron-left");
    });

    it("can render a panel stack in controlled mode", () => {
        const stack = [initialPanel];
        panelStackWrapper = renderPanelStack({ stack });
        assert.exists(panelStackWrapper);

        const newPanelButton = panelStackWrapper.find("#new-panel-button");
        assert.exists(newPanelButton);
        newPanelButton.simulate("click");

        // Expect the same panel as before since onOpen is not handled
        const newPanelHeader = panelStackWrapper.findClass(Classes.HEADING);
        assert.exists(newPanelHeader);
        assert.equal(newPanelHeader.at(0).text(), "Test Title");
    });

    it("can open a panel in controlled mode", () => {
        let stack = [initialPanel];
        panelStackWrapper = renderPanelStack({ onOpen: panel => (stack = [...stack, panel]), stack });
        assert.exists(panelStackWrapper);

        const newPanelButton = panelStackWrapper.find("#new-panel-button");
        assert.exists(newPanelButton);
        newPanelButton.simulate("click");
        panelStackWrapper.setProps({ stack });

        const newPanelHeader = panelStackWrapper.findClass(Classes.HEADING);
        assert.exists(newPanelHeader);
        assert.equal(newPanelHeader.at(0).text(), "New Panel 1");
    });

    it("can render a panel stack with multiple initial panels and close one", () => {
        let stack: Array<IPanel<any>> = [initialPanel, { component: TestPanel, title: "New Panel 1" }];
        panelStackWrapper = renderPanelStack({
            onClose: () => {
                const newStack = stack.slice();
                newStack.pop();
                stack = newStack;
            },
            stack,
        });
        assert.exists(panelStackWrapper);

        const panelHeader = panelStackWrapper.findClass(Classes.HEADING);
        assert.exists(panelHeader);
        assert.equal(panelHeader.at(0).text(), "New Panel 1");

        const backButton = panelStackWrapper.findClass(Classes.PANEL_STACK_HEADER_BACK);
        assert.exists(backButton);
        backButton.simulate("click");
        panelStackWrapper.setProps({ stack });

        const firstPanelHeader = panelStackWrapper.findClass(Classes.HEADING);
        assert.exists(firstPanelHeader);
        assert.equal(firstPanelHeader.at(0).text(), "Test Title");
    });

    interface IPanelStackWrapper extends ReactWrapper<IPanelStackProps, any> {
        findClass(className: string): ReactWrapper<React.HTMLAttributes<HTMLElement>, any>;
    }

    function renderPanelStack(props: IPanelStackProps): IPanelStackWrapper {
        panelStackWrapper = mount(<PanelStack {...props} />, { attachTo: testsContainerElement }) as IPanelStackWrapper;
        panelStackWrapper.findClass = (className: string) => panelStackWrapper.find(`.${className}`).hostNodes();
        return panelStackWrapper;
    }
});
