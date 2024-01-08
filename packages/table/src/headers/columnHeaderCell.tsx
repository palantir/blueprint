/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
 * * Licensed under the Apache License, Version 2.0 (the "License");
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
import * as React from "react";

import {
    AbstractPureComponent,
    Utils as CoreUtils,
    DISPLAYNAME_PREFIX,
    Icon,
    type IconName,
    type OverlayLifecycleProps,
    Popover,
    type PopoverProps,
    type Props,
} from "@blueprintjs/core";

import * as Classes from "../common/classes";
import { LoadableContent } from "../common/loadableContent";
import { CLASSNAME_EXCLUDED_FROM_TEXT_MEASUREMENT } from "../common/utils";

import { HeaderCell, type HeaderCellProps } from "./headerCell";
import { HorizontalCellDivider } from "./horizontalCellDivider";

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
     * If `true`, adds an interaction bar on top of all column header cells, and
     * moves interaction triggers into it.
     *
     * @default false
     */
    enableColumnInteractionBar?: boolean;

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
    menuIcon?: IconName | React.JSX.Element;

    /**
     * Optional props to forward to the dropdown menu popover.
     * This has no effect if `menuRenderer` is undefined.
     */
    menuPopoverProps?: Omit<PopoverProps, "content" | keyof OverlayLifecycleProps>;

    /**
     * If `true`, clicks on the header menu target element will cause the column's
     * cells to be selected.
     *
     * @default true
     */
    selectCellsOnMenuClick?: boolean;
}

export interface ColumnHeaderCellState {
    isActive?: boolean;
}

/**
 * Column header cell component.
 *
 * @see https://blueprintjs.com/docs/#table/api.columnheadercell
 */
export class ColumnHeaderCell extends AbstractPureComponent<ColumnHeaderCellProps, ColumnHeaderCellState> {
    public static displayName = `${DISPLAYNAME_PREFIX}.ColumnHeaderCell`;

    public static defaultProps: ColumnHeaderCellProps = {
        enableColumnInteractionBar: false,
        isActive: false,
        menuIcon: "chevron-down",
        selectCellsOnMenuClick: true,
    };

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

    public state = {
        isActive: false,
    };

    public render() {
        const {
            enableColumnInteractionBar,
            enableColumnReordering,
            isColumnSelected,
            menuIcon,
            name,
            nameRenderer,
            ...spreadableProps
        } = this.props;

        const classes = classNames(spreadableProps.className, Classes.TABLE_COLUMN_HEADER_CELL, {
            [Classes.TABLE_HAS_INTERACTION_BAR]: enableColumnInteractionBar,
            [Classes.TABLE_HAS_REORDER_HANDLE]: this.props.reorderHandle != null,
        });

        return (
            <HeaderCell
                isReorderable={enableColumnReordering}
                isSelected={isColumnSelected}
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
        const { enableColumnInteractionBar, index, loading, name, nameRenderer, reorderHandle } = this.props;

        const dropdownMenu = this.maybeRenderDropdownMenu();
        const defaultName = <div className={Classes.TABLE_TRUNCATED_TEXT}>{name}</div>;

        const nameComponent = (
            <LoadableContent loading={loading ?? false} variableLength={true}>
                {nameRenderer?.(name!, index) ?? defaultName}
            </LoadableContent>
        );

        if (enableColumnInteractionBar) {
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
        const { index, menuIcon, menuPopoverProps, menuRenderer, selectCellsOnMenuClick } = this.props;

        if (!CoreUtils.isFunction(menuRenderer)) {
            return undefined;
        }

        const classes = classNames(Classes.TABLE_TH_MENU_CONTAINER, CLASSNAME_EXCLUDED_FROM_TEXT_MEASUREMENT, {
            [Classes.TABLE_TH_MENU_OPEN]: this.state.isActive,
            [Classes.TABLE_TH_MENU_SELECT_CELLS]: selectCellsOnMenuClick,
        });

        return (
            <div className={classes}>
                <div className={Classes.TABLE_TH_MENU_CONTAINER_BACKGROUND} />
                <Popover
                    className={classNames(Classes.TABLE_TH_MENU, menuPopoverProps?.className)}
                    content={menuRenderer(index)}
                    onClosing={this.handlePopoverClosing}
                    onOpened={this.handlePopoverOpened}
                    placement="bottom"
                    rootBoundary="document"
                    {...menuPopoverProps}
                >
                    <Icon icon={menuIcon} />
                </Popover>
            </div>
        );
    }

    private handlePopoverOpened = () => this.setState({ isActive: true });

    private handlePopoverClosing = () => this.setState({ isActive: false });
}
