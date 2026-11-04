/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";
import { useArgs, useCallback as useStoryCallback } from "storybook/preview-api";

import { Button, H2, type TabId } from "@blueprintjs/core";

import { type ComparisonProps, TabsComparison } from "./TabsComparison";

type Args = Omit<ComparisonProps, "onChange" | "scheme" | "tokenOverrides" | "vertical">;

const meta = {
    title: "Spikes/Tabs token comparison",
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "Compare original Sass, existing tokens plus dark roles, and a semantic API. Selection is synchronized. Use the theme toolbar for light/dark and the Theme panel to edit proposed roles. Amber labels compare fixture defaults with the original and hide while overrides are active. Tabs has no intent prop.",
            },
        },
    },
    args: { animate: true, selectedTabId: "selected", showAnnotations: true, size: "medium" },
    argTypes: {
        animate: { control: "boolean" },
        selectedTabId: { control: "select", options: ["selected", "rest", "disabled"] },
        showAnnotations: { control: "boolean" },
        size: { control: "select", options: ["medium", "large"] },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Overview: Story = {
    render: function OverviewStory(args, context) {
        const [, updateArgs] = useArgs<Args>();
        const onChange = useStoryCallback((selectedTabId: TabId) => updateArgs({ selectedTabId }), [updateArgs]);
        return (
            <OverviewExamples
                {...args}
                onChange={onChange}
                scheme={context.globals.theme === "dark" ? "dark" : "light"}
                tokenOverrides={context.globals.tokenOverrides}
            />
        );
    },
};

// Local React state belongs below the Storybook render function, so updating it
// does not rerun useArgs outside Storybook's preview-hook context.
function OverviewExamples(props: Omit<ComparisonProps, "vertical">) {
    const [disabledSelection, setDisabledSelection] = useState<TabId>("disabled");
    const resetDisabledSelection = useCallback(() => setDisabledSelection("disabled"), []);
    return (
        <div style={{ padding: 24, overflowX: "auto" }}>
            <H2>Horizontal</H2>
            <TabsComparison {...props} vertical={false} />
            <H2>Vertical</H2>
            <TabsComparison {...props} vertical={true} />
            <H2>Selected disabled</H2>
            <Button disabled={disabledSelection === "disabled"} onClick={resetDisabledSelection} size="small">
                Reset selected-disabled example
            </Button>
            <TabsComparison
                {...props}
                onChange={setDisabledSelection}
                selectedTabId={disabledSelection}
                vertical={true}
            />
        </div>
    );
}
