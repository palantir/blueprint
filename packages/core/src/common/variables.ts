/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

export const GRID_SIZE = 10;
export const FONT_FAMILY_MONOSPACE = "monospace";

export const FONT_SIZE = GRID_SIZE * 1.4;
export const FONT_SIZE_LARGE = GRID_SIZE * 1.6;
export const FONT_SIZE_SMALL = GRID_SIZE * 1.2;

// a little bit extra to ensure the height comes out to just over 18px (and browser rounds to 18px)
export const LINE_HEIGHT = (GRID_SIZE * 1.8) / FONT_SIZE + 0.0001;

// Icon variables
export const ICONS16_FAMILY = "Icons16";
export const ICONS20_FAMILY = "Icons20";

export const ICON_SIZE_STANDARD = 16;
export const ICON_SIZE_LARGE = 20;

// Grids & dimensions
export const BORDER_RADIUS = Math.floor(GRID_SIZE / 3);

// Buttons
export const BUTTON_HEIGHT = GRID_SIZE * 3;
export const BUTTON_HEIGHT_SMALL = GRID_SIZE * 2.4;
export const BUTTON_HEIGHT_LARGE = GRID_SIZE * 4;

//Inputs
export const INPUT_HEIGHT = GRID_SIZE * 3;
export const INPUT_HEIGHT_LARGE = GRID_SIZE * 4;

// Others
export const NAVBAR_HEIGHT = GRID_SIZE * 5;

// Z-indices
export const Z_INDEX_BASE = 0;
export const Z_INDEX_CONTENT = Z_INDEX_BASE + 10;
export const Z_INDEX_OVERLAY = Z_INDEX_BASE + 10;

// Shadow Opacities
export const BORDER_SHADOW_OPACITY = 0.1;
export const DROP_SHADOW_OPACITY = 2;
export const DARK_BORDER_SHADOW_OPACITY = BORDER_SHADOW_OPACITY * 2;
export const DARK_DROP_SHADOW_OPACITY = DROP_SHADOW_OPACITY* 2;

// Elevations
// requires ColorAliases

// Transitions
export const TRANSITION_EASE = "cubic-bezier(0.4, 1, 0.75, 0.9)";
export const TRANSITION_EASE_BOUNCE = "cubic-bezier(0.54, 1.12, 0.38, 1.11)";
export const TRANSITION_DURATION = "100ms";

// Light theme styles
// requires ColorAliases

// Dark theme styles
// requires ColorAliases
