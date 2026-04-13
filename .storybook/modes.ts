/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { Colors } from "@blueprintjs/core";

export const modes = {
    dark: {
        backgrounds: { value: Colors.BLACK },
        theme: "dark",
    },
    light: {
        backgrounds: { value: Colors.WHITE },
        theme: "light",
    },
} as const;
