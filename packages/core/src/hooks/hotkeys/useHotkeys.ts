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

import * as React from "react";

import { comboMatches, getKeyCombo, IKeyCombo, parseKeyCombo } from "../../components/hotkeys/hotkeyParser";
import { HotkeysContext } from "../../context";
import { HotkeyConfig } from "./hotkeyConfig";

export interface UseHotkeysOptions {
    /**
     * A custom document to reference when binding global event handlers.
     * This can be useful when using iframes in an application.
     *
     * @default window.document
     */
    document?: Document;

    /**
     * The key combo which will trigger the hotkeys dialog to open.
     *
     * @default "?"
     */
    showDialogKeyCombo?: string;
}

export interface UseHotkeysReturnValue {
    handleKeyDown: React.KeyboardEventHandler<HTMLElement>;
    handleKeyUp: React.KeyboardEventHandler<HTMLElement>;
}

/**
 * React hook to register global and local hotkeys for a component.
 *
 * @param keys list of hotkeys to configure
 * @param options hook options
 */
export function useHotkeys(keys: HotkeyConfig[], options: UseHotkeysOptions = {}): UseHotkeysReturnValue {
    const { document = getDefaultDocument(), showDialogKeyCombo = "?" } = options;
    const localKeys = React.useMemo(
        () =>
            keys
                .filter(k => !k.global)
                .map(k => ({
                    combo: parseKeyCombo(k.combo),
                    config: k,
                })),
        [keys],
    );
    const globalKeys = React.useMemo(
        () =>
            keys
                .filter(k => k.global)
                .map(k => ({
                    combo: parseKeyCombo(k.combo),
                    config: k,
                })),
        [keys],
    );

    // register keys with global context
    const [, dispatch] = React.useContext(HotkeysContext);
    React.useEffect(() => {
        const payload = [...globalKeys.map(k => k.config), ...localKeys.map(k => k.config)];
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
        for (const key of global ? globalKeys : localKeys) {
            const {
                allowInInput = false,
                disabled = false,
                preventDefault = false,
                stopPropagation = false,
            } = key.config;
            const shouldIgnore = (isTextInput && !allowInInput) || disabled;
            if (!shouldIgnore && comboMatches(key.combo, combo)) {
                if (preventDefault) {
                    e.preventDefault();
                }
                if (stopPropagation) {
                    // set a flag just for unit testing. not meant to be referenced in feature work.
                    (e as any).isPropagationStopped = true;
                    e.stopPropagation();
                }
                key.config[callbackName]?.(e);
            }
        }
    };

    const handleGlobalKeyDown = React.useCallback(
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
    const handleGlobalKeyUp = React.useCallback(
        (e: KeyboardEvent) => invokeNamedCallbackIfComboRecognized(true, getKeyCombo(e), "onKeyUp", e),
        [globalKeys],
    );

    const handleLocalKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLElement>) =>
            invokeNamedCallbackIfComboRecognized(false, getKeyCombo(e.nativeEvent), "onKeyDown", e.nativeEvent),
        [localKeys],
    );
    const handleLocalKeyUp = React.useCallback(
        (e: React.KeyboardEvent<HTMLElement>) =>
            invokeNamedCallbackIfComboRecognized(false, getKeyCombo(e.nativeEvent), "onKeyUp", e.nativeEvent),
        [localKeys],
    );

    React.useEffect(() => {
        // document is guaranteed to be defined inside effects
        document!.addEventListener("keydown", handleGlobalKeyDown);
        document!.addEventListener("keyup", handleGlobalKeyUp);
        return () => {
            document!.removeEventListener("keydown", handleGlobalKeyDown);
            document!.removeEventListener("keyup", handleGlobalKeyUp);
        };
    }, [handleGlobalKeyDown, handleGlobalKeyUp]);

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

function getDefaultDocument(): Document | undefined {
    if (typeof window === "undefined") {
        return undefined;
    }
    return window.document;
}
