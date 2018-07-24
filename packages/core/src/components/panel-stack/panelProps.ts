/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

export interface IPanel<P = {}> extends IPanelOptions {
    /**
     * The component type to render for this panel. This is a reference to the
     * component class or SFC, _not_ a JSX.Element, so it can be re-created
     * dynamically when needed.
     */
    component: React.ComponentType<P & IPanelProps>;

    /**
     * The props passed to the component type when it is rendered. The methods
     * in `IPanelProps` will be injected by `PanelStack`.
     */
    props?: P;
}

/**
 * Include this interface in your panel component's props type to access these
 * two functions which are injected by `PanelStack`:
 *
 * ```tsx
 * import { IPanelProps } from "@blueprintjs/core";
 *
 * export interface IMyProps { ... }
 * export class MyPanel extends React.Component<IMyProps & IPanelProps> {
 *     public render() {
 *         return <button onClick={this.props.closePanel} />;
 *     }
 * }
 * ```
 */
export interface IPanelProps {
    /**
     * Call this method to programatically close the current panel. If there is
     * only one panel on the stack, it cannot be closed and this method will do
     * nothing.
     *
     * Remember that the panel header always contains a "back" button (unless
     * there is only one panel on the stack) that will close the current panel
     * on click.
     */
    closePanel(): void;

    /**
     * Call this method to open a new panel on the top of the stack.
     * @param component The React component of the new panel.
     * @param props The props to be passed to the new panel.
     * @param options Additional options for the new panel.
     */
    openPanel<P>(component: React.ComponentType<P & IPanelProps>, props: P, options: IPanelOptions): void;
}

export interface IPanelOptions {
    /**
     * The title to be displayed above this panel. It is also used as the text
     * of the back button for any panel opened by this panel.
     */
    title?: React.ReactNode;
}
