/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { ReactNode } from "react";

export interface StoryLabelProps {
    title: ReactNode;
    capitalize?: boolean;
}

/**
 * Small, muted label used in Storybook stories to annotate variants, states, etc.
 */
export function StoryLabel({ title, capitalize }: StoryLabelProps) {
    return (
        <span style={{ fontSize: 12, opacity: 0.6, marginBottom: 4, textTransform: capitalize ? "capitalize" : undefined }}>
            {title}
        </span>
    );
}
