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

import * as React from "react";

import { Button, Classes, Code, ControlGroup, type Placement, Popover } from "@blueprintjs/core";
import { Example, type ExampleProps } from "@blueprintjs/docs-theme";

const EXAMPLE_CLASS = "docs-popover-placement-example";
const SIDE_LABEL_CLASS = "docs-popover-placement-label-side";
const ALIGNMENT_LABEL_CLASS = "docs-popover-placement-label-alignment";
const CONTENT_CLASS = `${EXAMPLE_CLASS}-content`;

export const PopoverPlacementExample: React.FC<ExampleProps> = props => {
    return (
        <Example className={EXAMPLE_CLASS} options={false} {...props}>
            <div className="docs-example-grid">
                <div className="docs-example-grid-1-1" />
                <div className="docs-example-grid-1-2">
                    <ControlGroup fill={true}>
                        <PlacementPopover placement="bottom-start" />
                        <PlacementPopover placement="bottom" />
                        <PlacementPopover placement="bottom-end" />
                    </ControlGroup>
                </div>
                <div className="docs-example-grid-1-3" />
                <div className="docs-example-grid-2-1">
                    <ControlGroup vertical={true}>
                        <PlacementPopover placement="right-start" />
                        <PlacementPopover placement="right" />
                        <PlacementPopover placement="right-end" />
                    </ControlGroup>
                </div>
                <div className="docs-example-grid-2-2">
                    <em className={Classes.TEXT_MUTED}>
                        Button positions are flipped here so that all popovers open inward.
                    </em>
                </div>
                <div className="docs-example-grid-2-3">
                    <ControlGroup vertical={true}>
                        <PlacementPopover placement="left-start" />
                        <PlacementPopover placement="left" />
                        <PlacementPopover placement="left-end" />
                    </ControlGroup>
                </div>
                <div className="docs-example-grid-3-1" />
                <div className="docs-example-grid-3-2">
                    <ControlGroup fill={true}>
                        <PlacementPopover placement="top-start" />
                        <PlacementPopover placement="top" />
                        <PlacementPopover placement="top-end" />
                    </ControlGroup>
                </div>
                <div className="docs-example-grid-3-3" />
            </div>
        </Example>
    );
};

const PlacementPopover: React.FC<{ placement: Placement }> = ({ placement }) => {
    const [sideLabel, alignmentLabel] = placement.split("-");
    const sideSpan = <span className={SIDE_LABEL_CLASS}>{sideLabel}</span>;

    const buttonLabel =
        alignmentLabel === undefined ? (
            sideSpan
        ) : (
            <>
                {sideSpan}-{<span className={ALIGNMENT_LABEL_CLASS}>{alignmentLabel}</span>}
            </>
        );

    const popoverAlignmentSentence =
        alignmentLabel === undefined ? (
            <>
                Aligned to <Code className={ALIGNMENT_LABEL_CLASS}>(center)</Code>
            </>
        ) : (
            <>
                Aligned to <Code className={ALIGNMENT_LABEL_CLASS}>{alignmentLabel}</Code> edge
            </>
        );

    const content = (
        <div>
            Popover on <Code className={SIDE_LABEL_CLASS}>{sideLabel}</Code> side
            <br />
            {popoverAlignmentSentence}
        </div>
    );

    return (
        <Popover
            content={content}
            placement={placement}
            popoverClassName={CONTENT_CLASS}
            renderTarget={({ isOpen, ...p }) => (
                <Button {...p} active={isOpen} className={Classes.MONOSPACE_TEXT} text={buttonLabel} />
            )}
        />
    );
};
