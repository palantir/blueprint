/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { Children, ReactElement, ReactNode } from "react";
import { isElementOfType, safeInvoke } from "../../common/utils";

import { Hotkey, IHotkeyProps } from "./hotkey";
import { comboMatches, getKeyCombo, IKeyCombo, parseKeyCombo } from "./hotkeyParser";
import { IHotkeysProps } from "./hotkeys";
import { hideHotkeysDialogAfterDelay, isHotkeysDialogShowing, showHotkeysDialog } from "./hotkeysDialog";

const SHOW_DIALOG_KEY = "?";

export enum HotkeyScope {
    LOCAL = "local",
    GLOBAL = "global",
}

export interface IHotkeyAction {
    combo: IKeyCombo;
    props: IHotkeyProps;
}

export class HotkeysEvents {
    private actions = [] as IHotkeyAction[];

    public constructor(private scope: HotkeyScope) {}

    public count() {
        return this.actions.length;
    }

    public clear() {
        this.actions = [];
    }

    public setHotkeys(props: IHotkeysProps & { children?: ReactNode }) {
        const actions = [] as IHotkeyAction[];
        Children.forEach(props.children, (child: ReactElement<any>) => {
            if (isElementOfType(child, Hotkey) && this.isScope(child.props)) {
                actions.push({
                    combo: parseKeyCombo(child.props.combo),
                    props: child.props,
                });
            }
        });
        this.actions = actions;
    }

    public handleKeyDown = (e: KeyboardEvent) => {
        const combo = getKeyCombo(e);
        const isTextInput = this.isTextInput(e);

        if (!isTextInput && comboMatches(parseKeyCombo(SHOW_DIALOG_KEY), combo)) {
            if (isHotkeysDialogShowing()) {
                hideHotkeysDialogAfterDelay();
            } else {
                showHotkeysDialog(this.actions.map(action => action.props));
            }
            return;
        } else if (isHotkeysDialogShowing()) {
            return;
        }

        this.invokeNamedCallbackIfComboRecognized(combo, "onKeyDown", e);
    };

    public handleKeyUp = (e: KeyboardEvent) => {
        if (isHotkeysDialogShowing()) {
            return;
        }
        this.invokeNamedCallbackIfComboRecognized(getKeyCombo(e), "onKeyUp", e);
    };

    private invokeNamedCallbackIfComboRecognized(
        combo: IKeyCombo,
        callbackName: "onKeyDown" | "onKeyUp",
        e: KeyboardEvent,
    ) {
        const isTextInput = this.isTextInput(e);
        for (const action of this.actions) {
            const shouldIgnore = (isTextInput && !action.props.allowInInput) || action.props.disabled;
            if (!shouldIgnore && comboMatches(action.combo, combo)) {
                if (action.props.preventDefault) {
                    e.preventDefault();
                }
                if (action.props.stopPropagation) {
                    // set a flag just for unit testing. not meant to be referenced in feature work.
                    (e as any).isPropagationStopped = true;
                    e.stopPropagation();
                }
                safeInvoke(action.props[callbackName], e);
            }
        }
    }

    private isScope(props: IHotkeyProps) {
        return (props.global ? HotkeyScope.GLOBAL : HotkeyScope.LOCAL) === this.scope;
    }

    private isTextInput(e: KeyboardEvent) {
        const elem = e.target as HTMLElement;
        // we check these cases for unit testing, but this should not happen
        // during normal operation
        if (elem == null || elem.closest == null) {
            return false;
        }

        const editable = elem.closest("input, textarea, [contenteditable=true]");

        if (editable == null) {
            return false;
        }

        // don't let checkboxes, switches, and radio buttons prevent hotkey behavior
        if (editable.tagName.toLowerCase() === "input") {
            const inputType = (editable as HTMLInputElement).type;
            if (inputType === "checkbox" || inputType === "radio") {
                return false;
            }
        }

        // don't let read-only fields prevent hotkey behavior
        if ((editable as HTMLInputElement).readOnly) {
            return false;
        }

        return true;
    }
}
