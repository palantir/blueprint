/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Icon, IProps, Popover, Position } from "@blueprintjs/core";

import * as classNames from "classnames";
import * as React from "react";

import * as Classes from "../../common/classes";

// amount in pixels that the content div width changes when truncated vs when
// not truncated. Note: could be modified by styles
const CONTENT_DIV_WIDTH_DELTA = 25;

export enum TruncatedPopoverMode {
    ALWAYS,
    NEVER,
    WHEN_TRUNCATED,
}

export interface ITruncatedFormatProps extends IProps {
    children?: string;

    /**
     * Should the component keep track of the truncation state of the string content. If true, the
     * value of `truncateLength` is ignored. When combined with a `showPopover` value of
     * `WHEN_TRUNCATED`, popovers will only render when necessary.
     * @default true;
     */
    detectTruncation?: boolean;

    /**
     * Sets the popover content style to `white-space: pre` if `true` or
     * `white-space: normal` if `false`.
     * @default false
     */
    preformatted?: boolean;

    /**
     * Configures when the popover is shown with the `TruncatedPopoverMode` enum.
     *
     * The enum values are:
     * - `ALWAYS`: show the popover (default).
     * - `NEVER`: don't show the popover.
     * - `WHEN_TRUNCATED`: show the popover only when the text is truncated.
     * @default WHEN_TRUNCATED
     */
    showPopover?: TruncatedPopoverMode;

    /**
     * Number of characters that are displayed before being truncated and appended with the
     * `truncationSuffix` prop. A value of 0 will disable truncation. This prop is ignored if
     * `detectTruncation` is `true`.
     * @default 80
     */
    truncateLength?: number;

    /**
     * The string that is appended to the display string if it is truncated.
     * @default "..."
     */
    truncationSuffix?: string;
}

export interface ITruncatedFormatState {
    isTruncated: boolean;
}

export class TruncatedFormat extends React.Component<ITruncatedFormatProps, ITruncatedFormatState> {
    public static defaultProps: ITruncatedFormatProps = {
        detectTruncation: true,
        preformatted: false,
        showPopover: TruncatedPopoverMode.WHEN_TRUNCATED,
        truncateLength: 80,
        truncationSuffix: "...",
    };

    public state: ITruncatedFormatState = { isTruncated: false };

    private contentDiv: HTMLDivElement;

    public render() {
        const { children, detectTruncation, preformatted, truncateLength, truncationSuffix } = this.props;
        const content = "" + children;

        let cellContent = content;
        if (!detectTruncation && truncateLength > 0 && cellContent.length > truncateLength) {
            cellContent = cellContent.substring(0, truncateLength) + truncationSuffix;
        }

        if (this.shouldShowPopover(content)) {
            const popoverClasses = classNames(
                Classes.TABLE_TRUNCATED_POPOVER,
                preformatted ? Classes.TABLE_POPOVER_WHITESPACE_PRE : Classes.TABLE_POPOVER_WHITESPACE_NORMAL,
            );
            const popoverContent = <div className={popoverClasses}>{children}</div>;
            const className = classNames(this.props.className, Classes.TABLE_TRUNCATED_FORMAT);
            const constraints = [{
                attachment: "together",
                to: "window",
            }];

            return (
                <div className={className}>
                    <div className={Classes.TABLE_TRUNCATED_VALUE} ref={this.handleContentDivRef}>{cellContent}</div>
                    <Popover
                        className={Classes.TABLE_TRUNCATED_POPOVER_TARGET}
                        tetherOptions={{ constraints }}
                        content={popoverContent}
                        position={Position.BOTTOM}
                        useSmartArrowPositioning
                    >
                        <Icon iconName="more" />
                    </Popover>
                </div>
            );
        } else {
            const className = classNames(this.props.className, Classes.TABLE_TRUNCATED_FORMAT_TEXT);
            return <div className={className} ref={this.handleContentDivRef}>{cellContent}</div>;
        }
    }

    public componentDidMount() {
        this.setTruncationState();
    }

    public componentDidUpdate() {
        this.setTruncationState();
    }

    private handleContentDivRef = (ref: HTMLDivElement) => this.contentDiv = ref;

    private shouldShowPopover(content: string) {
        const { detectTruncation, showPopover, truncateLength } = this.props;

        switch (showPopover) {
            case TruncatedPopoverMode.ALWAYS:
                return true;
            case TruncatedPopoverMode.NEVER:
                return false;
            case TruncatedPopoverMode.WHEN_TRUNCATED:
                return detectTruncation
                    ? this.state.isTruncated
                    : (truncateLength > 0 && content.length > truncateLength);
            default:
                return false;
        }
    }

    private setTruncationState() {
        if (!this.props.detectTruncation || this.props.showPopover !== TruncatedPopoverMode.WHEN_TRUNCATED) {
            return;
        }

        // if the popover handle exists, take it into account
        let popoverHandleAdjustmentFactor = this.state.isTruncated ? CONTENT_DIV_WIDTH_DELTA : 0;
        // add a slight bit of buffer space where we don't show the popover, to deal with cases
        // where everything isn't pixel perfect
        popoverHandleAdjustmentFactor += .5;

        const isTruncated = this.contentDiv !== undefined &&
            (this.contentDiv.scrollWidth - popoverHandleAdjustmentFactor > this.contentDiv.clientWidth ||
            this.contentDiv.scrollHeight > this.contentDiv.clientHeight);
        if (this.state.isTruncated !== isTruncated) {
            this.setState({ isTruncated });
        }
    }
}
