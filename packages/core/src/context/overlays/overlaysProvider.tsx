/*
 * Copyright 2024 Palantir Technologies, Inc. All rights reserved.
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

import type { OverlayInstance } from "../../components/overlay2/overlay2";

interface OverlaysContextState {
    /**
     * Whether the context instance is being used within a tree which has an `<OverlaysProvider>`.
     * `useOverlayStack()` will work if this is `false` in Blueprint v5, but this will be unsupported
     * in Blueprint v6; all applications with overlays will be required to configure a provider to
     * manage global overlay state.
     *
     * @see https://github.com/palantir/blueprint/wiki/Overlay2-migration
     */
    hasProvider: boolean;

    /**
     * The application-wide global overlay stack.
     */
    stack: OverlayInstance[];
}

export type OverlayStackAction =
    | { type: "OPEN_OVERLAY" | "CLOSE_OVERLAY"; payload: OverlayInstance }
    | { type: "RESET_STACK" };

export type OverlaysContextInstance = readonly [OverlaysContextState, React.Dispatch<OverlayStackAction>];

const initialStateWithoutProvider: OverlaysContextState = { hasProvider: false, stack: [] };
const initialStateWithProvider: OverlaysContextState = { hasProvider: true, stack: [] };
const noOpDispatch: React.Dispatch<OverlayStackAction> = () => null;

/**
 * A React context used to interact with the overlay stack in an application.
 * Users should take care to make sure that only _one_ of these is instantiated and used within an
 * application.
 *
 * You will likely not be using this OverlaysContext directly, it's mostly used internally by the
 * Overlay2 component.
 *
 * For more information, see the [OverlaysProvider documentation](https://blueprintjs.com/docs/#core/context/overlays-provider).
 */
export const OverlaysContext = React.createContext<OverlaysContextInstance>([
    initialStateWithoutProvider,
    noOpDispatch,
]);

/**
 * N.B. this is exported in order for `useOverlayStack()` to implement backwards-compatibility for overlays
 * outside of a `<OverlaysProvider>. It should stop being exported from this module in Blueprint v6.
 */
export const overlaysReducer = (state: OverlaysContextState, action: OverlayStackAction): OverlaysContextState => {
    switch (action.type) {
        case "OPEN_OVERLAY":
            return { ...state, stack: [...state.stack, action.payload] };
        case "CLOSE_OVERLAY":
            const index = state.stack.findIndex(o => o.id === action.payload.id);
            if (index === -1) {
                return state;
            }
            const newStack = state.stack.slice();
            newStack.splice(index, 1);
            return { ...state, stack: newStack };
        case "RESET_STACK":
            return { ...state, stack: [] };
        default:
            return state;
    }
};

export interface OverlaysProviderProps {
    /** The component subtree which will have access to this overlay stack context. */
    children: React.ReactNode;
}

/**
 * Overlays context provider, necessary for the `useOverlayStack` hook.
 *
 * @see https://blueprintjs.com/docs/#core/context/overlays-provider
 */
export const OverlaysProvider = ({ children }: OverlaysProviderProps) => {
    const contextValue = React.useReducer(overlaysReducer, initialStateWithProvider);
    return <OverlaysContext.Provider value={contextValue}>{children}</OverlaysContext.Provider>;
};
