/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { type CSSProperties, type ReactNode, useState } from "react";

// Inline handlers keep this visual fixture's state transitions next to the components they exercise.
/* eslint-disable react/jsx-no-bind */

import {
    Breadcrumbs,
    Button,
    ButtonGroup,
    Callout,
    Card,
    Checkbox,
    CheckboxCard,
    CompoundTag,
    ControlGroup,
    Divider,
    EditableText,
    Elevation,
    EntityTitle,
    FileInput,
    FormGroup,
    H2,
    H3,
    H4,
    H5,
    HTMLSelect,
    HTMLTable,
    Icon,
    InputGroup,
    Intent,
    Label,
    Link,
    Menu,
    MenuDivider,
    MenuItem,
    MultiSlider,
    MultiSliderHandle,
    type NumberRange,
    NumericInput,
    ProgressBar,
    Radio,
    RadioCard,
    RadioGroup,
    RangeSlider,
    Section,
    SectionCard,
    SegmentedControl,
    Slider,
    Spinner,
    SpinnerSize,
    Switch,
    SwitchCard,
    Tab,
    type TabId,
    Tabs,
    Tag,
    TagInput,
    TextArea,
    Tooltip,
} from "./index";

const PAGE_STYLE: CSSProperties = {
    boxSizing: "border-box",
    margin: "0 auto",
    maxWidth: 1600,
    padding: 24,
    width: "100%",
};

const PAGE_GRID_STYLE: CSSProperties = {
    display: "grid",
    gap: 16,
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
};

const CONTENT_GRID_STYLE: CSSProperties = {
    display: "grid",
    gap: 16,
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
};

const STACK_STYLE: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 12,
};

const ROW_STYLE: CSSProperties = {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
};

const FULL_WIDTH_STYLE: CSSProperties = {
    gridColumn: "1 / -1",
    minWidth: 0,
};

const VIEW_OPTIONS = [
    { icon: "list" as const, label: "List", value: "list" },
    { icon: "grid-view" as const, label: "Grid", value: "grid" },
    { icon: "timeline-events" as const, label: "Timeline", value: "timeline" },
];

const BREADCRUMB_ITEMS = [
    { href: "#home", icon: "home" as const, text: "Home" },
    { href: "#workspaces", icon: "office" as const, text: "Workspaces" },
    { text: "Blueprint theming" },
];

interface ShowcaseSectionProps {
    children: ReactNode;
    icon: React.ComponentProps<typeof Section>["icon"];
    style?: CSSProperties;
    subtitle: string;
    title: string;
}

function ShowcaseSection({ children, icon, style, subtitle, title }: ShowcaseSectionProps) {
    return (
        <Section
            elevation={Elevation.ONE}
            icon={icon}
            style={{ minWidth: 0, ...style }}
            subtitle={subtitle}
            title={title}
        >
            <SectionCard>{children}</SectionCard>
        </Section>
    );
}

