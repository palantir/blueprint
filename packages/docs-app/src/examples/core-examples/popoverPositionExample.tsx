/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import { Button, Popover, Position } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs-theme";

const EXAMPLE_CLASS = "docs-popover-position-example";

// Avoid interpolation to ensure these values remain grep-able.
const BUTTON_CLASS = "docs-popover-position-example-button";
const INSTRUCTIONS_CLASS = "docs-popover-position-example-instructions";

const TABLE_CLASS = "docs-popover-position-example-table";
const ROW_CLASS = "docs-popover-position-example-row";
const CELL_CLASS = "docs-popover-position-example-cell";

const CELL_LEFT_CLASS = "docs-popover-position-example-cell-left";
const CELL_CENTER_CLASS = "docs-popover-position-example-cell-center";
const CELL_RIGHT_CLASS = "docs-popover-position-example-cell-right";

const SIDE_LABEL_CLASS = "docs-popover-position-label-side";
const ALIGNMENT_LABEL_CLASS = "docs-popover-position-label-alignment";

export class PopoverPositionExample extends BaseExample<{}> {
    protected className = EXAMPLE_CLASS;

    protected renderExample() {
        return (
            <table className={TABLE_CLASS}>
                <tbody>
                    <tr className={ROW_CLASS}>
                        <td className={CELL_LEFT_CLASS} />
                        <td className={classNames(CELL_CLASS, CELL_CENTER_CLASS)}>
                            {this.renderPopover(Position.BOTTOM_LEFT, "BOTTOM", "LEFT")}
                            {this.renderPopover(Position.BOTTOM, "BOTTOM")}
                            {this.renderPopover(Position.BOTTOM_RIGHT, "BOTTOM", "RIGHT")}
                        </td>
                        <td className={CELL_RIGHT_CLASS} />
                    </tr>
                    <tr className={ROW_CLASS}>
                        <td className={classNames(CELL_CLASS, CELL_LEFT_CLASS)}>
                            {this.renderPopover(Position.RIGHT_TOP, "RIGHT", "TOP")}
                            {this.renderPopover(Position.RIGHT, "RIGHT")}
                            {this.renderPopover(Position.RIGHT_BOTTOM, "RIGHT", "BOTTOM")}
                        </td>
                        <td className={classNames(CELL_CLASS, CELL_CENTER_CLASS)}>
                            <span className={INSTRUCTIONS_CLASS}>
                                Button positions are flipped here so that all popovers open inward.
                            </span>
                        </td>
                        <td className={classNames(CELL_CLASS, CELL_RIGHT_CLASS)}>
                            {this.renderPopover(Position.LEFT_TOP, "LEFT", "TOP")}
                            {this.renderPopover(Position.LEFT, "LEFT")}
                            {this.renderPopover(Position.LEFT_BOTTOM, "LEFT", "BOTTOM")}
                        </td>
                    </tr>
                    <tr className={ROW_CLASS}>
                        <td className={CELL_LEFT_CLASS} />
                        <td className={classNames(CELL_CLASS, CELL_CENTER_CLASS)}>
                            {this.renderPopover(Position.TOP_LEFT, "TOP", "LEFT")}
                            {this.renderPopover(Position.TOP, "TOP")}
                            {this.renderPopover(Position.TOP_RIGHT, "TOP", "RIGHT")}
                        </td>
                        <td className={CELL_RIGHT_CLASS} />
                    </tr>
                </tbody>
            </table>
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
                    Aligned at <code className={ALIGNMENT_LABEL_CLASS}>(center)</code>.
                </>
            ) : (
                <>
                    Aligned on <code className={ALIGNMENT_LABEL_CLASS}>{alignmentLabel}</code> edge.
                </>
            );

        const content = (
            <div>
                Popover on <code className={SIDE_LABEL_CLASS}>{sideLabel}</code>.<br />
                {popoverAlignmentSentence}
            </div>
        );

        return (
            <Popover content={content} position={position} usePortal={false}>
                <Button className={BUTTON_CLASS}>{buttonLabel}</Button>
            </Popover>
        );
    }
}
