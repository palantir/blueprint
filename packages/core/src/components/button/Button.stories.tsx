/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator, StoryLabel } from "@storybook-common";
import { expect, waitFor, within } from "storybook/test";

import { Flex } from "@blueprintjs/labs";

import { Alignment, ButtonVariant, Intent, Size } from "../../common";
import { H5 } from "../html/html";

import { Button } from "./buttons";

// These props are deprecated on Button — hide them from the Storybook controls panel.
const disabledArgs = [
    "large",
    "minimal",
    "outlined",
    "rightIcon",
    "small",
    "type",
    "children",
] as const satisfies ReadonlyArray<keyof React.ComponentProps<typeof Button>>;

const visualRegressionIntents = Object.values(Intent);
const visualRegressionVariants = Object.values(ButtonVariant);
const visualRegressionStates = [
    { label: "Rest", buttonProps: {} },
    { label: "Active", buttonProps: { active: true } },
    { label: "Disabled", buttonProps: { disabled: true } },
] as const satisfies ReadonlyArray<{
    label: string;
    buttonProps: Pick<React.ComponentProps<typeof Button>, "active" | "disabled">;
}>;

const renderButtonVisualRegressionMatrix = (args: React.ComponentProps<typeof Button>) => (
    <Flex flexDirection="column" gap={2}>
        {visualRegressionVariants.map(variant => (
            <Flex key={variant} data-button-variant={variant} flexDirection="column" gap={2}>
                <StoryLabel title={variant} />
                {visualRegressionStates.map(({ label, buttonProps }) => (
                    <Flex key={label} flexDirection="column" gap={1}>
                        <StoryLabel title={label} />
                        <Flex gap={2}>
                            {visualRegressionIntents.map(intent => (
                                <Button
                                    key={intent}
                                    {...args}
                                    {...buttonProps}
                                    aria-label={`${variant} ${intent} ${label.toLowerCase()}`}
                                    icon={args.icon ?? "style"}
                                    intent={intent}
                                    text={intent}
                                    variant={variant}
                                />
                            ))}
                        </Flex>
                    </Flex>
                ))}
            </Flex>
        ))}
    </Flex>
);

const buttonVisualProperties = ["boxShadow", "borderRadius", "fontFamily", "fontSize", "minHeight"] as const;

const colorToRgbaBytes = (color: string) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (context === null) {
        throw new Error("Expected the browser to provide a 2D canvas context");
    }

    context.fillStyle = color;
    context.fillRect(0, 0, 1, 1);
    return Array.from(context.getImageData(0, 0, 1, 1).data);
};

const getButtonVisualStyle = (button: HTMLElement) => {
    const style = getComputedStyle(button);
    const icon = button.querySelector("svg");
    if (!(icon instanceof SVGElement)) {
        throw new Error("Expected every compatibility button to render an icon");
    }
    const iconStyle = getComputedStyle(icon);
    return [
        colorToRgbaBytes(style.backgroundColor),
        colorToRgbaBytes(style.color),
        colorToRgbaBytes(iconStyle.fill),
        colorToRgbaBytes(iconStyle.color),
        ...buttonVisualProperties.map(property => style[property]),
    ];
};

const renderButtonTokenComparison = ({
    args,
    id,
    label,
    className,
}: {
    args: React.ComponentProps<typeof Button>;
    id: string;
    label: string;
    className: string;
}) => (
    <section aria-labelledby={id} className={className}>
        <H5 id={id}>{label}</H5>
        {renderButtonVisualRegressionMatrix(args)}
    </section>
);

const nhsdButtonTypes = [
    { type: "primary", label: "Take primary action" },
    { type: "secondary", label: "Take secondary action" },
    { type: "tertiary", label: "Take tertiary action" },
    { type: "start", label: "Start" },
    { type: "cancel", label: "Cancel" },
] as const;
const nhsdButtonStates = ["default", "hover", "focus", "active", "disabled"] as const;

