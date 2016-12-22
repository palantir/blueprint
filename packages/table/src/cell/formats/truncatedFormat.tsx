/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { IProps, Popover, Position } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";

export enum TruncatedPopoverMode {
    ALWAYS,
    NEVER,
    WHEN_TRUNCATED,
}

export interface ITruncatedFormatProps extends IProps {
    children?: string;

    /**
     * Sets the popover content style to `white-space: pre` if `true` or
     * `white-space: normal` if `false`.
     * @default true
     */
    preformatted?: boolean;

    /**
     * Configures when the popover is shown with the `TruncatedPopoverMode` enum.
     *
     * The enum values are:
     * - `ALWAYS` - show the popover (default).
     * - `NEVER` - don't show the popover.
     * - `WHEN_TRUNCATED` - show the popover only when the text is truncated.
     */
    showPopover?: TruncatedPopoverMode;

    /**
     * Number of characters that are displayed before being truncated and appended with
     * the `truncationSuffix` prop. A value of 0 will disable truncation.
     * @default 80
     */
    truncateLength?: number;

    /**
     * The string that is appended to the display string if it is truncated.
     * @default "..."
     */
    truncationSuffix?: string;
}

export class TruncatedFormat extends React.PureComponent<ITruncatedFormatProps, {}> {
    public static defaultProps: ITruncatedFormatProps = {
        preformatted: true,
        showPopover: TruncatedPopoverMode.ALWAYS,
        truncateLength: 80,
        truncationSuffix: "...",
    };

    public render() {
        const { children, preformatted, truncateLength, truncationSuffix } = this.props;
        const content = "" + children;

        let cellContent = content;
        if (truncateLength > 0 && cellContent.length > truncateLength) {
            cellContent = cellContent.substring(0, truncateLength) + truncationSuffix;
        }

        if (this.shouldShowPopover(content)) {
            const popoverClasses = classNames(
                "bp-table-truncated-popover",
                preformatted ? "bp-table-popover-whitespace-pre" : "bp-table-popover-whitespace-normal",
            );
            const popoverContent = <div className={popoverClasses}>{children}</div>;
            const className = classNames(this.props.className, "bp-table-truncated-format");
            const constraints = [{
                attachment: "together",
                pin: true,
                to: "window",
            }];
            return (
                <div className={className}>
                    <div className="bp-table-truncated-value">{cellContent}</div>
                    <Popover
                        className="bp-table-truncated-popover-target"
                        constraints={constraints}
                        content={popoverContent}
                        position={Position.BOTTOM}
                        useSmartArrowPositioning={true}
                    >
                        <span className="pt-icon-standard pt-icon-more"/>
                    </Popover>
                </div>
            );
        } else {
            const className = classNames(this.props.className, "bp-table-truncated-text");
            return <div className={className}>{cellContent}</div>;
        }
    }

    private shouldShowPopover(content: string) {
        const { showPopover, truncateLength } = this.props;

        switch (showPopover) {
            case TruncatedPopoverMode.ALWAYS:
                return true;
            case TruncatedPopoverMode.NEVER:
                return false;
            case TruncatedPopoverMode.WHEN_TRUNCATED:
                return (truncateLength > 0 && content.length > truncateLength);
            default:
                return false;
        }
    }
}
