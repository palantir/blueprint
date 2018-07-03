// Copyright 2018 Palantir Technologies, Inc. All rights reserved.

import classNames from "classnames";
import * as React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { PanelView } from "./panelView";
import * as Classes from "../../common/classes";

/** Add this interface to your panel components props type. */
export interface IPanelProps {
    /**
     * Call this method to close the current panel. It should be used sparingly as there is always a back button displayed that will call
     * this method. If there is only one panel on the stack, it cannot be closed and this method will do nothing.
     */
    closePanel(): void;
    /**
     * Call this method to open a new panel on the top of the stack.
     * @param component The React component of the new panel.
     * @param props The props to be passed to the new panel.
     * @param options Additional options for the new panel.
     */
    openPanel<P>(component: React.ComponentClass<P & IPanelProps>, props: P, options: IPanelOptions): void;
}

export interface IPanel<P = {}> extends IPanelOptions {
    /** The component being rendered by this panel. */
    component: React.ComponentClass<P & IPanelProps>;
    /** The props passed directly to the component prop. */
    props?: P;
}

export interface IPanelOptions {
    /** The title to be displayed above this panel. It is also used as the back button for any panel opened by this panel. */
    title: string;
}

export interface IPanelStackProps {
    /** Additional class names to add to the container element. */
    className?: string;
    /** The panel to show when initially rendering the component */
    initialPanel: IPanel;
    /**
     * Callback invoked when the user presses the back button or a panel wants to close the visible panel.
     * @param oldPanel The panel that was just removed from the stack.
     */
    onClose?(oldPanel: IPanel): void;
    /**
     * Callback invoked when a panel wants to open a new panel.
     * @param newPanel The panel that was just added to the stack.
     */
    onOpen?(newPanel: IPanel): void;
}

export interface IPanelStackState {
    /** Whether the stack is currently animating the push or pop of a panel. */
    direction: "push" | "pop";
    /** The current stack of panels. The first panel in the stack will be displayed. */
    stack: IPanel[];
}

export class PanelStack extends React.PureComponent<IPanelStackProps, IPanelStackState> {
    public constructor(props: IPanelStackProps, context?: any) {
        super(props, context);
        this.state = {
            direction: "push",
            stack: [props.initialPanel],
        };
    }

    public render() {
        const className = classNames(Classes.PANELSTACK, this.props.className);
        return (
            <TransitionGroup
                className={className}
                component="div"
            >
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
            <CSSTransition
                className={this.state.direction}
                classNames={Classes.PANELSTACK_TRANSITION}
                key={stack.length}
                timeout={{
                    enter: 400,
                    exit: 400,
                }}
            >
                <PanelView
                    className={this.props.className}
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
        this.setState(state => {
            const allowed =
                // Make sure this function only works for the panel it was issued to,
                // otherwise rapidly clicking the back link will close multiple panels.
                state.stack.length === stackSize &&
                // Prevent the last panel from being closed.
                state.stack.length > 1;
            if (allowed && this.props.onClose !== undefined) {
                this.props.onClose(state.stack[0]);
            }
            return {
                direction: allowed ? "pop" : state.direction,
                stack: allowed ? state.stack.slice(1) : state.stack,
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
