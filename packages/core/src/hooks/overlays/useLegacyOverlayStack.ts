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

import React from "react";
// tslint:disable-next-line no-submodule-imports
import { useSyncExternalStore } from "use-sync-external-store/shim";

import { Classes } from "../../common";
import type { OverlayInstance } from "../../components";
import { overlaysReducer, type OverlayStackAction } from "../../context/overlays/overlaysProvider";

import type { UseOverlayStackReturnValue } from "./useOverlayStack";

let legacyGlobalOverlayStack: OverlayInstance[] = [];
let legacyGlobalOverlayStoreListeners: Array<() => void> = [];

const legacyGlobalOverlayStackStore = {
    getSnapshot: () => legacyGlobalOverlayStack,
    subscribe: (listener: () => void) => {
        legacyGlobalOverlayStoreListeners = [...legacyGlobalOverlayStoreListeners, listener];
        return () => {
            legacyGlobalOverlayStoreListeners = legacyGlobalOverlayStoreListeners.filter(l => l !== listener);
        };
    },
};

/**
 * Public only for testing.
 */
export const dispatch: React.Dispatch<OverlayStackAction> = action => {
    const state = { stack: legacyGlobalOverlayStack, hasProvider: false };
    const newStack = overlaysReducer(state, action).stack;
    legacyGlobalOverlayStack = newStack;
    // IMPORTANT: notify all listeners that the global stack has changed
    legacyGlobalOverlayStoreListeners.forEach(listener => listener());
};

/**
 * Legacy implementation of a global overlay stack which maintains state in a global variable.
 * This is used for backwards-compatibility with overlay-based components in Blueprint v5.
 * It will be removed in Blueprint v6 once `<OverlaysProvider>` is required.
 *
 * @see https://github.com/palantir/blueprint/wiki/Overlay2-migration
 */
export function useLegacyOverlayStack(): UseOverlayStackReturnValue {
    const stack = useSyncExternalStore(
        legacyGlobalOverlayStackStore.subscribe,
        legacyGlobalOverlayStackStore.getSnapshot,
        // server snapshot is the same as client snapshot
        legacyGlobalOverlayStackStore.getSnapshot,
    );

    const getLastOpened = React.useCallback(() => stack.at(-1), [stack]);

    const getThisOverlayAndDescendants = React.useCallback(
        (overlay: OverlayInstance) => {
            const stackIndex = stack.findIndex(o => o.id === overlay.id);
            return stack.slice(stackIndex);
        },
        [stack],
    );

    const resetStack = React.useCallback(() => dispatch({ type: "RESET_STACK" }), []);

    const openOverlay = React.useCallback((overlay: OverlayInstance) => {
        dispatch({ type: "OPEN_OVERLAY", payload: overlay });
        if (overlay.props.usePortal && overlay.props.hasBackdrop) {
            // add a class to the body to prevent scrolling of content below the overlay
            document.body.classList.add(Classes.OVERLAY_OPEN);
        }
    }, []);

    const closeOverlay = React.useCallback(
        (overlay: OverlayInstance) => {
            const otherOverlaysWithBackdrop = stack.filter(
                o => o.props.usePortal && o.props.hasBackdrop && o.id !== overlay.id,
            );

            dispatch({ type: "CLOSE_OVERLAY", payload: overlay });

            if (otherOverlaysWithBackdrop.length === 0) {
                // remove body class which prevents scrolling of content below overlay
                document.body.classList.remove(Classes.OVERLAY_OPEN);
            }
        },
        [stack],
    );

    return {
        closeOverlay,
        getLastOpened,
        getThisOverlayAndDescendants,
        openOverlay,
        resetStack,
    };
}
