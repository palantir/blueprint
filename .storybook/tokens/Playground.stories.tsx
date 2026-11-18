/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
// eslint-disable-next-line import/no-extraneous-dependencies
import { type ChangeEvent, type KeyboardEvent, useCallback, useState } from "react";

import {
    Button,
    Card,
    Checkbox,
    Code,
    FormGroup,
    H2,
    H3,
    HTMLTable,
    InputGroup,
    Intent,
    Link,
    NumericInput,
    Radio,
    RadioGroup,
    Switch,
    Tag,
} from "@blueprintjs/core";
import { TagIcon } from "@blueprintjs/icons/next";
import { Flex } from "@blueprintjs/labs";

import "./playground.css";

const INTENT_EXAMPLES = [
    { intent: Intent.NONE, label: "Default" },
    { intent: Intent.PRIMARY, label: "Primary" },
    { intent: Intent.SUCCESS, label: "Success" },
    { intent: Intent.WARNING, label: "Warning" },
    { intent: Intent.DANGER, label: "Danger" },
] as const;

const BUTTON_VARIANTS = ["solid", "outlined", "minimal"] as const;

const Playground = () => {
    const [name, setName] = useState("");
    const [delivery, setDelivery] = useState("daily");
    const [cardSelected, setCardSelected] = useState(true);
    const [removedTagIntents, setRemovedTagIntents] = useState<Intent[]>([]);
    const nameIntent = name.trim() === "" ? Intent.DANGER : Intent.SUCCESS;
    const handleNameChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => setName(event.currentTarget.value),
        [],
    );
    const handleDeliveryChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => setDelivery(event.currentTarget.value),
        [],
    );
    const handleCardClick = useCallback(() => setCardSelected(value => !value), []);
    const handleCardKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleCardClick();
            }
        },
        [handleCardClick],
    );
    const handleTagRemove = useCallback(
        (intent: Intent) => () => setRemovedTagIntents(intents => [...intents, intent]),
        [],
    );

    return (
        <div className="theme-playground">
            <div className="playground-gallery">
                <Card className="playground-card playground-buttons" compact={true}>
                    <div className="playground-matrix-scroll">
                        <HTMLTable aria-label="Buttons by intent and variant" className="playground-matrix">
                            <tbody>
                                {INTENT_EXAMPLES.map(({ intent, label }) => (
                                    <tr key={intent}>
                                        <th scope="row">{label}</th>
                                        {BUTTON_VARIANTS.map(variant => (
                                            <td key={variant}>
                                                <Button
                                                    aria-label={`${label} ${variant} button`}
                                                    intent={intent}
                                                    text="Button"
                                                    variant={variant}
                                                />
                                            </td>
                                        ))}
                                        <td>
                                            <Button
                                                active={true}
                                                aria-label={`${label} active button`}
                                                intent={intent}
                                                text="Active"
                                            />
                                        </td>
                                        <td>
                                            <Button
                                                aria-label={`${label} disabled button`}
                                                disabled={true}
                                                intent={intent}
                                                text="Disabled"
                                            />
                                        </td>
                                        <td>
                                            <Button
                                                aria-label={`${label} loading button`}
                                                intent={intent}
                                                loading={true}
                                                text="Loading"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </HTMLTable>
                    </div>
                </Card>

                <Card className="playground-card" compact={true}>
                    <div className="playground-matrix-scroll">
                        <HTMLTable aria-label="Tags by intent and variant" className="playground-matrix">
                            <tbody>
                                {INTENT_EXAMPLES.map(({ intent, label }) => (
                                    <tr key={intent}>
                                        <th scope="row">{label}</th>
                                        <td aria-label={`${label} solid tag`}>
                                            <Tag intent={intent}>Tag</Tag>
                                        </td>
                                        <td aria-label={`${label} minimal tag`}>
                                            <Tag intent={intent} minimal={true}>
                                                Tag
                                            </Tag>
                                        </td>
                                        <td aria-label={`${label} tag with icon`}>
                                            <Tag icon={<TagIcon />} intent={intent}>
                                                Tag
                                            </Tag>
                                        </td>
                                        <td aria-label={`${label} tag with close button`}>
                                            {!removedTagIntents.includes(intent) && (
                                                <Tag intent={intent} onRemove={handleTagRemove(intent)}>
                                                    Tag
                                                </Tag>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </HTMLTable>
                    </div>
                </Card>
                <Card
                    aria-label="Text styles"
                    className="playground-card playground-typography"
                    compact={true}
                    role="region"
                >
                    <div className="playground-type-headings">
                        <H2 className="playground-type-display">Build with Blueprint</H2>
                        <H3 className="playground-type-heading">Designed for data-dense interfaces</H3>
                    </div>
                    <p className="playground-type-lead">
                        More than a decade ago, we set out to create products that would transform the way organizations
                        use their data.
                    </p>
                    <p>
                        We build products that make people <strong>better at their most important work</strong> — the
                        kind of work you read about on the <em>front page of the newspaper</em>, not just the technology
                        section. See{" "}
                        <Link
                            href="https://blueprintjs.com/docs/#core/typography.running-text"
                            target="_blank"
                            rel="noreferrer"
                        >
                            running text
                        </Link>{" "}
                        for inline <Code style={{ color: "var(--bp-typography-color-muted)" }}>code</Code> and paragraph
                        styles.
                    </p>
                    <div className="playground-type-tones">
                        <p className="playground-type-muted">Muted text</p>
                        <p aria-disabled={true} className="playground-type-disabled">
                            Disabled text
                        </p>
                        <small className="playground-type-small">Small text</small>
                    </div>
                    <Flex className="playground-type-intents" flexWrap="wrap" gap={3}>
                        {INTENT_EXAMPLES.filter(({ intent }) => intent !== Intent.NONE).map(({ intent, label }) => (
                            <Link
                                key={intent}
                                color={intent}
                                href="https://blueprintjs.com/docs/#core/components/link"
                                target="_blank"
                                rel="noreferrer"
                                underline="hover"
                            >
                                {label}
                            </Link>
                        ))}
                    </Flex>
                </Card>

                <Card className="playground-card" compact={true}>
                    <Flex flexDirection="column" gap={4}>
                        <Card>A surface for related content.</Card>
                        <Card
                            aria-pressed={cardSelected}
                            elevation={2}
                            interactive={true}
                            onClick={handleCardClick}
                            onKeyDown={handleCardKeyDown}
                            role="button"
                            selected={cardSelected}
                            tabIndex={0}
                        >
                            {cardSelected ? "Selected. Activate to deselect." : "Activate to select this card."}
                        </Card>
                        <Card compact={true}>Compact card</Card>
                    </Flex>
                </Card>
                <Card className="playground-card playground-form" compact={true}>
                    <FormGroup label="Search" labelFor="playground-search">
                        <InputGroup id="playground-search" placeholder="Search components…" type="search" />
                    </FormGroup>
                    <FormGroup
                        helperText={
                            <span id="playground-name-help">
                                {nameIntent === Intent.DANGER ? "A name is required." : "Ready to save."}
                            </span>
                        }
                        intent={nameIntent}
                        label="Project name"
                        labelFor="playground-name"
                    >
                        <InputGroup
                            aria-describedby="playground-name-help"
                            aria-invalid={nameIntent === Intent.DANGER}
                            id="playground-name"
                            intent={nameIntent}
                            onChange={handleNameChange}
                            placeholder="Enter a name"
                            required={true}
                            value={name}
                        />
                    </FormGroup>
                    <FormGroup label={<span id="playground-quantity-label">Quantity</span>}>
                        <NumericInput
                            aria-labelledby="playground-quantity-label"
                            defaultValue={4}
                            fill={true}
                            max={10}
                            min={0}
                        />
                    </FormGroup>
                    <FormGroup disabled={true} label="Unavailable" labelFor="playground-disabled">
                        <InputGroup defaultValue="Disabled input" disabled={true} id="playground-disabled" />
                    </FormGroup>
                </Card>

                <Card className="playground-card" compact={true}>
                    <Flex flexDirection="column" gap={4}>
                        <div>
                            <Checkbox defaultChecked={true} label="Receive updates" />
                            <Checkbox label="Include archived projects" />
                            <Checkbox defaultIndeterminate={true} label="Select all projects" />
                            <Checkbox defaultChecked={true} disabled={true} label="Managed by administrator" />
                        </div>
                        <div className="playground-control-section">
                            <Switch defaultChecked={true} label="Enable notifications" />
                            <Switch disabled={true} label="Unavailable setting" />
                        </div>
                        <RadioGroup
                            className="playground-control-section"
                            label="Delivery frequency"
                            onChange={handleDeliveryChange}
                            selectedValue={delivery}
                        >
                            <Radio label="Daily" value="daily" />
                            <Radio label="Weekly" value="weekly" />
                            <Radio disabled={true} label="Real time (unavailable)" value="realtime" />
                        </RadioGroup>
                    </Flex>
                </Card>
            </div>
        </div>
    );
};

const meta = {
    title: "Theming/Playground",
    parameters: {
        layout: "fullscreen",
    },
    render: () => <Playground />,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
