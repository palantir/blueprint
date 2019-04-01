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

import classNames from "classnames";
import * as React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import * as Classes from "../../common/classes";
import { IProps } from "../../common/props";
import { safeInvoke } from "../../common/utils";
import { IPanel } from "./panelProps";
import { PanelView } from "./panelView";

export interface IPanelStackProps extends IProps {
    /**
     * The initial panel to show on mount. This panel cannot be removed from the
     * stack and will appear when the stack is empty.
     */
    initialPanel: IPanel<any>;

    /**
     * Callback invoked when the user presses the back button or a panel invokes
     * the `closePanel()` injected prop method.
     */
    onClose?: (removedPanel: IPanel) => void;

    /**
     * Callback invoked when a panel invokes the `openPanel(panel)` injected
     * prop method.
     */
    onOpen?: (addedPanel: IPanel) => void;
}

export interface IPanelStackState {
    /** Whether the stack is currently animating the push or pop of a panel. */
    direction: "push" | "pop";

    /** The current stack of panels. The first panel in the stack will be displayed. */
    stack: IPanel[];
}

export class PanelStack extends React.PureComponent<IPanelStackProps, IPanelStackState> {
    public state: IPanelStackState = {
        direction: "push",
        stack: [this.props.initialPanel],
    };

    public render() {
        const classes = classNames(
            Classes.PANEL_STACK,
            `${Classes.PANEL_STACK}-${this.state.direction}`,
            this.props.className,
        );
        return (
            <TransitionGroup className={classes} component="div">
                {this.renderCurrentPanel()}
            </TransitionGroup>
        );
    }

    private renderCurrentPanel() {
        const { stack } = this.state;
        if (stack.length === 0) {
            return null;
        }
        const [activePanel, previousPanel] = stack;
        return (
            <CSSTransition classNames={Classes.PANEL_STACK} key={stack.length} timeout={400}>
                <PanelView
                    onClose={this.handlePanelClose}
                    onOpen={this.handlePanelOpen}
                    panel={activePanel}
                    previousPanel={previousPanel}
                />
            </CSSTransition>
        );
    }

    private handlePanelClose = (panel: IPanel) => {
        const { stack } = this.state;
        // only remove this panel if it is at the top and not the only one.
        if (stack[0] !== panel || stack.length <= 1) {
            return;
        }
        safeInvoke(this.props.onClose, panel);
        this.setState(state => ({
            direction: "pop",
            stack: state.stack.filter(p => p !== panel),
        }));
    };

    private handlePanelOpen = (panel: IPanel) => {
        safeInvoke(this.props.onOpen, panel);
        this.setState(state => ({
            direction: "push",
            stack: [panel, ...state.stack],
        }));
    };
}
