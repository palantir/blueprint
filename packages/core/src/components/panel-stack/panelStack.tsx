// Copyright 2018 Palantir Technologies, Inc. All rights reserved.

import classNames from "classnames";
import * as React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import * as Classes from "../../common/classes";
import { IProps } from "../../common/props";
import * as Utils from "../../common/utils";
import { IPanel, IPanelProps } from "./panelProps";
import { PanelView } from "./panelView";

export interface IPanelStackProps extends IProps {
    /**
     * The initial panel to show on mount. This panel cannot be removed from the
     * stack and will appear when the stack is empty.
     */
    initialPanel: IPanel;

    /**
     * Callback invoked when the user presses the back button or a panel invokes
     * the `closePanel()` injected prop method.
     * @param oldPanel The panel that was just removed from the stack.
     */
    onClose?: (oldPanel: IPanel) => void;

    /**
     * Callback invoked when a panel invokes the `openPanel(panel)` injected
     * prop method.
     */
    onOpen?: (newPanel: IPanel) => void;
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
        const [activePanel, previousPanel] = stack;
        return (
            <CSSTransition classNames={Classes.PANEL_STACK} key={stack.length} timeout={400}>
                <PanelView
                    key={stack.length}
                    previousPanel={previousPanel}
                    panel={activePanel}
                    panelProps={this.getPanelProps()}
                />
            </CSSTransition>
        );
    }

    private getPanelProps(): IPanelProps {
        const stackSize = this.state.stack.length;
        return {
            closePanel: () => this.closePanel(stackSize),
            openPanel: this.openPanel,
        };
    }

    private closePanel = (stackSize: number) => {
        if (this.state.stack.length !== stackSize || this.state.stack.length <= 1) {
            return;
        }
        this.setState(state => {
            Utils.safeInvoke(this.props.onClose, state.stack[0]);
            return {
                direction: "pop",
                stack: state.stack.slice(1),
            };
        });
    };

    private openPanel: IPanelProps["openPanel"] = (component, props, options) => {
        const panel: IPanel = {
            ...options,
            component: component as any,
            props: props as any,
        };
        this.setState(state => ({
            direction: "push",
            stack: [panel, ...state.stack],
        }));
        if (this.props.onOpen !== undefined) {
            this.props.onOpen(panel);
        }
    };
}
