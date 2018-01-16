/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as classNames from "classnames";
import PopperJS from "popper.js";
import * as React from "react";

import {
    Button,
    Classes,
    Icon,
    Intent,
    Menu,
    MenuDivider,
    MenuItem,
    Popover,
    PopoverInteractionKind,
    Position,
    RadioGroup,
    Slider,
    Switch,
} from "@blueprintjs/core";
import { BaseExample, handleBooleanChange, handleNumberChange, handleStringChange } from "@blueprintjs/docs-theme";

const INTERACTION_KINDS = [
    { label: "Click", value: PopoverInteractionKind.CLICK.toString() },
    { label: "Click (target only)", value: PopoverInteractionKind.CLICK_TARGET_ONLY.toString() },
    { label: "Hover", value: PopoverInteractionKind.HOVER.toString() },
    { label: "Hover (target only)", value: PopoverInteractionKind.HOVER_TARGET_ONLY.toString() },
];

const VALID_POSITIONS: Array<Position | "auto"> = [
    "auto",
    Position.TOP_LEFT,
    Position.TOP,
    Position.TOP_RIGHT,
    Position.RIGHT_TOP,
    Position.RIGHT,
    Position.RIGHT_BOTTOM,
    Position.BOTTOM_LEFT,
    Position.BOTTOM,
    Position.BOTTOM_RIGHT,
    Position.LEFT_TOP,
    Position.LEFT,
    Position.LEFT_BOTTOM,
];

const POSITION_OPTIONS = VALID_POSITIONS.map((p: Position) => (
    <option key={p} value={p}>
        {p}
    </option>
));

const POPPER_DOCS = "https://popper.js.org/popper-documentation.html#modifiers";

export interface IPopoverExampleState {
    canEscapeKeyClose?: boolean;
    exampleIndex?: number;
    hasBackdrop?: boolean;
    inheritDarkTheme?: boolean;
    inline?: boolean;
    interactionKind?: PopoverInteractionKind;
    minimal?: boolean;
    modifiers?: PopperJS.Modifiers;
    position?: Position | "auto";
    sliderValue?: number;
}

export class PopoverExample extends BaseExample<IPopoverExampleState> {
    public state: IPopoverExampleState = {
        canEscapeKeyClose: true,
        exampleIndex: 0,
        hasBackdrop: false,
        inheritDarkTheme: true,
        inline: false,
        interactionKind: PopoverInteractionKind.CLICK,
        minimal: false,
        modifiers: {
            arrow: { enabled: true },
            flip: { enabled: true },
            keepTogether: { enabled: true },
            preventOverflow: { enabled: true, boundariesElement: "scrollParent" },
        },
        position: "auto",
        sliderValue: 5,
    };

    protected className = "docs-popover-example";

    private handleExampleIndexChange = handleNumberChange(exampleIndex => this.setState({ exampleIndex }));
    private handleInteractionChange = handleStringChange((interactionKind: PopoverInteractionKind) => {
        const hasBackdrop = this.state.hasBackdrop && interactionKind === PopoverInteractionKind.CLICK;
        this.setState({ interactionKind, hasBackdrop });
    });
    private handlePositionChange = handleStringChange((position: Position | "auto") => this.setState({ position }));
    private handleBoundaryChange = handleStringChange((boundary: PopperJS.Boundary) =>
        this.setState({
            modifiers: {
                ...this.state.modifiers,
                preventOverflow: {
                    boundariesElement: boundary,
                    enabled: boundary.length > 0,
                },
            },
        }),
    );

    private toggleEscapeKey = handleBooleanChange(canEscapeKeyClose => this.setState({ canEscapeKeyClose }));
    private toggleInline = handleBooleanChange(inline => {
        if (inline) {
            this.setState({
                hasBackdrop: false,
                inheritDarkTheme: false,
                inline,
            });
        } else {
            this.setState({ inline });
        }
    });
    private toggleMinimal = handleBooleanChange(minimal => this.setState({ minimal }));

    protected renderExample() {
        const { exampleIndex, sliderValue, ...popoverProps } = this.state;
        const popoverClassName = classNames(this.className, {
            "pt-popover-content-sizing": exampleIndex <= 2,
        });
        return (
            <div className="docs-popover-example-scroll" ref={this.centerScroll}>
                <Popover popoverClassName={popoverClassName} portalClassName="foo" {...popoverProps}>
                    <Button intent={Intent.PRIMARY} text="Popover target" />
                    {this.getContents(exampleIndex)}
                </Popover>
                <p>
                    Scroll around this container to experiment<br />
                    with <code>flip</code> and <code>preventOverflow</code> modifiers.
                </p>
            </div>
        );
    }

