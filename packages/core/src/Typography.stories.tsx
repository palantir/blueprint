/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Flex } from "@blueprintjs/labs";

import {
    Button,
    Card,
    Checkbox,
    Code,
    FormGroup,
    H2,
    HTMLSelect,
    InputGroup,
    Menu,
    MenuItem,
    PopoverNext,
    Tag,
} from "./components";

const meta = {
    title: "Core/Typography",
    parameters: {
        docs: {
            description: {
                component:
                    'Edit --bp-typography-family-default in the Theme panel to try a CSS font stack, such as Georgia, serif or "Courier New", monospace. Clear the value to restore the default. The override applies to every story, including portaled content.',
            },
        },
    },
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const FontFamily: Story = {
    render: () => (
        <Card style={{ maxWidth: "100%", width: 480 }}>
            <Flex flexDirection="column" gap={4}>
                <div>
                    <H2>Typography preview</H2>
                    <p>The quick brown fox jumps over the lazy dog.</p>
                    <p>ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789</p>
                    <p>
                        <strong>Bold text</strong>, <em>italic text</em>, and <small>small text</small>
                    </p>
                    <Code>Code keeps its monospace font.</Code>
                </div>
                <FormGroup label="Project name" labelFor="font-family-project">
                    <InputGroup id="font-family-project" defaultValue="Quarterly analysis" />
                </FormGroup>
                <FormGroup label="Visibility" labelFor="font-family-visibility">
                    <HTMLSelect id="font-family-visibility" options={["Private", "Team", "Public"]} />
                </FormGroup>
                <Checkbox label="Send notifications" defaultChecked={true} />
                <Flex alignItems="center" gap={2}>
                    <Button intent="primary" text="Save project" />
                    <PopoverNext
                        content={
                            <Menu>
                                <MenuItem icon="edit" text="Rename project" />
                                <MenuItem icon="duplicate" text="Duplicate project" />
                            </Menu>
                        }
                    >
                        <Button endIcon="caret-down" text="Open menu" />
                    </PopoverNext>
                    <Tag>Draft</Tag>
                </Flex>
            </Flex>
        </Card>
    ),
};
