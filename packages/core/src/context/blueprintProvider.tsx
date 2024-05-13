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

import { HotkeysProvider, type HotkeysProviderProps } from "./hotkeys/hotkeysProvider";
import { OverlaysProvider, type OverlaysProviderProps } from "./overlays/overlaysProvider";
import { type PortalContextOptions, PortalProvider } from "./portal/portalProvider";

// for some props interfaces, it helps to prefix their property names with the name of the provider
// to avoid any ambiguity in the API
type HotkeysProviderPrefix<T> = {
    [Property in keyof T as `hotkeysProvider${Capitalize<string & Property>}`]: T[Property];
};

export interface BlueprintProviderProps
    extends OverlaysProviderProps,
        PortalContextOptions,
        HotkeysProviderPrefix<HotkeysProviderProps> {
    // no props of its own, `children` comes from `OverlaysProviderProps`
}

/**
 * Composite Blueprint context provider which enables & manages various global behaviors of Blueprint applications.
 *
 * @see https://blueprintjs.com/docs/#core/context/blueprint-provider
 */
export const BlueprintProvider = ({ children, hotkeysProviderValue, ...props }: BlueprintProviderProps) => {
    return (
        <PortalProvider {...props}>
            <OverlaysProvider>
                <HotkeysProvider value={hotkeysProviderValue} {...props}>
                    {children}
                </HotkeysProvider>
            </OverlaysProvider>
        </PortalProvider>
    );
};
