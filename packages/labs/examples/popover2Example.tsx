/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as PopperJS from "popper.js";
import * as React from "react";

import {
    Button,
    Classes,
    Intent,
    Menu,
    MenuDivider,
    MenuItem,
    PopoverInteractionKind,
    RadioGroup,
    Slider,
    Switch,
} from "@blueprintjs/core";
import { BaseExample, handleBooleanChange, handleNumberChange, handleStringChange } from "@blueprintjs/docs";
import { Popover2 } from "../src";

const INTERACTION_KINDS = [
    { label: "Click", value: PopoverInteractionKind.CLICK.toString() },
    { label: "Click (target only)", value: PopoverInteractionKind.CLICK_TARGET_ONLY.toString() },
    { label: "Hover", value: PopoverInteractionKind.HOVER.toString() },
    { label: "Hover (target only)", value: PopoverInteractionKind.HOVER_TARGET_ONLY.toString() },
];

const PLACEMENTS = (PopperJS as any).placements
    .map((p: PopperJS.Placement) => <option key={p} value={p}>{p}</option>);

export interface IPopover2ExampleState {
    canEscapeKeyClose?: boolean;
    exampleIndex?: number;
    inheritDarkTheme?: boolean;
    inline?: boolean;
    interactionKind?: PopoverInteractionKind;
    isModal?: boolean;
    modifiers?: PopperJS.Modifiers;
    placement?: PopperJS.Placement;
    sliderValue?: number;
}

export class Popover2Example extends BaseExample<IPopover2ExampleState> {
    public state: IPopover2ExampleState = {
        canEscapeKeyClose: true,
        exampleIndex: 0,
        inheritDarkTheme: true,
        inline: false,
        interactionKind: PopoverInteractionKind.CLICK,
        isModal: false,
        modifiers: {
            arrow: { enabled: true },
            flip: { enabled: true },
            keepTogether: { enabled: true },
            preventOverflow: { enabled: true, boundariesElement: "scrollParent" },
        },
        placement: "auto",
        sliderValue: 5,
    };

    protected className = "docs-popover2-example";

    private handleExampleIndexChange = handleNumberChange((exampleIndex) => this.setState({ exampleIndex }));
    private handleInteractionChange = handleNumberChange((interactionKind) => {
        const isModal = this.state.isModal && interactionKind === PopoverInteractionKind.CLICK;
        this.setState({ interactionKind, isModal });
    });

    private handlePlacementChange = handleStringChange((placement: PopperJS.Placement) => this.setState({ placement }));
    private handleBoundaryChange = handleStringChange((boundary: PopperJS.Boundary) => this.setState({
        modifiers: {
            ...this.state.modifiers,
            preventOverflow: {
                boundariesElement: boundary,
                enabled: boundary.length > 0,
            },
        },
     }));

    private toggleEscapeKey = handleBooleanChange((canEscapeKeyClose) => this.setState({ canEscapeKeyClose }));
    private toggleInline = handleBooleanChange((inline) => {
        if (inline) {
            this.setState({
                inline,
                inheritDarkTheme: false,
                isModal: false,
            });
        } else {
            this.setState({ inline });
        }
    });

    protected renderExample() {
        const { exampleIndex, sliderValue, ...popoverProps } = this.state;
        const popover2ClassName = classNames(this.className, {
            "pt-popover-content-sizing": exampleIndex <= 2,
        });
        return (
            <div className="docs-popover2-example-scroll" ref={this.centerScroll}>
                <Popover2
                    popoverClassName={popover2ClassName}
                    portalClassName="foo"
                    {...popoverProps}
                >
                    <Button intent={Intent.PRIMARY} text="Popover target" />
                    {this.getContents(exampleIndex)}
                </Popover2>
                <p>
                    Scroll around this container to experiment<br/>
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
                <label className={Classes.LABEL} key="placement">
                    Popover placement
                    <div className={Classes.SELECT}>
                        <select value={this.state.placement} onChange={this.handlePlacementChange}>
                            {PLACEMENTS}
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
                            <option value="4">Popover2 Example</option>
                            <option value="5">Empty</option>
                        </select>
                    </div>
                </label>,
                <Switch
                    checked={this.state.inline}
                    label="Inline"
                    key="inline"
                    onChange={this.toggleInline}
                />,
            ], [
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
            ], [
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
                <a href="https://popper.js.org/popper-documentation.html#modifiers">Popper.js docs</a>
            ],
        ];
    }

    private getContents(index: number) {
        return [
            <div>
                <h5>Popover2 title</h5>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <button className={classNames(Classes.BUTTON, Classes.POPOVER_DISMISS)}>Dismiss</button>
            </div>,
            <div>
                <label className={Classes.LABEL}>
                    Enter some text
                    <input
                        autoFocus={true}
                        className={Classes.INPUT}
                        type="text"
                    />
                </label>
            </div>,
            <Slider
                min={0}
                max={10}
                onChange={this.handleSliderChange}
                value={this.state.sliderValue}
            />,
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
            <Popover2Example {...this.props} />,
        ][index];
    }

    private handleSliderChange = (value: number) => this.setState({ sliderValue: value });

    private getModifierChangeHandler(name: keyof PopperJS.Modifiers) {
        return handleBooleanChange((enabled) => {
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
            const container = div.parentElement;
            container.scrollTop = div.clientHeight / 4;
            container.scrollLeft = div.clientWidth / 4;
        }
    }
}
