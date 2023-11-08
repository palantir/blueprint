/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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
import * as React from "react";

import {
    Button,
    Classes,
    EditableText,
    Elevation,
    H5,
    Label,
    Section,
    SectionCard,
    type SectionElevation,
    Slider,
    Switch,
} from "@blueprintjs/core";
import { Example, type ExampleProps } from "@blueprintjs/docs-theme";
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

export class SectionExample extends React.PureComponent<ExampleProps, SectionExampleState> {
    public state: SectionExampleState = {
        collapsible: false,
        defaultIsOpen: true,
        elevation: Elevation.ZERO,
        hasDescription: false,
        hasIcon: false,
        hasMultipleCards: false,
        hasRightElement: true,
        isCompact: false,
        isControlled: false,
        isOpen: true,
        isPanelPadded: true,
    };

    private editableTextRef = React.createRef<HTMLDivElement>();

    public render() {
        const {
            collapsible,
            defaultIsOpen,
            elevation,
            hasDescription,
            hasIcon,
            hasRightElement,
            hasMultipleCards,
            isCompact,
            isPanelPadded,
        } = this.state;

        const options = (
            <>
                <H5>Section Props</H5>
                <Switch checked={isCompact} label="Compact" onChange={this.toggleIsCompact} />
                <Switch checked={hasIcon} label="Icon" onChange={this.toggleHasIcon} />
                <Switch checked={hasDescription} label="Sub-title" onChange={this.toggleHasDescription} />
                <Switch checked={hasRightElement} label="Right element" onChange={this.toggleHasRightElement} />
                <Switch checked={collapsible} label="Collapsible" onChange={this.toggleCollapsible} />
                <Label>
                    Elevation
                    <Slider
                        max={1}
                        showTrackFill={false}
                        value={elevation}
                        onChange={this.handleElevationChange}
                        handleHtmlProps={{ "aria-label": "Section elevation" }}
                    />
                </Label>

                <H5>Collapse Props</H5>
                <Switch
                    checked={defaultIsOpen}
                    disabled={this.state.isControlled || !collapsible}
                    label="Default is open"
                    onChange={this.toggleDefaultIsOpen}
                />
                <Switch
                    disabled={!collapsible}
                    checked={this.state.isControlled}
                    label="Is controlled"
                    onChange={this.toggleIsControlled}
                />
                <Switch
                    checked={this.state.isOpen}
                    disabled={!this.state.isControlled || !collapsible}
                    label="Open"
                    onChange={this.toggleIsOpen}
                />

                <H5>Children</H5>
                <Switch
                    checked={hasMultipleCards}
                    label="Multiple section cards"
                    onChange={this.toggleMultiplePanels}
                />

                <H5>SectionCard Props</H5>
                <Switch checked={isPanelPadded} label="Padded" onChange={this.togglePanelIsPadded} />
            </>
        );

        const descriptionContent = (
            <EditableText
                defaultValue={BASIL_DESCRIPTION_TEXT}
                disabled={!hasRightElement}
                elementRef={this.editableTextRef}
                multiline={true}
            />
        );

        const metadataContent = (
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
        );

        const collapseProps = this.state.isControlled
            ? { isOpen: this.state.isOpen, onToggle: this.toggleIsOpen }
            : { defaultIsOpen };

        return (
            <Example options={options} {...this.props}>
                <Section
                    // A `key` is provided here to force the component to
                    // re-mount when `defaultIsOpen` is changed, otherwise
                    // the local state in the `Collapse` component is not
                    // updated.
                    key={String(defaultIsOpen)}
                    collapsible={collapsible}
                    compact={isCompact}
                    collapseProps={collapseProps}
                    elevation={elevation}
                    icon={hasIcon ? IconNames.BOOK : undefined}
                    rightElement={
                        hasRightElement ? (
                            <Button
                                minimal={true}
                                intent="primary"
                                onClick={this.handleEditContent}
                                text="Edit description"
                            />
                        ) : undefined
                    }
                    subtitle={hasDescription ? "Ocimum basilicum" : undefined}
                    title="Basil"
                >
                    <SectionCard padded={isPanelPadded}>{descriptionContent}</SectionCard>
                    {hasMultipleCards && <SectionCard padded={isPanelPadded}>{metadataContent}</SectionCard>}
                </Section>
            </Example>
        );
    }

    private toggleIsCompact = () => this.setState({ isCompact: !this.state.isCompact });

    private toggleHasIcon = () => this.setState({ hasIcon: !this.state.hasIcon });

    private toggleHasDescription = () => this.setState({ hasDescription: !this.state.hasDescription });

    private toggleHasRightElement = () => this.setState({ hasRightElement: !this.state.hasRightElement });

    private toggleMultiplePanels = () => this.setState({ hasMultipleCards: !this.state.hasMultipleCards });

    private toggleCollapsible = () => this.setState({ collapsible: !this.state.collapsible });

    private toggleDefaultIsOpen = () => this.setState({ defaultIsOpen: !this.state.defaultIsOpen });

    private togglePanelIsPadded = () => this.setState({ isPanelPadded: !this.state.isPanelPadded });

    private toggleIsControlled = () => this.setState({ isControlled: !this.state.isControlled });

    private toggleIsOpen = () => this.setState({ isOpen: !this.state.isOpen });

    private handleElevationChange = (elevation: SectionElevation) => this.setState({ elevation });

    private handleEditContent = (event: React.MouseEvent) => {
        // prevent this event from toggling the collapse state
        event.stopPropagation();
        this.editableTextRef?.current?.focus();
    };
}
