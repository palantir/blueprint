/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import * as Classes from "../../common/classes";
import { IProps } from "../../common/props";

export type TabId = string | number;

export interface ITabProps extends IProps {
    /**
     * Content of tab title, rendered in a list above the active panel.
     * Can also be set via the `title` prop.
     */
    children?: React.ReactNode;

    /**
     * Whether the tab is disabled.
     * @default false
     */
    disabled?: boolean;

    /**
     * Unique identifier used to control which tab is selected
     * and to generate ARIA attributes for accessibility.
     */
    id: TabId;

    /**
     * Panel content, rendered by the parent `Tabs` when this tab is active.
     * If omitted, no panel will be rendered for this tab.
     */
    panel?: JSX.Element;

    /**
     * Content of tab title element, rendered in a list above the active panel.
     * Can also be set via React `children`.
     */
    title?: React.ReactNode;
}

export class Tab extends React.PureComponent<ITabProps, {}> {
    public static defaultProps: ITabProps = {
        disabled: false,
        id: undefined,
    };

    public static displayName = "Blueprint2.Tab";

    // this component is never rendered directly; see Tabs#renderTabPanel()
    /* istanbul ignore next */
    public render() {
        const { className, panel } = this.props;
        return (
            <div className={classNames(Classes.TAB_PANEL, className)} role="tablist">
                {panel}
            </div>
        );
    }
}
