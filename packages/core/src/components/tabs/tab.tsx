/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import * as Classes from "../../common/classes";
import { IProps } from "../../common/props";

export interface ITabProps extends IProps {
    /**
     * Element ID.
     * @internal
     */
    id?: string;

    /**
     * Whether the tab is disabled.
     * @default false
     */
    isDisabled?: boolean;

    /**
     * Whether the tab is currently selected.
     * @internal
     */
    isSelected?: boolean;

    /**
     * The ID of the tab panel which this tab corresponds to.
     * @internal
     */
    panelId?: string;
}

@PureRender
export class Tab extends React.Component<ITabProps, {}> {
    public static defaultProps: ITabProps = {
        isDisabled: false,
        isSelected: false,
    };

    public displayName = "Blueprint.Tab";

    public render() {
        return (
            <li
                aria-controls={this.props.panelId}
                aria-disabled={this.props.isDisabled}
                aria-expanded={this.props.isSelected}
                aria-selected={this.props.isSelected}
                className={classNames(Classes.TAB, this.props.className)}
                id={this.props.id}
                role="tab"
                selected={this.props.isSelected ? true : null}
                tabIndex={this.props.isDisabled ? null : 0}
            >
                {this.props.children}
            </li>
        );
    }
}

export let TabFactory = React.createFactory(Tab);
