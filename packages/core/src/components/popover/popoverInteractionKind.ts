/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

export const PopoverInteractionKind = {
    CLICK: "click" as const,
    CLICK_TARGET_ONLY: "click-target" as const,
    HOVER: "hover" as const,
    HOVER_TARGET_ONLY: "hover-target" as const,
};
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PopoverInteractionKind = (typeof PopoverInteractionKind)[keyof typeof PopoverInteractionKind];
