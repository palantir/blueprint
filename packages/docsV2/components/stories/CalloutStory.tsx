"use client";

import { Callout } from "@blueprintjs/core";

export interface CalloutStoryProps {
    /** Whether to display compact appearance */
    compact?: boolean;
    /** Visual intent color */
    intent?: "none" | "primary" | "success" | "warning" | "danger";
    /** Whether to use minimal appearance (no background) */
    minimal?: boolean;
    /** Optional title text */
    title?: string;
}

export function CalloutStory({ compact, intent, minimal, title }: CalloutStoryProps) {
    return (
        <Callout
            compact={compact}
            intent={intent === "none" ? undefined : intent}
            minimal={minimal}
            title={title}
        >
            Long-form information about the important content. This text is styled as "Running text",
            so it may contain things like headers, links, lists, code etc.
        </Callout>
    );
}
