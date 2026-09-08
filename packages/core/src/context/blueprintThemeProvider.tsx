/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import classNames from "classnames";

import { type Props } from "../common/props";

import { BLUEPRINT_NEXT_CLASS, BlueprintThemeContext, type BlueprintTokenMap } from "./blueprintThemeContext";

export interface BlueprintThemeProviderProps extends Props {
    readonly children?: React.ReactNode;
    readonly tokens: BlueprintTokenMap;
}

/** Applies BP7 light tokens to a DOM subtree and any Blueprint portals it opens. */
export function BlueprintThemeProvider({ children, className, tokens }: BlueprintThemeProviderProps) {
    const style: React.CSSProperties = {
        // The wrapper provides a CSS inheritance boundary without participating in layout.
        display: "contents",
        ...tokens,
    };

    return (
        <BlueprintThemeContext.Provider value={tokens}>
            <div className={classNames(BLUEPRINT_NEXT_CLASS, className)} style={style}>
                {children}
            </div>
        </BlueprintThemeContext.Provider>
    );
}
