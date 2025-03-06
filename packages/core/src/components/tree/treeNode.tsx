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

import type {
    TreeKeyboardEventHandler,
    TreeKeyboardOrMouseEventHandler,
    TreeMouseEventHandler,
    TreeNodeInfo,
} from "./treeTypes";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TreeNodeProps<T = {}> extends TreeNodeInfo<T> {
    children?: React.ReactNode;
    contentRef?: (node: TreeNodeInfo<T>, element: HTMLDivElement | null) => void;
    depth: number;
    key?: string | number;
    onClick?: TreeMouseEventHandler<T>;
    onCollapse?: TreeKeyboardOrMouseEventHandler<T>;
    onContextMenu?: TreeMouseEventHandler<T>;
    onDoubleClick?: TreeMouseEventHandler<T>;
    onExpand?: TreeKeyboardOrMouseEventHandler<T>;
    onKeyDown?: TreeKeyboardEventHandler<T>;
    onMouseEnter?: TreeMouseEventHandler<T>;
    onMouseLeave?: TreeMouseEventHandler<T>;
    path: number[];
}

/**
 * Tree node component.
 *
 * Follows aria tree example for role structure and keypress actions: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/examples/treeview-1a/
 *
 * @see https://blueprintjs.com/docs/#core/components/tree.tree-node
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
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

        const hasChildren = this.hasChildren();

        return (
            <li
                className={classes}
                role="treeitem"
                aria-expanded={hasChildren ? Boolean(isExpanded) : undefined}
                aria-selected={Boolean(isSelected)}
                // want onKeyDown on the `treeitem` node, because this is what gets focused on via keyboard
                onKeyDown={disabled ? undefined : this.handleKeyDown}
            >
                <div className={contentClasses} ref={this.handleContentRef} {...eventHandlers}>
                    {this.maybeRenderCaret()}
                    <Icon className={Classes.TREE_NODE_ICON} icon={icon} aria-hidden={true} tabIndex={-1} />
                    <span className={Classes.TREE_NODE_LABEL}>{label}</span>
                    {this.maybeRenderSecondaryLabel()}
                </div>
                {hasChildren && <Collapse isOpen={isExpanded}>{children}</Collapse>}
            </li>
        );
    }

    private hasChildren() {
        return React.Children.count(this.props.children) > 0;
    }

    private maybeRenderCaret() {
        const { isExpanded, disabled, hasCaret = this.hasChildren() } = this.props;
        if (hasCaret) {
            const caretClasses = classNames(
                Classes.TREE_NODE_CARET,
                isExpanded ? Classes.TREE_NODE_CARET_OPEN : Classes.TREE_NODE_CARET_CLOSED,
            );
            return (
                <ChevronRight
                    title={isExpanded ? "Collapse group" : "Expand group"}
                    className={caretClasses}
                    onClick={disabled ? undefined : this.handleCaretClick}
                    role="button"
                    aria-disabled={disabled}
                    aria-expanded={isExpanded}
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

    private handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        e.stopPropagation();
        this.props.onKeyDown?.(this.props, this.props.path, e);
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
