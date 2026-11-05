/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { createContext } from "react";

export type BlueprintThemeTokens = Readonly<Partial<Record<`--bp-${string}`, string>>>;

export const BlueprintThemeContext = createContext<BlueprintThemeTokens>({});
