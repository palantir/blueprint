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

import React, { createContext } from "react";

import { DISPLAYNAME_PREFIX } from "../../common";

export interface PortalContextState {
    /**
     * Additional CSS classes to add to _each_ `Portal` in this context.
     */
    portalClassName?: string;
}

const initialPortalContextState: PortalContextState = {};

export const PortalContext = createContext<PortalContextState>(initialPortalContextState);
PortalContext.displayName = `${DISPLAYNAME_PREFIX}.PortalContext`;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PortalProviderProps extends PortalContextState {
    // empty
}

export const PortalProvider: React.FC<PortalProviderProps> = ({ portalClassName, children }) => {
    return <PortalContext.Provider value={{ portalClassName }}>{children}</PortalContext.Provider>;
};