function KitchenSink() {
    const [selectedTabId, setSelectedTabId] = useState<TabId>("overview");
    const [selectedMenuItem, setSelectedMenuItem] = useState("general");
    const [selectedStatusCard, setSelectedStatusCard] = useState("tokens");
    const [activityRange, setActivityRange] = useState("Month");
    const [lastAction, setLastAction] = useState("All workspace settings are up to date.");

    const [workspaceName, setWorkspaceName] = useState("Blueprint theming");
    const [workspaceSlug, setWorkspaceSlug] = useState("blueprint-theming");
    const [ownerEmail, setOwnerEmail] = useState("owner@example.com");
    const [memberLimit, setMemberLimit] = useState<number | string>(24);
    const [description, setDescription] = useState("A shared workspace for reviewing Blueprint theme changes.");
    const [region, setRegion] = useState("us-east");
    const [fileName, setFileName] = useState("Choose a workspace logo...");
    const [workspaceTags, setWorkspaceTags] = useState<ReactNode[]>(["Core", "Theming"]);

    const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
    const [releaseChannel, setReleaseChannel] = useState("stable");
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [selectedView, setSelectedView] = useState("grid");
    const [auditLogsEnabled, setAuditLogsEnabled] = useState(true);
    const [backupSchedule, setBackupSchedule] = useState("daily");
    const [automaticUpdates, setAutomaticUpdates] = useState(false);

    const [capacity, setCapacity] = useState(64);
    const [retentionRange, setRetentionRange] = useState<NumberRange>([20, 80]);
    const [thresholds, setThresholds] = useState([12, 36, 72, 90]);

    return (
        <main style={PAGE_STYLE}>
            <div style={PAGE_GRID_STYLE}>
                <ShowcaseSection
                    icon="applications"
                    style={FULL_WIDTH_STYLE}
                    subtitle="A stable, interactive canvas for exercising Core theme variables."
                    title="Workspace overview"
                >
                    <div style={STACK_STYLE}>
                        <Breadcrumbs items={BREADCRUMB_ITEMS} />
                        <div style={{ ...ROW_STYLE, justifyContent: "space-between" }}>
                            <EntityTitle
                                heading={H2}
                                icon="office"
                                tags={<Tag intent={Intent.SUCCESS}>Active</Tag>}
                                title="Blueprint theming"
                            />
                            <div style={ROW_STYLE}>
                                <Button icon="refresh" onClick={() => setLastAction("Workspace preview refreshed.")}>
                                    Refresh
                                </Button>
                                <Button
                                    icon="floppy-disk"
                                    intent={Intent.PRIMARY}
                                    onClick={() => setLastAction("Workspace settings saved.")}
                                >
                                    Save changes
                                </Button>
                            </div>
                        </div>
                        <div style={{ maxWidth: 420 }}>
                            <Label>
                                Editable workspace name
                                <div style={{ marginTop: 4 }}>
                                    <EditableText
                                        minWidth={220}
                                        onChange={setWorkspaceName}
                                        placeholder="Workspace name"
                                        value={workspaceName}
                                    />
                                </div>
                            </Label>
                        </div>
                        <div style={{ overflowX: "auto" }}>
                            <Tabs
                                animate={false}
                                onChange={newTabId => setSelectedTabId(newTabId)}
                                selectedTabId={selectedTabId}
                            >
                                <Tab
                                    id="overview"
                                    icon="dashboard"
                                    panel={<p>Review the current workspace theme and component surfaces.</p>}
                                    title="Overview"
                                />
                                <Tab
                                    id="members"
                                    icon="people"
                                    panel={<p>Manage workspace members, roles, and invitations.</p>}
                                    tagContent="24"
                                    title="Members"
                                />
                                <Tab
                                    id="settings"
                                    icon="cog"
                                    panel={<p>Configure workspace behavior and visual preferences.</p>}
                                    title="Settings"
                                />
                                <Tab disabled={true} id="archived" title="Archived" />
                            </Tabs>
                        </div>
                        <div>
                            Need help? <Link href="#documentation">Read the workspace documentation</Link>.
                        </div>
                    </div>
                </ShowcaseSection>

                <ShowcaseSection
                    icon="notifications"
                    subtitle="Intent colors, progress surfaces, tags, and overlay content."
                    title="Feedback and status"
                >
                    <div style={STACK_STYLE}>
                        <Callout icon="saved" intent={Intent.SUCCESS} title="Workspace synchronized">
                            {lastAction}
                        </Callout>
                        <Callout icon="warning-sign" intent={Intent.WARNING} title="Theme preview">
                            Experimental token overrides apply only to the current Storybook preview.
                        </Callout>

                        <div style={ROW_STYLE}>
                            <Button>Default</Button>
                            <Button intent={Intent.PRIMARY}>Primary</Button>
                            <Button intent={Intent.SUCCESS}>Success</Button>
                            <Button intent={Intent.WARNING}>Warning</Button>
                            <Button intent={Intent.DANGER}>Danger</Button>
                            <Button disabled={true}>Disabled</Button>
                            <Button size="large" variant="outlined">
                                Large outlined
                            </Button>
                            <ButtonGroup>
                                {["Day", "Month", "Year"].map(range => (
                                    <Button
                                        active={activityRange === range}
                                        key={range}
                                        onClick={() => setActivityRange(range)}
                                    >
                                        {range}
                                    </Button>
                                ))}
                            </ButtonGroup>
                        </div>

                        <Divider />

                        <div style={ROW_STYLE}>
                            <Tag icon="info-sign">Default</Tag>
                            <Tag intent={Intent.PRIMARY} interactive={true}>
                                Primary
                            </Tag>
                            <Tag intent={Intent.SUCCESS} minimal={true}>
                                Success
                            </Tag>
                            <Tag intent={Intent.DANGER} round={true}>
                                Danger
                            </Tag>
                            <CompoundTag intent={Intent.WARNING} leftContent="Status">
                                Needs review
                            </CompoundTag>
                            <CompoundTag active={true} interactive={true} leftContent="Theme">
                                Selected
                            </CompoundTag>
                        </div>

                        <div style={CONTENT_GRID_STYLE}>
                            <Card elevation={Elevation.ZERO} style={STACK_STYLE}>
                                <div style={ROW_STYLE}>
                                    <Icon icon="cloud-upload" intent={Intent.PRIMARY} />
                                    <H4 style={{ margin: 0 }}>Token migration</H4>
                                </div>
                                <ProgressBar animate={false} intent={Intent.PRIMARY} stripes={false} value={0.68} />
                                <small>68% of surfaces reviewed</small>
                                <ProgressBar animate={false} intent={Intent.SUCCESS} value={0.86} />
                            </Card>
                            <Card elevation={Elevation.ZERO} style={{ ...STACK_STYLE, alignItems: "center" }}>
                                <Spinner intent={Intent.SUCCESS} size={SpinnerSize.STANDARD} value={0.72} />
                                <strong>72% complete</strong>
                                <Spinner intent={Intent.WARNING} size={SpinnerSize.SMALL} value={0.42} />
                            </Card>
                        </div>

                        <Card
                            elevation={Elevation.ZERO}
                            style={{ minHeight: 120, paddingTop: 16, textAlign: "center" }}
                        >
                            <H5>Pinned portal surface</H5>
                            <Tooltip
                                content="Tooltip colors and arrow geometry inherit the active theme."
                                intent={Intent.PRIMARY}
                                isOpen={true}
                                placement="bottom"
                                transitionDuration={0}
                            >
                                <Button icon="help" variant="minimal">
                                    Inspect tooltip
                                </Button>
                            </Tooltip>
                        </Card>
                    </div>
                </ShowcaseSection>

                <ShowcaseSection
                    icon="menu"
                    subtitle="Persistent navigation states and compact tabular data."
                    title="Navigation and data"
                >
                    <div style={CONTENT_GRID_STYLE}>
                        <Menu aria-label="Workspace navigation">
                            <MenuItem
                                active={selectedMenuItem === "general"}
                                icon="settings"
                                onClick={() => setSelectedMenuItem("general")}
                                text="General settings"
                            />
                            <MenuItem
                                active={selectedMenuItem === "members"}
                                icon="people"
                                label="24"
                                onClick={() => setSelectedMenuItem("members")}
                                text="Members"
                            />
                            <MenuItem
                                active={selectedMenuItem === "billing"}
                                icon="credit-card"
                                onClick={() => setSelectedMenuItem("billing")}
                                text="Billing"
                            />
                            <MenuDivider title="Administration" />
                            <MenuItem disabled={true} icon="lock" text="Enterprise policies" />
                            <MenuItem icon="trash" intent={Intent.DANGER} text="Delete workspace" />
                        </Menu>

                        <div style={{ minWidth: 0, overflowX: "auto" }}>
                            <HTMLTable bordered={true} compact={true} interactive={true} striped={true}>
                                <thead>
                                    <tr>
                                        <th>Member</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Ada</td>
                                        <td>Owner</td>
                                        <td>
                                            <Tag intent={Intent.SUCCESS} minimal={true}>
                                                Active
                                            </Tag>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Grace</td>
                                        <td>Editor</td>
                                        <td>
                                            <Tag intent={Intent.PRIMARY} minimal={true}>
                                                Invited
                                            </Tag>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Linus</td>
                                        <td>Viewer</td>
                                        <td>
                                            <Tag intent={Intent.WARNING} minimal={true}>
                                                Pending
                                            </Tag>
                                        </td>
                                    </tr>
                                </tbody>
                            </HTMLTable>
                        </div>
                    </div>
                </ShowcaseSection>

                <ShowcaseSection
                    icon="layout-grid"
                    style={FULL_WIDTH_STYLE}
                    subtitle="Interactive and selected cards expose surface, border, shadow, and text tokens."
                    title="Cards and selection"
                >
                    <div style={CONTENT_GRID_STYLE}>
                        {[
                            { description: "Design tokens and generated CSS", icon: "style" as const, id: "tokens" },
                            {
                                description: "Component-level theme coverage",
                                icon: "widget" as const,
                                id: "components",
                            },
                            {
                                description: "Light and dark visual baselines",
                                icon: "contrast" as const,
                                id: "snapshots",
                            },
                        ].map(item => (
                            <Card
                                interactive={true}
                                key={item.id}
                                onClick={() => setSelectedStatusCard(item.id)}
                                onKeyDown={event => {
                                    if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault();
                                        setSelectedStatusCard(item.id);
                                    }
                                }}
                                role="button"
                                selected={selectedStatusCard === item.id}
                                tabIndex={0}
                            >
                                <div style={ROW_STYLE}>
                                    <Icon icon={item.icon} />
                                    <H4 style={{ margin: 0, textTransform: "capitalize" }}>{item.id}</H4>
                                </div>
                                <p>{item.description}</p>
                                <Tag
                                    intent={selectedStatusCard === item.id ? Intent.PRIMARY : Intent.NONE}
                                    minimal={true}
                                >
                                    {selectedStatusCard === item.id ? "Selected" : "Select card"}
                                </Tag>
                            </Card>
                        ))}
                        <Card compact={true} elevation={Elevation.ZERO}>
                            <strong>Compact card</strong>
                            <p>Reduced padding provides a separate spacing reference.</p>
                        </Card>
                    </div>
                </ShowcaseSection>

                <ShowcaseSection
                    icon="form"
                    style={FULL_WIDTH_STYLE}
                    subtitle="All Core input families with representative intents, sizes, and disabled states."
                    title="Inputs and form groups"
                >
                    <div style={CONTENT_GRID_STYLE}>
                        <FormGroup
                            helperText="Used in workspace URLs."
                            label="Workspace slug"
                            labelFor="kitchen-sink-slug"
                        >
                            <InputGroup
                                fill={true}
                                id="kitchen-sink-slug"
                                leftIcon="link"
                                onValueChange={setWorkspaceSlug}
                                value={workspaceSlug}
                            />
                        </FormGroup>

                        <FormGroup
                            helperText="Receives administrative notifications."
                            label="Owner email"
                            labelFor="kitchen-sink-email"
                        >
                            <InputGroup
                                fill={true}
                                id="kitchen-sink-email"
                                intent={Intent.DANGER}
                                leftIcon="envelope"
                                onValueChange={setOwnerEmail}
                                value={ownerEmail}
                            />
                        </FormGroup>

                        <FormGroup
                            helperText="Maximum active collaborators."
                            label="Member limit"
                            labelFor="kitchen-sink-limit"
                        >
                            <NumericInput
                                fill={true}
                                id="kitchen-sink-limit"
                                max={100}
                                min={1}
                                onValueChange={(_valueAsNumber, valueAsString) => setMemberLimit(valueAsString)}
                                value={memberLimit}
                            />
                        </FormGroup>

                        <FormGroup label="Deployment region" labelFor="kitchen-sink-region">
                            <HTMLSelect
                                fill={true}
                                id="kitchen-sink-region"
                                onChange={event => setRegion(event.currentTarget.value)}
                                options={[
                                    { label: "US East", value: "us-east" },
                                    { label: "US West", value: "us-west" },
                                    { label: "Europe", value: "eu" },
                                ]}
                                value={region}
                            />
                        </FormGroup>

                        <FormGroup
                            helperText="Visible to all workspace members."
                            label="Description"
                            labelFor="kitchen-sink-description"
                        >
                            <TextArea
                                fill={true}
                                id="kitchen-sink-description"
                                onChange={event => setDescription(event.currentTarget.value)}
                                rows={3}
                                value={description}
                            />
                        </FormGroup>

                        <FormGroup helperText="PNG, JPG, or SVG." label="Workspace logo" labelFor="kitchen-sink-file">
                            <FileInput
                                fill={true}
                                hasSelection={fileName !== "Choose a workspace logo..."}
                                inputProps={{ id: "kitchen-sink-file" }}
                                onInputChange={event =>
                                    setFileName(event.currentTarget.files?.[0]?.name ?? "Choose a workspace logo...")
                                }
                                text={fileName}
                            />
                        </FormGroup>

                        <FormGroup
                            helperText="Add a tag by pressing Enter."
                            label="Workspace tags"
                            labelFor="kitchen-sink-tags"
                        >
                            <TagInput
                                fill={true}
                                inputProps={{ id: "kitchen-sink-tags" }}
                                onChange={setWorkspaceTags}
                                placeholder="Add a tag..."
                                values={workspaceTags}
                            />
                        </FormGroup>

                        <FormGroup
                            helperText="A disabled large input for state and size coverage."
                            label="Organization"
                            labelFor="kitchen-sink-organization"
                        >
                            <InputGroup
                                disabled={true}
                                fill={true}
                                id="kitchen-sink-organization"
                                leftIcon="office"
                                size="large"
                                value="Palantir"
                            />
                        </FormGroup>

                        <Label style={{ gridColumn: "1 / -1" }}>
                            Workspace URL
                            <ControlGroup fill={true}>
                                <InputGroup
                                    aria-label="Workspace URL"
                                    readOnly={true}
                                    value={`blueprintjs.com/${workspaceSlug}`}
                                />
                                <Button icon="clipboard" onClick={() => setLastAction("Workspace URL copied.")}>
                                    Copy
                                </Button>
                            </ControlGroup>
                        </Label>
                    </div>
                </ShowcaseSection>

                <ShowcaseSection
                    icon="selection"
                    style={FULL_WIDTH_STYLE}
                    subtitle="Basic controls, grouped choices, segmented controls, and selectable control cards."
                    title="Form controls"
                >
                    <div style={CONTENT_GRID_STYLE}>
                        <Card elevation={Elevation.ZERO} style={STACK_STYLE}>
                            <H3 style={{ margin: 0 }}>Basic controls</H3>
                            <Checkbox
                                checked={analyticsEnabled}
                                label="Share anonymous usage analytics"
                                onChange={event => setAnalyticsEnabled(event.currentTarget.checked)}
                            />
                            <Checkbox indeterminate={true} label="Inherited permissions" />
                            <Checkbox disabled={true} label="Disabled checkbox" />
                            <RadioGroup
                                label="Release channel"
                                onChange={event => setReleaseChannel(event.currentTarget.value)}
                                selectedValue={releaseChannel}
                            >
                                <Radio label="Stable" value="stable" />
                                <Radio label="Preview" value="preview" />
                                <Radio disabled={true} label="Internal" value="internal" />
                            </RadioGroup>
                            <Switch
                                checked={notificationsEnabled}
                                innerLabel="Off"
                                innerLabelChecked="On"
                                label="Email notifications"
                                onChange={event => setNotificationsEnabled(event.currentTarget.checked)}
                            />
                            <Switch disabled={true} label="Disabled switch" />
                            <SegmentedControl
                                fill={true}
                                intent={Intent.PRIMARY}
                                onValueChange={setSelectedView}
                                options={VIEW_OPTIONS}
                                value={selectedView}
                            />
                        </Card>

                        <Card elevation={Elevation.ZERO} style={STACK_STYLE}>
                            <H3 style={{ margin: 0 }}>Control cards</H3>
                            <CheckboxCard
                                checked={auditLogsEnabled}
                                onChange={event => setAuditLogsEnabled(event.currentTarget.checked)}
                            >
                                <strong>Audit logs</strong>
                                <div>Keep a searchable record of workspace changes.</div>
                            </CheckboxCard>
                            <RadioGroup
                                label="Backup schedule"
                                onChange={event => setBackupSchedule(event.currentTarget.value)}
                                selectedValue={backupSchedule}
                            >
                                <RadioCard value="daily">
                                    <strong>Daily</strong>
                                    <div>Create a backup every day.</div>
                                </RadioCard>
                                <RadioCard value="weekly">
                                    <strong>Weekly</strong>
                                    <div>Create a backup every week.</div>
                                </RadioCard>
                            </RadioGroup>
                            <SwitchCard
                                checked={automaticUpdates}
                                onChange={event => setAutomaticUpdates(event.currentTarget.checked)}
                            >
                                <strong>Automatic updates</strong>
                                <div>Apply compatible theme changes automatically.</div>
                            </SwitchCard>
                        </Card>
                    </div>
                </ShowcaseSection>

                <ShowcaseSection
                    icon="horizontal-bar-chart"
                    style={FULL_WIDTH_STYLE}
                    subtitle="Single-value, range, and multi-handle slider variants."
                    title="Sliders"
                >
                    <div style={CONTENT_GRID_STYLE}>
                        <Card elevation={Elevation.ZERO} style={STACK_STYLE}>
                            <H4 style={{ margin: 0 }}>Capacity</H4>
                            <Slider
                                handleHtmlProps={{ "aria-label": "Workspace capacity" }}
                                intent={Intent.PRIMARY}
                                labelStepSize={25}
                                max={100}
                                onChange={setCapacity}
                                value={capacity}
                            />
                        </Card>
                        <Card elevation={Elevation.ZERO} style={STACK_STYLE}>
                            <H4 style={{ margin: 0 }}>Retention window</H4>
                            <RangeSlider
                                handleHtmlProps={{
                                    end: { "aria-label": "Retention end" },
                                    start: { "aria-label": "Retention start" },
                                }}
                                intent={Intent.SUCCESS}
                                labelStepSize={25}
                                max={100}
                                onChange={setRetentionRange}
                                value={retentionRange}
                            />
                        </Card>
                        <Card elevation={Elevation.ZERO} style={STACK_STYLE}>
                            <H4 style={{ margin: 0 }}>Alert thresholds</H4>
                            <MultiSlider
                                defaultTrackIntent={Intent.SUCCESS}
                                labelStepSize={25}
                                max={100}
                                onChange={setThresholds}
                            >
                                <MultiSliderHandle
                                    htmlProps={{ "aria-label": "Danger range start" }}
                                    intentBefore={Intent.DANGER}
                                    type="start"
                                    value={thresholds[0]}
                                />
                                <MultiSliderHandle
                                    htmlProps={{ "aria-label": "Warning range start" }}
                                    intentBefore={Intent.WARNING}
                                    type="start"
                                    value={thresholds[1]}
                                />
                                <MultiSliderHandle
                                    htmlProps={{ "aria-label": "Warning range end" }}
                                    intentAfter={Intent.WARNING}
                                    type="end"
                                    value={thresholds[2]}
                                />
                                <MultiSliderHandle
                                    htmlProps={{ "aria-label": "Danger range end" }}
                                    intentAfter={Intent.DANGER}
                                    type="end"
                                    value={thresholds[3]}
                                />
                            </MultiSlider>
                        </Card>
                    </div>
                </ShowcaseSection>
            </div>
        </main>
    );
}

const meta = {
    title: "Core/Kitchen Sink",
    parameters: {
        controls: { disable: true },
        layout: "fullscreen",
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
    render: () => <KitchenSink />,
};
