/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

export interface ITabProps extends IProps {
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
     * Content of tab title element,
     * rendered in a list above the active panel
     */
    title: string | JSX.Element;
}

@PureRender
export class Tab extends React.Component<ITabProps, {}> {
    public static defaultProps: ITabProps = {
        disabled: false,
        id: undefined,
        title: "Untitled",
    };

    public displayName = "Blueprint.Tab";

    public render() {
        const { className, children, id } = this.props;
        return (
            <div
                className={classNames(Classes.TAB_PANEL, className)}
                data-tab-id={id}
                role="tablist"
            >
                {children}
            </div>
        );
    }
}

export const TabFactory = React.createFactory(Tab);
