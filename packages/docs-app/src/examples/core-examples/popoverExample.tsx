/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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

import { useCallback, useRef, useState } from "react";

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
    type Placement,
    Popover,
    PopoverInteractionKind,
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

type Boundary = "scrollParent" | "body" | "clippingParents";

const POPPER_DOCS_URL = "https://popper.js.org/docs/v2/";

const INTERACTION_KINDS = [
    { label: "Click", value: "click" },
    { label: "Click (target only)", value: "click-target" },
    { label: "Hover", value: "hover" },
    { label: "Hover (target only)", value: "hover-target" },
];

const DEFAULT_MODIFIERS = {
    arrow: { enabled: true },
    flip: { enabled: true },
    preventOverflow: { enabled: true },
};

export const PopoverExample: React.FC<ExampleProps> = props => {
    const [boundary, setBoundary] = useState<Boundary>("scrollParent");
    const [buttonText, setButtonText] = useState("Popover target");
    const [canEscapeKeyClose, setCanEscapeKeyClose] = useState(true);
    const [exampleIndex, setExampleIndex] = useState(0);
    const [hasBackdrop, setHasBackdrop] = useState(false);
    const [inheritDarkTheme, setInheritDarkTheme] = useState(true);
    const [interactionKind, setInteractionKind] = useState<PopoverInteractionKind>(PopoverInteractionKind.CLICK);
    const [isControlled, setIsControlled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [matchTargetWidth, setMatchTargetWidth] = useState(false);
    const [minimal, setMinimal] = useState(false);
    const [modifiers, setModifiers] = useState<PopperModifierOverrides>(DEFAULT_MODIFIERS);
    const [openOnTargetFocus, setOpenOnTargetFocus] = useState(true);
    const [placement, setPlacement] = useState<Placement>("auto");
    const [rangeSliderValue, setRangeSliderValue] = useState<[number, number]>([0, 10]);
    const [shouldReturnFocusOnClose, setShouldReturnFocusOnClose] = useState(false);
    const [sliderValue, setSliderValue] = useState(5);
    const [usePortal, setUsePortal] = useState(true);

    const scrollParentElement = useRef<HTMLElement | null>(null);

    const bodyElement = useRef<HTMLElement | null>(null);

    // popper.js requires this modiifer for "auto" placement
    const forceFlipEnabled = placement.startsWith("auto");

    const isHoverInteractionKind = interactionKind === "hover" || interactionKind === "hover-target";

    const getModifierChangeHandler = useCallback(
        <Name extends StrictModifierNames>(name: Name) =>
            handleBooleanChange(enabled => {
                const newModifiers = { ...modifiers, [name]: { ...modifiers[name], enabled } };
                setModifiers(newModifiers);
            }),
        [modifiers],
    );

    const handleInteractionChange = handleValueChange((newInteractionKind: PopoverInteractionKind) => {
        setInteractionKind(newInteractionKind);
        setHasBackdrop(hasBackdrop && newInteractionKind === "click");
    });

    const toggleMatchTargetWidth = handleBooleanChange(newMatchTargetWidth => {
        setButtonText(newMatchTargetWidth ? "(Slightly wider) popover target" : "Popover target");
        setMatchTargetWidth(newMatchTargetWidth);
    });

    const toggleShouldReturnFocusOnClose = handleBooleanChange(newShouldReturnFocusOnClose => {
        setOpenOnTargetFocus(newShouldReturnFocusOnClose ? false : undefined);
        setShouldReturnFocusOnClose(newShouldReturnFocusOnClose);
    });

    const toggleUsePortal = handleBooleanChange(newUsePortal => {
        if (newUsePortal) {
            setHasBackdrop(false);
            setInheritDarkTheme(false);
        }
        setUsePortal(newUsePortal);
    });

    const options = (
        <>
            <H5>Appearance</H5>
            <FormGroup
                helperText="May be overridden to prevent overflow"
                label="Position when opened"
                labelFor="position"
            >
                <HTMLSelect onChange={handleValueChange(setPlacement)} options={PopperPlacements} value={placement} />
            </FormGroup>
            <FormGroup label="Example content">
                <HTMLSelect onChange={handleNumberChange(setExampleIndex)} value={exampleIndex}>
                    <option value="0">Text</option>
                    <option value="1">Input</option>
                    <option value="2">Sliders</option>
                    <option value="3">Menu</option>
                    <option value="4">Select</option>
                    <option value="5">Empty</option>
                </HTMLSelect>
            </FormGroup>
            <Switch checked={usePortal} onChange={toggleUsePortal}>
                Use <Code>Portal</Code>
            </Switch>
            <Switch checked={minimal} label="Minimal appearance" onChange={handleBooleanChange(setMinimal)} />

            <H5>Control</H5>
            <Switch checked={isControlled} label="Is controlled" onChange={handleBooleanChange(setIsControlled)} />
            <Switch checked={isOpen} disabled={!isControlled} label="Open" onChange={handleBooleanChange(setIsOpen)} />

            <H5>Interactions</H5>
            <RadioGroup
                label="Interaction kind"
                onChange={handleInteractionChange}
                options={INTERACTION_KINDS}
                selectedValue={interactionKind.toString()}
            />
            <Divider />
            <Switch
                checked={canEscapeKeyClose}
                label="Can escape key close"
                onChange={handleBooleanChange(setCanEscapeKeyClose)}
            />
            <Switch
                checked={openOnTargetFocus}
                disabled={!isHoverInteractionKind}
                label="Open on target focus"
                onChange={handleBooleanChange(setOpenOnTargetFocus)}
            />
            <Switch
                checked={isHoverInteractionKind ? false : shouldReturnFocusOnClose}
                disabled={isHoverInteractionKind}
                label="Should return focus on close"
                onChange={toggleShouldReturnFocusOnClose}
            />

            <H5>Modifiers</H5>
            <Switch checked={modifiers.arrow.enabled} label="Arrow" onChange={getModifierChangeHandler("arrow")} />
            <Switch
                checked={modifiers.flip.enabled || forceFlipEnabled}
                disabled={forceFlipEnabled}
                label="Flip"
                onChange={getModifierChangeHandler("flip")}
            />
            <Switch
                checked={modifiers.preventOverflow.enabled}
                label="Prevent overflow"
                onChange={getModifierChangeHandler("preventOverflow")}
            >
                <br />
                <div style={{ marginTop: 5 }} />
                <HTMLSelect
                    disabled={!modifiers.preventOverflow.enabled}
                    onChange={handleValueChange(setBoundary)}
                    value={boundary}
                >
                    <option value="scrollParent">scrollParent</option>
                    <option value="window">window</option>
                </HTMLSelect>
            </Switch>
            <Switch checked={matchTargetWidth} label="Match target width" onChange={toggleMatchTargetWidth} />

            <FormGroup>
                <AnchorButton
                    endIcon="share"
                    fill={true}
                    href={POPPER_DOCS_URL}
                    intent={Intent.PRIMARY}
                    style={{ marginTop: 20 }}
                    target="_blank"
                    variant="minimal"
                >
                    Visit Popper.js docs
                </AnchorButton>
            </FormGroup>
        </>
    );

    const getContents = useCallback(
        (index: number): React.JSX.Element => {
            return [
                <div key="text">
                    <H5>Confirm deletion</H5>
                    <p>Are you sure you want to delete these items? You won't be able to recover them.</p>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 15 }}>
                        <Button className={Classes.POPOVER_DISMISS} style={{ marginRight: 10 }}>
                            Cancel
                        </Button>
                        <Button className={Classes.POPOVER_DISMISS} intent={Intent.DANGER}>
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
                    <Slider max={10} min={0} onChange={setSliderValue} value={sliderValue} />
                    <RangeSlider max={10} min={0} onChange={setRangeSliderValue} value={rangeSliderValue} />
                </div>,
                <Menu key="menu">
                    <MenuDivider title="Edit" />
                    <MenuItem icon="cut" label="⌘X" text="Cut" />
                    <MenuItem icon="duplicate" label="⌘C" text="Copy" />
                    <MenuItem disabled={true} icon="clipboard" label="⌘V" text="Paste" />
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
        },
        [rangeSliderValue, sliderValue],
    );

    const centerScroll = useCallback((overflowingDiv: HTMLDivElement) => {
        scrollParentElement.current = overflowingDiv?.parentElement;

        if (overflowingDiv != null) {
            // if we don't requestAnimationFrame, this function apparently executes
            // before styles are applied to the page, so the centering is way off.
            requestAnimationFrame(() => {
                const container = overflowingDiv.parentElement;
                container.scrollLeft = overflowingDiv.clientWidth / 2 - container.clientWidth / 2;
                container.scrollTop = overflowingDiv.clientHeight / 2 - container.clientHeight / 2;
            });
        }
    }, []);

    return (
        <Example options={options} {...props}>
            <div className="docs-popover-example-scroll" ref={centerScroll}>
                <Popover
                    boundary={
                        boundary === "scrollParent"
                            ? scrollParentElement.current ?? undefined
                            : boundary === "body"
                              ? bodyElement.current ?? undefined
                              : boundary
                    }
                    canEscapeKeyClose={canEscapeKeyClose}
                    content={getContents(exampleIndex)}
                    enforceFocus={false}
                    hasBackdrop={hasBackdrop}
                    inheritDarkTheme={inheritDarkTheme}
                    interactionKind={interactionKind}
                    isOpen={isControlled ? isOpen : undefined}
                    matchTargetWidth={matchTargetWidth}
                    minimal={minimal}
                    modifiers={modifiers}
                    openOnTargetFocus={openOnTargetFocus}
                    placement={placement}
                    popoverClassName={exampleIndex <= 2 ? Classes.POPOVER_CONTENT_SIZING : ""}
                    portalClassName="docs-popover-example-portal"
                    shouldReturnFocusOnClose={shouldReturnFocusOnClose}
                    usePortal={usePortal}
                >
                    <Button intent={Intent.PRIMARY} tabIndex={0} text={buttonText} />
                </Popover>
                <p>
                    Scroll around this container to experiment
                    <br />
                    with <Code>flip</Code> and <Code>preventOverflow</Code> modifiers.
                </p>
            </div>
        </Example>
    );
};
