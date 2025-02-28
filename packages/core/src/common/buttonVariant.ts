/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

/** The visual style variant for buttons. */
export const ButtonVariant = {
    MINIMAL: "minimal",
    OUTLINED: "outlined",
    SOLID: "solid",
} as const;
export type ButtonVariant = (typeof ButtonVariant)[keyof typeof ButtonVariant];
