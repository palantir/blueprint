/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";

import {
    AnchorButton,
    Button,
    Classes,
    Code,
    Divider,
    FormGroup,
    H5,
    HTMLSelect,
    Intent,
    Menu,
    MenuDivider,
    MenuItem,
    type NumberRange,
    type Placement,
    Popover,
    type PopoverInteractionKind,
    type PopperModifierOverrides,
    PopperPlacements,
    RadioGroup,
    RangeSlider,
    Slider,
    type StrictModifierNames,
    Switch,
} from "@blueprintjs/core";
import {
    Example,
    type ExampleProps,
    handleBooleanChange,
    handleNumberChange,
    handleValueChange,
} from "@blueprintjs/docs-theme";
import { FilmSelect } from "@blueprintjs/select/examples";

const POPPER_DOCS_URL = "https://popper.js.org/docs/v2/";

const INTERACTION_KINDS = [
    { label: "Click", value: "click" },
    { label: "Click (target only)", value: "click-target" },
    { label: "Hover", value: "hover" },
    { label: "Hover (target only)", value: "hover-target" },
];

export interface PopoverExampleState {
    boundary?: "scrollParent" | "body" | "clippingParents";
    buttonText: string;
    canEscapeKeyClose?: boolean;
    exampleIndex?: number;
    hasBackdrop?: boolean;
    inheritDarkTheme?: boolean;
    interactionKind?: PopoverInteractionKind;
    isControlled: boolean;
    isOpen?: boolean;
    matchTargetWidth: boolean;
    minimal?: boolean;
    modifiers?: PopperModifierOverrides;
    openOnTargetFocus: boolean;
    placement?: Placement;
    rangeSliderValue?: NumberRange;
    shouldReturnFocusOnClose: boolean;
    sliderValue?: number;
    usePortal?: boolean;
}

export class PopoverExample extends React.PureComponent<ExampleProps, PopoverExampleState> {
    public static displayName = "PopoverExample";

    public state: PopoverExampleState = {
        boundary: "scrollParent",
        buttonText: "Popover target",
        canEscapeKeyClose: true,
        exampleIndex: 0,
        hasBackdrop: false,
        inheritDarkTheme: true,
        interactionKind: "click",
        isControlled: false,
        isOpen: false,
        matchTargetWidth: false,
        minimal: false,
        modifiers: {
            arrow: { enabled: true },
            flip: { enabled: true },
            preventOverflow: { enabled: true },
        },
        openOnTargetFocus: true,
        placement: "auto",
        rangeSliderValue: [0, 10],
        shouldReturnFocusOnClose: false,
        sliderValue: 5,
        usePortal: true,
    };

    private scrollParentElement: HTMLElement | null = null;

    private bodyElement: HTMLElement | null = null;

    private handleRangeSliderChange = (rangeSliderValue: NumberRange) => this.setState({ rangeSliderValue });

    private handleSliderChange = (sliderValue: number) => this.setState({ sliderValue });

    private handleExampleIndexChange = handleNumberChange(exampleIndex => this.setState({ exampleIndex }));

    private handleInteractionChange = handleValueChange((interactionKind: PopoverInteractionKind) => {
        const hasBackdrop = this.state.hasBackdrop && interactionKind === "click";
        this.setState({ hasBackdrop, interactionKind });
    });

    private handlePlacementChange = handleValueChange((placement: Placement) => this.setState({ placement }));

    private handleBoundaryChange = handleValueChange((boundary: PopoverExampleState["boundary"]) =>
        this.setState({ boundary }),
    );

    private toggleEscapeKey = handleBooleanChange(canEscapeKeyClose => this.setState({ canEscapeKeyClose }));

    private toggleIsControlled = handleBooleanChange(isControlled => this.setState({ isControlled }));

    private toggleIsOpen = handleBooleanChange(isOpen => this.setState({ isOpen }));

    private toggleMatchTargetWidth = handleBooleanChange(matchTargetWidth => {
        this.setState({
            buttonText: matchTargetWidth ? "(Slightly wider) popover target" : "Popover target",
            matchTargetWidth,
        });
    });

    private toggleMinimal = handleBooleanChange(minimal => this.setState({ minimal }));

    private toggleOpenOnTargetFocus = handleBooleanChange(openOnTargetFocus => this.setState({ openOnTargetFocus }));

