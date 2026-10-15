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

import classNames from "classnames";
import { createContext, useContext, useId, useMemo } from "react";

import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import type { BlueprintThemeTokens } from "../blueprintTheme";

export interface PortalContextOptions {
    /** Additional CSS classes to add to all `Portal` elements in this React context. */
    portalClassName?: string;
    /** The HTML element that all `Portal` elements in this React context will be added as children to  */
    portalContainer?: HTMLElement;
}

export interface PortalProviderProps extends PortalContextOptions {
    /**
     * CSS tokens scoped to portals in this provider. Pass an empty map to clear overrides without
     * remounting open portals. Omit to preserve existing portal classes without creating a theme scope.
     */
    portalTokens?: BlueprintThemeTokens;
}

const THEME_CLASS_PREFIX = "bp-portal-theme-";

/**
 * A React context to set options for all portals in a given subtree.
 * Do not use this PortalContext directly, instead use PortalProvider to set the options.
 */
export const PortalContext = createContext<PortalContextOptions>({});

/**
 * Portal context provider.
 *
 * @see https://blueprintjs.com/docs/#core/context/portal-provider
 */
export const PortalProvider = ({
    children,
    portalClassName,
    portalContainer,
    portalTokens,
}: React.PropsWithChildren<PortalProviderProps>) => {
    // Portal recreates its DOM node when its class changes; token updates must keep this scope stable.
    const id = useId();
    const themeClassName = `${THEME_CLASS_PREFIX}${id.replace(/:/g, "")}`;
    const resolvedClassName =
        portalTokens === undefined
            ? portalClassName
            : classNames(
                  portalClassName?.split(/\s+/).filter(name => !name.startsWith(THEME_CLASS_PREFIX)),
                  themeClassName,
              );
    useIsomorphicLayoutEffect(() => {
        if (portalTokens == null || Object.keys(portalTokens).length === 0) {
            return;
        }
        const ownerDocument = portalContainer?.ownerDocument ?? document;
        const styleElement = ownerDocument.createElement("style");
        ownerDocument.head.appendChild(styleElement);
        const sheet = styleElement.sheet;
        if (sheet != null) {
            sheet.insertRule(`.${themeClassName} {}`);
            const rule = sheet.cssRules[0] as CSSStyleRule;
            for (const [name, value] of Object.entries(portalTokens)) {
                rule.style.setProperty(name, String(value));
            }
        }
        return () => styleElement.remove();
    }, [portalContainer, portalTokens, themeClassName]);
    const contextOptions = useMemo<PortalContextOptions>(
        () => ({
            portalClassName: resolvedClassName,
            portalContainer,
        }),
        [resolvedClassName, portalContainer],
    );
    return <PortalContext.Provider value={contextOptions}>{children}</PortalContext.Provider>;
};

/** Capture resolved portal options to restore them with PortalProvider in a separate React root. */
export function usePortalContext(): PortalContextOptions {
    return useContext(PortalContext);
}