const renderNhsDigitalButtonComponentOverrides = () => (
    <section
        aria-labelledby="button-comparison-nhsd-component-overrides"
        className="bp-next token-compatibility-nhsd-theme token-compatibility-nhsd-component-overrides"
    >
        <H5 id="button-comparison-nhsd-component-overrides">NHS Digital theme overrides</H5>
        <p>
            Public tokens provide the palette and font family. Component-level CSS adds the dimensions, typography,
            variants, and states which BP7 public tokens cannot currently express.
        </p>
        <Flex flexDirection="column" gap={3}>
            {nhsdButtonTypes.map(({ type, label }) => (
                <Flex
                    key={type}
                    className={`token-compatibility-nhsd-button-row token-compatibility-nhsd-button-row-${type}`}
                    flexDirection="column"
                    gap={1}
                >
                    <StoryLabel title={type} />
                    <Flex alignItems="flex-start" flexWrap="wrap" gap={2}>
                        {nhsdButtonStates.map(state => (
                            <Flex key={state} flexDirection="column" gap={1}>
                                <StoryLabel title={state} />
                                <Button
                                    active={state === "active"}
                                    aria-label={`NHS Digital ${type} ${state}`}
                                    className={`token-compatibility-nhsd-button token-compatibility-nhsd-button-${type} token-compatibility-nhsd-button-state-${state}`}
                                    disabled={state === "disabled"}
                                    text={<span className="token-compatibility-nhsd-button-label">{label}</span>}
                                />
                            </Flex>
                        ))}
                    </Flex>
                </Flex>
            ))}
        </Flex>
    </section>
);