    private toggleShouldReturnFocusOnClose = handleBooleanChange(shouldReturnFocusOnClose =>
        this.setState({ openOnTargetFocus: shouldReturnFocusOnClose ? false : undefined, shouldReturnFocusOnClose }),
    );

    private toggleUsePortal = handleBooleanChange(usePortal => {
        if (usePortal) {
            this.setState({ hasBackdrop: false, inheritDarkTheme: false });
        }
        this.setState({ usePortal });
    });

    private getModifierChangeHandler<Name extends StrictModifierNames>(name: Name) {
        return handleBooleanChange(enabled => {
            this.setState({
                modifiers: {
                    ...this.state.modifiers,
                    [name]: { ...this.state.modifiers[name], enabled },
                },
            });
        });
    }

    public componentDidMount() {
        this.bodyElement = document.body;
    }

    public render() {
        const { boundary, buttonText, exampleIndex, sliderValue, ...popoverProps } = this.state;
        return (
            <Example options={this.renderOptions()} {...this.props}>
                <div className="docs-popover-example-scroll" ref={this.centerScroll}>
                    <Popover
                        popoverClassName={exampleIndex <= 2 ? Classes.POPOVER_CONTENT_SIZING : ""}
                        portalClassName="docs-popover-example-portal"
                        {...popoverProps}
                        content={this.getContents(exampleIndex)}
                        boundary={
                            boundary === "scrollParent"
                                ? this.scrollParentElement ?? undefined
                                : boundary === "body"
                                  ? this.bodyElement ?? undefined
                                  : boundary
                        }
                        enforceFocus={false}
                        isOpen={this.state.isControlled ? this.state.isOpen : undefined}
                    >
                        <Button intent={Intent.PRIMARY} text={buttonText} tabIndex={0} />
                    </Popover>
                    <p>
                        Scroll around this container to experiment
                        <br />
                        with <Code>flip</Code> and <Code>preventOverflow</Code> modifiers.
                    </p>
                </div>
            </Example>
        );
    }

    private renderOptions() {
        const { interactionKind, matchTargetWidth, modifiers, placement } = this.state;
        const { arrow, flip, preventOverflow } = modifiers;

        // popper.js requires this modiifer for "auto" placement
        const forceFlipEnabled = placement.startsWith("auto");

        const isHoverInteractionKind = interactionKind === "hover" || interactionKind === "hover-target";

        return (
            <>
                <H5>Appearance</H5>
                <FormGroup
                    helperText="May be overridden to prevent overflow"
                    label="Position when opened"
                    labelFor="position"
                >
                    <HTMLSelect value={placement} onChange={this.handlePlacementChange} options={PopperPlacements} />
                </FormGroup>
                <FormGroup label="Example content">
                    <HTMLSelect value={this.state.exampleIndex} onChange={this.handleExampleIndexChange}>
                        <option value="0">Text</option>
                        <option value="1">Input</option>
                        <option value="2">Sliders</option>
                        <option value="3">Menu</option>
                        <option value="4">Select</option>
                        <option value="5">Empty</option>
                    </HTMLSelect>
                </FormGroup>
                <Switch checked={this.state.usePortal} onChange={this.toggleUsePortal}>
                    Use <Code>Portal</Code>
                </Switch>
                <Switch checked={this.state.minimal} label="Minimal appearance" onChange={this.toggleMinimal} />

                <H5>Control</H5>
                <Switch checked={this.state.isControlled} label="Is controlled" onChange={this.toggleIsControlled} />
                <Switch
                    checked={this.state.isOpen}
                    disabled={!this.state.isControlled}
                    label="Open"
                    onChange={this.toggleIsOpen}
                />

                <H5>Interactions</H5>
                <RadioGroup
                    label="Interaction kind"
                    selectedValue={interactionKind.toString()}
                    options={INTERACTION_KINDS}
                    onChange={this.handleInteractionChange}
                />
                <Divider />
                <Switch
                    checked={this.state.canEscapeKeyClose}
                    label="Can escape key close"
                    onChange={this.toggleEscapeKey}
                />
                <Switch
                    checked={this.state.openOnTargetFocus}
                    disabled={!isHoverInteractionKind}
                    label="Open on target focus"
                    onChange={this.toggleOpenOnTargetFocus}
                />
                <Switch
                    checked={isHoverInteractionKind ? false : this.state.shouldReturnFocusOnClose}
                    disabled={isHoverInteractionKind}
                    label="Should return focus on close"
                    onChange={this.toggleShouldReturnFocusOnClose}
                />

                <H5>Modifiers</H5>
                <Switch checked={arrow.enabled} label="Arrow" onChange={this.getModifierChangeHandler("arrow")} />
                <Switch
                    checked={flip.enabled || forceFlipEnabled}
                    disabled={forceFlipEnabled}
                    label="Flip"
                    onChange={this.getModifierChangeHandler("flip")}
                />
                <Switch
                    checked={preventOverflow.enabled}
                    label="Prevent overflow"
                    onChange={this.getModifierChangeHandler("preventOverflow")}
                >
                    <br />
                    <div style={{ marginTop: 5 }} />
                    <HTMLSelect
                        disabled={!preventOverflow.enabled}
                        value={this.state.boundary}
                        onChange={this.handleBoundaryChange}
                    >
                        <option value="scrollParent">scrollParent</option>
                        <option value="window">window</option>
                    </HTMLSelect>
                </Switch>
                <Switch checked={matchTargetWidth} label="Match target width" onChange={this.toggleMatchTargetWidth} />

                <FormGroup>
                    <AnchorButton
                        href={POPPER_DOCS_URL}
                        fill={true}
                        intent={Intent.PRIMARY}
                        minimal={true}
                        rightIcon="share"
                        target="_blank"
                        style={{ marginTop: 20 }}
                    >
                        Visit Popper.js docs
                    </AnchorButton>
                </FormGroup>
            </>
        );
    }

