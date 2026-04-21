/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Flex } from "@blueprintjs/labs";

import { Intent } from "../../common";
import { HTMLSelect } from "../html-select/htmlSelect";
import { SegmentedControl } from "../segmented-control/segmentedControl";
import { Slider } from "../slider/slider";

import { Checkbox, Radio, Switch } from "./controls";
import { FileInput } from "./fileInput";
import { FormGroup } from "./formGroup";
import { InputGroup } from "./inputGroup";
import { NumericInput } from "./numericInput";
import { RadioGroup } from "./radioGroup";
import { TextArea } from "./textArea";

const NOOP = () => undefined;

const meta: Meta<typeof FormGroup> = {
    title: "Core/Form/FormGroup",
    component: FormGroup,
    decorators: [
        Story => (
            <Flex flexDirection="column" gap={3} style={{ width: "100%", minWidth: "400px" }}>
                <Story />
            </Flex>
        ),
    ],
    tags: ["autodocs"],
    args: {
        label: "Label",
        helperText: "",
        labelInfo: "",
        subLabel: "",
        intent: "none",
        disabled: false,
        fill: false,
        inline: false,
    },
    argTypes: {
        label: {
            control: "text",
        },
        helperText: {
            control: "text",
        },
        labelInfo: {
            control: "text",
        },
        subLabel: {
            control: "text",
        },
        intent: {
            control: "select",
            options: Object.values(Intent),
        },
        disabled: {
            control: "boolean",
        },
        fill: {
            control: "boolean",
        },
        inline: {
            control: "boolean",
        },
    },
} satisfies Meta<typeof FormGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Individual control stories
// ---------------------------------------------------------------------------

/**
 * A basic form group with a text input.
 */
export const Default: Story = {
    render: args => (
        <FormGroup {...args} labelFor="default-input">
            <InputGroup
                id="default-input"
                intent={args.intent}
                disabled={args.disabled}
                fill={args.fill}
                placeholder="Enter value..."
            />
        </FormGroup>
    ),
};

/**
 * FormGroup works with TextArea for multi-line text input.
 */
export const WithTextArea: Story = {
    args: {
        label: "Description",
        helperText: "Provide a detailed description",
    },
    render: args => (
        <FormGroup {...args} labelFor="textarea-input">
            <TextArea
                id="textarea-input"
                intent={args.intent}
                disabled={args.disabled}
                fill={args.fill}
                placeholder="Enter description..."
            />
        </FormGroup>
    ),
};

/**
 * FormGroup works with NumericInput for numeric values.
 */
export const WithNumericInput: Story = {
    args: {
        label: "Quantity",
        helperText: "Enter a number between 1 and 100",
    },
    render: args => (
        <FormGroup {...args} labelFor="numeric-input">
            <NumericInput
                id="numeric-input"
                intent={args.intent}
                disabled={args.disabled}
                fill={args.fill}
                min={1}
                max={100}
                placeholder="Enter quantity..."
            />
        </FormGroup>
    ),
};

/**
 * FormGroup works with HTMLSelect for dropdown selections.
 */
export const WithHTMLSelect: Story = {
    args: {
        label: "Country",
        helperText: "Select your country of residence",
    },
    render: args => (
        <FormGroup {...args} labelFor="select-input">
            <HTMLSelect
                id="select-input"
                disabled={args.disabled}
                fill={args.fill}
                options={["United States", "Canada", "United Kingdom", "Germany", "France", "Japan"]}
            />
        </FormGroup>
    ),
};

/**
 * FormGroup works with FileInput for file uploads.
 */
export const WithFileInput: Story = {
    args: {
        label: "Attachment",
        helperText: "Upload a PDF or image file",
    },
    render: args => (
        <FormGroup {...args} labelFor="file-input">
            <FileInput
                inputProps={{ id: "file-input" }}
                disabled={args.disabled}
                fill={args.fill}
                text="Choose file..."
            />
        </FormGroup>
    ),
};

/**
 * FormGroup works with Switch for toggling a boolean setting.
 */
