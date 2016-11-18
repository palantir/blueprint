/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as classNames from "classnames";
import * as React from "react";

import BaseExample, { handleBooleanChange, handleNumberChange } from "./common/baseExample";
import {
    Classes,
    ITetherConstraint,
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

const INTERACTION_KINDS = [
    { label: "Click", value: PopoverInteractionKind.CLICK.toString() },
    { label: "Click (target only)", value: PopoverInteractionKind.CLICK_TARGET_ONLY.toString() },
    { label: "Hover", value: PopoverInteractionKind.HOVER.toString() },
    { label: "Hover (target only)", value: PopoverInteractionKind.HOVER_TARGET_ONLY.toString() },
];

const CONSTRAINTS = [
    {
        label: "None",
        value: "[]",
    },
    {
        label: "Smart positioning",
        value: JSON.stringify([
            {
                attachment: "together",
                to: "scrollParent",
            },
        ]),
    },
    {
        label: "Pin to window",
        value: JSON.stringify([
            {
                attachment: "together",
                pin: true,
                to: "window",
            },
        ]),
    },
];

export interface IPopoverExampleState {
    canEscapeKeyClose?: boolean;
    constraints?: ITetherConstraint[];
    contentIndex?: number;
    inheritDarkTheme?: boolean;
    inline?: boolean;
    interactionKind?: PopoverInteractionKind;
    isModal?: boolean;
    position?: Position;
    sliderValue?: number;
    useSmartArrowPositioning?: boolean;
}

export class PopoverExample extends BaseExample<IPopoverExampleState> {
    public state: IPopoverExampleState = {
        canEscapeKeyClose: true,
        constraints: [],
        contentIndex: 0,
        inheritDarkTheme: true,
        inline: false,
        interactionKind: PopoverInteractionKind.CLICK,
        isModal: false,
        position: Position.RIGHT,
        sliderValue: 5,
        useSmartArrowPositioning: true,
    };

    protected className = "docs-popover-example";

    private handleContentIndexChange = handleNumberChange((contentIndex) => this.setState({ contentIndex }));
    private handleInteractionChange = handleNumberChange((interactionKind) => {
        const isModal = this.state.isModal && interactionKind === PopoverInteractionKind.CLICK;
        this.setState({ interactionKind, isModal });
    });
    private handlePositionChange = handleNumberChange((position) => this.setState({ position }));

    private toggleArrows = handleBooleanChange((useSmartArrowPositioning) => {
        this.setState({ useSmartArrowPositioning });
    });
    private toggleEscapeKey = handleBooleanChange((canEscapeKeyClose) => this.setState({ canEscapeKeyClose }));
    private toggleInheritDarkTheme = handleBooleanChange((inheritDarkTheme) => this.setState({ inheritDarkTheme }));
    private toggleInline = handleBooleanChange((inline) => {
        const newState: IPopoverExampleState = { inline };
        if (newState.inline) {
            // these options are mutually exclusive
            newState.isModal = false;
            newState.constraints = [];
            newState.inheritDarkTheme = false;
        }
        this.setState(newState);
    });
    private toggleModal = handleBooleanChange((isModal) => this.setState({ isModal }));

    protected renderExample() {
        const popoverClassName = classNames({
            "pt-popover-content-sizing": this.state.contentIndex <= 2,
        });

        return (
            <Popover
                content={this.getContents(this.state.contentIndex)}
                constraints={this.state.constraints}
                popoverClassName={popoverClassName}
                {...this.state}
            >
                <button className="pt-button pt-intent-primary">Popover target</button>
            </Popover>
        );
    }

    protected renderOptions() {
        const isModalDisabled = this.state.inline
            || this.state.interactionKind !== PopoverInteractionKind.CLICK;
        const inheritDarkThemeDisabled = this.state.inline;

        return [
            [
                <label className={Classes.LABEL} key="content">
                    Example content
                    <div className={Classes.SELECT}>
                        <select value={this.state.contentIndex} onChange={this.handleContentIndexChange}>
                            <option value="0">Text</option>
                            <option value="1">Input</option>
                            <option value="2">Slider</option>
                            <option value="3">Menu</option>
                            <option value="4">Popover Example</option>
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
                    Popover position
                    <div className={Classes.SELECT}>
                        <select value={this.state.position} onChange={this.handlePositionChange}>
                            <option value={Position.TOP.toString()}>Top</option>
                            <option value={Position.TOP_RIGHT.toString()}>Top right</option>
                            <option value={Position.RIGHT_TOP.toString()}>Right top</option>
                            <option value={Position.RIGHT.toString()}>Right</option>
                            <option value={Position.RIGHT_BOTTOM.toString()}>Right bottom</option>
                            <option value={Position.BOTTOM_RIGHT.toString()}>Bottom right</option>
                            <option value={Position.BOTTOM.toString()}>Bottom</option>
                            <option value={Position.BOTTOM_LEFT.toString()}>Bottom left</option>
                            <option value={Position.LEFT_BOTTOM.toString()}>Left bottom</option>
                            <option value={Position.LEFT.toString()}>Left</option>
                            <option value={Position.LEFT_TOP.toString()}>Left top</option>
                            <option value={Position.TOP_LEFT.toString()}>Top left</option>
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
                    key="constraints"
                    label="Constraints"
                    onChange={this.handleConstraintChange}
                    options={CONSTRAINTS}
                    selectedValue={JSON.stringify(this.state.constraints)}
                />,
            ],
        ];
    }

    private getContents(index: number) {
        return [
            <div>
                <h5>Popover title</h5>
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
            <PopoverExample {...this.props} />,
        ][index];
    }

    private handleConstraintChange = (e: React.SyntheticEvent<HTMLElement>) => {
        this.setState({ constraints: JSON.parse((e.target as HTMLInputElement).value) });
    };

    private handleSliderChange = (value: number) => {
        this.setState({ sliderValue: value });
    }
}
