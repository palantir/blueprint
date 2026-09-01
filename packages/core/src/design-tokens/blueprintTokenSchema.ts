/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

/**
 * Do not edit directly, this file was auto-generated.
 */

export const BLUEPRINT_TOKEN_SCHEMA = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "additionalProperties": false,
    "patternProperties": {
        "^--bp-.*$": {
            "type": "string"
        }
    },
    "properties": {
        "--bp-emphasis-blur": {
            "default": "12px",
            "type": "string"
        },
        "--bp-emphasis-disabled-opacity": {
            "default": "0.4",
            "type": "string"
        },
        "--bp-emphasis-ease-bounce": {
            "default": "cubic-bezier(0.54, 1.12, 0.38, 1.11)",
            "type": "string"
        },
        "--bp-emphasis-ease-default": {
            "default": "cubic-bezier(0.4, 1, 0.75, 0.9)",
            "type": "string"
        },
        "--bp-emphasis-focus-color": {
            "default": "var(--bp-intent-primary-500)",
            "type": "string"
        },
        "--bp-emphasis-focus-offset": {
            "default": "2px",
            "type": "string"
        },
        "--bp-emphasis-focus-width": {
            "default": "2px",
            "type": "string"
        },
        "--bp-emphasis-motion-reduced": {
            "default": "0",
            "description": "0 = motion allowed, 1 = reduced motion",
            "type": "string"
        },
        "--bp-emphasis-transition-duration": {
            "default": "100ms",
            "type": "string"
        },
        "--bp-emphasis-translucence-opacity": {
            "default": "0.95",
            "type": "string"
        },
        "--bp-intent-danger-100": {
            "default": "var(--bp-palette-red-100)",
            "type": "string"
        },
        "--bp-intent-danger-1000": {
            "default": "var(--bp-palette-red-1000)",
            "type": "string"
        },
        "--bp-intent-danger-200": {
            "default": "var(--bp-palette-red-200)",
            "type": "string"
        },
        "--bp-intent-danger-300": {
            "default": "var(--bp-palette-red-300)",
            "type": "string"
        },
        "--bp-intent-danger-400": {
            "default": "var(--bp-palette-red-400)",
            "type": "string"
        },
        "--bp-intent-danger-500": {
            "default": "var(--bp-palette-red-500)",
            "type": "string"
        },
        "--bp-intent-danger-600": {
            "default": "var(--bp-palette-red-600)",
            "type": "string"
        },
        "--bp-intent-danger-700": {
            "default": "var(--bp-palette-red-700)",
            "type": "string"
        },
        "--bp-intent-danger-800": {
            "default": "var(--bp-palette-red-800)",
            "type": "string"
        },
        "--bp-intent-danger-900": {
            "default": "var(--bp-palette-red-900)",
            "type": "string"
        },
        "--bp-intent-danger-foreground": {
            "default": "var(--bp-palette-white-1000)",
            "type": "string"
        },
        "--bp-intent-neutral-100": {
            "default": "var(--bp-palette-grey-100)",
            "type": "string"
        },
        "--bp-intent-neutral-1000": {
            "default": "var(--bp-palette-grey-1000)",
            "type": "string"
        },
        "--bp-intent-neutral-200": {
            "default": "var(--bp-palette-grey-200)",
            "type": "string"
        },
        "--bp-intent-neutral-300": {
            "default": "var(--bp-palette-grey-300)",
            "type": "string"
        },
        "--bp-intent-neutral-400": {
            "default": "var(--bp-palette-grey-400)",
            "type": "string"
        },
        "--bp-intent-neutral-500": {
            "default": "var(--bp-palette-grey-500)",
            "type": "string"
        },
        "--bp-intent-neutral-600": {
            "default": "var(--bp-palette-grey-600)",
            "type": "string"
        },
        "--bp-intent-neutral-700": {
            "default": "var(--bp-palette-grey-700)",
            "type": "string"
        },
        "--bp-intent-neutral-800": {
            "default": "var(--bp-palette-grey-800)",
            "type": "string"
        },
        "--bp-intent-neutral-900": {
            "default": "var(--bp-palette-grey-900)",
            "type": "string"
        },
        "--bp-intent-neutral-foreground": {
            "default": "var(--bp-palette-white-1000)",
            "type": "string"
        },
        "--bp-intent-primary-100": {
            "default": "var(--bp-palette-blue-100)",
            "type": "string"
        },
        "--bp-intent-primary-1000": {
            "default": "var(--bp-palette-blue-1000)",
            "type": "string"
        },
        "--bp-intent-primary-200": {
            "default": "var(--bp-palette-blue-200)",
            "type": "string"
        },
        "--bp-intent-primary-300": {
            "default": "var(--bp-palette-blue-300)",
            "type": "string"
        },
        "--bp-intent-primary-400": {
            "default": "var(--bp-palette-blue-400)",
            "type": "string"
        },
        "--bp-intent-primary-500": {
            "default": "var(--bp-palette-blue-500)",
            "type": "string"
        },
        "--bp-intent-primary-600": {
            "default": "var(--bp-palette-blue-600)",
            "type": "string"
        },
        "--bp-intent-primary-700": {
            "default": "var(--bp-palette-blue-700)",
            "type": "string"
        },
        "--bp-intent-primary-800": {
            "default": "var(--bp-palette-blue-800)",
            "type": "string"
        },
        "--bp-intent-primary-900": {
            "default": "var(--bp-palette-blue-900)",
            "type": "string"
        },
        "--bp-intent-primary-foreground": {
            "default": "var(--bp-palette-white-1000)",
            "type": "string"
        },
        "--bp-intent-success-100": {
            "default": "var(--bp-palette-green-100)",
            "type": "string"
        },
        "--bp-intent-success-1000": {
            "default": "var(--bp-palette-green-1000)",
            "type": "string"
        },
        "--bp-intent-success-200": {
            "default": "var(--bp-palette-green-200)",
            "type": "string"
        },
        "--bp-intent-success-300": {
            "default": "var(--bp-palette-green-300)",
            "type": "string"
        },
        "--bp-intent-success-400": {
            "default": "var(--bp-palette-green-400)",
            "type": "string"
        },
        "--bp-intent-success-500": {
            "default": "var(--bp-palette-green-500)",
            "type": "string"
        },
        "--bp-intent-success-600": {
            "default": "var(--bp-palette-green-600)",
            "type": "string"
        },
        "--bp-intent-success-700": {
            "default": "var(--bp-palette-green-700)",
            "type": "string"
        },
        "--bp-intent-success-800": {
            "default": "var(--bp-palette-green-800)",
            "type": "string"
        },
        "--bp-intent-success-900": {
            "default": "var(--bp-palette-green-900)",
            "type": "string"
        },
        "--bp-intent-success-foreground": {
            "default": "var(--bp-palette-white-1000)",
            "type": "string"
        },
        "--bp-intent-warning-100": {
            "default": "var(--bp-palette-orange-100)",
            "type": "string"
        },
        "--bp-intent-warning-1000": {
            "default": "var(--bp-palette-orange-1000)",
            "type": "string"
        },
        "--bp-intent-warning-200": {
            "default": "var(--bp-palette-orange-200)",
            "type": "string"
        },
        "--bp-intent-warning-300": {
            "default": "var(--bp-palette-orange-300)",
            "type": "string"
        },
        "--bp-intent-warning-400": {
            "default": "var(--bp-palette-orange-400)",
            "type": "string"
        },
        "--bp-intent-warning-500": {
            "default": "var(--bp-palette-orange-500)",
            "type": "string"
        },
        "--bp-intent-warning-600": {
            "default": "var(--bp-palette-orange-600)",
            "type": "string"
        },
        "--bp-intent-warning-700": {
            "default": "var(--bp-palette-orange-700)",
            "type": "string"
        },
        "--bp-intent-warning-800": {
            "default": "var(--bp-palette-orange-800)",
            "type": "string"
        },
        "--bp-intent-warning-900": {
            "default": "var(--bp-palette-orange-900)",
            "type": "string"
        },
        "--bp-intent-warning-foreground": {
            "default": "var(--bp-palette-white-1000)",
            "type": "string"
        },
        "--bp-palette-black-100": {
            "default": "oklch(0.0696 0.0248 257.1 / 0.025)",
            "type": "string"
        },
        "--bp-palette-black-1000": {
            "default": "oklch(0.0696 0.0248 257.1)",
            "type": "string"
        },
        "--bp-palette-black-200": {
            "default": "oklch(0.0696 0.0248 257.1 / 0.09)",
            "type": "string"
        },
        "--bp-palette-black-300": {
            "default": "oklch(0.0696 0.0248 257.1 / 0.12)",
            "type": "string"
        },
        "--bp-palette-black-400": {
            "default": "oklch(0.0696 0.0248 257.1 / 0.3)",
            "type": "string"
        },
        "--bp-palette-black-500": {
            "default": "oklch(0.0696 0.0248 257.1 / 0.5)",
            "type": "string"
        },
        "--bp-palette-black-600": {
            "default": "oklch(0.0696 0.0248 257.1 / 0.8)",
            "type": "string"
        },
        "--bp-palette-black-700": {
            "default": "oklch(0.0696 0.0248 257.1 / 0.85)",
            "type": "string"
        },
        "--bp-palette-black-800": {
            "default": "oklch(0.0696 0.0248 257.1 / 0.9)",
            "type": "string"
        },
        "--bp-palette-black-900": {
            "default": "oklch(0.0696 0.0248 257.1 / 0.95)",
            "type": "string"
        },
        "--bp-palette-blue-100": {
            "default": "oklch(0.9152 0.0416 255.01)",
            "type": "string"
        },
        "--bp-palette-blue-1000": {
            "default": "oklch(0.0988 0.033 255.43)",
            "type": "string"
        },
        "--bp-palette-blue-200": {
            "default": "oklch(0.8298 0.0858 256.19)",
            "type": "string"
        },
        "--bp-palette-blue-300": {
            "default": "oklch(0.745 0.1224 257.51)",
            "type": "string"
        },
        "--bp-palette-blue-400": {
            "default": "oklch(0.6561 0.1448 257.73)",
            "type": "string"
        },
        "--bp-palette-blue-500": {
            "default": "oklch(0.5678 0.1553 257.52)",
            "type": "string"
        },
        "--bp-palette-blue-600": {
            "default": "oklch(0.476 0.1544 257.66)",
            "type": "string"
        },
        "--bp-palette-blue-700": {
            "default": "oklch(0.3847 0.1418 257.9)",
            "type": "string"
        },
        "--bp-palette-blue-800": {
            "default": "oklch(0.2947 0.1145 259.06)",
            "type": "string"
        },
        "--bp-palette-blue-900": {
            "default": "oklch(0.1991 0.0778 259.16)",
            "type": "string"
        },
        "--bp-palette-cerulean-100": {
            "default": "oklch(0.9279 0.038 242.12)",
            "type": "string"
        },
        "--bp-palette-cerulean-1000": {
            "default": "oklch(0.1041 0.028 247.9)",
            "type": "string"
        },
        "--bp-palette-cerulean-200": {
            "default": "oklch(0.8424 0.08 243.25)",
            "type": "string"
        },
        "--bp-palette-cerulean-300": {
            "default": "oklch(0.7564 0.1098 242.75)",
            "type": "string"
        },
        "--bp-palette-cerulean-400": {
            "default": "oklch(0.6664 0.1299 242.89)",
            "type": "string"
        },
        "--bp-palette-cerulean-500": {
            "default": "oklch(0.5762 0.1392 242.96)",
            "type": "string"
        },
        "--bp-palette-cerulean-600": {
            "default": "oklch(0.4906 0.1308 247.59)",
            "type": "string"
        },
        "--bp-palette-cerulean-700": {
            "default": "oklch(0.3992 0.1129 249.96)",
            "type": "string"
        },
        "--bp-palette-cerulean-800": {
            "default": "oklch(0.3042 0.0918 252.3)",
            "type": "string"
        },
        "--bp-palette-cerulean-900": {
            "default": "oklch(0.2051 0.0637 253.21)",
            "type": "string"
        },
        "--bp-palette-forest-100": {
            "default": "oklch(0.9147 0.0437 144.16)",
            "type": "string"
        },
        "--bp-palette-forest-1000": {
            "default": "oklch(0.0996 0.0339 142.5)",
            "type": "string"
        },
        "--bp-palette-forest-200": {
            "default": "oklch(0.8299 0.0892 144.25)",
            "type": "string"
        },
        "--bp-palette-forest-300": {
            "default": "oklch(0.7429 0.1232 144.21)",
            "type": "string"
        },
        "--bp-palette-forest-400": {
            "default": "oklch(0.6577 0.1471 143.89)",
            "type": "string"
        },
        "--bp-palette-forest-500": {
            "default": "oklch(0.5674 0.1567 144.05)",
            "type": "string"
        },
        "--bp-palette-forest-600": {
            "default": "oklch(0.4762 0.1546 143.96)",
            "type": "string"
        },
        "--bp-palette-forest-700": {
            "default": "oklch(0.3895 0.1325 142.5)",
            "type": "string"
        },
        "--bp-palette-forest-800": {
            "default": "oklch(0.2986 0.1016 142.5)",
            "type": "string"
        },
        "--bp-palette-forest-900": {
            "default": "oklch(0.2036 0.0693 142.5)",
            "type": "string"
        },
        "--bp-palette-gold-100": {
            "default": "oklch(0.917 0.033 74.78)",
            "type": "string"
        },
        "--bp-palette-gold-1000": {
            "default": "oklch(0.1042 0.0219 75.86)",
            "type": "string"
        },
        "--bp-palette-gold-200": {
            "default": "oklch(0.833 0.0679 76.25)",
            "type": "string"
        },
        "--bp-palette-gold-300": {
            "default": "oklch(0.7456 0.0942 77.26)",
            "type": "string"
        },
        "--bp-palette-gold-400": {
            "default": "oklch(0.6589 0.1109 76.66)",
            "type": "string"
        },
        "--bp-palette-gold-500": {
            "default": "oklch(0.5691 0.1192 76.81)",
            "type": "string"
        },
        "--bp-palette-gold-600": {
            "default": "oklch(0.4812 0.1037 70.85)",
            "type": "string"
        },
        "--bp-palette-gold-700": {
            "default": "oklch(0.3887 0.0844 69.6)",
            "type": "string"
        },
        "--bp-palette-gold-800": {
            "default": "oklch(0.2956 0.0654 66.82)",
            "type": "string"
        },
        "--bp-palette-gold-900": {
            "default": "oklch(0.1985 0.0458 61.82)",
            "type": "string"
        },
        "--bp-palette-green-100": {
            "default": "oklch(0.923 0.0407 153.1)",
            "type": "string"
        },
        "--bp-palette-green-1000": {
            "default": "oklch(0.1005 0.0274 150.49)",
            "type": "string"
        },
        "--bp-palette-green-200": {
            "default": "oklch(0.8372 0.0835 152.92)",
            "type": "string"
        },
        "--bp-palette-green-300": {
            "default": "oklch(0.7515 0.1177 152.65)",
            "type": "string"
        },
        "--bp-palette-green-400": {
            "default": "oklch(0.6634 0.1379 152.81)",
            "type": "string"
        },
        "--bp-palette-green-500": {
            "default": "oklch(0.5727 0.148 152.83)",
            "type": "string"
        },
        "--bp-palette-green-600": {
            "default": "oklch(0.4882 0.1363 149.44)",
            "type": "string"
        },
        "--bp-palette-green-700": {
            "default": "oklch(0.3983 0.1159 147.78)",
            "type": "string"
        },
        "--bp-palette-green-800": {
            "default": "oklch(0.3034 0.0915 146.46)",
            "type": "string"
        },
        "--bp-palette-green-900": {
            "default": "oklch(0.208 0.0654 144.99)",
            "type": "string"
        },
        "--bp-palette-grey-100": {
            "default": "oklch(0.9525 0.0142 254.61)",
            "type": "string"
        },
        "--bp-palette-grey-1000": {
            "default": "oklch(0.1804 0.0165 256.84)",
            "type": "string"
        },
        "--bp-palette-grey-200": {
            "default": "oklch(0.8611 0.0146 254.62)",
            "type": "string"
        },
        "--bp-palette-grey-300": {
            "default": "oklch(0.77 0.0138 251.59)",
            "type": "string"
        },
        "--bp-palette-grey-400": {
            "default": "oklch(0.6773 0.0137 255.54)",
            "type": "string"
        },
        "--bp-palette-grey-500": {
            "default": "oklch(0.5839 0.0142 255.55)",
            "type": "string"
        },
        "--bp-palette-grey-600": {
            "default": "oklch(0.4902 0.0148 255.57)",
            "type": "string"
        },
        "--bp-palette-grey-700": {
            "default": "oklch(0.3954 0.0157 255.6)",
            "type": "string"
        },
        "--bp-palette-grey-800": {
            "default": "oklch(0.2916 0.0163 259.79)",
            "type": "string"
        },
        "--bp-palette-grey-900": {
            "default": "oklch(0.2336 0.0172 259.75)",
            "type": "string"
        },
        "--bp-palette-indigo-100": {
            "default": "oklch(0.9151 0.0434 288.38)",
            "type": "string"
        },
        "--bp-palette-indigo-1000": {
            "default": "oklch(0.1002 0.0333 285.73)",
            "type": "string"
        },
        "--bp-palette-indigo-200": {
            "default": "oklch(0.831 0.0891 287.87)",
            "type": "string"
        },
        "--bp-palette-indigo-300": {
            "default": "oklch(0.7449 0.124 288.27)",
            "type": "string"
        },
        "--bp-palette-indigo-400": {
            "default": "oklch(0.6568 0.1457 288.61)",
            "type": "string"
        },
        "--bp-palette-indigo-500": {
            "default": "oklch(0.568 0.1565 288.26)",
            "type": "string"
        },
        "--bp-palette-indigo-600": {
            "default": "oklch(0.4773 0.1546 288.21)",
            "type": "string"
        },
        "--bp-palette-indigo-700": {
            "default": "oklch(0.3859 0.1412 288.29)",
            "type": "string"
        },
        "--bp-palette-indigo-800": {
            "default": "oklch(0.2916 0.117 288.04)",
            "type": "string"
        },
        "--bp-palette-indigo-900": {
            "default": "oklch(0.1984 0.0807 288.23)",
            "type": "string"
        },
        "--bp-palette-lime-100": {
            "default": "oklch(0.9152 0.0391 124.67)",
            "type": "string"
        },
        "--bp-palette-lime-1000": {
            "default": "oklch(0.0982 0.0252 126.59)",
            "type": "string"
        },
        "--bp-palette-lime-200": {
            "default": "oklch(0.8304 0.0808 124.3)",
            "type": "string"
        },
        "--bp-palette-lime-300": {
            "default": "oklch(0.7458 0.1128 124.51)",
            "type": "string"
        },
        "--bp-palette-lime-400": {
            "default": "oklch(0.6581 0.1329 124.48)",
            "type": "string"
        },
        "--bp-palette-lime-500": {
            "default": "oklch(0.5684 0.1419 124.44)",
            "type": "string"
        },
        "--bp-palette-lime-600": {
            "default": "oklch(0.4799 0.1225 126.2)",
            "type": "string"
        },
        "--bp-palette-lime-700": {
            "default": "oklch(0.3867 0.0993 126.69)",
            "type": "string"
        },
        "--bp-palette-lime-800": {
            "default": "oklch(0.295 0.0762 127.16)",
            "type": "string"
        },
        "--bp-palette-lime-900": {
            "default": "oklch(0.1996 0.0521 127.85)",
            "type": "string"
        },
        "--bp-palette-orange-100": {
            "default": "oklch(0.9147 0.0427 47.48)",
            "type": "string"
        },
        "--bp-palette-orange-1000": {
            "default": "oklch(0.1011 0.0325 38.79)",
            "type": "string"
        },
        "--bp-palette-orange-200": {
            "default": "oklch(0.8297 0.0891 47.62)",
            "type": "string"
        },
        "--bp-palette-orange-300": {
            "default": "oklch(0.7426 0.1236 47.04)",
            "type": "string"
        },
        "--bp-palette-orange-400": {
            "default": "oklch(0.6562 0.1455 47.13)",
            "type": "string"
        },
        "--bp-palette-orange-500": {
            "default": "oklch(0.5673 0.1563 47.24)",
            "type": "string"
        },
        "--bp-palette-orange-600": {
            "default": "oklch(0.4784 0.1481 40.69)",
            "type": "string"
        },
        "--bp-palette-orange-700": {
            "default": "oklch(0.3867 0.1248 38.65)",
            "type": "string"
        },
        "--bp-palette-orange-800": {
            "default": "oklch(0.2943 0.0996 36.52)",
            "type": "string"
        },
        "--bp-palette-orange-900": {
            "default": "oklch(0.1971 0.0737 32.5)",
            "type": "string"
        },
        "--bp-palette-red-100": {
            "default": "oklch(0.9133 0.0428 23.3)",
            "type": "string"
        },
        "--bp-palette-red-1000": {
            "default": "oklch(0.102 0.0309 24.44)",
            "type": "string"
        },
        "--bp-palette-red-200": {
            "default": "oklch(0.8283 0.0897 22.54)",
            "type": "string"
        },
        "--bp-palette-red-300": {
            "default": "oklch(0.7422 0.1225 22.88)",
            "type": "string"
        },
        "--bp-palette-red-400": {
            "default": "oklch(0.6548 0.145 22.88)",
            "type": "string"
        },
        "--bp-palette-red-500": {
            "default": "oklch(0.5667 0.1557 23.02)",
            "type": "string"
        },
        "--bp-palette-red-600": {
            "default": "oklch(0.4771 0.1549 23.18)",
            "type": "string"
        },
        "--bp-palette-red-700": {
            "default": "oklch(0.3839 0.1416 22.86)",
            "type": "string"
        },
        "--bp-palette-red-800": {
            "default": "oklch(0.2913 0.1164 23.21)",
            "type": "string"
        },
        "--bp-palette-red-900": {
            "default": "oklch(0.1977 0.0797 22.61)",
            "type": "string"
        },
        "--bp-palette-rose-100": {
            "default": "oklch(0.9163 0.0435 3.75)",
            "type": "string"
        },
        "--bp-palette-rose-1000": {
            "default": "oklch(0.1039 0.0313 3.71)",
            "type": "string"
        },
        "--bp-palette-rose-200": {
            "default": "oklch(0.83 0.0902 3.46)",
            "type": "string"
        },
        "--bp-palette-rose-300": {
            "default": "oklch(0.7437 0.1247 3.85)",
            "type": "string"
        },
        "--bp-palette-rose-400": {
            "default": "oklch(0.6559 0.1464 3.72)",
            "type": "string"
        },
        "--bp-palette-rose-500": {
            "default": "oklch(0.5678 0.1571 3.99)",
            "type": "string"
        },
        "--bp-palette-rose-600": {
            "default": "oklch(0.4779 0.1563 3.87)",
            "type": "string"
        },
        "--bp-palette-rose-700": {
            "default": "oklch(0.3858 0.1435 3.98)",
            "type": "string"
        },
        "--bp-palette-rose-800": {
            "default": "oklch(0.2918 0.1174 3.97)",
            "type": "string"
        },
        "--bp-palette-rose-900": {
            "default": "oklch(0.1989 0.0799 4.8)",
            "type": "string"
        },
        "--bp-palette-sepia-100": {
            "default": "oklch(0.9191 0.0376 59.54)",
            "type": "string"
        },
        "--bp-palette-sepia-1000": {
            "default": "oklch(0.1027 0.0258 53.71)",
            "type": "string"
        },
        "--bp-palette-sepia-200": {
            "default": "oklch(0.8349 0.0776 58.12)",
            "type": "string"
        },
        "--bp-palette-sepia-300": {
            "default": "oklch(0.7477 0.1075 58.59)",
            "type": "string"
        },
        "--bp-palette-sepia-400": {
            "default": "oklch(0.6589 0.1274 57.94)",
            "type": "string"
        },
        "--bp-palette-sepia-500": {
            "default": "oklch(0.5701 0.1364 58.06)",
            "type": "string"
        },
        "--bp-palette-sepia-600": {
            "default": "oklch(0.4805 0.1254 50.95)",
            "type": "string"
        },
        "--bp-palette-sepia-700": {
            "default": "oklch(0.3897 0.1037 49.55)",
            "type": "string"
        },
        "--bp-palette-sepia-800": {
            "default": "oklch(0.295 0.0821 46.65)",
            "type": "string"
        },
        "--bp-palette-sepia-900": {
            "default": "oklch(0.2002 0.0596 42.68)",
            "type": "string"
        },
        "--bp-palette-turquoise-100": {
            "default": "oklch(0.9281 0.0291 183.33)",
            "type": "string"
        },
        "--bp-palette-turquoise-1000": {
            "default": "oklch(0.1032 0.0184 182.95)",
            "type": "string"
        },
        "--bp-palette-turquoise-200": {
            "default": "oklch(0.8417 0.058 183.74)",
            "type": "string"
        },
        "--bp-palette-turquoise-300": {
            "default": "oklch(0.7538 0.08 184.32)",
            "type": "string"
        },
        "--bp-palette-turquoise-400": {
            "default": "oklch(0.6662 0.095 184.43)",
            "type": "string"
        },
        "--bp-palette-turquoise-500": {
            "default": "oklch(0.5753 0.1016 184.33)",
            "type": "string"
        },
        "--bp-palette-turquoise-600": {
            "default": "oklch(0.4895 0.0871 183.14)",
            "type": "string"
        },
        "--bp-palette-turquoise-700": {
            "default": "oklch(0.4002 0.0715 182.57)",
            "type": "string"
        },
        "--bp-palette-turquoise-800": {
            "default": "oklch(0.3056 0.0549 181.54)",
            "type": "string"
        },
        "--bp-palette-turquoise-900": {
            "default": "oklch(0.2071 0.037 182.42)",
            "type": "string"
        },
        "--bp-palette-vermilion-100": {
            "default": "oklch(0.9167 0.0437 35.56)",
            "type": "string"
        },
        "--bp-palette-vermilion-1000": {
            "default": "oklch(0.1011 0.0325 38.79)",
            "type": "string"
        },
        "--bp-palette-vermilion-200": {
            "default": "oklch(0.8311 0.0896 34.37)",
            "type": "string"
        },
        "--bp-palette-vermilion-300": {
            "default": "oklch(0.7438 0.1232 34.21)",
            "type": "string"
        },
        "--bp-palette-vermilion-400": {
            "default": "oklch(0.6571 0.1451 34.41)",
            "type": "string"
        },
        "--bp-palette-vermilion-500": {
            "default": "oklch(0.5683 0.1562 34.4)",
            "type": "string"
        },
        "--bp-palette-vermilion-600": {
            "default": "oklch(0.478 0.1557 34.35)",
            "type": "string"
        },
        "--bp-palette-vermilion-700": {
            "default": "oklch(0.3859 0.1407 33.45)",
            "type": "string"
        },
        "--bp-palette-vermilion-800": {
            "default": "oklch(0.2923 0.1156 30.49)",
            "type": "string"
        },
        "--bp-palette-vermilion-900": {
            "default": "oklch(0.1984 0.079 30.23)",
            "type": "string"
        },
        "--bp-palette-violet-100": {
            "default": "oklch(0.914 0.0436 327.11)",
            "type": "string"
        },
        "--bp-palette-violet-1000": {
            "default": "oklch(0.1013 0.0343 327.74)",
            "type": "string"
        },
        "--bp-palette-violet-200": {
            "default": "oklch(0.8293 0.089 327.59)",
            "type": "string"
        },
        "--bp-palette-violet-300": {
            "default": "oklch(0.7443 0.1217 327.2)",
            "type": "string"
        },
        "--bp-palette-violet-400": {
            "default": "oklch(0.6557 0.1452 327.51)",
            "type": "string"
        },
        "--bp-palette-violet-500": {
            "default": "oklch(0.5675 0.1555 327.38)",
            "type": "string"
        },
        "--bp-palette-violet-600": {
            "default": "oklch(0.477 0.1539 327.66)",
            "type": "string"
        },
        "--bp-palette-violet-700": {
            "default": "oklch(0.3857 0.1413 327.89)",
            "type": "string"
        },
        "--bp-palette-violet-800": {
            "default": "oklch(0.2924 0.1173 327.35)",
            "type": "string"
        },
        "--bp-palette-violet-900": {
            "default": "oklch(0.1967 0.0808 328.12)",
            "type": "string"
        },
        "--bp-palette-white-100": {
            "default": "oklch(1 0 none / 0.06)",
            "type": "string"
        },
        "--bp-palette-white-1000": {
            "default": "oklch(1 0 none)",
            "type": "string"
        },
        "--bp-palette-white-200": {
            "default": "oklch(1 0 none / 0.12)",
            "type": "string"
        },
        "--bp-palette-white-300": {
            "default": "oklch(1 0 none / 0.2)",
            "type": "string"
        },
        "--bp-palette-white-400": {
            "default": "oklch(1 0 none / 0.3)",
            "type": "string"
        },
        "--bp-palette-white-500": {
            "default": "oklch(1 0 none / 0.5)",
            "type": "string"
        },
        "--bp-palette-white-600": {
            "default": "oklch(1 0 none / 0.8)",
            "type": "string"
        },
        "--bp-palette-white-700": {
            "default": "oklch(1 0 none / 0.85)",
            "type": "string"
        },
        "--bp-palette-white-800": {
            "default": "oklch(1 0 none / 0.9)",
            "type": "string"
        },
        "--bp-palette-white-900": {
            "default": "oklch(1 0 none / 0.95)",
            "type": "string"
        },
        "--bp-surface-background-color-base-active": {
            "default": "var(--bp-palette-white-1000)",
            "type": "string"
        },
        "--bp-surface-background-color-base-hover": {
            "default": "var(--bp-palette-white-1000)",
            "type": "string"
        },
        "--bp-surface-background-color-base-rest": {
            "default": "var(--bp-palette-white-1000)",
            "type": "string"
        },
        "--bp-surface-background-color-danger-active": {
            "default": "var(--bp-intent-danger-700)",
            "type": "string"
        },
        "--bp-surface-background-color-danger-hover": {
            "default": "var(--bp-intent-danger-600)",
            "type": "string"
        },
        "--bp-surface-background-color-danger-rest": {
            "default": "var(--bp-intent-danger-500)",
            "type": "string"
        },
        "--bp-surface-background-color-neutral-active": {
            "default": "var(--bp-intent-neutral-700)",
            "type": "string"
        },
        "--bp-surface-background-color-neutral-hover": {
            "default": "var(--bp-intent-neutral-600)",
            "type": "string"
        },
        "--bp-surface-background-color-neutral-rest": {
            "default": "var(--bp-intent-neutral-500)",
            "type": "string"
        },
        "--bp-surface-background-color-primary-active": {
            "default": "var(--bp-intent-primary-700)",
            "type": "string"
        },
        "--bp-surface-background-color-primary-hover": {
            "default": "var(--bp-intent-primary-600)",
            "type": "string"
        },
        "--bp-surface-background-color-primary-rest": {
            "default": "var(--bp-intent-primary-500)",
            "type": "string"
        },
        "--bp-surface-background-color-success-active": {
            "default": "var(--bp-intent-success-700)",
            "type": "string"
        },
        "--bp-surface-background-color-success-hover": {
            "default": "var(--bp-intent-success-600)",
            "type": "string"
        },
        "--bp-surface-background-color-success-rest": {
            "default": "var(--bp-intent-success-500)",
            "type": "string"
        },
        "--bp-surface-background-color-warning-active": {
            "default": "var(--bp-intent-warning-700)",
            "type": "string"
        },
        "--bp-surface-background-color-warning-hover": {
            "default": "var(--bp-intent-warning-600)",
            "type": "string"
        },
        "--bp-surface-background-color-warning-rest": {
            "default": "var(--bp-intent-warning-500)",
            "type": "string"
        },
        "--bp-surface-border-color-danger": {
            "default": "var(--bp-intent-danger-200)",
            "type": "string"
        },
        "--bp-surface-border-color-neutral": {
            "default": "var(--bp-intent-neutral-200)",
            "type": "string"
        },
        "--bp-surface-border-color-primary": {
            "default": "var(--bp-intent-primary-200)",
            "type": "string"
        },
        "--bp-surface-border-color-success": {
            "default": "var(--bp-intent-success-200)",
            "type": "string"
        },
        "--bp-surface-border-color-warning": {
            "default": "var(--bp-intent-warning-200)",
            "type": "string"
        },
        "--bp-surface-border-radius": {
            "default": "4px",
            "type": "string"
        },
        "--bp-surface-border-width": {
            "default": "1px",
            "type": "string"
        },
        "--bp-surface-color-code": {
            "default": "oklch(from var(--bp-palette-white-1000) l c h / 0.7)",
            "type": "string"
        },
        "--bp-surface-divider-color-default": {
            "default": "oklch(from var(--bp-palette-black-1000) l c h / 0.09)",
            "type": "string"
        },
        "--bp-surface-divider-color-strong": {
            "default": "oklch(from var(--bp-palette-black-1000) l c h / 0.12)",
            "type": "string"
        },
        "--bp-surface-layer-base": {
            "default": "linear-gradient(var(--bp-surface-layer-color-base) 0 0)",
            "type": "string"
        },
        "--bp-surface-layer-color-base": {
            "default": "oklch(from var(--bp-intent-primary-900) l c h / var(--bp-surface-layer-opacity-base))",
            "type": "string"
        },
        "--bp-surface-layer-color-danger-active": {
            "default": "oklch(from var(--bp-intent-danger-600) l c h / var(--bp-surface-layer-opacity-intent-active))",
            "type": "string"
        },
        "--bp-surface-layer-color-danger-hover": {
            "default": "oklch(from var(--bp-intent-danger-600) l c h / var(--bp-surface-layer-opacity-intent-hover))",
            "type": "string"
        },
        "--bp-surface-layer-color-danger-rest": {
            "default": "oklch(from var(--bp-intent-danger-500) l c h / var(--bp-surface-layer-opacity-intent-rest))",
            "type": "string"
        },
        "--bp-surface-layer-color-neutral-active": {
            "default": "oklch(from var(--bp-intent-neutral-700) l c h / var(--bp-surface-layer-opacity-intent-active))",
            "type": "string"
        },
        "--bp-surface-layer-color-neutral-hover": {
            "default": "oklch(from var(--bp-intent-neutral-700) l c h / var(--bp-surface-layer-opacity-intent-hover))",
            "type": "string"
        },
        "--bp-surface-layer-color-neutral-rest": {
            "default": "oklch(from var(--bp-intent-neutral-500) l c h / var(--bp-surface-layer-opacity-intent-rest))",
            "type": "string"
        },
        "--bp-surface-layer-color-primary-active": {
            "default": "oklch(from var(--bp-intent-primary-600) l c h / var(--bp-surface-layer-opacity-intent-active))",
            "type": "string"
        },
        "--bp-surface-layer-color-primary-hover": {
            "default": "oklch(from var(--bp-intent-primary-600) l c h / var(--bp-surface-layer-opacity-intent-hover))",
            "type": "string"
        },
        "--bp-surface-layer-color-primary-rest": {
            "default": "oklch(from var(--bp-intent-primary-500) l c h / var(--bp-surface-layer-opacity-intent-rest))",
            "type": "string"
        },
        "--bp-surface-layer-color-success-active": {
            "default": "oklch(from var(--bp-intent-success-600) l c h / var(--bp-surface-layer-opacity-intent-active))",
            "type": "string"
        },
        "--bp-surface-layer-color-success-hover": {
            "default": "oklch(from var(--bp-intent-success-600) l c h / var(--bp-surface-layer-opacity-intent-hover))",
            "type": "string"
        },
        "--bp-surface-layer-color-success-rest": {
            "default": "oklch(from var(--bp-intent-success-500) l c h / var(--bp-surface-layer-opacity-intent-rest))",
            "type": "string"
        },
        "--bp-surface-layer-color-warning-active": {
            "default": "oklch(from var(--bp-intent-warning-600) l c h / var(--bp-surface-layer-opacity-intent-active))",
            "type": "string"
        },
        "--bp-surface-layer-color-warning-hover": {
            "default": "oklch(from var(--bp-intent-warning-600) l c h / var(--bp-surface-layer-opacity-intent-hover))",
            "type": "string"
        },
        "--bp-surface-layer-color-warning-rest": {
            "default": "oklch(from var(--bp-intent-warning-500) l c h / var(--bp-surface-layer-opacity-intent-rest))",
            "type": "string"
        },
        "--bp-surface-layer-danger-active": {
            "default": "linear-gradient(var(--bp-surface-layer-color-danger-active) 0 0)",
            "type": "string"
        },
        "--bp-surface-layer-danger-hover": {
            "default": "linear-gradient(var(--bp-surface-layer-color-danger-hover) 0 0)",
            "type": "string"
        },
        "--bp-surface-layer-danger-rest": {
            "default": "linear-gradient(var(--bp-surface-layer-color-danger-rest) 0 0)",
            "type": "string"
        },
        "--bp-surface-layer-neutral-active": {
            "default": "linear-gradient(var(--bp-surface-layer-color-neutral-active) 0 0)",
            "type": "string"
        },
        "--bp-surface-layer-neutral-hover": {
            "default": "linear-gradient(var(--bp-surface-layer-color-neutral-hover) 0 0)",
            "type": "string"
        },
        "--bp-surface-layer-neutral-rest": {
            "default": "linear-gradient(var(--bp-surface-layer-color-neutral-rest) 0 0)",
            "type": "string"
        },
        "--bp-surface-layer-opacity-base": {
            "default": "0.01",
            "type": "string"
        },
        "--bp-surface-layer-opacity-intent-active": {
            "default": "0.12",
            "type": "string"
        },
        "--bp-surface-layer-opacity-intent-hover": {
            "default": "0.06",
            "type": "string"
        },
        "--bp-surface-layer-opacity-intent-rest": {
            "default": "0.03",
            "type": "string"
        },
        "--bp-surface-layer-primary-active": {
            "default": "linear-gradient(var(--bp-surface-layer-color-primary-active) 0 0)",
            "type": "string"
        },
        "--bp-surface-layer-primary-hover": {
            "default": "linear-gradient(var(--bp-surface-layer-color-primary-hover) 0 0)",
            "type": "string"
        },
        "--bp-surface-layer-primary-rest": {
            "default": "linear-gradient(var(--bp-surface-layer-color-primary-rest) 0 0)",
            "type": "string"
        },
        "--bp-surface-layer-success-active": {
            "default": "linear-gradient(var(--bp-surface-layer-color-success-active) 0 0)",
            "type": "string"
        },
        "--bp-surface-layer-success-hover": {
            "default": "linear-gradient(var(--bp-surface-layer-color-success-hover) 0 0)",
            "type": "string"
        },
        "--bp-surface-layer-success-rest": {
            "default": "linear-gradient(var(--bp-surface-layer-color-success-rest) 0 0)",
            "type": "string"
        },
        "--bp-surface-layer-warning-active": {
            "default": "linear-gradient(var(--bp-surface-layer-color-warning-active) 0 0)",
            "type": "string"
        },
        "--bp-surface-layer-warning-hover": {
            "default": "linear-gradient(var(--bp-surface-layer-color-warning-hover) 0 0)",
            "type": "string"
        },
        "--bp-surface-layer-warning-rest": {
            "default": "linear-gradient(var(--bp-surface-layer-color-warning-rest) 0 0)",
            "type": "string"
        },
        "--bp-surface-shadow-0": {
            "default": "0px 0px 0px 1px rgba(0, 0, 0, 0.15), 0px 0px 5px 0px rgba(0, 0, 0, 0.02)",
            "description": "Level 0 - border only, 0 0 0 1px rgba(black, 15%), 0 0 5px 0 rgba(0,0,0, 2%)",
            "type": "string"
        },
        "--bp-surface-shadow-1": {
            "default": "0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px -1px rgba(0, 0, 0, 0.1)",
            "description": "Level 1 - subtle elevation",
            "type": "string"
        },
        "--bp-surface-shadow-2": {
            "default": "0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)",
            "description": "Level 2 - standard elevation",
            "type": "string"
        },
        "--bp-surface-shadow-3": {
            "default": "0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)",
            "description": "Level 3 - popover/dialog elevation",
            "type": "string"
        },
        "--bp-surface-shadow-4": {
            "default": "0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 25px 50px -12px rgba(0, 0, 0, 0.3)",
            "description": "Level 4 - maximum elevation",
            "type": "string"
        },
        "--bp-surface-spacing": {
            "default": "4px",
            "description": "Base spacing unit — components multiply this",
            "type": "string"
        },
        "--bp-surface-z-index-0": {
            "default": "0",
            "type": "string"
        },
        "--bp-surface-z-index-1": {
            "default": "10",
            "type": "string"
        },
        "--bp-surface-z-index-2": {
            "default": "20",
            "type": "string"
        },
        "--bp-surface-z-index-3": {
            "default": "30",
            "type": "string"
        },
        "--bp-surface-z-index-4": {
            "default": "40",
            "type": "string"
        },
        "--bp-typography-color-base": {
            "default": "var(--bp-palette-grey-1000)",
            "type": "string"
        },
        "--bp-typography-color-intent-danger": {
            "default": "var(--bp-intent-danger-600)",
            "type": "string"
        },
        "--bp-typography-color-intent-neutral": {
            "default": "var(--bp-intent-neutral-600)",
            "type": "string"
        },
        "--bp-typography-color-intent-primary": {
            "default": "var(--bp-intent-primary-600)",
            "type": "string"
        },
        "--bp-typography-color-intent-success": {
            "default": "var(--bp-intent-success-600)",
            "type": "string"
        },
        "--bp-typography-color-intent-warning": {
            "default": "var(--bp-intent-warning-600)",
            "type": "string"
        },
        "--bp-typography-family-body": {
            "default": "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", blueprint-icons-16, sans-serif",
            "type": "string"
        },
        "--bp-typography-family-display": {
            "default": "var(--bp-typography-family-body)",
            "description": "Placeholder display face: aliases the body family for now; swap in a dedicated display stack when one is supplied.",
            "type": "string"
        },
        "--bp-typography-family-heading": {
            "default": "var(--bp-typography-family-body)",
            "description": "Aliases the body family; kept as its own slot so a distinct heading face can be supplied without touching body.",
            "type": "string"
        },
        "--bp-typography-family-mono": {
            "default": "monospace",
            "type": "string"
        },
        "--bp-typography-line-height-running-factor": {
            "default": "1.105",
            "description": "Multiplier applied to a style's standard line-height for multi-line running/body text (midpoint of the former per-size running ratios). Components/users stack their own line-height scaling on top.",
            "type": "string"
        },
        "--bp-typography-size-2xl": {
            "default": "16px",
            "type": "string"
        },
        "--bp-typography-size-2xs": {
            "default": "9px",
            "type": "string"
        },
        "--bp-typography-size-3xl": {
            "default": "20px",
            "type": "string"
        },
        "--bp-typography-size-4xl": {
            "default": "24px",
            "type": "string"
        },
        "--bp-typography-size-5xl": {
            "default": "28px",
            "type": "string"
        },
        "--bp-typography-size-6xl": {
            "default": "48px",
            "type": "string"
        },
        "--bp-typography-size-lg": {
            "default": "14px",
            "type": "string"
        },
        "--bp-typography-size-md": {
            "default": "13px",
            "type": "string"
        },
        "--bp-typography-size-sm": {
            "default": "11px",
            "type": "string"
        },
        "--bp-typography-size-xl": {
            "default": "15px",
            "type": "string"
        },
        "--bp-typography-size-xs": {
            "default": "10px",
            "type": "string"
        },
        "--bp-typography-weight-default": {
            "default": "400",
            "type": "string"
        },
        "--bp-typography-weight-strong": {
            "default": "500",
            "type": "string"
        }
    },
    "title": "Blueprint BP7 light tokens",
    "type": "object"
};
