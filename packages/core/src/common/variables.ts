/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// Not used (yet)
// import { Colors } from "./colors";

// @import "colors";
// @import "mixins";

const GRID_SIZE = 10;
const FONT_SIZE = GRID_SIZE * 1.4;
const Z_INDEX_BASE = 0;
const BORDER_SHADOW_OPACITY = 0.1;
const DROP_SHADOW_OPACITY = 2;

export const Variables = {

    // easily the most important variable, so it comes up top
    // (so other variables can use it to define themselves)
    GRID_SIZE,

    FONT_FAMILY_MONOSPACE: "monospace",

    FONT_SIZE,
    FONT_SIZE_LARGE: GRID_SIZE * 1.6,
    FONT_SIZE_SMALL: GRID_SIZE * 1.2,

    // a little bit extra to ensure the height comes out to just over 18px (and browser rounds to 18px)
    LINE_HEIGHT: (GRID_SIZE * 1.8) / FONT_SIZE + 0.0001,

    // Icon variables
    ICONS16_FAMILY: "Icons16",
    ICONS20_FAMILY: "Icons20",

    ICON_SIZE_STANDARD: 16,
    ICON_SIZE_LARGE: 20,

    // Grids & dimensions
    BORDER_RADIUS: Math.floor(GRID_SIZE / 3),

    // Buttons
    BUTTON_HEIGHT: GRID_SIZE * 3,
    BUTTON_HEIGHT_SMALL: GRID_SIZE * 2.4,
    BUTTON_HEIGHT_LARGE: GRID_SIZE * 4,

    //Inputs
    INPUT_HEIGHT: GRID_SIZE * 3,
    INPUT_HEIGHT_LARGE: GRID_SIZE * 4,

    // Others
    NAVBAR_HEIGHT: GRID_SIZE * 5,

    // Z-indices
    Z_INDEX_BASE,
    Z_INDEX_CONTENT: Z_INDEX_BASE + 10,
    Z_INDEX_OVERLAY: Z_INDEX_BASE + 10,

    // Shadow Opacities
    BORDER_SHADOW_OPACITY,
    DROP_SHADOW_OPACITY,
    DARK_BORDER_SHADOW_OPACITY: BORDER_SHADOW_OPACITY * 2,
    DARK_DROP_SHADOW_OPACITY: DROP_SHADOW_OPACITY* 2,

    // Elevations
    // requires ColorAliases

    // Transitions
    TRANSITION_EASE: "cubic-bezier(0.4, 1, 0.75, 0.9)",
    TRANSITION_EASE_BOUNCE: "cubic-bezier(0.54, 1.12, 0.38, 1.11)",
    TRANSITION_DURATION: "100ms",

    // Light theme styles
    // requires ColorAliases

    // Dark theme styles
    // requires ColorAliases
}

