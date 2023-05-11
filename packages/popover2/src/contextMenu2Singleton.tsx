/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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

import * as React from "react";
import * as ReactDOM from "react-dom";

import * as Classes from "./classes";
import { ContextMenu2Popover, ContextMenu2PopoverProps } from "./contextMenu2Popover";

/** DOM element which contains the context menu singleton instance for the imperative ContextMenu2 APIs. */
let contextMenuElement: HTMLElement | undefined;

/**
 * Show a context menu at a particular offset from the top-left corner of the document.
 * The menu will appear below-right of this point and will flip to below-left if there is not enough
 * room onscreen. Additional props like `onClose`, `isDarkTheme`, etc. can be forwarded to the `<ContextMenu2Popover>`.
 *
 * Context menus created with this API will automatically close when a user clicks outside the popover.
 * You may force them to close by using `hideContextMenu()`.
 *
 * Note that this API relies on global state in the @blueprintjs/popover2 package, and should be used with caution,
 * especially if your build system allows multiple copies of Blueprint libraries to be bundled into an application at
 * once.
 *
 * Alternative APIs to consider which do not have the limitations of global state:
 *  - `<ContextMenu2>`
 *  - `<ContextMenu2Popover>`
 *
 * @see https://blueprintjs.com/docs/#popover2-package/context-menu2-popover.imperative-api
 */
export function showContextMenu(props: Omit<ContextMenu2PopoverProps, "isOpen">) {
    if (contextMenuElement === undefined) {
        contextMenuElement = document.createElement("div");
        contextMenuElement.classList.add(Classes.CONTEXT_MENU2);
        document.body.appendChild(contextMenuElement);
    } else {
        // N.B. It's important to unmount previous instances of the ContextMenu2Popover rendered by this function.
        // Otherwise, React will detect no change in props sent to the already-mounted component, and therefore
        // do nothing after the first call to this function, leading to bugs like https://github.com/palantir/blueprint/issues/5949
        ReactDOM.unmountComponentAtNode(contextMenuElement);
    }

    ReactDOM.render(<UncontrolledContextMenu2Popover {...props} />, contextMenuElement);
}

/**
 * Hide a context menu that was created using `showContextMenu()`.
 *
 * Note that this API relies on global state in the @blueprintjs/popover2 package, and should be used with caution.
 *
 * @see https://blueprintjs.com/docs/#popover2-package/context-menu2-popover.imperative-api
 */
export function hideContextMenu() {
    if (contextMenuElement !== undefined) {
        ReactDOM.unmountComponentAtNode(contextMenuElement);
        contextMenuElement = undefined;
    }
}

/**
 * A simple wrapper around `ContextMenu2Popover` which is open by default and uncontrolled.
 * It closes when a user clicks outside the popover.
 */
function UncontrolledContextMenu2Popover(props: Omit<ContextMenu2PopoverProps, "isOpen">) {
    const [isOpen, setIsOpen] = React.useState(true);
    const handleClose = React.useCallback(() => {
        setIsOpen(false);
        props.onClose?.();
    }, [props.onClose]);

    return <ContextMenu2Popover isOpen={isOpen} {...props} onClose={handleClose} />;
}