    protected renderOptions() {
        const { arrow, flip, preventOverflow } = this.state.modifiers;
        return [
            [
                <h5 key="app">Appearance</h5>,
                <label className={Classes.LABEL} key="position">
                    Popover position
                    <div className={Classes.SELECT}>
                        <select value={this.state.position} onChange={this.handlePositionChange}>
                            {POSITION_OPTIONS}
                        </select>
                    </div>
                </label>,
                <label className={Classes.LABEL} key="example">
                    Example content
                    <div className={Classes.SELECT}>
                        <select value={this.state.exampleIndex} onChange={this.handleExampleIndexChange}>
                            <option value="0">Text</option>
                            <option value="1">Input</option>
                            <option value="2">Slider</option>
                            <option value="3">Menu</option>
                            <option value="4">Popover Example</option>
                            <option value="5">Empty</option>
                        </select>
                    </div>
                </label>,
                <Switch checked={this.state.inline} label="Inline" key="inline" onChange={this.toggleInline} />,
                <Switch
                    checked={this.state.minimal}
                    label="Minimal (no arrow, simple transition)"
                    key="minimal"
                    onChange={this.toggleMinimal}
                />,
            ],
            [
                <h5 key="int">Interactions</h5>,
                <RadioGroup
                    key="interaction"
                    label="Interaction kind"
                    selectedValue={this.state.interactionKind.toString()}
                    options={INTERACTION_KINDS}
                    onChange={this.handleInteractionChange}
                />,
                <Switch
                    checked={this.state.canEscapeKeyClose}
                    label="Can escape key close"
                    key="escape"
                    onChange={this.toggleEscapeKey}
                />,
                <br key="break" />,
            ],
            [
                <h5 key="mod">Modifiers</h5>,
                <Switch
                    checked={arrow.enabled}
                    label="Arrow"
                    key="arrow"
                    onChange={this.getModifierChangeHandler("arrow")}
                />,
                <Switch
                    checked={flip.enabled}
                    label="Flip"
                    key="flip"
                    onChange={this.getModifierChangeHandler("flip")}
                />,
                <Switch
                    checked={preventOverflow.enabled}
                    label="Prevent overflow"
                    key="preventOverflow"
                    onChange={this.getModifierChangeHandler("preventOverflow")}
                >
                    <div className={Classes.SELECT} style={{ marginTop: 5 }}>
                        <select
                            disabled={!preventOverflow.enabled}
                            value={preventOverflow.boundariesElement.toString()}
                            onChange={this.handleBoundaryChange}
                        >
                            <option value="scrollParent">scrollParent</option>
                            <option value="viewport">viewport</option>
                            <option value="window">window</option>
                        </select>
                    </div>
                </Switch>,
                <p key="docs-link">
                    <a href={POPPER_DOCS} target="_blank">
                        Popper.js docs <Icon iconName="share" />
                    </a>
                </p>,
            ],
        ];
    }

    private getContents(index: number) {
        return [
            <div>
                <h5>Popover title</h5>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua.
                </p>
                <button className={classNames(Classes.BUTTON, Classes.POPOVER_DISMISS)}>Dismiss</button>
            </div>,
            <div>
                <label className={Classes.LABEL}>
                    Enter some text
                    <input autoFocus={true} className={Classes.INPUT} type="text" />
                </label>
            </div>,
            <Slider min={0} max={10} onChange={this.handleSliderChange} value={this.state.sliderValue} />,
            <Menu>
                <MenuDivider title="Edit" />
                <MenuItem iconName="cut" text="Cut" label="⌘X" />
                <MenuItem iconName="duplicate" text="Copy" label="⌘C" />
                <MenuItem iconName="clipboard" text="Paste" label="⌘V" disabled={true} />
                <MenuDivider title="Text" />
                <MenuItem iconName="align-left" text="Alignment">
                    <MenuItem iconName="align-left" text="Left" />
                    <MenuItem iconName="align-center" text="Center" />
                    <MenuItem iconName="align-right" text="Right" />
                    <MenuItem iconName="align-justify" text="Justify" />
                </MenuItem>
                <MenuItem iconName="style" text="Style">
                    <MenuItem iconName="bold" text="Bold" />
                    <MenuItem iconName="italic" text="Italic" />
                    <MenuItem iconName="underline" text="Underline" />
                </MenuItem>
            </Menu>,
            <PopoverExample {...this.props} />,
        ][index];
    }

    private handleSliderChange = (value: number) => this.setState({ sliderValue: value });

    private getModifierChangeHandler(name: keyof PopperJS.Modifiers) {
        return handleBooleanChange(enabled => {
            this.setState({
                modifiers: {
                    ...this.state.modifiers,
                    [name]: { ...this.state.modifiers[name], enabled },
                },
            });
        });
    }

    private centerScroll = (div: HTMLDivElement) => {
        if (div != null) {
            // if we don't requestAnimationFrame, this function apparently executes
            // before styles are applied to the page, so the centering is way off.
            requestAnimationFrame(() => {
                const container = div.parentElement;
                container.scrollTop = div.clientHeight / 4;
                container.scrollLeft = div.clientWidth / 4;
            });
        }
    };
}
