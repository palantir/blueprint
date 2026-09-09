/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { Colors } from "@blueprintjs/core";

export const modes = {
    dark: {
        backgrounds: { value: Colors.BLACK },
        blueprintStyles: "bp6",
        theme: "dark",
    },
    light: {
        backgrounds: { value: Colors.WHITE },
        blueprintStyles: "bp6",
        theme: "light",
    },
    nextDark: {
        backgrounds: { value: Colors.BLACK },
        blueprintStyles: "next",
        theme: "dark",
    },
    nextLight: {
        backgrounds: { value: Colors.WHITE },
        blueprintStyles: "next",
        theme: "light",
    },
    nextCustomIntent: {
        backgrounds: { value: Colors.WHITE },
        blueprintStyles: "next-custom-intent",
        theme: "light",
    },
} as const;