export const WithSwitch: Story = {
    args: {
        label: "Notifications",
        helperText: "Enable or disable email notifications",
    },
    render: args => (
        <FormGroup {...args}>
            <Switch label="Email notifications" disabled={args.disabled} />
        </FormGroup>
    ),
};

/**
 * FormGroup works with Checkbox for single or multiple boolean selections.
 */
export const WithCheckboxes: Story = {
    args: {
        label: "Interests",
        helperText: "Select all that apply",
    },
    render: args => (
        <FormGroup {...args}>
            <Checkbox label="Engineering" disabled={args.disabled} />
            <Checkbox label="Design" disabled={args.disabled} />
            <Checkbox label="Marketing" disabled={args.disabled} />
            <Checkbox label="Sales" disabled={args.disabled} />
        </FormGroup>
    ),
};

/**
 * FormGroup works with RadioGroup for mutually exclusive selections.
 */
export const WithRadioGroup: Story = {
    args: {
        label: "Priority",
        helperText: "Select the task priority",
    },
    render: args => (
        <FormGroup {...args}>
            <RadioGroup
                disabled={args.disabled}
                onChange={NOOP}
                selectedValue="medium"
                options={[
                    { label: "Low", value: "low" },
                    { label: "Medium", value: "medium" },
                    { label: "High", value: "high" },
                    { label: "Critical", value: "critical" },
                ]}
            />
        </FormGroup>
    ),
};

/**
 * FormGroup works with Slider for selecting a value in a range.
 */
export const WithSlider: Story = {
    args: {
        label: "Volume",
        helperText: "Adjust the output volume",
    },
    render: args => (
        <FormGroup {...args}>
            <Slider
                intent={args.intent}
                disabled={args.disabled}
                min={0}
                max={100}
                stepSize={1}
                value={50}
                labelStepSize={25}
            />
        </FormGroup>
    ),
};

/**
 * FormGroup works with SegmentedControl for selecting one of a few options.
 */
export const WithSegmentedControl: Story = {
    args: {
        label: "View mode",
        helperText: "Choose how items are displayed",
    },
    render: args => (
        <FormGroup {...args}>
            <SegmentedControl
                disabled={args.disabled}
                fill={args.fill}
                options={[
                    { label: "List", value: "list" },
                    { label: "Grid", value: "grid" },
                    { label: "Table", value: "table" },
                ]}
            />
        </FormGroup>
    ),
};

// ---------------------------------------------------------------------------
// FormGroup prop demonstrations
// ---------------------------------------------------------------------------

/**
 * Use the `intent` prop to apply a semantic color to the helper text and sub label.
 * Shown here with various form controls.
 */
export const IntentExample: Story = {
    name: "Intent",
    args: {
        label: "Label",
        helperText: "Helper text styled by intent",
    },
    argTypes: {
        intent: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={4} style={{ width: "100%" }}>
            <FormGroup {...args} intent="primary" labelInfo="(text input)" labelFor="intent-primary-input">
                <InputGroup
                    id="intent-primary-input"
                    intent="primary"
                    disabled={args.disabled}
                    fill={args.fill}
                    placeholder="Primary input..."
                />
            </FormGroup>
            <FormGroup {...args} intent="success" labelInfo="(text area)" labelFor="intent-success-textarea">
                <TextArea
                    id="intent-success-textarea"
                    intent="success"
                    disabled={args.disabled}
                    fill={args.fill}
                    placeholder="Success textarea..."
                />
            </FormGroup>
            <FormGroup {...args} intent="warning" labelInfo="(numeric input)">
                <NumericInput
                    intent="warning"
                    disabled={args.disabled}
                    fill={args.fill}
                    placeholder="Warning numeric..."
                />
            </FormGroup>
            <FormGroup {...args} intent="danger" labelInfo="(select)" labelFor="intent-danger-select">
                <HTMLSelect
                    id="intent-danger-select"
                    disabled={args.disabled}
                    fill={args.fill}
                    options={["Option A", "Option B", "Option C"]}
                />
            </FormGroup>
            <FormGroup {...args} intent="primary" labelInfo="(checkbox)">
                <Checkbox label="Option one" disabled={args.disabled} />
                <Checkbox label="Option two" disabled={args.disabled} />
            </FormGroup>
            <FormGroup {...args} intent="success" labelInfo="(switch)">
                <Switch label="Enable feature" disabled={args.disabled} />
            </FormGroup>
            <FormGroup {...args} intent="warning" labelInfo="(radio group)">
                <RadioGroup
                    disabled={args.disabled}
                    onChange={NOOP}
                    selectedValue="a"
                    options={[
                        { label: "Option A", value: "a" },
                        { label: "Option B", value: "b" },
                    ]}
                />
            </FormGroup>
        </Flex>
    ),
};

