/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import { Classes as CoreClasses, ContextMenuTarget, IProps, Popover, Position } from "@blueprintjs/core";

import * as Classes from "../common/classes";
import { LoadableContent } from "../common/loadableContent";
import { ResizeHandle } from "../interactions/resizeHandle";

export type IColumnHeaderRenderer = (columnIndex: number) => React.ReactElement<IColumnHeaderCellProps>;

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

export interface IColumnHeaderCellProps extends IColumnNameProps, IProps {
    /**
     * If `true`, will apply the active class to the header to indicate it is
     * part of an external operation.
     *
     * @default false
     */
    isActive?: boolean;

    /**
     * Specifies if the full column is part of a selection.
     */
    isColumnSelected?: boolean;

    /**
     * If `true`, the column `name` will be replaced with a fixed-height skeleton and the
     * `resizeHandle` will not be rendered. If passing in additional children to this component, you
     * will also want to conditionally apply the `pt-skeleton` class where appropriate.
     * @default false
     */
    loading?: boolean;

    /**
     * An element, like a `<Menu>`, that is displayed by clicking the button
     * to the right of the header name, or by right-clicking anywhere in the
     * header.
     */
    menu?: JSX.Element;

    /**
     * The icon name for the header's menu button.
     * @default 'more'
     */
    menuIconName?: string;

    /**
     * CSS styles for the top level element.
     */
    style?: React.CSSProperties;

    /**
     * A `ResizeHandle` React component that allows users to drag-resize the
     * header. If you are wrapping your `ColumnHeaderCell` in your own
     * component, you'll need to pass this through for resizing to work.
     */
    resizeHandle?: ResizeHandle;
}

export interface IColumnHeaderState {
    isActive: boolean;
}

export function HorizontalCellDivider(): JSX.Element {
    return <div className={Classes.TABLE_HORIZONTAL_CELL_DIVIDER}/>;
}

@ContextMenuTarget
@PureRender
export class ColumnHeaderCell extends React.Component<IColumnHeaderCellProps, IColumnHeaderState> {
    public static defaultProps: IColumnHeaderCellProps = {
        isActive: false,
        menuIconName: "more",
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

    public state = {
        isActive: false,
    };

    public render() {
        const { className, isActive, isColumnSelected, loading, resizeHandle, style } = this.props;
        const classes = classNames(Classes.TABLE_HEADER, {
            [Classes.TABLE_HEADER_ACTIVE]: isActive || this.state.isActive,
            [Classes.TABLE_HEADER_SELECTED]: isColumnSelected,
            [CoreClasses.LOADING]: loading,
        }, className);

        return (
            <div className={classes} style={style}>
                {this.renderName()}
                {this.maybeRenderContent()}
                {loading ? undefined : resizeHandle}
            </div>
        );
    }

    public renderContextMenu(_event: React.MouseEvent<HTMLElement>) {
        return this.props.menu;
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
        );
    }

    private getPopoverStateChangeHandler = (isActive: boolean) => () => {
        this.setState({ isActive });
    }
}
