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

/**
 * @fileoverview This component is DEPRECATED, and the code is frozen.
 * All changes & bugfixes should be made to PanelStack2 instead.
 */

/* eslint-disable deprecation/deprecation */

import type * as React from "react";

/**
 * An object describing a panel in a `PanelStack`.
 *
 * @deprecated use `Panel<T>` with PanelStack2
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export interface IPanel<P = {}> {
    /**
     * The component type to render for this panel. This must be a reference to
     * the component class or SFC, _not_ a JSX element, so it can be re-created
     * dynamically when needed.
     */
    component: React.ComponentType<P & IPanelProps>;

    /**
     * HTML title to be passed to the <Text> component
     */
    htmlTitle?: string;

    /**
     * The props passed to the component type when it is rendered. The methods
     * in `IPanelProps` will be injected by `PanelStack`.
     */
    props?: P;

    /**
     * The title to be displayed above this panel. It is also used as the text
     * of the back button for any panel opened by this panel.
     */
    title?: React.ReactNode;
}

/**
 * Include this interface in your panel component's props type to access these
 * two functions which are injected by `PanelStack`.
 *
 * ```tsx
 * import { IPanelProps } from "@blueprintjs/core";
 * export class SettingsPanel extends React.Component<IPanelProps & ISettingsPanelProps> {...}
 * ```
 *
 * @deprecated use `PanelActions<T>` with PanelStack2
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
     * Call this method to open a new panel on the top of the stack.
     */
    openPanel<P>(panel: IPanel<P>): void;
}
