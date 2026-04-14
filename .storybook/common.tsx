/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { Colors } from "@blueprintjs/core";

export interface StoryLabelProps {
    title: React.ReactNode;
}

/**
 * Small, muted label used in Storybook stories to annotate variants, states, etc.
 */
export function StoryLabel({ title }: StoryLabelProps) {
    return <div style={{ fontSize: 12, marginBottom: 4, opacity: 0.6, textTransform: "capitalize" }}>{title}</div>;
}

export interface DashedPaddedContainerProps {
    children: React.ReactNode;
    width?: number;
}

/**
 * Dashed-border container with padding, used in Storybook stories to visualize component boundaries.
 */
export function DashedPaddedContainer({ children, width = 400 }: DashedPaddedContainerProps) {
    return <div style={{ width, border: `1px dashed ${Colors.GRAY4}`, borderRadius: 4, padding: 8 }}>{children}</div>;
}
