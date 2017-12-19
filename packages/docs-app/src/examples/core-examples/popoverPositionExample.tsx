/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as classNames from "classnames";
import * as React from "react";

import { Button, ButtonGroup, Classes, Popover, Position } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs";

const CENTER_LABEL = "(center)";

const EXAMPLE_CLASS = "docs-popover-position-example";

const TABLE_CLASS = `${EXAMPLE_CLASS}-table`;
const ROW_CLASS = `${EXAMPLE_CLASS}-row`;
const CELL_CLASS = `${EXAMPLE_CLASS}-cell`;

const CELL_LEFT_CLASS = `${CELL_CLASS}-left`;
const CELL_CENTER_CLASS = `${CELL_CLASS}-center`;
const CELL_RIGHT_CLASS = `${CELL_CLASS}-right`;

const INSTRUCTIONS_CLASS = `${EXAMPLE_CLASS}-instructions`;

export class PopoverPositionExample extends BaseExample<{}> {
    protected className = EXAMPLE_CLASS;

    protected renderExample() {
        return (
            <table className={TABLE_CLASS}>
                <tr className={ROW_CLASS}>
                    <td className={CELL_LEFT_CLASS} />
                    <td className={classNames(CELL_CLASS, CELL_CENTER_CLASS)}>
                        {this.renderPopover(Position.BOTTOM_LEFT, "BOTTOM_LEFT", "BOTTOM", "LEFT")}
                        {this.renderPopover(Position.BOTTOM, "BOTTOM", "BOTTOM", "(center)")}
                        {this.renderPopover(Position.BOTTOM_RIGHT, "BOTTOM_RIGHT", "BOTTOM", "RIGHT")}
                    </td>
                    <td className={CELL_RIGHT_CLASS} />
                </tr>
                <tr className={ROW_CLASS}>
                    <td className={classNames(CELL_CLASS, CELL_LEFT_CLASS)}>
                        {this.renderPopover(Position.RIGHT_TOP, "RIGHT_TOP", "RIGHT", "TOP")}
                        {this.renderPopover(Position.RIGHT, "RIGHT", "RIGHT", "(center)")}
                        {this.renderPopover(Position.RIGHT_BOTTOM, "RIGHT_BOTTOM", "RIGHT", "BOTTOM")}
                    </td>
                    <td className={classNames(CELL_CLASS, CELL_CENTER_CLASS)}>
                        <span className={INSTRUCTIONS_CLASS}>
                            Button positions are flipped so that all popovers open inward.
                        </span>
                    </td>
                    <td className={classNames(CELL_CLASS, CELL_RIGHT_CLASS)}>
                        {this.renderPopover(Position.LEFT_TOP, "LEFT_TOP", "LEFT", "TOP")}
                        {this.renderPopover(Position.LEFT, "LEFT", "LEFT", "(center)")}
                        {this.renderPopover(Position.LEFT_BOTTOM, "LEFT_BOTTOM", "LEFT", "BOTTOM")}
                    </td>
                </tr>
                <tr className={ROW_CLASS}>
                    <td className={CELL_LEFT_CLASS} />
                    <td className={classNames(CELL_CLASS, CELL_CENTER_CLASS)}>
                        {this.renderPopover(Position.TOP_LEFT, "TOP_LEFT", "TOP", "LEFT")}
                        {this.renderPopover(Position.TOP, "TOP", "TOP", "(center)")}
                        {this.renderPopover(Position.TOP_RIGHT, "TOP_RIGHT", "TOP", "RIGHT")}
                    </td>
                    <td className={CELL_RIGHT_CLASS} />
                </tr>
            </table>
        );
    }

    private renderPopover(position: "auto" | Position, buttonLabel: string, popoverLabel: string, arrowLabel: string) {
        const alignMessage =
            arrowLabel === CENTER_LABEL ? (
                <>
                    Aligned at <code>(center)</code>.
                </>
            ) : (
                <>
                    Aligned on <code>{arrowLabel}</code> edge.
                </>
            );
        const content = (
            <div>
                Popover on <code>{popoverLabel}</code>.<br />
                {alignMessage}
            </div>
        );
        return (
            <Popover content={content} inline={true} position={position}>
                <Button>{buttonLabel}</Button>
            </Popover>
        );
    }
}
