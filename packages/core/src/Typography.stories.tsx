/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Flex } from "@blueprintjs/labs";

import { Classes } from "./common";
import {
    Button,
    Callout,
    Card,
    Checkbox,
    Code,
    FormGroup,
    H2,
    HTMLSelect,
    InputGroup,
    Menu,
    MenuDivider,
    MenuItem,
    PopoverNext,
    Pre,
    Tag,
} from "./components";

const meta = {
    title: "Core/Typography",
    parameters: {
        docs: {
            description: {
                component:
                    'Use the Theme panel to edit font families, regular/bold weights, and default/large line heights. Try Georgia, serif for --bp-font-family and "Courier New", monospace for --bp-font-family-mono. Line heights are unitless. Reset the controls to restore defaults. Overrides apply to every story, including portaled content.',
            },
        },
    },
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    render: () => (
        <Card style={{ maxWidth: "100%", width: 480 }}>
            <Flex flexDirection="column" gap={4}>
                <div>
                    <H2>Typography playground</H2>
                    <p>
                        Plan your next project with a clear overview of the work ahead. Share updates with your team,
                        review the details, and keep everyone moving toward the same goal.
                    </p>
                    <p>ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789</p>
                    <p>
                        <strong>Bold text</strong>, <em>italic text</em>, and <small>small text</small>
                    </p>
                </div>
                <div className={Classes.RUNNING_TEXT}>
                    <p>
                        Running text uses the large line height for longer passages. Adjust it independently of the
                        default line height to compare how comfortably each paragraph reads.
                    </p>
                </div>
                <Callout title="Ready for review" icon="info-sign">
                    Callout text also uses the large line height. Share this project with your team when the details are
                    ready.
                </Callout>
                <div>
                    <Code>project.status === "draft"</Code>
                    <Pre>{'const project = {\n    name: "Quarterly analysis",\n};'}</Pre>
                </div>
                <FormGroup label="Project name" labelFor="typography-project">
                    <InputGroup id="typography-project" defaultValue="Quarterly analysis" />
                </FormGroup>
                <FormGroup label="Visibility" labelFor="typography-visibility">
                    <HTMLSelect id="typography-visibility" options={["Private", "Team", "Public"]} />
                </FormGroup>
                <Checkbox label="Send notifications" defaultChecked={true} />
                <Flex alignItems="center" gap={2}>
                    <Button intent="primary" text="Save project" />
                    <PopoverNext
                        content={
                            <Menu>
                                <MenuDivider title="Project actions" />
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