/**
 * FormGroup supports `disabled` state which visually dims the label and helper text.
 * Shown here with various form controls in enabled and disabled states.
 */
export const StateExample: Story = {
    name: "State",
    args: {
        label: "Label",
        helperText: "Helper text for this field",
    },
    argTypes: {
        disabled: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={4} style={{ width: "100%" }}>
            <FormGroup {...args} labelInfo="(text input, enabled)" labelFor="state-enabled-input">
                <InputGroup
                    id="state-enabled-input"
                    intent={args.intent}
                    fill={args.fill}
                    placeholder="Enabled input..."
                />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(text input, disabled)" labelFor="state-disabled-input">
                <InputGroup
                    id="state-disabled-input"
                    disabled={true}
                    intent={args.intent}
                    fill={args.fill}
                    placeholder="Disabled input..."
                />
            </FormGroup>
            <FormGroup {...args} labelInfo="(switch, enabled)">
                <Switch label="Notifications" />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(switch, disabled)">
                <Switch disabled={true} label="Notifications" />
            </FormGroup>
            <FormGroup {...args} labelInfo="(checkbox, enabled)">
                <Checkbox label="Accept terms" />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(checkbox, disabled)">
                <Checkbox disabled={true} label="Accept terms" />
            </FormGroup>
            <FormGroup {...args} labelInfo="(select, enabled)" labelFor="state-enabled-select">
                <HTMLSelect id="state-enabled-select" fill={args.fill} options={["Option A", "Option B"]} />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(select, disabled)" labelFor="state-disabled-select">
                <HTMLSelect
                    id="state-disabled-select"
                    disabled={true}
                    fill={args.fill}
                    options={["Option A", "Option B"]}
                />
            </FormGroup>
        </Flex>
    ),
};

/**
 * Use `helperText`, `labelInfo`, and `subLabel` to add additional context to the form group.
 * Shown here with various form controls.
 */
export const LabelsExample: Story = {
    name: "Labels & Helper Text",
    argTypes: {
        helperText: { table: { disable: true } },
        labelInfo: { table: { disable: true } },
        subLabel: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={4} style={{ width: "100%" }}>
            <FormGroup {...args} label="Text input" labelFor="labels-basic-input">
                <InputGroup
                    id="labels-basic-input"
                    intent={args.intent}
                    disabled={args.disabled}
                    fill={args.fill}
                    placeholder="Basic..."
                />
            </FormGroup>
            <FormGroup
                {...args}
                label="Text area"
                labelFor="labels-textarea"
                helperText="Helper text appears below the control"
            >
                <TextArea
                    id="labels-textarea"
                    intent={args.intent}
                    disabled={args.disabled}
                    fill={args.fill}
                    placeholder="With helper..."
                />
            </FormGroup>
            <FormGroup {...args} label="Numeric input" labelInfo="(required)">
                <NumericInput
                    intent={args.intent}
                    disabled={args.disabled}
                    fill={args.fill}
                    placeholder="Required field..."
                />
            </FormGroup>
            <FormGroup {...args} label="Select" labelFor="labels-select" subLabel="Additional context below the label">
                <HTMLSelect
                    id="labels-select"
                    disabled={args.disabled}
                    fill={args.fill}
                    options={["Option A", "Option B", "Option C"]}
                />
            </FormGroup>
            <FormGroup
                {...args}
                label="Checkbox group"
                labelInfo="(optional)"
                subLabel="Select your preferences"
                helperText="You may choose more than one"
            >
                <Checkbox label="Option one" disabled={args.disabled} />
                <Checkbox label="Option two" disabled={args.disabled} />
                <Checkbox label="Option three" disabled={args.disabled} />
            </FormGroup>
            <FormGroup
                {...args}
                label="Switch"
                subLabel="Toggle this setting on or off"
                helperText="Changes take effect immediately"
            >
                <Switch label="Dark mode" disabled={args.disabled} />
            </FormGroup>
            <FormGroup {...args} label="Radio group" labelInfo="(required)" helperText="Choose exactly one option">
                <RadioGroup
                    disabled={args.disabled}
                    onChange={NOOP}
                    selectedValue="a"
                    options={[
                        { label: "Option A", value: "a" },
                        { label: "Option B", value: "b" },
                    ]}
                />
            </FormGroup>
        </Flex>
    ),
};

