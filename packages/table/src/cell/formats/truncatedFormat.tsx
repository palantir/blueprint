/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Icon, IProps, Popover, Position } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import * as Classes from "../../common/classes";

// amount in pixels that the content div width changes when truncated vs when
// not truncated. Note: could be modified by styles
// Note 2: this doesn't come from the width of the popover element, but the "right" style
// on the div, which comes from styles
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
     * Height of the parent cell. Used by shouldComponentUpdate only
     */
    parentCellHeight?: string;

    /**
     * Width of the parent cell. Used by shouldComponentUpdate only
     */
    parentCellWidth?: string;

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

@PureRender
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
            const constraints = [
                {
                    attachment: "together",
                    to: "window",
                },
            ];

            return (
                <div className={className}>
                    <div className={Classes.TABLE_TRUNCATED_VALUE} ref={this.handleContentDivRef}>
                        {cellContent}
                    </div>
                    <Popover
                        className={Classes.TABLE_TRUNCATED_POPOVER_TARGET}
                        tetherOptions={{ constraints }}
                        content={popoverContent}
                        position={Position.BOTTOM}
                        useSmartArrowPositioning={true}
                    >
                        <Icon iconName="more" />
                    </Popover>
                </div>
            );
        } else {
            const className = classNames(this.props.className, Classes.TABLE_TRUNCATED_FORMAT_TEXT);
            return (
                <div className={className} ref={this.handleContentDivRef}>
                    {cellContent}
                </div>
            );
        }
    }

    public componentDidMount() {
        this.setTruncationState();
    }

    public componentDidUpdate() {
        this.setTruncationState();
    }

    private handleContentDivRef = (ref: HTMLDivElement) => (this.contentDiv = ref);

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
                    : truncateLength > 0 && content.length > truncateLength;
            default:
                return false;
        }
    }

    private setTruncationState() {
        if (!this.props.detectTruncation || this.props.showPopover !== TruncatedPopoverMode.WHEN_TRUNCATED) {
            return;
        }

        if (this.contentDiv === undefined) {
            this.setState({ isTruncated: false });
            return;
        }

        const { isTruncated } = this.state;

        // take all measurements at once to avoid excessive DOM reflows.
        const {
            clientHeight: containerHeight,
            clientWidth: containerWidth,
            scrollHeight: actualContentHeight,
            scrollWidth: contentWidth,
        } = this.contentDiv;

        // if the content is truncated, then a popover handle will be present as a
        // sibling of the content. we don't want to consider that handle when
        // calculating the width of the actual content, so subtract it.
        const actualContentWidth = isTruncated ? contentWidth - CONTENT_DIV_WIDTH_DELTA : contentWidth;

        // we of course truncate the content if it doesn't fit in the container. but we
        // also aggressively truncate if they're the same size with truncation enabled;
        // this addresses browser-crashing stack-overflow bugs at various zoom levels.
        // (see: https://github.com/palantir/blueprint/pull/1519)
        const shouldTruncate =
            (isTruncated && actualContentWidth === containerWidth) ||
            actualContentWidth > containerWidth ||
            actualContentHeight > containerHeight;

        this.setState({ isTruncated: shouldTruncate });
    }
}
