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
import { polyfill } from "react-lifecycles-compat";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { AbstractPureComponent2, Classes } from "../../common";
import * as Errors from "../../common/errors";
import { IProps } from "../../common/props";
import { IPanel } from "./panelProps";
import { PanelView } from "./panelView";

/* eslint-disable deprecation/deprecation */

export interface IPanelStackProps extends IProps {
    /**
     * The initial panel to show on mount. This panel cannot be removed from the
     * stack and will appear when the stack is empty.
     * This prop is only used in uncontrolled mode and is thus mutually
     * exclusive with the `stack` prop.
     */
    initialPanel?: IPanel<any>;

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

    /**
     * If false, PanelStack will render all panels in the stack to the DOM, allowing their
     * React component trees to maintain state as a user navigates through the stack.
     * Panels other than the currently active one will be invisible.
     *
     * @default true
     */
    renderActivePanelOnly?: boolean;

    /**
     * Whether to show the header with the "back" button in each panel.
     *
     * @default true
     */
    showPanelHeader?: boolean;

    /**
     * The full stack of panels in controlled mode. The last panel in the stack
     * will be displayed.
     */
    stack?: Array<IPanel<any>>;
}

export interface IPanelStackState {
    /** Whether the stack is currently animating the push or pop of a panel. */
    direction: "push" | "pop";

    /** The current stack of panels. The first panel in the stack will be displayed. */
    stack: IPanel[];
}

/** @deprecated use `PanelStack2<T>` */
@polyfill
export class PanelStack extends AbstractPureComponent2<IPanelStackProps, IPanelStackState> {
    public state: IPanelStackState = {
        direction: "push",
        stack:
            this.props.stack != null
                ? this.props.stack.slice().reverse()
                : this.props.initialPanel !== undefined
                ? [this.props.initialPanel]
                : [],
    };

    public componentDidUpdate(prevProps: IPanelStackProps, prevState: IPanelStackState) {
        super.componentDidUpdate(prevProps, prevState);

        // Always update local stack if stack prop changes
        if (this.props.stack !== prevProps.stack && prevProps.stack != null) {
            this.setState({ stack: this.props.stack!.slice().reverse() });
        }

        // Only update animation direction if stack length changes
        const stackLength = this.props.stack != null ? this.props.stack.length : 0;
        const prevStackLength = prevProps.stack != null ? prevProps.stack.length : 0;
        if (stackLength !== prevStackLength && prevProps.stack != null) {
            this.setState({
                direction: prevProps.stack.length - this.props.stack!.length < 0 ? "push" : "pop",
            });
        }
    }

    public render() {
        const classes = classNames(
            Classes.PANEL_STACK,
            `${Classes.PANEL_STACK}-${this.state.direction}`,
            this.props.className,
        );
        return (
            <TransitionGroup className={classes} component="div">
                {this.renderPanels()}
            </TransitionGroup>
        );
    }

    protected validateProps(props: IPanelStackProps) {
        if (
            (props.initialPanel == null && props.stack == null) ||
            (props.initialPanel != null && props.stack != null)
        ) {
            console.error(Errors.PANEL_STACK_INITIAL_PANEL_STACK_MUTEX);
        }
        if (props.stack != null && props.stack.length === 0) {
            console.error(Errors.PANEL_STACK_REQUIRES_PANEL);
        }
    }

    private renderPanels() {
        const { renderActivePanelOnly = true } = this.props;
        const { stack } = this.state;
        if (stack.length === 0) {
            return null;
        }
        const panelsToRender = renderActivePanelOnly ? [stack[0]] : stack;
        const panelViews = panelsToRender.map(this.renderPanel).reverse();
        return panelViews;
    }

    private renderPanel = (panel: IPanel, index: number) => {
        const { renderActivePanelOnly, showPanelHeader = true } = this.props;
        const { stack } = this.state;

        // With renderActivePanelOnly={false} we would keep all the CSSTransitions rendered,
        // therefore they would not trigger the "enter" transition event as they were entered.
        // To force the enter event, we want to change the key, but stack.length is not enough
        // and a single panel should not rerender as long as it's hidden.
        // This key contains two parts: first one, stack.length - index is constant (and unique) for each panel,
        // second one, active changes only when the panel becomes or stops being active.
        const layer = stack.length - index;
        const key = renderActivePanelOnly ? stack.length : layer;

        return (
            <CSSTransition classNames={Classes.PANEL_STACK} key={key} timeout={400}>
                <PanelView
                    onClose={this.handlePanelClose}
                    onOpen={this.handlePanelOpen}
                    panel={panel}
                    previousPanel={stack[index + 1]}
                    showHeader={showPanelHeader}
                />
            </CSSTransition>
        );
    };

    private handlePanelClose = (panel: IPanel) => {
        const { stack } = this.state;
        // only remove this panel if it is at the top and not the only one.
        if (stack[0] !== panel || stack.length <= 1) {
            return;
        }
        this.props.onClose?.(panel);
        if (this.props.stack == null) {
            this.setState(state => ({
                direction: "pop",
                stack: state.stack.slice(1),
            }));
        }
    };

    private handlePanelOpen = (panel: IPanel) => {
        this.props.onOpen?.(panel);
        if (this.props.stack == null) {
            this.setState(state => ({
                direction: "push",
                stack: [panel, ...state.stack],
            }));
        }
    };
}