/**
 * Use the `inline` prop to render the label and input on a single line.
 * Shown here with various form controls.
 */
export const InlineExample: Story = {
    name: "Inline",
    argTypes: {
        inline: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={4} style={{ width: "100%" }}>
            <FormGroup {...args} inline={true} labelInfo="(text input)" labelFor="inline-name-input">
                <InputGroup
                    id="inline-name-input"
                    intent={args.intent}
                    disabled={args.disabled}
                    fill={args.fill}
                    placeholder="Enter name..."
                />
            </FormGroup>
            <FormGroup {...args} inline={true} labelInfo="(text area)" labelFor="inline-textarea">
                <TextArea
                    id="inline-textarea"
                    intent={args.intent}
                    disabled={args.disabled}
                    fill={args.fill}
                    placeholder="Enter description..."
                />
            </FormGroup>
            <FormGroup {...args} inline={true} labelInfo="(numeric input)">
                <NumericInput intent={args.intent} disabled={args.disabled} fill={args.fill} placeholder="0" />
            </FormGroup>
            <FormGroup {...args} inline={true} labelInfo="(select)" labelFor="inline-select">
                <HTMLSelect
                    id="inline-select"
                    disabled={args.disabled}
                    fill={args.fill}
                    options={["United States", "Canada", "United Kingdom"]}
                />
            </FormGroup>
            <FormGroup {...args} inline={true} labelInfo="(switch)">
                <Switch label="Toggle" disabled={args.disabled} />
            </FormGroup>
            <FormGroup {...args} inline={true} labelInfo="(checkbox)">
                <Checkbox label="I accept the terms" disabled={args.disabled} />
            </FormGroup>
        </Flex>
    ),
};

/**
 * Use the `fill` prop to make the form group expand to the full width of its container.
 * Shown here with various form controls.
 */
export const FillExample: Story = {
    name: "Fill",
    argTypes: {
        fill: { table: { disable: true } },
    },
    decorators: [
        Story => (
            <div style={{ width: "400px" }}>
                <Story />
            </div>
        ),
    ],
    render: args => (
        <Flex flexDirection="column" gap={4} alignItems="start">
            <FormGroup {...args} fill={true} labelInfo="(text input, fill)" labelFor="fill-full-input">
                <InputGroup
                    id="fill-full-input"
                    fill={true}
                    intent={args.intent}
                    disabled={args.disabled}
                    placeholder="Full width input..."
                />
            </FormGroup>
            <FormGroup {...args} fill={false} labelInfo="(text input, auto)" labelFor="fill-auto-input">
                <InputGroup
                    id="fill-auto-input"
                    intent={args.intent}
                    disabled={args.disabled}
                    placeholder="Auto width input..."
                />
            </FormGroup>
            <FormGroup {...args} fill={true} labelInfo="(text area, fill)" labelFor="fill-textarea">
                <TextArea
                    id="fill-textarea"
                    fill={true}
                    intent={args.intent}
                    disabled={args.disabled}
                    placeholder="Full width textarea..."
                />
            </FormGroup>
            <FormGroup {...args} fill={true} labelInfo="(select, fill)" labelFor="fill-select">
                <HTMLSelect
                    id="fill-select"
                    fill={true}
                    disabled={args.disabled}
                    options={["Option A", "Option B", "Option C"]}
                />
            </FormGroup>
            <FormGroup {...args} fill={false} labelInfo="(select, auto)" labelFor="fill-select-auto">
                <HTMLSelect
                    id="fill-select-auto"
                    disabled={args.disabled}
                    options={["Option A", "Option B", "Option C"]}
                />
            </FormGroup>
            <FormGroup {...args} fill={true} labelInfo="(switch, fill)">
                <Switch label="Enable feature" disabled={args.disabled} />
            </FormGroup>
            <FormGroup {...args} fill={true} labelInfo="(segmented control, fill)">
                <SegmentedControl
                    fill={true}
                    disabled={args.disabled}
                    options={[
                        { label: "List", value: "list" },
                        { label: "Grid", value: "grid" },
                        { label: "Table", value: "table" },
                    ]}
                />
            </FormGroup>
        </Flex>
    ),
};

