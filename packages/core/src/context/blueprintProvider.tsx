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

import { useContext } from "react";

import {
    type BlueprintTheme,
    BlueprintThemeContext,
    type BlueprintThemeTokens,
    useBlueprintTheme,
} from "./blueprintTheme";
import { HotkeysProvider, type HotkeysProviderProps } from "./hotkeys/hotkeysProvider";
import { type OverlaysContextState, OverlaysProvider, type OverlaysProviderProps } from "./overlays/overlaysProvider";
import { PortalContext, PortalProvider, type PortalProviderProps } from "./portal/portalProvider";

// for some props interfaces, it helps to prefix their property names with the name of the provider
// to avoid any ambiguity in the API
type HotkeysProviderPrefix<T> = {
    [Property in keyof T as `hotkeysProvider${Capitalize<string & Property>}`]: T[Property];
};

export interface BlueprintProviderProps
    extends Omit<OverlaysProviderProps, "value">,
        PortalProviderProps,
        HotkeysProviderPrefix<HotkeysProviderProps> {
    /** Reuse an application overlay stack across nested providers or separate React roots. */
    overlaysProviderValue?: OverlaysContextState;
    /** Theme application content via BlueprintThemeContext and scope the same tokens to portals. */
    theme?: BlueprintTheme;
    /** Disable theme overrides without remounting open portals. @default true */
    themeEnabled?: boolean;
}

const EMPTY_TOKENS: BlueprintThemeTokens = {};

/**
 * Composite Blueprint context provider which enables & manages various global behaviors of Blueprint applications.
 *
 * @see https://blueprintjs.com/docs/#core/context/blueprint-provider
 */
export const BlueprintProvider = (props: BlueprintProviderProps) => {
    const {
        children,
        hotkeysProviderValue,
        hotkeysProviderDialogProps,
        hotkeysProviderRenderDialog,
        portalClassName,
        portalContainer,
        portalTokens,
        overlaysProviderValue,
        theme,
        themeEnabled = true,
    } = props;
    const inheritedPortalOptions = useContext(PortalContext);
    const hasTheme = "theme" in props;
    const themeTokens = useBlueprintTheme(theme, themeEnabled);
    const tokens = portalTokens ?? (hasTheme ? (themeTokens ?? EMPTY_TOKENS) : undefined);
    return (
        <BlueprintThemeContext.Provider value={tokens}>
            <PortalProvider
                portalClassName={portalClassName ?? (hasTheme ? inheritedPortalOptions.portalClassName : undefined)}
                portalContainer={portalContainer ?? (hasTheme ? inheritedPortalOptions.portalContainer : undefined)}
                portalTokens={tokens}
            >
                <OverlaysProvider value={overlaysProviderValue}>
                    <HotkeysProvider
                        value={hotkeysProviderValue}
                        dialogProps={hotkeysProviderDialogProps}
                        renderDialog={hotkeysProviderRenderDialog}
                    >
                        {children}
                    </HotkeysProvider>
                </OverlaysProvider>
            </PortalProvider>
        </BlueprintThemeContext.Provider>
    );
};
