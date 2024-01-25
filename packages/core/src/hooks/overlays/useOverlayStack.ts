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

import { Classes } from "../../common";
import { OVERLAY2_REQUIRES_OVERLAY_PROVDER } from "../../common/errors";
import { isNodeEnv } from "../../common/utils";
import type { OverlayInstance } from "../../components";
import { OverlaysContext } from "../../context/overlays/overlaysProvider";

import { useLegacyOverlayStack } from "./useLegacyOverlayStack";

export interface UseOverlayStackReturnValue {
    /**
     * Removes an existing overlay off the stack.
     */
    closeOverlay: (overlay: OverlayInstance) => void;

    /**
     * @returns the last opened overlay on the stack
     */
    getLastOpened: () => OverlayInstance | undefined;

    /**
     * @param overlay current overlay
     * @returns a list of the current overlay and all overlays which are descendants of it.
     */
    getThisOverlayAndDescendants: (overlay: OverlayInstance) => OverlayInstance[];

    /**
     * Pushes a new overlay onto the stack.
     */
    openOverlay: (overlay: OverlayInstance) => void;

    /**
     * Resets the overlay stack, to be called after all overlays are closed.
     * Warning: this should only be used in unit tests.
     */
    resetStack: () => void;
}

/**
 * React hook to interact with the global overlay stack.
 *
 * @see https://blueprintjs.com/docs/#core/hooks/use-overlay-stack
 */
export function useOverlayStack(): UseOverlayStackReturnValue {
    // get the overlay stack from application-wide React context
    const [state, dispatch] = React.useContext(OverlaysContext);
    const legacyOverlayStack = useLegacyOverlayStack();
    const { stack } = state;

    const getLastOpened = React.useCallback(() => stack.at(-1), [stack]);

    const getThisOverlayAndDescendants = React.useCallback(
        (overlay: OverlayInstance) => {
            const stackIndex = stack.findIndex(o => o.id === overlay.id);
            return stack.slice(stackIndex);
        },
        [stack],
    );

    const resetStack = React.useCallback(() => dispatch({ type: "RESET_STACK" }), [dispatch]);

    const openOverlay = React.useCallback(
        (overlay: OverlayInstance) => {
            dispatch({ type: "OPEN_OVERLAY", payload: overlay });
            if (overlay.props.usePortal && overlay.props.hasBackdrop) {
                // add a class to the body to prevent scrolling of content below the overlay
                document.body.classList.add(Classes.OVERLAY_OPEN);
            }
        },
        [dispatch],
    );

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
        [dispatch, stack],
    );

    if (!state.hasProvider) {
        if (!isNodeEnv("production")) {
            console.error(OVERLAY2_REQUIRES_OVERLAY_PROVDER);
        }
        return legacyOverlayStack;
    }

    return {
        closeOverlay,
        getLastOpened,
        getThisOverlayAndDescendants,
        openOverlay,
        resetStack,
    };
}
