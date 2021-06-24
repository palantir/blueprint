/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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
import React, { useCallback } from "react";

import {
    Classes,
    ContextMenu,
    ContextMenuChildrenProps,
    ContextMenuContentProps,
    Menu,
    MenuDivider,
    MenuItem,
    Tooltip,
} from "@blueprintjs/core";
import { Example, ExampleProps } from "@blueprintjs/docs-theme";

export const ContextMenuExample: React.FC<ExampleProps> = props => {
    const renderContent = useCallback(
        ({ targetOffset }: ContextMenuContentProps) => (
            <Menu>
                <MenuItem icon="select" text="Select all" />
                <MenuItem icon="insert" text="Insert...">
                    <MenuItem icon="new-object" text="Object" />
                    <MenuItem icon="new-text-box" text="Text box" />
                    <MenuItem icon="star" text="Astral body" />
                </MenuItem>
                <MenuItem icon="layout" text="Layout...">
                    <MenuItem icon="layout-auto" text="Auto" />
                    <MenuItem icon="layout-circle" text="Circle" />
                    <MenuItem icon="layout-grid" text="Grid" />
                </MenuItem>
                {targetOffset === undefined ? undefined : (
                    <>
                        <MenuDivider />
                        <MenuItem
                            disabled={true}
                            text={`Clicked at (${Math.round(targetOffset.left)}, ${Math.round(targetOffset.top)})`}
                        />
                    </>
                )}
            </Menu>
        ),
        [],
    );

    return (
        <ContextMenu content={renderContent}>
            <Example className="docs-context-menu-example" options={false} {...props}>
                <Tooltip
                    content={
                        <div style={{ maxWidth: 230, textAlign: "center" }}>
                            This tooltip will close when you open the node's context menu
                        </div>
                    }
                >
                    <GraphNode />
                </Tooltip>
                <span className={Classes.TEXT_MUTED}>Right-click on node or background.</span>
            </Example>
        </ContextMenu>
    );
};

const GraphNode: React.FC = () => {
    const children = useCallback(
        (props: ContextMenuChildrenProps) => (
            <div
                className={classNames("docs-context-menu-node", props.className, {
                    "docs-context-menu-open": props.contentProps.isOpen,
                })}
                onContextMenu={props.onContextMenu}
                ref={props.ref}
            >
                {props.popover}
            </div>
        ),
        [],
    );

    return (
        <ContextMenu
            content={
                <Menu>
                    <MenuItem icon="search-around" text="Search around..." />
                    <MenuItem icon="search" text="Object viewer" />
                    <MenuItem icon="graph-remove" text="Remove" />
                    <MenuItem icon="group-objects" text="Group" />
                    <MenuDivider />
                    <MenuItem disabled={true} text="Clicked on node" />
                </Menu>
            }
        >
            {children}
        </ContextMenu>
    );
};
