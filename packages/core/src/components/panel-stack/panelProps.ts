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
 * two functions which are injected by `PanelStack`.
 *
 * ```tsx
 * import { IPanelProps } from "@blueprintjs/core";
 * export class SettingsPanel extends React.Component<IPanelProps & ISettingsPanelProps> {...}
 * ```
 */
export interface IPanelProps {
    /**
     * Call this method to programatically close this panel. If this is the only
     * panel on the stack then this method will do nothing.
     *
     * Remember that the panel header always contains a "back" button that
     * closes this panel on click (unless there is only one panel on the stack).
     */
    closePanel(): void;

    /**
     * Call this method to open a new panel on the top of the stack. Together,
     * `component` and `props` are used to render the panel element when needed
     * (and `IPanelProps` is injected). The `title` option is required and will
     * appear in the panel header.
     */
    openPanel<P>(component: React.ComponentType<P & IPanelProps>, props: P, options: IPanelOptions): void;
}

/** Options for opening a new panel. */
export interface IPanelOptions {
    /**
     * The title to be displayed above this panel. It is also used as the text
     * of the back button for any panel opened by this panel.
     */
    title?: React.ReactNode;
}
