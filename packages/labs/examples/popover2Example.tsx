/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
// TODO: popper.js declares export default, but webpack clobbers it
import * as PopperJS from "popper.js";
import * as React from "react";

console.log(PopperJS);

import {
    Classes,
    ITetherConstraint,
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

const MODIFIERS: any[] = [
];

const PLACEMENTS = (PopperJS as any).placements
    .map((p: Popper.Placement) => <option key={p} value={p}>{p}</option>);

export interface IPopover2ExampleState {
    canEscapeKeyClose?: boolean;
    exampleIndex?: number;
    inheritDarkTheme?: boolean;
    inline?: boolean;
    interactionKind?: PopoverInteractionKind;
    isModal?: boolean;
    placement?: Popper.Placement;
    sliderValue?: number;
    tetherConstraints?: ITetherConstraint[];
    useSmartArrowPositioning?: boolean;
}

export class Popover2Example extends BaseExample<IPopover2ExampleState> {
    public state: IPopover2ExampleState = {
        canEscapeKeyClose: true,
        exampleIndex: 0,
        inheritDarkTheme: true,
        // TODO: inline=false causes jump to top of page when popover opens
        inline: true,
        interactionKind: PopoverInteractionKind.CLICK,
        isModal: false,
        placement: "right",
        sliderValue: 5,
        tetherConstraints: [],
        useSmartArrowPositioning: true,
    };

    protected className = "docs-popover2-example";

    private handleConstraintChange = handleStringChange((constraints) => {
        this.setState({ tetherConstraints: JSON.parse(constraints) });
    });
    private handleExampleIndexChange = handleNumberChange((exampleIndex) => this.setState({ exampleIndex }));
    private handleInteractionChange = handleNumberChange((interactionKind) => {
        const isModal = this.state.isModal && interactionKind === PopoverInteractionKind.CLICK;
        this.setState({ interactionKind, isModal });
    });

    private handlePlacementChange = handleStringChange((placement: Popper.Placement) => this.setState({ placement }));

    private toggleArrows = handleBooleanChange((useSmartArrowPositioning) => {
        this.setState({ useSmartArrowPositioning });
    });
    private toggleEscapeKey = handleBooleanChange((canEscapeKeyClose) => this.setState({ canEscapeKeyClose }));
    private toggleInheritDarkTheme = handleBooleanChange((inheritDarkTheme) => this.setState({ inheritDarkTheme }));
    private toggleInline = handleBooleanChange((inline) => {
        if (inline) {
            this.setState({
                inline,
                inheritDarkTheme: false,
                isModal: false,
                tetherConstraints: [],
            });
        } else {
            this.setState({ inline });
        }
    });
    private toggleModal = handleBooleanChange((isModal) => this.setState({ isModal }));

    protected renderExample() {
        const constraints = this.state.tetherConstraints;
        const popover2ClassName = classNames({
            "pt-popover-content-sizing": this.state.exampleIndex <= 2,
        });
        return (
            <Popover2
                content={this.getContents(this.state.exampleIndex)}
                popoverClassName={popover2ClassName}
                tetherOptions={{ constraints }}
                {...this.state}
            >
                <button className="pt-button pt-intent-primary">Popover2 target</button>
            </Popover2>
        );
    }

    protected renderOptions() {
        const isModalDisabled = this.state.inline
            || this.state.interactionKind !== PopoverInteractionKind.CLICK;
        const inheritDarkThemeDisabled = this.state.inline;

        return [
            [
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
                    checked={this.state.isModal}
                    disabled={isModalDisabled}
                    key="modal"
                    label="Modal (requires Click interaction kind)"
                    onChange={this.toggleModal}
                />,
                <br key="break" />,
                <RadioGroup
                    key="interaction"
                    label="Interaction kind"
                    selectedValue={this.state.interactionKind.toString()}
                    options={INTERACTION_KINDS}
                    onChange={this.handleInteractionChange}
                />,
            ], [
                <label className={Classes.LABEL} key="position">
                    Popover2 position
                    <div className={Classes.SELECT}>
                        <select value={this.state.placement} onChange={this.handlePlacementChange}>
                            {PLACEMENTS}
                        </select>
                    </div>
                </label>,
                <Switch
                    checked={this.state.useSmartArrowPositioning}
                    label="Smart arrow positioning"
                    key="smartarrow"
                    onChange={this.toggleArrows}
                />,
                <Switch
                    checked={this.state.canEscapeKeyClose}
                    label="Can escape key close"
                    key="escape"
                    onChange={this.toggleEscapeKey}
                />,
                <Switch
                    checked={this.state.inline}
                    label="Inline"
                    key="inline"
                    onChange={this.toggleInline}
                />,
                <Switch
                    checked={this.state.inheritDarkTheme}
                    disabled={inheritDarkThemeDisabled}
                    label="Should inherit dark theme"
                    key="shouldinheritdarktheme"
                    onChange={this.toggleInheritDarkTheme}
                />,
                <br key="break" />,
                <RadioGroup
                    disabled={this.state.inline}
                    key="modifiers"
                    label="Modifiers"
                    onChange={this.handleConstraintChange}
                    options={MODIFIERS}
                    selectedValue={JSON.stringify(this.state.tetherConstraints)}
                />,
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
}
