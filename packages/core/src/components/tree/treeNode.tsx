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

import * as Classes from "../../common/classes";
import { DISPLAYNAME_PREFIX, IProps, MaybeElement } from "../../common/props";
import { safeInvoke } from "../../common/utils";
import { Collapse } from "../collapse/collapse";
import { Icon, IconName } from "../icon/icon";

export interface ITreeNode<T = {}> extends IProps {
    /**
     * Child tree nodes of this node.
     */
    childNodes?: Array<ITreeNode<T>>;

    /**
     * Whether this tree node is non-interactive. Enabling this prop will ignore
     * mouse event handlers (in particular click, down, enter, leave).
     */
    disabled?: boolean;

    /**
     * Whether the caret to expand/collapse a node should be shown.
     * If not specified, this will be true if the node has children and false otherwise.
     */
    hasCaret?: boolean;

    /**
     * The name of a Blueprint icon (or an icon element) to render next to the node's label.
     */
    icon?: IconName | MaybeElement;

    /**
     * A unique identifier for the node.
     */
    id: string | number;

    /**
     */
    isExpanded?: boolean;

    /**
     * Whether this node is selected.
     * @default false
     */
    isSelected?: boolean;

    /**
     * The main label for the node.
     */
    label: string | JSX.Element;

    /**
     * A secondary label/component that is displayed at the right side of the node.
     */
    secondaryLabel?: string | MaybeElement;

    /**
     * An optional custom user object to associate with the node.
     * This property can then be used in the `onClick`, `onContextMenu` and `onDoubleClick`
     * event handlers for doing custom logic per node.
     */
    nodeData?: T;
}

export interface ITreeNodeProps<T = {}> extends ITreeNode<T> {
    children?: React.ReactNode;
    contentRef?: (node: TreeNode<T>, element: HTMLDivElement | null) => void;
    depth: number;
    key?: string | number;
    onClick?: (node: TreeNode<T>, e: React.MouseEvent<HTMLDivElement>) => void;
    onCollapse?: (node: TreeNode<T>, e: React.MouseEvent<HTMLSpanElement>) => void;
    onContextMenu?: (node: TreeNode<T>, e: React.MouseEvent<HTMLDivElement>) => void;
    onDoubleClick?: (node: TreeNode<T>, e: React.MouseEvent<HTMLDivElement>) => void;
    onExpand?: (node: TreeNode<T>, e: React.MouseEvent<HTMLSpanElement>) => void;
    onMouseEnter?: (node: TreeNode<T>, e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseLeave?: (node: TreeNode<T>, e: React.MouseEvent<HTMLDivElement>) => void;
    path: number[];
}

export class TreeNode<T = {}> extends React.Component<ITreeNodeProps<T>, {}> {
    public static displayName = `${DISPLAYNAME_PREFIX}.TreeNode`;

    public static ofType<T>() {
        return TreeNode as new (props: ITreeNodeProps<T>) => TreeNode<T>;
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
                    <Icon className={Classes.TREE_NODE_ICON} icon={icon} />
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
            const onClick = disabled === true ? undefined : this.handleCaretClick;
            return <Icon className={caretClasses} onClick={onClick} icon={"chevron-right"} />;
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
        safeInvoke(isExpanded ? onCollapse : onExpand, this, e);
    };

    private handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        safeInvoke(this.props.onClick, this, e);
    };

    private handleContentRef = (element: HTMLDivElement | null) => {
        safeInvoke(this.props.contentRef, this, element);
    };

    private handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        safeInvoke(this.props.onContextMenu, this, e);
    };

    private handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        safeInvoke(this.props.onDoubleClick, this, e);
    };

    private handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        safeInvoke(this.props.onMouseEnter, this, e);
    };

    private handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        safeInvoke(this.props.onMouseLeave, this, e);
    };
}