const meta: Meta<typeof Button> = {
    title: "Core/Button/Button",
    component: Button,
    decorators: [storybookLayoutDecorator],
    tags: ["autodocs"],
    args: {
        text: "Button",
        intent: "none",
        variant: "solid",
        size: "medium",
        alignText: "center",
        icon: undefined,
        endIcon: undefined,
        fill: false,
        active: false,
        loading: false,
        disabled: false,
        ellipsizeText: false,
    },
    argTypes: {
        text: {
            control: "text",
        },
        intent: {
            control: "select",
            options: Object.values(Intent),
        },
        size: {
            control: "select",
            options: Object.values(Size),
        },
        variant: {
            control: "select",
            options: Object.values(ButtonVariant),
        },
        alignText: {
            control: "select",
            options: Object.values(Alignment),
        },
        icon: {
            control: "text",
        },
        endIcon: {
            control: "text",
        },
        active: {
            control: "boolean",
        },
        disabled: {
            control: "boolean",
        },
        ellipsizeText: {
            control: "boolean",
        },
        fill: {
            control: "boolean",
        },
        loading: {
            control: "boolean",
        },
        onClick: { action: "clicked" },
        ...disabledArgs.reduce(
            (acc, argName) => {
                acc[argName] = {
                    table: {
                        disable: true,
                    },
                };
                return acc;
            },
            {} as Record<(typeof disabledArgs)[number], { table: { disable: boolean } }>,
        ),
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic button with default styling.
 */
export const Default: Story = {
    args: {
        text: "Button",
    },
};

/**
 * Use the `intent` prop to apply a semantic color that conveys the purpose or status of the button.
 */
export const IntentExample: Story = {
    name: "Intent",
    argTypes: {
        intent: { table: { disable: true } },
    },
    render: args => (
        <Flex gap={2}>
            {Object.values(Intent)
                .filter(i => i !== "none")
                .map(intent => (
                    <Button
                        key={intent}
                        {...args}
                        intent={intent}
                        text={intent.charAt(0).toUpperCase() + intent.slice(1)}
                    />
                ))}
        </Flex>
    ),
};

/**
 * Use the `variant` prop to change the visual style. "solid" (default) renders a filled button,
 * "minimal" renders without a background, and "outlined" adds a border without fill.
 */
export const VariantExample: Story = {
    name: "Variant",
    argTypes: {
        variant: { table: { disable: true } },
    },
    render: args => (
        <Flex gap={2}>
            {Object.values(ButtonVariant).map(variant => (
                <Button
                    key={variant}
                    {...args}
                    variant={variant}
                    text={variant.charAt(0).toUpperCase() + variant.slice(1)}
                />
            ))}
        </Flex>
    ),
};

/**
 * Use the `size` prop to adjust the button dimensions.
 */
export const SizeExample: Story = {
    name: "Size",
    argTypes: {
        size: { table: { disable: true } },
    },
    render: args => (
        <Flex gap={2} alignItems="center">
            {Object.values(Size).map(size => (
                <Button key={size} {...args} size={size} text={size.charAt(0).toUpperCase() + size.slice(1)} />
            ))}
        </Flex>
    ),
};

/**
 * Buttons support `active`, `disabled`, and `loading` states.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        active: { table: { disable: true } },
        disabled: { table: { disable: true } },
        loading: { table: { disable: true } },
    },
    render: args => (
        <Flex gap={2}>
            <Button {...args} text="Default" />
            <Button {...args} active={true} text="Active" />
            <Button {...args} disabled={true} text="Disabled" />
            <Button {...args} loading={true} text="Loading" />
        </Flex>
    ),
};

/**
 * Use `icon` and `endIcon` props to render icons alongside text, or use `icon` alone for icon-only buttons.
 */
export const IconExample: Story = {
    name: "Icons",
    argTypes: {
        icon: { table: { disable: true } },
        endIcon: { table: { disable: true } },
    },
    render: args => (
        <Flex gap={2}>
            <Button {...args} icon="refresh" text="Reset" />
            <Button {...args} icon="user" endIcon="caret-down" text="Profile" />
            <Button {...args} endIcon="arrow-right" text="Next" />
            <Button {...args} icon="edit" text={undefined} aria-label="edit" />
        </Flex>
    ),
};

/**
 * Use the `alignText` prop to control text alignment within the button.
 */
export const AlignmentExample: Story = {
    name: "Alignment",
    argTypes: {
        alignText: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={2} style={{ minWidth: 300 }}>
            {Object.values(Alignment).map(alignment => (
                <Button
                    key={alignment}
                    {...args}
                    alignText={alignment}
                    fill={true}
                    endIcon="caret-down"
                    text={alignment.charAt(0).toUpperCase() + alignment.slice(1)}
                />
            ))}
        </Flex>
    ),
};

/**
 * Use the `fill` prop to make the button expand to the full width of its container.
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
        <Flex flexDirection="column" gap={2}>
            <Button {...args} fill={true} text="Full Width" />
            <Button {...args} fill={false} text="Auto Width" />
        </Flex>
    ),
};

/**
 * All intents across all variants and states.
 */
export const AllIntentsAllVariants: Story = {
    argTypes: {
        intent: { table: { disable: true } },
        variant: { table: { disable: true } },
        active: { table: { disable: true } },
        disabled: { table: { disable: true } },
        loading: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={4}>
            {Object.values(ButtonVariant).map(variant => (
                <Flex key={variant} flexDirection="column" gap={2}>
                    <StoryLabel title={variant} />
                    <Flex gap={2}>
                        {Object.values(Intent).map(intent => (
                            <Button key={intent} {...args} variant={variant} intent={intent} text={intent} />
                        ))}
                    </Flex>
                    <Flex gap={2}>
                        {Object.values(Intent).map(intent => (
                            <Button
                                key={intent}
                                {...args}
                                variant={variant}
                                intent={intent}
                                active={true}
                                text={intent}
                            />
                        ))}
                    </Flex>
                    <Flex gap={2}>
                        {Object.values(Intent).map(intent => (
                            <Button
                                key={intent}
                                {...args}
                                variant={variant}
                                intent={intent}
                                disabled={true}
                                text={intent}
                            />
                        ))}
                    </Flex>
                    <Flex gap={2}>
                        {Object.values(Intent).map(intent => (
                            <Button
                                key={intent}
                                {...args}
                                variant={variant}
                                intent={intent}
                                loading={true}
                                text={intent}
                            />
                        ))}
                    </Flex>
                </Flex>
            ))}
        </Flex>
    ),
};

/** Compares the BP6 baseline with BP7's defaults and a complete NHS Digital Button theme. */
export const TokenCompatibility: Story = {
    name: "BP6 baseline → BP7 defaults → NHS Digital theme",
    parameters: {
        layout: "padded",
    },
    render: args => (
        <Flex alignItems="flex-start" gap={6}>
            {renderButtonTokenComparison({
                args,
                id: "button-comparison-bp6",
                label: "BP6 baseline",
                className: "token-compatibility-baseline",
            })}
            {renderButtonTokenComparison({
                args,
                id: "button-comparison-bp7",
                label: "BP7 defaults: new palette",
                className: "bp-next token-compatibility-bp7-defaults",
            })}
            {renderNhsDigitalButtonComponentOverrides()}
        </Flex>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const baselineButtons = within(canvas.getByRole("region", { name: "BP6 baseline" })).getAllByRole("button");
        const defaultButtons = within(canvas.getByRole("region", { name: /BP7 defaults:/ })).getAllByRole("button");

        await expect(defaultButtons).toHaveLength(baselineButtons.length);
        await waitFor(() => {
            expect([...baselineButtons, ...defaultButtons].every(button => button.querySelector("svg") !== null)).toBe(
                true,
            );
        });

        const baselineWarningButtons = baselineButtons.filter(button => button.ariaLabel?.startsWith("solid warning"));
        const bp6WarningColors = new Map<string, readonly [readonly number[], readonly number[]]>([
            [
                "solid warning rest",
                [
                    [251, 179, 96, 255],
                    [17, 20, 24, 255],
                ],
            ],
            [
                "solid warning active",
                [
                    [119, 69, 13, 255],
                    [17, 20, 24, 255],
                ],
            ],
            [
                "solid warning disabled",
                [
                    [200, 117, 25, 102],
                    [23, 18, 20, 153],
                ],
            ],
        ]);
        let checkedWarningStates = 0;
        for (const button of baselineWarningButtons) {
            if (!button.matches(":hover")) {
                const expectedColors = bp6WarningColors.get(button.ariaLabel ?? "");
                await expect(expectedColors).toBeDefined();
                await expect(getButtonVisualStyle(button).slice(0, 2)).toEqual(expectedColors);
                checkedWarningStates++;
            }
        }
        await expect(checkedWarningStates).toBeGreaterThanOrEqual(2);

        await expect(
            defaultButtons.some((button, index) => {
                return (
                    getButtonVisualStyle(button).join("|") !== getButtonVisualStyle(baselineButtons[index]).join("|")
                );
            }),
        ).toBe(true);

        const nhsdButtons = within(canvas.getByRole("region", { name: "NHS Digital theme overrides" }));
        const getButton = (type: (typeof nhsdButtonTypes)[number]["type"], state: (typeof nhsdButtonStates)[number]) =>
            nhsdButtons.getByRole("button", { name: `NHS Digital ${type} ${state}` });

        await expect(nhsdButtons.getAllByRole("button")).toHaveLength(nhsdButtonTypes.length * nhsdButtonStates.length);

        const primaryDefault = getComputedStyle(getButton("primary", "default"));
        await expect(primaryDefault.backgroundColor).toBe("rgb(0, 91, 187)");
        await expect(primaryDefault.color).toBe("rgb(255, 255, 255)");
        await expect(primaryDefault.fontSize).toBe("14.04px");
        await expect(primaryDefault.fontWeight).toBe("600");
        await expect(primaryDefault.borderRadius).toBe("21.96px");
        await expect(getButton("primary", "default").getBoundingClientRect().height).toBe(44);

        await expect(getComputedStyle(getButton("primary", "hover")).backgroundColor).toBe("rgb(0, 48, 135)");

        const secondaryDefault = getComputedStyle(getButton("secondary", "default"));
        await expect(secondaryDefault.backgroundColor).toBe("rgb(255, 255, 255)");
        await expect(secondaryDefault.borderColor).toBe("rgb(0, 91, 187)");
        await expect(secondaryDefault.color).toBe("rgb(0, 91, 187)");

        await expect(getComputedStyle(getButton("tertiary", "default")).backgroundColor).toBe("rgb(255, 255, 255)");
        await expect(getComputedStyle(getButton("start", "default")).backgroundColor).toBe("rgb(0, 102, 70)");
        await expect(getComputedStyle(getButton("cancel", "default")).backgroundColor).toBe("rgb(179, 15, 15)");

        const focusedButton = getComputedStyle(getButton("primary", "focus"));
        await expect(focusedButton.backgroundColor).toBe("rgb(0, 48, 135)");
        await expect(focusedButton.boxShadow).toContain("rgb(250, 225, 0)");

        const activeButton = getComputedStyle(getButton("primary", "active"));
        await expect(activeButton.backgroundColor).toBe("rgb(0, 91, 187)");
        await expect(activeButton.transform).not.toBe("none");

        const disabledButton = getComputedStyle(getButton("primary", "disabled"));
        await expect(disabledButton.backgroundColor).toBe("rgb(213, 218, 222)");
        await expect(disabledButton.color).toBe("rgb(63, 82, 95)");
        await expect(disabledButton.boxShadow).toBe("none");
    },
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    render: function Render(args) {
        return (
            <Button
                active={args.active}
                alignText={args.alignText}
                disabled={args.disabled}
                ellipsizeText={args.ellipsizeText}
                endIcon={args.endIcon}
                fill={args.fill}
                icon={args.icon}
                intent={args.intent}
                loading={args.loading}
                size={args.size}
                text={args.text}
                variant={args.variant}
            />
        );
    },
    args: {
        text: "Click",
        icon: "refresh",
        endIcon: undefined,
        intent: "none",
        variant: "solid",
        size: "medium",
    },
};
