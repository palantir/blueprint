/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import * as Classes from "../../common/classes";
import { IProps } from "../../common/props";

export type TabId = string | number;

export interface ITab2Props extends IProps {
    /**
     * Whether the tab is disabled.
     * @default false
     */
    disabled?: boolean;

    /**
     * Unique identifier used to control which tab is selected.
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
    title?: string | JSX.Element;
}

@PureRender
export class Tab2 extends React.Component<ITab2Props, {}> {
    public static defaultProps: ITab2Props = {
        disabled: false,
        id: undefined,
    };

    public displayName = "Blueprint.Tab2";

    public render() {
        const { className, panel } = this.props;
        return <div className={classNames(Classes.TAB_PANEL, className)} role="tablist">{panel}</div>;
    }
}

export const Tab2Factory = React.createFactory(Tab2);
