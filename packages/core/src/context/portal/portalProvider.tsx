/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
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

import { createContext, useMemo } from "react";

import type { BlueprintThemeTokens } from "../theme/themeContext";
import { useBlueprintTheme } from "../theme/useBlueprintTheme";

export interface PortalContextOptions {
    /** Additional CSS classes to add to all `Portal` elements in this React context. */
    portalClassName?: string;
    /** The HTML element that all `Portal` elements in this React context will be added as children to  */
    portalContainer?: HTMLElement;
}

interface PortalContextValue extends PortalContextOptions {
    portalTheme?: BlueprintThemeTokens;
}

/**
 * A React context to set options for all portals in a given subtree.
 * Do not use this PortalContext directly, instead use PortalProvider to set the options.
 */
export const PortalContext = createContext<PortalContextValue>({});

/**
 * Portal context provider.
 *
 * @see https://blueprintjs.com/docs/#core/context/portal-provider
 */
export const PortalProvider = ({
    children,
    portalClassName,
    portalContainer,
}: React.PropsWithChildren<PortalContextOptions>) => {
    const portalTheme = useBlueprintTheme();
    const contextOptions = useMemo<PortalContextValue>(
        () => ({
            portalClassName,
            portalContainer,
            portalTheme,
        }),
        [portalClassName, portalContainer, portalTheme],
    );
    return <PortalContext.Provider value={contextOptions}>{children}</PortalContext.Provider>;
};
