/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator, StoryLabel } from "@storybook-common";
import { useCallback, useMemo, useState } from "react";

import { FolderClose, Heart, Home, InfoSign, Projects, Search, User } from "@blueprintjs/icons";
import { Flex } from "@blueprintjs/labs";

import { Intent, type MaybeElement } from "../../common";
import { Alert } from "../alert/alert";
import { Button } from "../button/buttons";
import { EntityTitle } from "../entity-title/entityTitle";
import { NonIdealState, NonIdealStateIconSize } from "../non-ideal-state/nonIdealState";
import { Section } from "../section/section";
import { SectionCard } from "../section/sectionCard";
import { Tab } from "../tabs/tab";
import { Tabs } from "../tabs/tabs";
import { TagInput } from "../tag-input/tagInput";
import { Tree } from "../tree/tree";
import type { TreeNodeInfo } from "../tree/treeTypes";

import type { IconName } from "./icon";

type IconKind = "static" | "dynamic";

interface StoryArgs {
    iconKind: IconKind;
    intent: Intent;
}

const meta: Meta<StoryArgs> = {
    title: "Core/Icon/Static Element Propagation",
    decorators: [storybookLayoutDecorator],
    parameters: {
        layout: "padded",
    },
    args: {
        iconKind: "static",
        intent: Intent.PRIMARY,
    },
    argTypes: {
        iconKind: {
            control: "inline-radio",
            options: ["static", "dynamic"] satisfies IconKind[],
            description:
                "Static passes an element (e.g. `<Home />`); dynamic passes a string name (e.g. `'home'`). Visuals should match.",
        },
        intent: {
            control: "select",
            options: Object.values(Intent),
        },
    },
};

export default meta;
type Story = StoryObj<StoryArgs>;

/**
 * Each core component that accepts `icon: IconName | MaybeElement` is rendered here. Toggle
 * `iconKind` to switch between the string-name path (dynamic) and the element path (static,
 * routed through Option 5's `cloneElement`). Spacing should match across both for every
 * component; intent color should propagate onto the static icon's root for the selected
 * `Tab` (always primary) and `Alert` (via the `intent` control). Size is not merged onto
 * element icons, so consumers of static icons must set `size` on the element directly
 * (visible in `NonIdealState` and `Alert` below).
 */
export const AllComponents: Story = {
    render: function Render({ iconKind, intent }) {
        const isStatic = iconKind === "static";
        const treeNodes = useMemo<TreeNodeInfo[]>(
            () => [
                {
                    id: "root",
                    icon: isStatic ? <FolderClose /> : "folder-close",
                    label: "Root folder",
                    isExpanded: true,
                    hasCaret: true,
                    childNodes: [
                        { id: "child-1", icon: isStatic ? <Home /> : ("home" satisfies IconName), label: "Home" },
                        { id: "child-2", icon: isStatic ? <User /> : ("user" satisfies IconName), label: "Profile" },
                    ],
                },
            ],
            [isStatic],
        );

        const tabHomeIcon: IconName | MaybeElement = isStatic ? <Home /> : "home";
        const tabProfileIcon: IconName | MaybeElement = isStatic ? <User /> : "user";
        const sectionIcon: IconName | MaybeElement = isStatic ? <Projects /> : "projects";
        const entityIcon: IconName | MaybeElement = isStatic ? <Heart /> : "heart";
        const nonIdealIcon: IconName | MaybeElement = isStatic ? (
            <Search size={NonIdealStateIconSize.STANDARD} />
        ) : (
            "search"
        );
        const tagInputIcon: IconName | MaybeElement = isStatic ? <FolderClose /> : "folder-close";

        return (
            <Flex flexDirection="column" gap={6}>
                <LabelledExample title="Tab / Tabs">
                    <Tabs id="icon-propagation-tabs" defaultSelectedTabId="home">
                        <Tab id="home" icon={tabHomeIcon} title="Home" panel={<div>Home panel</div>} />
                        <Tab id="profile" icon={tabProfileIcon} title="Profile" panel={<div>Profile panel</div>} />
                    </Tabs>
                </LabelledExample>

                <LabelledExample title="Tree">
                    <Tree contents={treeNodes} />
                </LabelledExample>

                <LabelledExample title="Section">
                    <Section icon={sectionIcon} title="Projects" compact={true}>
                        <SectionCard>Section content</SectionCard>
                    </Section>
                </LabelledExample>

                <LabelledExample title="EntityTitle">
                    <EntityTitle icon={entityIcon} title="Favorites" subtitle="Saved items" />
                </LabelledExample>

                <LabelledExample title="NonIdealState">
                    <NonIdealState icon={nonIdealIcon} title="No results" description="Try a different search term." />
                </LabelledExample>

                <LabelledExample title="TagInput">
                    <TagInput leftIcon={tagInputIcon} values={["one", "two", "three"]} />
                </LabelledExample>

                <LabelledExample title="Alert">
                    <AlertExample iconKind={iconKind} intent={intent} />
                </LabelledExample>
            </Flex>
        );
    },
};

function LabelledExample({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Flex flexDirection="column" gap={2}>
            <StoryLabel title={title} />
            {children}
        </Flex>
    );
}

function AlertExample({ iconKind, intent }: { iconKind: IconKind; intent: Intent }) {
    const [isOpen, setIsOpen] = useState(false);
    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    const icon = iconKind === "static" ? <InfoSign size={40} /> : "info-sign";
    return (
        <>
            <Button text="Open alert" onClick={open} />
            <Alert icon={icon} intent={intent} isOpen={isOpen} confirmButtonText="OK" onClose={close} onConfirm={close}>
                Alert content with an {iconKind} icon.
            </Alert>
        </>
    );
}
