/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { PureArgsTable } from "@storybook/addon-docs/blocks";
import type { ArgTypes } from "@storybook/react-vite";
// This panel uses the manager's separate build config and classic JSX runtime.
// React must be in scope here even though Blueprint's shared config uses the automatic runtime.
// eslint-disable-next-line import/no-extraneous-dependencies -- Storybook uses the root React devDependency.
import React, { useMemo } from "react";
import { useGlobals, useStorybookState, useStoryPrepared } from "storybook/manager-api";

import { THEME_INTENTS, type ThemeColors } from "./intentScale";

const ROWS: ArgTypes = Object.fromEntries(
    THEME_INTENTS.map(intent => [
        intent,
        {
            control: { type: "color" },
            description: `Generates the ${intent} scale (both themes) from one color`,
            name: intent.charAt(0).toUpperCase() + intent.slice(1),
        },
    ]),
);

export function TokensPanel() {
    const [globals, updateGlobals] = useGlobals();
    const { storyId } = useStorybookState();
    const isStoryPrepared = useStoryPrepared(storyId);
    const themeColors: ThemeColors = useMemo(() => globals.themeColors ?? {}, [globals.themeColors]);

    const handleUpdateArgs = React.useCallback(
        (updates: ThemeColors) => updateGlobals({ themeColors: { ...themeColors, ...updates } }),
        [themeColors, updateGlobals],
    );

    return (
        <PureArgsTable
            compact={true}
            args={themeColors}
            inAddonPanel={true}
            isLoading={!isStoryPrepared}
            rows={ROWS}
            updateArgs={handleUpdateArgs}
        />
    );
}
