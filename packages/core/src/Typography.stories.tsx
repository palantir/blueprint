/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { DatePicker } from "@blueprintjs/datetime";

import { TYPOGRAPHY_TOKEN_NAMES } from "../../../.storybook/tokens/tokens";

import { Classes } from "./common";
import {
    Breadcrumbs,
    Button,
    Callout,
    Card,
    Checkbox,
    Code,
    Dialog,
    Drawer,
    EntityTitle,
    H1,
    H2,
    H3,
    H4,
    H5,
    H6,
    HTMLSelect,
    HTMLTable,
    InputGroup,
    Menu,
    MenuDivider,
    MenuItem,
    NonIdealState,
    PopoverNext,
    Pre,
    Radio,
    Section,
    SectionCard,
    Switch,
    Tab,
    Tabs,
    Tag,
} from "./components";

import "./Typography.stories.scss";

const meta = {
    title: "Core/Typography",
    parameters: {
        layout: "fullscreen",
        themeTokens: TYPOGRAPHY_TOKEN_NAMES,
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const actions = (
    <Menu>
        <MenuDivider title="Menu heading" />
        <MenuItem icon="edit" text="Rename project" />
        <MenuItem icon="duplicate" text="Duplicate project" />
    </Menu>
);

export const Playground: Story = {
    render: () => (
        <div className="typography-playground">
            <p className={Classes.TEXT_MUTED}>
                Adjust typography in the Theme panel. Compare bold titles with regular text; overrides also follow you
                to other stories.
            </p>
            <div className="typography-playground-grid">
                <Section compact={true} title="Text & headings">
                    <SectionCard className="typography-playground-stack">
                        <div className="typography-playground-headings">
                            <H1>H1</H1>
                            <H2>H2</H2>
                            <H3>H3</H3>
                            <H4>H4</H4>
                            <H5>H5</H5>
                            <H6>H6</H6>
                        </div>
                        <div>
                            Regular text, <strong>strong text</strong>, <em>italic text</em>.
                            <br />A second line uses the default line height.
                        </div>
                        <div className={Classes.RUNNING_TEXT}>
                            Running text uses the large line height.
                            <br />
                            Compare the space between these two lines.
                        </div>
                        <div className={Classes.MONOSPACE_TEXT}>Monospace: AaBb 0O 1Il 0123456789</div>
                        <Code>project.status === "draft"</Code>
                        <Pre>{'const project = {\n    name: "Analysis",\n};'}</Pre>
                    </SectionCard>
                </Section>

                <Section compact={true} title="Component titles">
                    <SectionCard className="typography-playground-stack">
                        <Callout title="Callout title" icon="info-sign">
                            Body text uses the large line height.
                        </Callout>
                        <Card compact={true}>
                            <H5>Card with a heading</H5>
                            Cards inherit regular body text.
                        </Card>
                        <EntityTitle
                            heading={H5}
                            icon="document"
                            title="EntityTitle with H5"
                            subtitle="Regular subtitle"
                        />
                        <EntityTitle icon="document" title="EntityTitle with default Text" />
                    </SectionCard>
                </Section>

                <Section compact={true} title="Calendar">
                    <SectionCard className="typography-playground-calendar">
                        <DatePicker
                            defaultValue={new Date(2026, 9, 15)}
                            initialMonth={new Date(2026, 9, 1)}
                            dayPickerProps={{ fixedWeeks: true, today: new Date(2026, 9, 15) }}
                        />
                    </SectionCard>
                </Section>

                <Section compact={true} title="Navigation & tables">
                    <SectionCard className="typography-playground-stack">
                        <Breadcrumbs items={[{ text: "Projects" }, { text: "Current page" }]} />
                        {actions}
                        <Tabs id="typography-tabs" defaultSelectedTabId="overview">
                            <Tab id="overview" title="Overview" />
                            <Tab id="activity" title="Activity" />
                        </Tabs>
                        <HTMLTable compact={true} striped={true}>
                            <thead>
                                <tr>
                                    <th>Table heading</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Regular table cell</td>
                                    <td>Draft</td>
                                </tr>
                            </tbody>
                        </HTMLTable>
                    </SectionCard>
                </Section>

                <Section compact={true} title="Regular controls">
                    <SectionCard className="typography-playground-stack">
                        <InputGroup aria-label="Project name" defaultValue="Project name" />
                        <HTMLSelect aria-label="Visibility" options={["Private", "Team", "Public"]} fill={true} />
                        <div className="typography-playground-row">
                            <Checkbox label="Checkbox" defaultChecked={true} />
                            <Radio label="Radio" defaultChecked={true} />
                            <Switch label="Switch" defaultChecked={true} />
                        </div>
                        <div className="typography-playground-row">
                            <Button intent="primary" text="Save" />
                            <PopoverNext content={actions}>
                                <Button endIcon="caret-down" text="Portaled menu" />
                            </PopoverNext>
                            <Tag>Tag</Tag>
                        </div>
                        <NonIdealState
                            title="NonIdealState title"
                            description="Regular description"
                            layout="horizontal"
                        />
                    </SectionCard>
                </Section>

                <Section compact={true} title="Dialog & drawer titles">
                    <SectionCard className="typography-playground-stack">
                        <div className="typography-playground-dialog">
                            <Dialog
                                // eslint-disable-next-line jsx-a11y/no-autofocus -- Disable focus capture in this inline specimen.
                                autoFocus={false}
                                canEscapeKeyClose={false}
                                canOutsideClickClose={false}
                                enforceFocus={false}
                                isCloseButtonShown={false}
                                isOpen={true}
                                shouldReturnFocusOnClose={false}
                                title="Dialog title"
                                transitionDuration={0}
                                usePortal={false}
                            >
                                <div className={Classes.DIALOG_BODY}>Regular dialog body</div>
                            </Dialog>
                        </div>
                        <div className="typography-playground-drawer">
                            <Drawer
                                // eslint-disable-next-line jsx-a11y/no-autofocus -- Disable focus capture in this inline specimen.
                                autoFocus={false}
                                canEscapeKeyClose={false}
                                canOutsideClickClose={false}
                                enforceFocus={false}
                                hasBackdrop={false}
                                isCloseButtonShown={false}
                                isOpen={true}
                                shouldReturnFocusOnClose={false}
                                size="100%"
                                title="Drawer title"
                                transitionDuration={0}
                                usePortal={false}
                            >
                                <div className={Classes.DRAWER_BODY}>Regular drawer body</div>
                            </Drawer>
                        </div>
                    </SectionCard>
                </Section>
            </div>
        </div>
    ),
};
