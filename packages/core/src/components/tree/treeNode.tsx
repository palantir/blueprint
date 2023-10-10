/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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
import * as React from "react";

import { ChevronRight } from "@blueprintjs/icons";

import { Classes, DISPLAYNAME_PREFIX } from "../../common";
import { Collapse } from "../collapse/collapse";
import { Icon } from "../icon/icon";
import type { TreeEventHandler, TreeNodeInfo } from "./treeTypes";

// eslint-disable-next-line @typescript-eslint/ban-types
export interface TreeNodeProps<T = {}> extends TreeNodeInfo<T> {
    children?: React.ReactNode;
    contentRef?: (node: TreeNodeInfo<T>, element: HTMLDivElement | null) => void;
    depth: number;
    key?: string | number;
    onClick?: TreeEventHandler<T>;
    onCollapse?: TreeEventHandler<T>;
    onContextMenu?: TreeEventHandler<T>;
    onDoubleClick?: TreeEventHandler<T>;
    onExpand?: TreeEventHandler<T>;
    onMouseEnter?: TreeEventHandler<T>;
    onMouseLeave?: TreeEventHandler<T>;
    path: number[];
}

/**
 * Tree node component.
 *
 * @see https://blueprintjs.com/docs/#core/components/tree.tree-node
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export class TreeNode<T = {}> extends React.Component<TreeNodeProps<T>> {
    public static displayName = `${DISPLAYNAME_PREFIX}.TreeNode`;

    /** @deprecated no longer necessary now that the TypeScript parser supports type arguments on JSX element tags */
    public static ofType<U>() {
        return TreeNode as new (props: TreeNodeProps<U>) => TreeNode<U>;
    }

    public render() {
        const { children, className, disabled, icon, isExpanded, isSelected, label } = this.props;
        const classes = classNames(
            Classes.TREE_NODE,
            {
                [Classes.DISABLED]: disabled,
                [Classes.TREE_NODE_SELECTED]: isSelected,
                [Classes.TREE_NODE_EXPANDED]: isExpanded,
            },
            className,
        );

        const contentClasses = classNames(
            Classes.TREE_NODE_CONTENT,
            `${Classes.TREE_NODE_CONTENT}-${this.props.depth}`,
        );

        const eventHandlers =
            disabled === true
                ? {}
                : {
                      onClick: this.handleClick,
                      onContextMenu: this.handleContextMenu,
                      onDoubleClick: this.handleDoubleClick,
                      onMouseEnter: this.handleMouseEnter,
                      onMouseLeave: this.handleMouseLeave,
                  };

        return (
            <li className={classes}>
                <div className={contentClasses} ref={this.handleContentRef} {...eventHandlers}>
                    {this.maybeRenderCaret()}
                    <Icon className={Classes.TREE_NODE_ICON} icon={icon} aria-hidden={true} tabIndex={-1} />
                    <span className={Classes.TREE_NODE_LABEL}>{label}</span>
                    {this.maybeRenderSecondaryLabel()}
                </div>
                <Collapse isOpen={isExpanded}>{children}</Collapse>
            </li>
        );
    }

    private maybeRenderCaret() {
        const { children, isExpanded, disabled, hasCaret = React.Children.count(children) > 0 } = this.props;
        if (hasCaret) {
            const caretClasses = classNames(
                Classes.TREE_NODE_CARET,
                isExpanded ? Classes.TREE_NODE_CARET_OPEN : Classes.TREE_NODE_CARET_CLOSED,
            );
            return (
                <ChevronRight
                    title={isExpanded ? "Collapse group" : "Expand group"}
                    className={caretClasses}
                    onClick={disabled === true ? undefined : this.handleCaretClick}
                />
            );
        }
        return <span className={Classes.TREE_NODE_CARET_NONE} />;
    }

    private maybeRenderSecondaryLabel() {
        if (this.props.secondaryLabel != null) {
            return <span className={Classes.TREE_NODE_SECONDARY_LABEL}>{this.props.secondaryLabel}</span>;
        } else {
            return undefined;
        }
    }

    private handleCaretClick = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        const { isExpanded, onCollapse, onExpand } = this.props;
        (isExpanded ? onCollapse : onExpand)?.(this.props, this.props.path, e);
    };

    private handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        this.props.onClick?.(this.props, this.props.path, e);
    };

    private handleContentRef = (element: HTMLDivElement | null) => {
        this.props.contentRef?.(this.props, element);
    };

    private handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        this.props.onContextMenu?.(this.props, this.props.path, e);
    };

    private handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        this.props.onDoubleClick?.(this.props, this.props.path, e);
    };

    private handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        this.props.onMouseEnter?.(this.props, this.props.path, e);
    };

    private handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        this.props.onMouseLeave?.(this.props, this.props.path, e);
    };
}
