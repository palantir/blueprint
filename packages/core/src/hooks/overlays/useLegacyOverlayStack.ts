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
import { useSyncExternalStore } from "use-sync-external-store/shim";

import { Classes } from "../../common";
import type { OverlayInstance } from "../../components";

import type { UseOverlayStackReturnValue } from "./useOverlayStack";

const globalStack: OverlayInstance[] = [];
const globalStackListeners: Array<() => void> = [];

/**
 * Modify the global stack in-place and notify all listeners of the updated value.
 *
 * @public for testing
 */
export const modifyGlobalStack = (fn: (stack: OverlayInstance[]) => void) => {
    fn(globalStack);
    globalStackListeners.forEach(listener => listener());
};

const legacyGlobalOverlayStackStore = {
    getSnapshot: () => globalStack,
    subscribe: (listener: () => void) => {
        globalStackListeners.push(listener);
        return () => {
            const index = globalStackListeners.indexOf(listener);
            globalStackListeners.splice(index, 1);
        };
    },
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

    const getLastOpened = React.useCallback(() => stack[stack.length - 1], [stack]);

    const getThisOverlayAndDescendants = React.useCallback(
        (id: string) => {
            const stackIndex = stack.findIndex(o => o.id === id);
            return stack.slice(stackIndex);
        },
        [stack],
    );

    const resetStack = React.useCallback(() => {
        modifyGlobalStack(s => s.splice(0, s.length));
    }, []);

    const openOverlay = React.useCallback((overlay: OverlayInstance) => {
        globalStack.push(overlay);
        if (overlay.props.usePortal && overlay.props.hasBackdrop) {
            // add a class to the body to prevent scrolling of content below the overlay
            document.body.classList.add(Classes.OVERLAY_OPEN);
        }
    }, []);

    const closeOverlay = React.useCallback(
        (id: string) => {
            const otherOverlaysWithBackdrop = stack.filter(
                o => o.props.usePortal && o.props.hasBackdrop && o.id !== id,
            );

            const index = globalStack.findIndex(o => o.id === id);
            if (index > -1) {
                globalStack.splice(index, 1);
            }

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
