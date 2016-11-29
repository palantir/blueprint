/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import { Classes, ContextMenuTarget, IProps, Popover, Position } from "@blueprintjs/core";

import { ILoadableCell, renderLoadingSkeleton } from "../common/loading";
import { ResizeHandle } from "../interactions/resizeHandle";

export interface IColumnHeaderRenderer {
    (columnIndex: number): React.ReactElement<IColumnHeaderCellProps>;
}

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
     * `useInteractionBar` to true, to avoid issues with menus or selection.
     */
    renderName?: (name: string) => React.ReactElement<IProps>;

    /**
     * If true, adds an interaction bar on top of the column header cell and
     * moves the menu and selection interactions to it.
     *
     * This allows you to override the rendering of column name without worry
     * of clobbering the menu or other interactions.
     *
     * @default false
     */
    useInteractionBar?: boolean;
}

export interface IColumnHeaderCellProps extends IColumnNameProps, ILoadableCell, IProps {
    /**
     * If true, will apply the active class to the header to indicate it is
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
     * CSS styles for the top level element
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

const HEADER_CLASSNAME = "bp-table-header";
const HEADER_COLUMN_CLASSNAME = "bp-table-column-header";
const HEADER_COLUMN_NAME_CLASSNAME = "bp-table-column-name";
const HEADER_CONTENT_CLASSNAME = "bp-table-header-content";
const HEADER_COLUMN_NAME_TEXT_CLASSNAME = "bp-table-column-name-text";
const HEADER_INTERACTION_BAR_CLASSNAME = "bp-table-interaction-bar";

export function HorizontalCellDivider(): JSX.Element {
    return <div className="bp-table-horizontal-cell-divider" />;
}

@ContextMenuTarget
export class ColumnHeaderCell extends React.Component<IColumnHeaderCellProps, IColumnHeaderState> {
    public static defaultProps: IColumnHeaderCellProps = {
        isActive: false,
        menuIconName: "more",
        useInteractionBar: false,
    };

    /**
     * This method determines if a MouseEvent was triggered on a target that
     * should be used as the header click/drag target. This enables users of
     * this component to render full interactive components in their header
     * cells without worry of selection or resize operations from capturing
     * their mouse events.
     */
    public static isHeaderMouseTarget(target: HTMLElement) {
        return target.classList.contains(HEADER_CLASSNAME)
            || target.classList.contains(HEADER_COLUMN_NAME_CLASSNAME)
            || target.classList.contains(HEADER_INTERACTION_BAR_CLASSNAME)
            || target.classList.contains(HEADER_CONTENT_CLASSNAME);
    }

    public state = {
        isActive: false,
    };

    public render() {
        const { className, isActive, isColumnSelected, isLoading, resizeHandle, style } = this.props;

        const classes = classNames(HEADER_CLASSNAME, HEADER_COLUMN_CLASSNAME, {
            "bp-table-column-header-loading": isLoading,
            "bp-table-header-active": isActive || this.state.isActive,
            "bp-table-header-selected": isColumnSelected,
        }, className);

        if (isLoading) {
            return (
                <div className={classes} style={style}>
                    {renderLoadingSkeleton(HEADER_COLUMN_CLASSNAME)}
                </div>
            );
        } else {
            return (
                <div className={classes} style={style}>
                    {this.renderName()}
                    {this.maybeRenderContent()}
                    {resizeHandle}
                </div>
            );
        }
    }

    public renderContextMenu(_event: React.MouseEvent<HTMLElement>) {
        return this.props.menu;
    }

    private renderName() {
        const { useInteractionBar, name, renderName } = this.props;
        const dropdownMenu = this.maybeRenderDropdownMenu();
        const defaultName = (<div className="bp-table-truncated-text">{name}</div>);
        const nameComponent = (renderName == null) ? defaultName : renderName(name);
        if (useInteractionBar) {
            return (
                <div className={HEADER_COLUMN_NAME_CLASSNAME} title={name}>
                    <div className={HEADER_INTERACTION_BAR_CLASSNAME}>{dropdownMenu}</div>
                    <HorizontalCellDivider />
                    <div className={HEADER_COLUMN_NAME_TEXT_CLASSNAME}>{nameComponent}</div>
                </div>
            );
        } else {
            return (
                <div className={HEADER_COLUMN_NAME_CLASSNAME} title={name}>
                    {dropdownMenu}
                    <div className={HEADER_COLUMN_NAME_TEXT_CLASSNAME}>{nameComponent}</div>
                </div>
            );
        }
    }

    private maybeRenderContent() {
        if (this.props.children === null) {
            return undefined;
        }

        return (
            <div className={HEADER_CONTENT_CLASSNAME}>
                {this.props.children}
            </div>
        );
    }

    private maybeRenderDropdownMenu() {
        const { menu, menuIconName } = this.props;

        if (menu == null) {
            return undefined;
        }

        const popoverTargetClasses = classNames("pt-icon-standard", Classes.iconClass(menuIconName));
        const constraints = [{
            attachment: "together",
            pin: true,
            to: "window",
        }];

        return (
            <Popover
                constraints={constraints}
                content={menu}
                position={Position.BOTTOM}
                className="bp-table-th-menu"
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
