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

import React, { useCallback, useContext, useEffect, useMemo } from "react";

import { IHotkeyProps } from "../components/hotkeys/hotkey";
import { comboMatches, getKeyCombo, IKeyCombo, parseKeyCombo } from "../components/hotkeys/hotkeyParser";
import { HotkeysContext } from "../context/hotkeysProvider";

export interface UseHotkeysOptions {
    /**
     * The key combo which will trigger the hotkeys dialog to open.
     *
     * @default "?"
     */
    showDialogKeyCombo?: string;
}

export function useHotkeys(keys: IHotkeyProps[], { showDialogKeyCombo = "?" }: UseHotkeysOptions = {}) {
    const localKeys = useMemo(
        () =>
            keys
                .filter(k => !k.global)
                .map(k => ({
                    combo: parseKeyCombo(k.combo),
                    props: k,
                })),
        [keys],
    );
    const globalKeys = useMemo(
        () =>
            keys
                .filter(k => k.global)
                .map(k => ({
                    combo: parseKeyCombo(k.combo),
                    props: k,
                })),
        [keys],
    );

    // register keys with global context
    const [, dispatch] = useContext(HotkeysContext);
    useEffect(() => {
        const payload = [...globalKeys.map(k => k.props), ...localKeys.map(k => k.props)];
        dispatch({ type: "ADD_HOTKEYS", payload });
        return () => dispatch({ type: "REMOVE_HOTKEYS", payload });
    }, [keys]);

    const invokeNamedCallbackIfComboRecognized = (
        global: boolean,
        combo: IKeyCombo,
        callbackName: "onKeyDown" | "onKeyUp",
        e: KeyboardEvent,
    ) => {
        const isTextInput = isTargetATextInput(e);
        for (const action of global ? globalKeys : localKeys) {
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
                action.props[callbackName]?.(e);
            }
        }
    };

    const handleGlobalKeyDown = useCallback(
        (e: KeyboardEvent) => {
            // special case for global keydown: if '?' is pressed, open the hotkeys dialog
            const combo = getKeyCombo(e);
            const isTextInput = isTargetATextInput(e);
            if (!isTextInput && comboMatches(parseKeyCombo(showDialogKeyCombo), combo)) {
                dispatch({ type: "OPEN_DIALOG" });
            } else {
                invokeNamedCallbackIfComboRecognized(true, getKeyCombo(e), "onKeyDown", e);
            }
        },
        [globalKeys],
    );
    const handleGlobalKeyUp = useCallback(
        (e: KeyboardEvent) => invokeNamedCallbackIfComboRecognized(true, getKeyCombo(e), "onKeyUp", e),
        [globalKeys],
    );

    const handleLocalKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLElement>) =>
            invokeNamedCallbackIfComboRecognized(false, getKeyCombo(e.nativeEvent), "onKeyDown", e.nativeEvent),
        [localKeys],
    );
    const handleLocalKeyUp = useCallback(
        (e: React.KeyboardEvent<HTMLElement>) =>
            invokeNamedCallbackIfComboRecognized(false, getKeyCombo(e.nativeEvent), "onKeyUp", e.nativeEvent),
        [localKeys],
    );

    useEffect(() => {
        document.addEventListener("keydown", handleGlobalKeyDown);
        document.addEventListener("keyup", handleGlobalKeyUp);
        return () => {
            document.removeEventListener("keydown", handleGlobalKeyDown);
            document.removeEventListener("keyup", handleGlobalKeyUp);
        };
    }, []);

    return { handleKeyDown: handleLocalKeyDown, handleKeyUp: handleLocalKeyUp };
}

/**
 * @returns true if the event target is a text input which should take priority over hotkey bindings
 */
function isTargetATextInput(e: KeyboardEvent) {
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