// ---------------------------------------------------------------------------
// Comprehensive comparisons
// ---------------------------------------------------------------------------

/**
 * All form controls in their enabled and disabled states within FormGroups.
 */
export const AllStates: Story = {
    args: {
        label: "Label",
        helperText: "Helper text for this field",
    },
    argTypes: {
        disabled: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={4}>
            <FormGroup {...args} labelInfo="(text input, enabled)" labelFor="allstates-input">
                <InputGroup id="allstates-input" intent={args.intent} fill={args.fill} placeholder="Enter value..." />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(text input, disabled)" labelFor="allstates-input-dis">
                <InputGroup
                    id="allstates-input-dis"
                    disabled={true}
                    intent={args.intent}
                    fill={args.fill}
                    placeholder="Enter value..."
                />
            </FormGroup>
            <FormGroup {...args} labelInfo="(text area, enabled)" labelFor="allstates-textarea">
                <TextArea id="allstates-textarea" intent={args.intent} fill={args.fill} placeholder="Enter text..." />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(text area, disabled)" labelFor="allstates-textarea-dis">
                <TextArea
                    id="allstates-textarea-dis"
                    disabled={true}
                    intent={args.intent}
                    fill={args.fill}
                    placeholder="Enter text..."
                />
            </FormGroup>
            <FormGroup {...args} labelInfo="(numeric input, enabled)">
                <NumericInput intent={args.intent} fill={args.fill} placeholder="0" />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(numeric input, disabled)">
                <NumericInput disabled={true} intent={args.intent} fill={args.fill} placeholder="0" />
            </FormGroup>
            <FormGroup {...args} labelInfo="(select, enabled)" labelFor="allstates-select">
                <HTMLSelect id="allstates-select" fill={args.fill} options={["Option A", "Option B"]} />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(select, disabled)" labelFor="allstates-select-dis">
                <HTMLSelect
                    id="allstates-select-dis"
                    disabled={true}
                    fill={args.fill}
                    options={["Option A", "Option B"]}
                />
            </FormGroup>
            <FormGroup {...args} labelInfo="(file input, enabled)" labelFor="allstates-file">
                <FileInput inputProps={{ id: "allstates-file" }} fill={args.fill} text="Choose file..." />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(file input, disabled)" labelFor="allstates-file-dis">
                <FileInput
                    inputProps={{ id: "allstates-file-dis" }}
                    disabled={true}
                    fill={args.fill}
                    text="Choose file..."
                />
            </FormGroup>
            <FormGroup {...args} labelInfo="(switch, enabled)">
                <Switch label="Toggle" />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(switch, disabled)">
                <Switch disabled={true} label="Toggle" />
            </FormGroup>
            <FormGroup {...args} labelInfo="(checkbox, enabled)">
                <Checkbox label="Accept terms" />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(checkbox, disabled)">
                <Checkbox disabled={true} label="Accept terms" />
            </FormGroup>
            <FormGroup {...args} labelInfo="(radio group, enabled)">
                <RadioGroup
                    onChange={NOOP}
                    selectedValue="a"
                    options={[
                        { label: "Option A", value: "a" },
                        { label: "Option B", value: "b" },
                    ]}
                />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(radio group, disabled)">
                <RadioGroup
                    disabled={true}
                    onChange={NOOP}
                    selectedValue="a"
                    options={[
                        { label: "Option A", value: "a" },
                        { label: "Option B", value: "b" },
                    ]}
                />
            </FormGroup>
            <FormGroup {...args} labelInfo="(slider, enabled)">
                <Slider intent={args.intent} min={0} max={10} value={5} />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(slider, disabled)">
                <Slider disabled={true} intent={args.intent} min={0} max={10} value={5} />
            </FormGroup>
            <FormGroup {...args} labelInfo="(segmented control, enabled)">
                <SegmentedControl
                    fill={args.fill}
                    options={[
                        { label: "A", value: "a" },
                        { label: "B", value: "b" },
                    ]}
                />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(segmented control, disabled)">
                <SegmentedControl
                    disabled={true}
                    fill={args.fill}
                    options={[
                        { label: "A", value: "a" },
                        { label: "B", value: "b" },
                    ]}
                />
            </FormGroup>
        </Flex>
    ),
};

