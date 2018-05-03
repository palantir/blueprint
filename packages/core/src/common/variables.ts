/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// Not used (yet)
// import { Colors } from "./colors";

// @import "colors";
// @import "mixins";

const PT_GRID_SIZE = 10;
const PT_FONT_SIZE = PT_GRID_SIZE * 1.4;
const PT_Z_INDEX_BASE = 0;
const PT_BORDER_SHADOW_OPACITY = 0.1;
const PT_DROP_SHADOW_OPACITY = 2;

export const Variables = {

    // easily the most important variable, so it comes up top
    // (so other variables can use it to define themselves)
    PT_GRID_SIZE,

    PT_FONT_FAMILY_MONOSPACE: "monospace",

    PT_FONT_SIZE,
    PT_FONT_SIZE_LARGE: PT_GRID_SIZE * 1.6,
    PT_FONT_SIZE_SMALL: PT_GRID_SIZE * 1.2,

    // a little bit extra to ensure the height comes out to just over 18px (and browser rounds to 18px)
    PT_LINE_HEIGHT: (PT_GRID_SIZE * 1.8) / PT_FONT_SIZE + 0.0001,

    // Icon variables
    ICONS16_FAMILY: "Icons16",
    ICONS20_FAMILY: "Icons20",

    PT_ICON_SIZE_STANDARD: 16,
    PT_ICON_SIZE_LARGE: 20,

    // Grids & dimensions
    PT_BORDER_RADIUS: Math.floor(PT_GRID_SIZE / 3),

    // Buttons
    PT_BUTTON_HEIGHT: PT_GRID_SIZE * 3,
    PT_BUTTON_HEIGHT_SMALL: PT_GRID_SIZE * 2.4,
    PT_BUTTON_HEIGHT_LARGE: PT_GRID_SIZE * 4,

    //Inputs
    PT_INPUT_HEIGHT: PT_GRID_SIZE * 3,
    PT_INPUT_HEIGHT_LARGE: PT_GRID_SIZE * 4,

    // Others
    PT_NAVBAR_HEIGHT: PT_GRID_SIZE * 5,

    // Z-indices
    PT_Z_INDEX_BASE,
    PT_Z_INDEX_CONTENT: PT_Z_INDEX_BASE + 10,
    PT_Z_INDEX_OVERLAY: PT_Z_INDEX_BASE + 10,

    // Shadow Opacities
    PT_BORDER_SHADOW_OPACITY,
    PT_DROP_SHADOW_OPACITY,
    PT_DARK_BORDER_SHADOW_OPACITY: PT_BORDER_SHADOW_OPACITY * 2,
    PT_DARK_DROP_SHADOW_OPACITY: PT_DROP_SHADOW_OPACITY* 2,

    // Elevations
    // requires ColorAliases

    // Transitions
    PT_TRANSITION_EASE: "cubic-bezier(0.4, 1, 0.75, 0.9)",
    PT_TRANSITION_EASE_BOUNCE: "cubic-bezier(0.54, 1.12, 0.38, 1.11)",
    PT_TRANSITION_DURATION: "100ms",

    // Light theme styles
    // requires ColorAliases

    // Dark theme styles
    // requires ColorAliases
}

