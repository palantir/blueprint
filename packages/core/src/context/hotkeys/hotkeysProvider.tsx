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

import { HotkeysDialog2, HotkeysDialog2Props } from "../../components/hotkeys/hotkeysDialog2";
import { HotkeyConfig } from "../../hooks";

interface HotkeysContextState {
    /** List of hotkeys accessible in the current scope, registered by currently mounted components, can be global or local. */
    hotkeys: HotkeyConfig[];

    /** Whether the global hotkeys dialog is open. */
    isDialogOpen: boolean;
}

type HotkeysAction =
    | { type: "ADD_HOTKEYS" | "REMOVE_HOTKEYS"; payload: HotkeyConfig[] }
    | { type: "CLOSE_DIALOG" | "OPEN_DIALOG" };

const initialHotkeysState: HotkeysContextState = { hotkeys: [], isDialogOpen: false };
const noOpDispatch: React.Dispatch<HotkeysAction> = () => null;

// we can remove this guard once Blueprint depends on React 16
export const HotkeysContext = React.createContext?.<[HotkeysContextState, React.Dispatch<HotkeysAction>]>([
    initialHotkeysState,
    noOpDispatch,
]);

const hotkeysReducer = (state: HotkeysContextState, action: HotkeysAction) => {
    switch (action.type) {
        case "ADD_HOTKEYS":
            return {
                ...state,
                hotkeys: [...state.hotkeys, ...action.payload],
            };
        case "REMOVE_HOTKEYS":
            return {
                ...state,
                hotkeys: state.hotkeys.filter(key => action.payload.indexOf(key) === -1),
            };
        case "OPEN_DIALOG":
            return { ...state, isDialogOpen: true };
        case "CLOSE_DIALOG":
            return { ...state, isDialogOpen: false };
        default:
            return state;
    }
};

export interface HotkeysProviderProps {
    /** The component subtree which will have access to this hotkeys context. */
    children: React.ReactChild;

    /** Optional props to customize the rendered hotkeys dialog. */
    dialogProps?: Partial<Omit<HotkeysDialog2Props, "hotkeys">>;

    /** If provided, this dialog render function will be used in place of the default implementation. */
    renderDialog?: (state: HotkeysContextState, contextActions: { handleDialogClose: () => void }) => JSX.Element;
}

/**
 * Hotkeys context provider, necessary for the `useHotkeys` hook.
 */
export const HotkeysProvider = ({ children, dialogProps, renderDialog }: HotkeysProviderProps) => {
    const [state, dispatch] = React.useReducer(hotkeysReducer, initialHotkeysState);
    const handleDialogClose = React.useCallback(() => dispatch({ type: "CLOSE_DIALOG" }), []);

    const dialog = renderDialog?.(state, { handleDialogClose }) ?? (
        <HotkeysDialog2
            {...dialogProps}
            isOpen={state.isDialogOpen}
            hotkeys={state.hotkeys}
            onClose={handleDialogClose}
        />
    );

    return (
        <HotkeysContext.Provider value={[state, dispatch]}>
            {children}
            {dialog}
        </HotkeysContext.Provider>
    );
};