/**
 * All form controls in their disabled state within FormGroups.
 */
export const AllControlsDisabled: Story = {
    render: args => (
        <Flex flexDirection="column" gap={4}>
            <FormGroup {...args} disabled={true} labelInfo="(text input)" labelFor="disabled-text">
                <InputGroup id="disabled-text" disabled={true} intent={args.intent} placeholder="Disabled input..." />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(text area)" labelFor="disabled-textarea">
                <TextArea
                    id="disabled-textarea"
                    disabled={true}
                    intent={args.intent}
                    placeholder="Disabled textarea..."
                    fill={true}
                />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(numeric input)">
                <NumericInput disabled={true} intent={args.intent} placeholder="Disabled..." />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(select)" labelFor="disabled-select">
                <HTMLSelect id="disabled-select" disabled={true} options={["Option A", "Option B"]} />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(file input)" labelFor="disabled-file">
                <FileInput inputProps={{ id: "disabled-file" }} disabled={true} text="Choose file..." />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(switch)">
                <Switch disabled={true} label="Disabled switch" />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(checkbox)">
                <Checkbox disabled={true} label="Disabled checkbox" />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(radio)">
                <Radio disabled={true} label="Disabled radio" />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(slider)">
                <Slider disabled={true} intent={args.intent} value={30} />
            </FormGroup>
            <FormGroup {...args} disabled={true} labelInfo="(segmented control)">
                <SegmentedControl
                    disabled={true}
                    options={[
                        { label: "A", value: "a" },
                        { label: "B", value: "b" },
                    ]}
                />
            </FormGroup>
        </Flex>
    ),
};

/**
 * All form controls rendered inline within FormGroups.
 */
export const InlineControls: Story = {
    render: args => (
        <Flex flexDirection="column" gap={4} style={{ width: "100%" }}>
            <FormGroup {...args} inline={true} labelInfo="(text input)" labelFor="inline-name">
                <InputGroup
                    id="inline-name"
                    intent={args.intent}
                    disabled={args.disabled}
                    fill={args.fill}
                    placeholder="Enter name..."
                />
            </FormGroup>
            <FormGroup {...args} inline={true} labelInfo="(numeric input)">
                <NumericInput intent={args.intent} disabled={args.disabled} fill={args.fill} placeholder="0" />
            </FormGroup>
            <FormGroup {...args} inline={true} labelInfo="(select)" labelFor="inline-country">
                <HTMLSelect
                    id="inline-country"
                    disabled={args.disabled}
                    fill={args.fill}
                    options={["United States", "Canada", "United Kingdom"]}
                />
            </FormGroup>
            <FormGroup {...args} inline={true} labelInfo="(switch)">
                <Switch disabled={args.disabled} />
            </FormGroup>
            <FormGroup {...args} inline={true} labelInfo="(checkbox)">
                <Checkbox label="I accept the terms" disabled={args.disabled} />
            </FormGroup>
        </Flex>
    ),
};

// ---------------------------------------------------------------------------
// Composite examples
// ---------------------------------------------------------------------------

/**
 * A realistic form combining multiple input types within FormGroups.
 */
