/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, Classes, Code, Popover, Position } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";

const EXAMPLE_CLASS = "docs-popover-position-example";

const SIDE_LABEL_CLASS = "docs-popover-position-label-side";
const ALIGNMENT_LABEL_CLASS = "docs-popover-position-label-alignment";

export class PopoverPositionExample extends React.PureComponent<IExampleProps> {
    public render() {
        return (
            <Example className={EXAMPLE_CLASS} options={false} {...this.props}>
                {/* tslint:disable-next-line:blueprint-html-components */}
                <table>
                    <tbody>
                        <tr>
                            <td />
                            <td>
                                {this.renderPopover(Position.BOTTOM_LEFT, "BOTTOM", "LEFT")}
                                {this.renderPopover(Position.BOTTOM, "BOTTOM")}
                                {this.renderPopover(Position.BOTTOM_RIGHT, "BOTTOM", "RIGHT")}
                            </td>
                            <td />
                        </tr>
                        <tr>
                            <td>
                                {this.renderPopover(Position.RIGHT_TOP, "RIGHT", "TOP")}
                                {this.renderPopover(Position.RIGHT, "RIGHT")}
                                {this.renderPopover(Position.RIGHT_BOTTOM, "RIGHT", "BOTTOM")}
                            </td>
                            <td>
                                <em className={Classes.TEXT_MUTED}>
                                    Button positions are flipped here so that all popovers open inward.
                                </em>
                            </td>
                            <td>
                                {this.renderPopover(Position.LEFT_TOP, "LEFT", "TOP")}
                                {this.renderPopover(Position.LEFT, "LEFT")}
                                {this.renderPopover(Position.LEFT_BOTTOM, "LEFT", "BOTTOM")}
                            </td>
                        </tr>
                        <tr>
                            <td />
                            <td>
                                {this.renderPopover(Position.TOP_LEFT, "TOP", "LEFT")}
                                {this.renderPopover(Position.TOP, "TOP")}
                                {this.renderPopover(Position.TOP_RIGHT, "TOP", "RIGHT")}
                            </td>
                            <td />
                        </tr>
                    </tbody>
                </table>
            </Example>
        );
    }

    private renderPopover(position: "auto" | Position, sideLabel: string, alignmentLabel?: string) {
        const sideSpan = <span className={SIDE_LABEL_CLASS}>{sideLabel}</span>;

        const buttonLabel =
            alignmentLabel === undefined ? (
                <>{sideSpan}</>
            ) : (
                <>
                    {sideSpan}_{<span className={ALIGNMENT_LABEL_CLASS}>{alignmentLabel}</span>}
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
            <Popover content={content} position={position} usePortal={false}>
                <Button className={Classes.MONOSPACE_TEXT}>{buttonLabel}</Button>
            </Popover>
        );
    }
}
