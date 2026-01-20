import { defineStory } from "@/lib/story";

import { CalloutStory } from "./CalloutStory";

export const story = defineStory(import.meta.url, {
    Component: CalloutStory,
    args: [
        {
            variant: "Default",
            initial: {
                title: "Callout Title",
                compact: false,
                minimal: false,
                intent: "none",
            },
        },
        {
            variant: "Primary",
            initial: { title: "Primary Callout" },
            fixed: { intent: "primary" },
        },
        {
            variant: "Warning",
            initial: { title: "Warning Callout" },
            fixed: { intent: "warning" },
        },
        {
            variant: "Danger",
            initial: { title: "Danger Callout" },
            fixed: { intent: "danger" },
        },
    ],
});
