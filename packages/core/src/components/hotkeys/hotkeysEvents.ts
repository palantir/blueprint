/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Children, ReactElement, ReactNode } from "react";
import { safeInvoke } from "../../common/utils";

import { Hotkey, IHotkeyProps } from "./hotkey";
import { comboMatches, getKeyCombo, IKeyCombo, parseKeyCombo } from "./hotkeyParser";
import { IHotkeysProps } from "./hotkeys";
import { isHotkeysDialogShowing, showHotkeysDialog } from "./hotkeysDialog";

const SHOW_DIALOG_KEY = "?";

export enum HotkeyScope {
    LOCAL,
    GLOBAL,
}

export interface IHotkeyAction {
    combo: IKeyCombo;
    props: IHotkeyProps;
}

export class HotkeysEvents {
    private actions = [] as IHotkeyAction[];

    public constructor(private scope: HotkeyScope) {
    }

    public count() {
        return this.actions.length;
    }

    public clear() {
        this.actions = [];
    }

    public setHotkeys(props: IHotkeysProps & { children: ReactNode[] }) {
        const actions = [] as IHotkeyAction[];
        Children.forEach(props.children, (child: ReactElement<any>) => {
            if (Hotkey.isInstance(child) && this.isScope(child.props)) {
                actions.push({
                    combo: parseKeyCombo(child.props.combo),
                    props: child.props,
                });
            }
        });
        this.actions = actions;
    }

    public handleKeyDown = (e: KeyboardEvent) => {
        const isTextInput = this.isTextInput(e);

        if (isHotkeysDialogShowing()) {
            return;
        }

        const combo = getKeyCombo(e);

        if (!isTextInput && comboMatches(parseKeyCombo(SHOW_DIALOG_KEY), combo)) {
            showHotkeysDialog(this.actions.map((action) => action.props));
            return;
        }

        for (const action of this.actions) {
            const shouldIgnore = (isTextInput && !action.props.allowInInput) || action.props.disabled;
            if (comboMatches(action.combo, combo) && !shouldIgnore) {
                if (action.props.preventDefault) {
                    e.preventDefault();
                }
                if (action.props.stopPropagation) {
                    e.stopPropagation();
                }
                safeInvoke(action.props.onKeyDown, e);
            }
        }
    }

    public handleKeyUp = (e: KeyboardEvent) => {
        const isTextInput = this.isTextInput(e);

        if (isHotkeysDialogShowing()) {
            return;
        }

        const combo = getKeyCombo(e);
        for (const action of this.actions) {
            const shouldIgnore = (isTextInput && !action.props.allowInInput) || action.props.disabled;
            if (comboMatches(action.combo, combo) && !shouldIgnore) {
                if (action.props.preventDefault) {
                    e.preventDefault();
                }
                if (action.props.stopPropagation) {
                    e.stopPropagation();
                }
                safeInvoke(action.props.onKeyUp, e);
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
