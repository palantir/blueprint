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

import { Utils } from "../../common";
import { Menu } from "../menu/menu";
import { PopoverInteractionKind, type PopoverProps } from "./popover";

/**
 * Specifies the popup kind for [aria-haspopup](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-haspopup).
 */
export enum PopupKind {
    /** The popup is a menu. */
    MENU = "menu",
    /** The popup is a listbox. */
    LISTBOX = "listbox",
    /** The popup is a tree. */
    TREE = "tree",
    /** The popup is a grid. */
    GRID = "grid",
    /** The popup is a dialog. */
    DIALOG = "dialog",
}

/**
 * Returns value for `aria-haspopup`.
 * https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-haspopup
 *
 * @returns
 * - `undefined` if `interactionKind` is `"hover-target"` (doesn't have popup, since only on hover, and popup would never be interactive)
 * - `popupKind` if passed
 * - else, `role` of the `content` if `content` is an element with role that matches a possible `PopupKind` (`aria-haspopup` value) (this includes a passed `Menu` component, which gets role `menu`)
 * - else, `undefined` (popover is not interactive)
 */
export function getPopupKind(props: Pick<PopoverProps, "interactionKind" | "popupKind" | "content">) {
    if (props.interactionKind === PopoverInteractionKind.HOVER_TARGET_ONLY) return undefined;
    if (props.popupKind) return props.popupKind;
    if (Utils.isReactElement(props.content)) {
        const role: React.AriaRole | undefined = props.content.props.role;
        if (role && (Object.values(PopupKind) satisfies React.AriaRole[] as React.AriaRole[]).includes(role)) {
            return role as PopupKind;
        }
    }
    if (Utils.isElementOfType(props.content, Menu) && !props.content.props.role) return PopupKind.MENU;

    return undefined;
}