    private getContents(index: number): React.JSX.Element {
        return [
            <div key="text">
                <H5>Confirm deletion</H5>
                <p>Are you sure you want to delete these items? You won't be able to recover them.</p>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 15 }}>
                    <Button className={Classes.POPOVER_DISMISS} style={{ marginRight: 10 }}>
                        Cancel
                    </Button>
                    <Button intent={Intent.DANGER} className={Classes.POPOVER_DISMISS}>
                        Delete
                    </Button>
                </div>
            </div>,
            <div key="input">
                <label className={Classes.LABEL}>
                    Enter some text
                    <input autoFocus={true} className={Classes.INPUT} type="text" />
                </label>
            </div>,
            <div key="sliders">
                <Slider min={0} max={10} onChange={this.handleSliderChange} value={this.state.sliderValue} />
                <RangeSlider
                    min={0}
                    max={10}
                    onChange={this.handleRangeSliderChange}
                    value={this.state.rangeSliderValue}
                />
            </div>,
            <Menu key="menu">
                <MenuDivider title="Edit" />
                <MenuItem icon="cut" text="Cut" label="⌘X" />
                <MenuItem icon="duplicate" text="Copy" label="⌘C" />
                <MenuItem icon="clipboard" text="Paste" label="⌘V" disabled={true} />
                <MenuDivider title="Text" />
                <MenuItem icon="align-left" text="Alignment">
                    <MenuItem icon="align-left" text="Left" />
                    <MenuItem icon="align-center" text="Center" />
                    <MenuItem icon="align-right" text="Right" />
                    <MenuItem icon="align-justify" text="Justify" />
                </MenuItem>
                <MenuItem icon="style" text="Style">
                    <MenuItem icon="bold" text="Bold" />
                    <MenuItem icon="italic" text="Italic" />
                    <MenuItem icon="underline" text="Underline" />
                </MenuItem>
            </Menu>,
            <div key="filmselect" style={{ padding: 20 }}>
                <FilmSelect popoverProps={{ captureDismiss: true }} />
            </div>,
        ][index];
    }

    private centerScroll = (overflowingDiv: HTMLDivElement) => {
        this.scrollParentElement = overflowingDiv?.parentElement;

        if (overflowingDiv != null) {
            // if we don't requestAnimationFrame, this function apparently executes
            // before styles are applied to the page, so the centering is way off.
            requestAnimationFrame(() => {
                const container = overflowingDiv.parentElement;
                container.scrollLeft = overflowingDiv.clientWidth / 2 - container.clientWidth / 2;
                container.scrollTop = overflowingDiv.clientHeight / 2 - container.clientHeight / 2;
            });
        }
    };
}
