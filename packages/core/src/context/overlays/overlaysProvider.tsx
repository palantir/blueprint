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

import type { OverlayInstance } from "../../components/overlay2/overlayInstance";

// N.B. using a mutable ref for the stack is much easier to work with in the world of hooks and FCs.
// This matches the mutable global behavior of the old Overlay implementation in Blueprint v5. An alternative
// approach was considered with an immutable array data structure and a reducer, but that implementation
// caused lots of unnecessary invalidation of `React.useCallback()` for document-level event handlers, which
// led to memory leaks and bugs.
export interface OverlaysContextState {
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
    stack: React.MutableRefObject<OverlayInstance[]>;
}

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
export const OverlaysContext = React.createContext<OverlaysContextState>({
    hasProvider: false,
    stack: { current: [] },
});

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
    const stack = React.useRef<OverlayInstance[]>([]);
    const contextValue = React.useMemo(() => ({ hasProvider: true, stack }), [stack]);
    return <OverlaysContext.Provider value={contextValue}>{children}</OverlaysContext.Provider>;
};
