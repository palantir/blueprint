/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { ReactNode } from "react";

export interface StoryLabelProps {
    title: ReactNode;
}

/**
 * Small, muted label used in Storybook stories to annotate variants, states, etc.
 */
export function StoryLabel({ title }: StoryLabelProps) {
    return <span style={{ fontSize: 12, marginBottom: 4, opacity: 0.6, textTransform: "capitalize" }}>{title}</span>;
}
