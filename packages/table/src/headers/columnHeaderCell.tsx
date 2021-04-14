/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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
import React from "react";

import { AbstractPureComponent, Icon, IconName, Popover, Props, Utils as CoreUtils } from "@blueprintjs/core";

import * as Classes from "../common/classes";
import { columnInteractionBarContextTypes, ColumnInteractionBarContextTypes } from "../common/context";
import { LoadableContent } from "../common/loadableContent";
import { CLASSNAME_EXCLUDED_FROM_TEXT_MEASUREMENT } from "../common/utils";
import { HeaderCell, HeaderCellProps } from "./headerCell";

export interface ColumnNameProps {
    /**
     * The name displayed in the header of the column.
     */
    name?: string;

    /**
     * A callback to override the default name rendering behavior. The default
     * behavior is to simply use the `ColumnHeaderCell`s name prop.
     *
     * This render callback can be used, for example, to provide a
     * `EditableName` component for editing column names.
     *
     * If you define this callback, we recommend you also set
     * `<Table enableColumnInteractionBar={true}>` to avoid issues with menus or selection.
     *
     * The callback will also receive the column index if an `index` was originally
     * provided via props.
     */
    nameRenderer?: (name: string, index?: number) => React.ReactElement<Props>;
}

export interface ColumnHeaderCellProps extends HeaderCellProps, ColumnNameProps {
    /**
     * Specifies if the column is reorderable.
     */
    enableColumnReordering?: boolean;

    /**
     * Specifies if the full column is part of a selection.
     */
    isColumnSelected?: boolean;

    /**
     * The icon name or element for the header's menu button.
     *
     * @default "chevron-down"
     */
    menuIcon?: IconName | JSX.Element;
}

export interface ColumnHeaderCellState {
    isActive?: boolean;
}

export function HorizontalCellDivider(): JSX.Element {
    return <div className={Classes.TABLE_HORIZONTAL_CELL_DIVIDER} />;
}

export class ColumnHeaderCell extends AbstractPureComponent<ColumnHeaderCellProps, ColumnHeaderCellState> {
    public static defaultProps: ColumnHeaderCellProps = {
        isActive: false,
        menuIcon: "chevron-down",
    };

    public static contextTypes: React.ValidationMap<ColumnInteractionBarContextTypes> = columnInteractionBarContextTypes;

    /**
     * This method determines if a `MouseEvent` was triggered on a target that
     * should be used as the header click/drag target. This enables users of
     * this component to render fully interactive components in their header
     * cells without worry of selection or resize operations from capturing
     * their mouse events.
     */
    public static isHeaderMouseTarget(target: HTMLElement) {
        return (
            target.classList.contains(Classes.TABLE_HEADER) ||
            target.classList.contains(Classes.TABLE_COLUMN_NAME) ||
            target.classList.contains(Classes.TABLE_INTERACTION_BAR) ||
            target.classList.contains(Classes.TABLE_HEADER_CONTENT)
        );
    }

    public context: ColumnInteractionBarContextTypes;

    public state = {
        isActive: false,
    };

    public render() {
        const {
            // from ColumnHeaderCellProps
            enableColumnReordering,
            isColumnSelected,
            menuIcon,

            // from ColumnNameProps
            name,
            nameRenderer,

            // from HeaderProps
            ...spreadableProps
        } = this.props;

        const classes = classNames(spreadableProps.className, Classes.TABLE_COLUMN_HEADER_CELL, {
            [Classes.TABLE_HAS_INTERACTION_BAR]: this.context.enableColumnInteractionBar,
            [Classes.TABLE_HAS_REORDER_HANDLE]: this.props.reorderHandle != null,
        });

        return (
            <HeaderCell
                isReorderable={this.props.enableColumnReordering}
                isSelected={this.props.isColumnSelected}
                {...spreadableProps}
                className={classes}
            >
                {this.renderName()}
                {this.maybeRenderContent()}
                {this.props.loading ? undefined : this.props.resizeHandle}
            </HeaderCell>
        );
    }

    private renderName() {
        const { index, loading, name, nameRenderer, reorderHandle } = this.props;

        const dropdownMenu = this.maybeRenderDropdownMenu();
        const defaultName = <div className={Classes.TABLE_TRUNCATED_TEXT}>{name}</div>;

        const nameComponent = (
            <LoadableContent loading={loading} variableLength={true}>
                {nameRenderer == null ? defaultName : nameRenderer(name, index)}
            </LoadableContent>
        );

        if (this.context.enableColumnInteractionBar) {
            return (
                <div className={Classes.TABLE_COLUMN_NAME} title={name}>
                    <div className={Classes.TABLE_INTERACTION_BAR}>
                        {reorderHandle}
                        {dropdownMenu}
                    </div>
                    <HorizontalCellDivider />
                    <div className={Classes.TABLE_COLUMN_NAME_TEXT}>{nameComponent}</div>
                </div>
            );
        } else {
            return (
                <div className={Classes.TABLE_COLUMN_NAME} title={name}>
                    {reorderHandle}
                    {dropdownMenu}
                    <div className={Classes.TABLE_COLUMN_NAME_TEXT}>{nameComponent}</div>
                </div>
            );
        }
    }

    private maybeRenderContent() {
        if (this.props.children === null) {
            return undefined;
        }

        return <div className={Classes.TABLE_HEADER_CONTENT}>{this.props.children}</div>;
    }

    private maybeRenderDropdownMenu() {
        const { index, menuIcon, menuRenderer } = this.props;

        if (!CoreUtils.isFunction(menuRenderer)) {
            return undefined;
        }

        const classes = classNames(Classes.TABLE_TH_MENU_CONTAINER, CLASSNAME_EXCLUDED_FROM_TEXT_MEASUREMENT, {
            [Classes.TABLE_TH_MENU_OPEN]: this.state.isActive,
        });

        return (
            <div className={classes}>
                <div className={Classes.TABLE_TH_MENU_CONTAINER_BACKGROUND} />
                <Popover
                    content={menuRenderer(index)}
                    placement="bottom"
                    className={Classes.TABLE_TH_MENU}
                    onOpened={this.handlePopoverOpened}
                    onClosing={this.handlePopoverClosing}
                >
                    <Icon icon={menuIcon} />
                </Popover>
            </div>
        );
    }

    private handlePopoverOpened = () => this.setState({ isActive: true });

    private handlePopoverClosing = () => this.setState({ isActive: false });
}
