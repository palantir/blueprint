import { defineStory } from "@/lib/story";

import { CardStory } from "./CardStory";

export const story = defineStory(import.meta.url, {
    Component: CardStory,
    args: [
        {
            variant: "Default",
            initial: {
                elevation: 0,
                interactive: false,
                selected: false,
                compact: false,
            },
        },
        {
            variant: "Interactive",
            initial: { elevation: 1 },
            fixed: { interactive: true },
        },
        {
            variant: "Elevated",
            initial: { elevation: 3, interactive: false },
        },
    ],
});