export const MixedForm: Story = {
    decorators: [
        Story => (
            <div style={{ width: "100%", minWidth: "500px" }}>
                <Story />
            </div>
        ),
    ],
    render: args => (
        <Flex flexDirection="column" gap={4}>
            <FormGroup {...args} label="Full name" labelFor="mixed-name" labelInfo="(required)">
                <InputGroup
                    id="mixed-name"
                    intent={args.intent}
                    disabled={args.disabled}
                    fill={args.fill}
                    placeholder="Jane Doe"
                />
            </FormGroup>
            <FormGroup {...args} label="Email" labelFor="mixed-email" labelInfo="(required)">
                <InputGroup
                    id="mixed-email"
                    intent={args.intent}
                    disabled={args.disabled}
                    fill={args.fill}
                    placeholder="jane@example.com"
                    type="email"
                />
            </FormGroup>
            <FormGroup {...args} label="Bio" labelFor="mixed-bio" helperText="Brief description of yourself">
                <TextArea
                    id="mixed-bio"
                    intent={args.intent}
                    disabled={args.disabled}
                    fill={args.fill}
                    placeholder="Tell us about yourself..."
                />
            </FormGroup>
            <FormGroup {...args} label="Age">
                <NumericInput
                    intent={args.intent}
                    disabled={args.disabled}
                    fill={args.fill}
                    min={0}
                    max={150}
                    placeholder="Enter age..."
                />
            </FormGroup>
            <FormGroup {...args} label="Country" labelFor="mixed-country">
                <HTMLSelect
                    id="mixed-country"
                    disabled={args.disabled}
                    fill={args.fill}
                    options={["", "United States", "Canada", "United Kingdom", "Germany"]}
                />
            </FormGroup>
            <FormGroup {...args} label="Resume" labelFor="mixed-resume" helperText="PDF format preferred">
                <FileInput
                    inputProps={{ id: "mixed-resume" }}
                    disabled={args.disabled}
                    fill={args.fill}
                    text="Choose file..."
                />
            </FormGroup>
            <FormGroup {...args} label="Role">
                <RadioGroup
                    disabled={args.disabled}
                    onChange={NOOP}
                    selectedValue="engineer"
                    options={[
                        { label: "Engineer", value: "engineer" },
                        { label: "Designer", value: "designer" },
                        { label: "Manager", value: "manager" },
                    ]}
                />
            </FormGroup>
            <FormGroup {...args} label="Skills" helperText="Select all that apply">
                <Checkbox label="JavaScript" disabled={args.disabled} />
                <Checkbox label="TypeScript" disabled={args.disabled} />
                <Checkbox label="React" disabled={args.disabled} />
                <Checkbox label="Node.js" disabled={args.disabled} />
            </FormGroup>
            <FormGroup {...args} label="Experience level">
                <Slider
                    intent={args.intent}
                    disabled={args.disabled}
                    min={0}
                    max={10}
                    stepSize={1}
                    value={3}
                    labelStepSize={5}
                />
            </FormGroup>
            <FormGroup {...args} label="Employment type">
                <SegmentedControl
                    disabled={args.disabled}
                    fill={args.fill}
                    options={[
                        { label: "Full-time", value: "full" },
                        { label: "Part-time", value: "part" },
                        { label: "Contract", value: "contract" },
                    ]}
                />
            </FormGroup>
            <FormGroup {...args} label="Preferences">
                <Switch label="Subscribe to newsletter" disabled={args.disabled} />
                <Switch label="Allow data collection" disabled={args.disabled} />
            </FormGroup>
        </Flex>
    ),
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    render: args => (
        <FormGroup
            disabled={args.disabled}
            fill={args.fill}
            helperText={args.helperText}
            inline={args.inline}
            intent={args.intent}
            label={args.label}
            labelFor="playground-input"
            labelInfo={args.labelInfo}
            subLabel={args.subLabel}
        >
            <InputGroup
                id="playground-input"
                intent={args.intent}
                disabled={args.disabled}
                fill={args.fill}
                placeholder="Enter value..."
            />
        </FormGroup>
    ),
    args: {
        label: "Full Name",
        helperText: "Enter your full legal name",
        labelInfo: "(required)",
        intent: "none",
    },
};
