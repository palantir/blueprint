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

import dedent from "dedent";
import { useCallback, useRef, useState } from "react";

import {
    Button,
    Classes,
    EditableText,
    Elevation,
    FormGroup,
    H5,
    Section,
    SectionCard,
    type SectionElevation,
    Slider,
    Switch,
} from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";
import { IconNames } from "@blueprintjs/icons";

export interface SectionExampleState {
    collapsible: boolean;
    defaultIsOpen: boolean;
    elevation: SectionElevation;
    hasDescription: boolean;
    hasIcon: boolean;
    hasMultipleCards: boolean;
    hasRightElement: boolean;
    isCompact: boolean;
    isControlled: boolean;
    isOpen: boolean;
    isPanelPadded: boolean;
}

const BASIL_DESCRIPTION_TEXT = dedent`
    Ocimum basilicum, also called great basil, is a culinary herb of the family Lamiaceae (mints). It \
    is a tender plant, and is used in cuisines worldwide. In Western cuisine, the generic term "basil" \
    refers to the variety also known as sweet basil or Genovese basil. Basil is native to tropical regions \
    from Central Africa to Southeast Asia.
`;

export const SectionExample: React.FC<ExampleProps> = props => {
    const [collapsible, setCollapsible] = useState(false);
    const [defaultIsOpen, setDefaultIsOpen] = useState(true);
    const [elevation, setElevation] = useState<SectionElevation>(Elevation.ZERO);
    const [hasDescription, setHasDescription] = useState(false);
    const [hasIcon, setHasIcon] = useState(false);
    const [hasMultipleCards, setHasMultipleCards] = useState(false);
    const [hasRightElement, setHasRightElement] = useState(true);
    const [isCompact, setIsCompact] = useState(false);
    const [isControlled, setIsControlled] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const [isPanelPadded, setIsPanelPadded] = useState(true);

    const editableTextRef = useRef<HTMLDivElement>(null);

    const handleEditContent = useCallback((event: React.MouseEvent) => {
        event.stopPropagation();
        editableTextRef.current.focus();
    }, []);

    const handleElevationChange = useCallback((value: SectionElevation) => setElevation(value), []);

    const handleToggle = useCallback(() => setIsOpen(value => !value), []);

    const options = (
        <>
            <div>
                <H5>Section Props</H5>
                <Switch checked={isCompact} label="Compact" onChange={handleBooleanChange(setIsCompact)} />
                <Switch checked={hasIcon} label="Icon" onChange={handleBooleanChange(setHasIcon)} />
                <Switch checked={hasDescription} label="Sub-title" onChange={handleBooleanChange(setHasDescription)} />
                <Switch
                    checked={hasRightElement}
                    label="Right element"
                    onChange={handleBooleanChange(setHasRightElement)}
                />
                <Switch checked={collapsible} label="Collapsible" onChange={handleBooleanChange(setCollapsible)} />
                <FormGroup label="Elevation">
                    <Slider
                        handleHtmlProps={{ "aria-label": "Section elevation" }}
                        max={1}
                        onChange={handleElevationChange}
                        showTrackFill={false}
                        value={elevation}
                    />
                </FormGroup>
            </div>

            <div>
                <H5>Collapse Props</H5>
                <Switch
                    checked={defaultIsOpen}
                    disabled={isControlled || !collapsible}
                    label="Default is open"
                    onChange={handleBooleanChange(setDefaultIsOpen)}
                />
                <Switch
                    disabled={!collapsible}
                    checked={isControlled}
                    label="Is controlled"
                    onChange={handleBooleanChange(setIsControlled)}
                />
                <Switch
                    checked={isOpen}
                    disabled={!isControlled || !collapsible}
                    label="Open"
                    onChange={handleBooleanChange(setIsOpen)}
                />
            </div>

            <div>
                <H5>Children</H5>
                <Switch
                    checked={hasMultipleCards}
                    label="Multiple section cards"
                    onChange={handleBooleanChange(setHasMultipleCards)}
                />

                <H5>SectionCard Props</H5>
                <Switch checked={isPanelPadded} label="Padded" onChange={handleBooleanChange(setIsPanelPadded)} />
            </div>
        </>
    );

    const collapseProps = isControlled ? { isOpen, onToggle: handleToggle } : { defaultIsOpen };

    return (
        <Example options={options} {...props} showOptionsBelowExample={true}>
            <Section
                // A `key` is provided here to force the component to
                // re-mount when `defaultIsOpen` is changed, otherwise
                // the local state in the `Collapse` component is not
                // updated.
                key={String(defaultIsOpen)}
                collapsible={collapsible}
                collapseProps={collapseProps}
                compact={isCompact}
                elevation={elevation}
                icon={hasIcon ? IconNames.BOOK : undefined}
                rightElement={
                    hasRightElement ? (
                        <Button
                            intent="primary"
                            onClick={handleEditContent}
                            text="Edit description"
                            variant="minimal"
                        />
                    ) : undefined
                }
                subtitle={hasDescription ? "Ocimum basilicum" : undefined}
                title="Basil"
            >
                <SectionCard padded={isPanelPadded}>
                    <EditableText
                        defaultValue={BASIL_DESCRIPTION_TEXT}
                        disabled={!hasRightElement}
                        elementRef={editableTextRef}
                        multiline={true}
                    />
                </SectionCard>
                {hasMultipleCards && (
                    <SectionCard padded={isPanelPadded}>
                        <div className="metadata-panel">
                            <div>
                                <span className={Classes.TEXT_MUTED}>Kingdom</span>Plantae
                            </div>
                            <div>
                                <span className={Classes.TEXT_MUTED}>Clade</span>Tracheophytes
                            </div>
                            <div>
                                <span className={Classes.TEXT_MUTED}>Family</span>Lamiaceae
                            </div>
                        </div>
                    </SectionCard>
                )}
            </Section>
        </Example>
    );
};
