/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import { AbstractComponent, Icon, IconName, IProps, Popover, Position, Utils as CoreUtils } from "@blueprintjs/core";

import * as Classes from "../common/classes";
import * as Errors from "../common/errors";
import { LoadableContent } from "../common/loadableContent";
import { HeaderCell, IHeaderCellProps } from "./headerCell";

export interface IColumnNameProps {
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
     * `useInteractionBar` to `true`, to avoid issues with menus or selection.
     *
     * The callback will also receive the column index if an `index` was originally
     * provided via props.
     */
    renderName?: (name: string, index?: number) => React.ReactElement<IProps>;

    /**
     * If `true`, adds an interaction bar on top of the column header cell and
     * moves the menu and selection interactions to it.
     *
     * This allows you to override the rendering of column name without worry of
     * clobbering the menu or other interactions.
     *
     * @default false
     * @deprecated since @blueprintjs/table v1.27.0; pass this prop to `Table`
     * instead.
     */
    useInteractionBar?: boolean;
}

export interface IColumnHeaderCellProps extends IHeaderCellProps, IColumnNameProps {
    /**
     * Specifies if the column is reorderable.
     */
    isColumnReorderable?: boolean;

    /**
     * Specifies if the full column is part of a selection.
     */
    isColumnSelected?: boolean;

    /**
     * The icon name for the header's menu button.
     * @default "chevron-down"
     */
    menuIconName?: IconName;
}

export interface IColumnHeaderCellState {
    isActive?: boolean;
}

export function HorizontalCellDivider(): JSX.Element {
    return <div className={Classes.TABLE_HORIZONTAL_CELL_DIVIDER} />;
}

export class ColumnHeaderCell extends AbstractComponent<IColumnHeaderCellProps, IColumnHeaderCellState> {
    public static defaultProps: IColumnHeaderCellProps = {
        isActive: false,
        menuIconName: "chevron-down",
        useInteractionBar: false,
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
            // from IColumnHeaderCellProps
            isColumnReorderable,
            isColumnSelected,
            menuIconName,

            // from IColumnNameProps
            name,
            renderName,
            useInteractionBar,

            // from IHeaderProps
            ...spreadableProps,
        } = this.props;

        const classes = classNames(spreadableProps.className, Classes.TABLE_COLUMN_HEADER_CELL, {
            [Classes.TABLE_HAS_INTERACTION_BAR]: useInteractionBar,
            [Classes.TABLE_HAS_REORDER_HANDLE]: this.props.reorderHandle != null,
        });

        return (
            <HeaderCell
                isReorderable={this.props.isColumnReorderable}
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

    protected validateProps(nextProps: IColumnHeaderCellProps) {
        if (nextProps.menu != null) {
            // throw this warning from the publicly exported, higher-order *HeaderCell components
            // rather than HeaderCell, so consumers know exactly which components are receiving the
            // offending prop
            console.warn(Errors.COLUMN_HEADER_CELL_MENU_DEPRECATED);
        }
    }

    private renderName() {
        const { index, loading, name, renderName, reorderHandle, useInteractionBar } = this.props;

        const dropdownMenu = this.maybeRenderDropdownMenu();
        const defaultName = <div className={Classes.TABLE_TRUNCATED_TEXT}>{name}</div>;

        const nameComponent = (
            <LoadableContent loading={loading} variableLength={true}>
                {renderName == null ? defaultName : renderName(name, index)}
            </LoadableContent>
        );

        if (useInteractionBar) {
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
        const { index, menu, menuIconName, renderMenu } = this.props;

        if (renderMenu == null && menu == null) {
            return undefined;
        }

        const constraints = [
            {
                attachment: "together",
                pin: true,
                to: "window",
            },
        ];
        const classes = classNames(Classes.TABLE_TH_MENU_CONTAINER, {
            [Classes.TABLE_TH_MENU_OPEN]: this.state.isActive,
        });

        // prefer renderMenu if it's defined
        const content = CoreUtils.isFunction(renderMenu) ? renderMenu(index) : menu;

        return (
            <div className={classes}>
                <div className={Classes.TABLE_TH_MENU_CONTAINER_BACKGROUND} />
                <Popover
                    tetherOptions={{ constraints }}
                    content={content}
                    position={Position.BOTTOM}
                    className={Classes.TABLE_TH_MENU}
                    popoverDidOpen={this.handlePopoverDidOpen}
                    popoverWillClose={this.handlePopoverWillClose}
                    useSmartArrowPositioning={true}
                >
                    <Icon iconName={menuIconName} />
                </Popover>
            </div>
        );
    }

    private handlePopoverDidOpen = () => {
        this.setState({ isActive: true });
    };

    private handlePopoverWillClose = () => {
        this.setState({ isActive: false });
    };
}
