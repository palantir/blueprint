/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { Flex } from "@blueprintjs/labs";

export interface StoryLabelProps {
    title: React.ReactNode;
}

/**
 * Small, muted label used in Storybook stories to annotate variants, states, etc.
 */
export function StoryLabel({ title }: StoryLabelProps) {
    return <span style={{ fontSize: 12, marginBottom: 4, opacity: 0.6, textTransform: "capitalize" }}>{title}</span>;
}

export interface StorybookLayoutProps {
    children: React.ReactNode;
    minWidth?: string;
    style?: React.CSSProperties;
}

export function StorybookLayout({ children, minWidth = "400px", style }: StorybookLayoutProps) {
    return (
        <Flex justifyContent="center" alignItems="center" style={{ minWidth, ...style }}>
            {children}
        </Flex>
    );
}
