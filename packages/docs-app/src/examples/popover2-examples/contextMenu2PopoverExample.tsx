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
import * as React from "react";

import { Classes, Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import { Example, ExampleProps } from "@blueprintjs/docs-theme";
import { hideContextMenu, showContextMenu } from "@blueprintjs/popover2";

export const ContextMenu2PopoverExample: React.FC<ExampleProps> = props => {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleClose = React.useCallback(() => {
        setIsOpen(false);
        hideContextMenu();
    }, []);

    const menu = (
        <Menu>
            <MenuItem icon="cross-circle" intent="danger" text="Click me to close" onClick={handleClose} />
            <MenuItem icon="search-around" text="Search around..." />
            <MenuItem icon="search" text="Object viewer" />
            <MenuItem icon="graph-remove" text="Remove" />
            <MenuItem icon="group-objects" text="Group" />
            <MenuDivider />
            <MenuItem disabled={true} text="Clicked on node" />
        </Menu>
    );

    const handleContextMenu = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        showContextMenu({
            content: menu,
            onClose: handleClose,
            targetOffset: {
                left: event.clientX,
                top: event.clientY,
            },
        });
        setIsOpen(true);
    }, []);

    return (
        <Example className="docs-context-menu-example" options={false} {...props}>
            <div
                className={classNames("docs-context-menu-node", {
                    "docs-context-menu-open": isOpen,
                })}
                onContextMenu={handleContextMenu}
            />
            <span className={Classes.TEXT_MUTED}>Right-click on node to open.</span>
        </Example>
    );
};
