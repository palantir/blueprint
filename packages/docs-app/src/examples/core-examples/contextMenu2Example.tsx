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

import { Classes, Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import { Example, ExampleProps } from "@blueprintjs/docs-theme";
import { ContextMenu2, ContextMenu2RenderProps } from "@blueprintjs/popover2";

export const ContextMenu2Example: React.FC<ExampleProps> = props => {
    const renderContent = useCallback(
        ({ targetOffset }: ContextMenu2RenderProps) => (
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
                <MenuDivider />
                <MenuItem disabled={true} text={`Clicked at (${targetOffset.left}, ${targetOffset.top})`} />
            </Menu>
        ),
        [],
    );

    return (
        <ContextMenu2 content={renderContent}>
            <Example className="docs-context-menu-example" options={false} {...props}>
                <GraphNode />
                <span className={Classes.TEXT_MUTED}>Right-click on node or background.</span>
            </Example>
        </ContextMenu2>
    );
};

const GraphNode: React.FC = () => {
    const children = useCallback(
        ({ isOpen }) => <div className={classNames("docs-context-menu-node", { "docs-context-menu-open": isOpen })} />,
        [],
    );

    return (
        <ContextMenu2
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
        </ContextMenu2>
    );
};
