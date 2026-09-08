/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { createContext } from "react";

export const BLUEPRINT_NEXT_CLASS = "bp-next";

export type BlueprintTokenMap = Record<`--bp-${string}`, string>;

export const BlueprintThemeContext = createContext<BlueprintTokenMap | undefined>(undefined);
