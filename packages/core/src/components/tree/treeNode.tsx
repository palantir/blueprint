/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import * as Classes from "../../common/classes";
import { safeInvoke } from "../../common/utils";
import { Collapse } from "../collapse/collapse";
import { Icon, IconName } from "../icon/icon";

export interface ITreeNode {
    /**
     * Child tree nodes of this node.
     */
    childNodes?: ITreeNode[];

    /**
     * A space-delimited string of class names to apply to the node.
     */
    className?: string;

    /**
     * Whether the caret to expand/collapse a node should be shown.
     * If not specified, this will be true if the node has children and false otherwise.
     */
    hasCaret?: boolean;

    /**
     * The name of a Blueprint icon to display next to the node's label.
     */
    iconName?: IconName;

    /**
     * A unique identifier for the node.
     */
    id: string | number;

    /**
     * Whether the children of this node are displayed.
     * @default false
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
    secondaryLabel?: string | JSX.Element;
}

export interface ITreeNodeProps extends ITreeNode {
    children?: React.ReactNode;
    contentRef?: (node: TreeNode, element: HTMLDivElement | null) => void;
    depth: number;
    key?: string | number;
    onClick?: (node: TreeNode, e: React.MouseEvent<HTMLDivElement>) => void;
    onCollapse?: (node: TreeNode, e: React.MouseEvent<HTMLSpanElement>) => void;
    onContextMenu?: (node: TreeNode, e: React.MouseEvent<HTMLDivElement>) => void;
    onDoubleClick?: (node: TreeNode, e: React.MouseEvent<HTMLDivElement>) => void;
    onExpand?: (node: TreeNode, e: React.MouseEvent<HTMLSpanElement>) => void;
    path: number[];
}

export class TreeNode extends React.Component<ITreeNodeProps, {}> {
    public render() {
        const { children, className, hasCaret, iconName, isExpanded, isSelected, label } = this.props;

        const showCaret = hasCaret == null ? React.Children.count(children) > 0 : hasCaret;
        const caretClass = showCaret ? Classes.TREE_NODE_CARET : Classes.TREE_NODE_CARET_NONE;
        const caretStateClass = isExpanded ? Classes.TREE_NODE_CARET_OPEN : Classes.TREE_NODE_CARET_CLOSED;
        const caretClasses = classNames(caretClass, Classes.ICON_STANDARD, {
            [caretStateClass]: showCaret,
        });

        const classes = classNames(
            Classes.TREE_NODE,
            {
                [Classes.TREE_NODE_SELECTED]: isSelected,
                [Classes.TREE_NODE_EXPANDED]: isExpanded,
            },
            className,
        );

        const contentClasses = classNames(Classes.TREE_NODE_CONTENT, `pt-tree-node-content-${this.props.depth}`);

        return (
            <li className={classes}>
                <div
                    className={contentClasses}
                    onClick={this.handleClick}
                    onContextMenu={this.handleContextMenu}
                    onDoubleClick={this.handleDoubleClick}
                    ref={this.handleContentRef}
                >
                    <span className={caretClasses} onClick={showCaret ? this.handleCaretClick : null} />
                    <Icon className={Classes.TREE_NODE_ICON} iconName={iconName} />
                    <span className={Classes.TREE_NODE_LABEL}>{label}</span>
                    {this.maybeRenderSecondaryLabel()}
                </div>
                <Collapse isOpen={isExpanded}>{children}</Collapse>
            </li>
        );
    }

    private maybeRenderSecondaryLabel() {
        if (this.props.secondaryLabel != null) {
            return <span className={Classes.TREE_NODE_SECONDARY_LABEL}>{this.props.secondaryLabel}</span>;
        } else {
            return undefined;
        }
    }

    private handleCaretClick = (e: React.MouseEvent<HTMLSpanElement>) => {
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
}
