/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import { Classes as CoreClasses, IProps, Popover, Position } from "@blueprintjs/core";

import * as Classes from "../common/classes";
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
     */
    renderName?: (name: string) => React.ReactElement<IProps>;

    /**
     * If `true`, adds an interaction bar on top of the column header cell and
     * moves the menu and selection interactions to it.
     *
     * This allows you to override the rendering of column name without worry
     * of clobbering the menu or other interactions.
     *
     * @default false
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
     * @default 'chevron-down'
     */
    menuIconName?: string;
}

export function HorizontalCellDivider(): JSX.Element {
    return <div className={Classes.TABLE_HORIZONTAL_CELL_DIVIDER}/>;
}

export class ColumnHeaderCell extends React.Component<IColumnHeaderCellProps, {}> {
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
        return target.classList.contains(Classes.TABLE_HEADER)
            || target.classList.contains(Classes.TABLE_COLUMN_NAME)
            || target.classList.contains(Classes.TABLE_INTERACTION_BAR)
            || target.classList.contains(Classes.TABLE_HEADER_CONTENT);
    }

    private static SHALLOWLY_COMPARABLE_PROP_KEYS = [
        "children",
        "className",
        "name",
        "renderName",
        "useInteractionBar",
        "isActive",
        "isColumnReorderable",
        "isColumnSelected",
        "loading",
        "menu",
        "menuIconName",
        "resizeHandle",
    ];

    public render() {
        const {
            // IColumnHeaderCellProps
            isColumnReorderable,
            isColumnSelected,
            menuIconName,

            // IColumnNameProps
            name,
            renderName,
            useInteractionBar,

            // from IHeaderProps
            ...spreadableProps,
        } = this.props;

        return (
            <HeaderCell
                isReorderable={this.props.isColumnReorderable}
                isSelected={this.props.isColumnSelected}
                shallowlyComparablePropKeys={ColumnHeaderCell.SHALLOWLY_COMPARABLE_PROP_KEYS}
                {...spreadableProps}
            >
                {this.renderName()}
                {this.maybeRenderContent()}
                {this.props.loading ? undefined : this.props.resizeHandle}
            </HeaderCell>
        );
    }

    private renderName() {
        const { loading, name, renderName, useInteractionBar } = this.props;
        const dropdownMenu = this.maybeRenderDropdownMenu();
        const defaultName = <div className={Classes.TABLE_TRUNCATED_TEXT}>{name}</div>;
        const nameComponent = (
            <LoadableContent loading={loading} variableLength={true}>
                {renderName == null ? defaultName : renderName(name)}
            </LoadableContent>
        );
        if (useInteractionBar) {
            return (
                <div className={Classes.TABLE_COLUMN_NAME} title={name}>
                    <div className={Classes.TABLE_INTERACTION_BAR}>{dropdownMenu}</div>
                    <HorizontalCellDivider />
                    <div className={Classes.TABLE_COLUMN_NAME_TEXT}>{nameComponent}</div>
                </div>
            );
        } else {
            return (
                <div className={Classes.TABLE_COLUMN_NAME} title={name}>
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

        return (
            <div className={Classes.TABLE_HEADER_CONTENT}>
                {this.props.children}
            </div>
        );
    }

    private maybeRenderDropdownMenu() {
        const { menu, menuIconName } = this.props;

        if (menu == null) {
            return undefined;
        }

        const popoverTargetClasses = classNames(
            CoreClasses.ICON_STANDARD,
            CoreClasses.iconClass(menuIconName),
        );

        const constraints = [{
            attachment: "together",
            pin: true,
            to: "window",
        }];

        return (
            <div className={Classes.TABLE_TH_MENU_CONTAINER}>
                <div className={Classes.TABLE_TH_MENU_CONTAINER_BACKGROUND} />
                <Popover
                    tetherOptions={{ constraints }}
                    content={menu}
                    position={Position.BOTTOM}
                    className={Classes.TABLE_TH_MENU}
                    popoverDidOpen={this.getPopoverStateChangeHandler(true)}
                    popoverWillClose={this.getPopoverStateChangeHandler(false)}
                    useSmartArrowPositioning={true}
                >
                    <span className={popoverTargetClasses}/>
                </Popover>
            </div>
        );
    }

    private getPopoverStateChangeHandler = (isActive: boolean) => () => {
        this.setState({ isActive });
    }
}
