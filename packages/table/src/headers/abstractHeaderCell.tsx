
import * as classNames from "classnames";
import * as React from "react";

import { Classes as CoreClasses, ContextMenuTarget, IProps } from "@blueprintjs/core";
import * as Classes from "../common/classes";
import { Utils } from "../common/utils";
import { ResizeHandle } from "../interactions/resizeHandle";

export interface IHeaderCellProps extends IProps {
    /**
     * If `true`, will apply the active class to the header to indicate it is
     * part of an external operation.
     */
    isActive?: boolean;

    /**
     * Specifies if the row/column is reorderable.
     */
    isReorderable?: boolean;

    /**
     * Specifies whether the full row/column is part of a selection.
     */
    isSelected?: boolean;

    /**
     * The name displayed in the header of the row/column.
     */
    name?: string;

    /**
     * If `true`, the row `name` will be replaced with a fixed-height skeleton and the `resizeHandle`
     * will not be rendered. If passing in additional children to this component, you will also want
     * to conditionally apply the `.pt-skeleton` class where appropriate.
     * @default false
     */
    loading?: boolean;

    /**
     * An element, like a `<Menu>`, this is displayed by right-clicking
     * anywhere in the header.
     */
    menu?: JSX.Element;

    /**
     * A `ResizeHandle` React component that allows users to drag-resize the
     * header.
     */
    resizeHandle?: ResizeHandle;

    /**
     * CSS styles for the top level element.
     */
    style?: React.CSSProperties;
}

export interface IHeaderCellState {
    isActive: boolean;
}

@ContextMenuTarget
export abstract class AbstractHeaderCell extends React.Component<IHeaderCellProps, IHeaderCellState> {
    public static defaultProps: IHeaderCellProps = {
        isActive: false,
    };

    public state = {
        isActive: false,
    };

    public abstract UPDATE_PROP_KEYS: string[];

    public shouldComponentUpdate(nextProps: IHeaderCellProps) {
        return !Utils.shallowCompareKeys(this.props, nextProps, this.UPDATE_PROP_KEYS)
            || !Utils.deepCompareKeys(this.props.style, nextProps.style);
    }

    public renderContextMenu(_event: React.MouseEvent<HTMLElement>) {
        return this.props.menu;
    }

    protected getCssClasses() {
        return classNames(Classes.TABLE_HEADER, {
            [Classes.TABLE_HEADER_ACTIVE]: this.props.isActive || this.state.isActive,
            [Classes.TABLE_HEADER_REORDERABLE]: this.props.isReorderable,
            [Classes.TABLE_HEADER_SELECTED]: this.props.isSelected,
            [CoreClasses.LOADING]: this.props.loading,
        }, this.props.className);
    }

}
