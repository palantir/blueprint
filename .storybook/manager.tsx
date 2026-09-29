/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

// Storybook builds the manager with its own config and classic JSX runtime.
// React must be in scope here even though Blueprint's shared config uses the automatic runtime.
/** @jsxRuntime classic */
// eslint-disable-next-line import/no-extraneous-dependencies
import React from "react";
import { AddonPanel } from "storybook/internal/components";
import { addons, types } from "storybook/manager-api";

import { TokensPanel } from "./tokens/TokensPanel";

const ADDON_ID = "tokens";
const PANEL_ID = `${ADDON_ID}/panel`;

addons.register(ADDON_ID, () => {
    addons.add(PANEL_ID, {
        render: ({ active = false }) => (
            <AddonPanel active={active}>
                <TokensPanel />
            </AddonPanel>
        ),
        title: "Theme",
        type: types.PANEL,
    });
});
