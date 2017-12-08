/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Icon, IProps, Popover, Position } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import * as Classes from "../../common/classes";
import { Utils } from "../../common/utils";

import { Locator } from "../../locator";

// amount in pixels that the content div width changes when truncated vs when
// not truncated. Note: could be modified by styles
// Note 2: this doesn't come from the width of the popover element, but the "right" style
// on the div, which comes from styles
const CONTENT_DIV_WIDTH_DELTA = 25;

export enum TruncatedPopoverMode {
    ALWAYS,
    NEVER,
    WHEN_TRUNCATED,
    WHEN_TRUNCATED_APPROX,
}

export interface ITrucatedFormateMeasureByApproximateOptions {
    /**
     * Approximate character width (in pixels), used to determine whether to display the popover in approx truncation mode.
     * The default value should work for normal table styles,
     * but should be changed as necessary if the fonts or styles are changed significantly.
     * @default 8
     */
    approximateCharWidth: number;

    /**
     * Approximate line height (in pixels), used to determine whether to display the popover in approx truncation mode.
     * The default value should work for normal table styles, but should be changed if the fonts or styles are changed significantly.
     * @default 18
     */
    approximateLineHeight: number;

    /**
     * Total horizonal cell padding (both sides), used to determine whether to display the popover in approx truncation mode.
     * The default value should work for normal table styles,
     * but should be changed as necessary if the fonts or styles are changed significantly.
     * @default 20
     */
    cellHorizontalPadding: number;

    /**
     * Number of buffer lines desired, used to determine whether to display the popover in approx truncation mode.
     * Buffer lines are extra lines at the bottom of the cell that space is made for, to make sure that the cell text will fit
     * after the math calculates how many lines the text is expected to take.
     * The default value should work for normal table styles,
     * but should be changed as necessary if the fonts or styles are changed significantly.
     * @default 0
     */
    numBufferLines: number;
}

export interface ITruncatedFormatProps extends IProps {
    children?: string;

    /**
     * Should the component keep track of the truncation state of the string content. If true, the
     * value of `truncateLength` is ignored. When combined with a `showPopover` value of
     * `WHEN_TRUNCATED`, popovers will only render when necessary.
     * @default false;
     */
    detectTruncation?: boolean;

    /**
     * Values to use for character width, line height, cell padding, and buffer lines desired, when using approximate truncation.
     * These values are used to guess at the size of the text and determine if the popover should be drawn. They should work well
     * enough for default table styles, but may need to be overridden for more accuracy if the default styles or font size, etc
     * are changed.
     */
    measureByApproxOptions?: ITrucatedFormateMeasureByApproximateOptions;

    /**
     * Height of the parent cell. Used by shouldComponentUpdate only
     */
    parentCellHeight?: number;

    /**
     * Width of the parent cell. Used by shouldComponentUpdate only
     */
    parentCellWidth?: number;

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
     * - `ALWAYS`: show the popover.
     * - `NEVER`: don't show the popover.
     * - `WHEN_TRUNCATED`: show the popover only when the text is truncated (default).
     * @default WHEN_TRUNCATED
     */
    showPopover?: TruncatedPopoverMode;

    /**
     * Number of characters that are displayed before being truncated and appended with the
     * `truncationSuffix` prop. A value of 0 will disable truncation. This prop is ignored if
     * `detectTruncation` is `true`.
     * @default 2000
     */
    truncateLength?: number;

    /**
     * The string that is appended to the display string if it is truncated.
     * @default "..."
     */
    truncationSuffix?: string;
}

export interface ITruncatedFormatState {
    isTruncated?: boolean;
    isPopoverOpen?: boolean;
}

@PureRender
export class TruncatedFormat extends React.Component<ITruncatedFormatProps, ITruncatedFormatState> {
    public static defaultProps: ITruncatedFormatProps = {
        detectTruncation: false,
        measureByApproxOptions: {
            approximateCharWidth: 8,
            approximateLineHeight: 18,
            cellHorizontalPadding: 2 * Locator.CELL_HORIZONTAL_PADDING,
            numBufferLines: 0,
        },
        preformatted: false,
        showPopover: TruncatedPopoverMode.WHEN_TRUNCATED,
        truncateLength: 2000,
        truncationSuffix: "...",
    };

    public state: ITruncatedFormatState = {
        isPopoverOpen: false,
        isTruncated: false,
    };

    private contentDiv: HTMLDivElement;

    public componentDidMount() {
        this.setTruncationState();
    }

    public componentDidUpdate() {
        this.setTruncationState();
    }

    public render() {
        const { children, detectTruncation, truncateLength, truncationSuffix } = this.props;
        const content = "" + children;

        let cellContent = content;
        if (!detectTruncation && truncateLength > 0 && cellContent.length > truncateLength) {
            cellContent = cellContent.substring(0, truncateLength) + truncationSuffix;
        }

        if (this.shouldShowPopover(content)) {
            const className = classNames(this.props.className, Classes.TABLE_TRUNCATED_FORMAT);
            return (
                <div className={className}>
                    <div className={Classes.TABLE_TRUNCATED_VALUE} ref={this.handleContentDivRef}>
                        {cellContent}
                    </div>
                    {this.renderPopover()}
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

    private renderPopover() {
        const { children, preformatted } = this.props;

        // `<Popover>` will always check the content's position on update
        // regardless if it is open or not. This negatively affects perf due to
        // layout thrashing. So instead we manage the popover state ourselves
        // and mimic its popover target
        if (this.state.isPopoverOpen) {
            const popoverClasses = classNames(
                Classes.TABLE_TRUNCATED_POPOVER,
                preformatted ? Classes.TABLE_POPOVER_WHITESPACE_PRE : Classes.TABLE_POPOVER_WHITESPACE_NORMAL,
            );
            const popoverContent = <div className={popoverClasses}>{children}</div>;
            const constraints = [
                {
                    attachment: "together",
                    to: "window",
                },
            ];

            return (
                <Popover
                    className={Classes.TABLE_TRUNCATED_POPOVER_TARGET}
                    tetherOptions={{ constraints }}
                    content={popoverContent}
                    position={Position.BOTTOM}
                    isOpen={true}
                    onClose={this.handlePopoverClose}
                    useSmartArrowPositioning={true}
                >
                    <Icon iconName="more" />
                </Popover>
            );
        } else {
            // NOTE: This structure matches what `<Popover>` does internally. If
            // `<Popover>` changes, this must be updated.
            return (
                <span className={Classes.TABLE_TRUNCATED_POPOVER_TARGET} onClick={this.handlePopoverOpen}>
                    <Icon iconName="more" />
                </span>
            );
        }
    }

    private handleContentDivRef = (ref: HTMLDivElement) => (this.contentDiv = ref);

    private handlePopoverOpen = () => {
        this.setState({ isPopoverOpen: true });
    };

    private handlePopoverClose = () => {
        this.setState({ isPopoverOpen: false });
    };

    private shouldShowPopover(content: string) {
        const { detectTruncation, measureByApproxOptions, showPopover, truncateLength } = this.props;

        switch (showPopover) {
            case TruncatedPopoverMode.ALWAYS:
                return true;
            case TruncatedPopoverMode.NEVER:
                return false;
            case TruncatedPopoverMode.WHEN_TRUNCATED:
                return detectTruncation
                    ? this.state.isTruncated
                    : truncateLength > 0 && content.length > truncateLength;
            case TruncatedPopoverMode.WHEN_TRUNCATED_APPROX:
                if (!detectTruncation) {
                    return truncateLength > 0 && content.length > truncateLength;
                }
                if (this.props.parentCellHeight == null || this.props.parentCellWidth == null) {
                    return false;
                }

                const {
                    approximateCharWidth,
                    approximateLineHeight,
                    cellHorizontalPadding,
                    numBufferLines,
                } = measureByApproxOptions;

                const cellWidth = this.props.parentCellWidth;
                const approxCellHeight = Utils.getApproxCellHeight(
                    content,
                    cellWidth,
                    approximateCharWidth,
                    approximateLineHeight,
                    cellHorizontalPadding,
                    numBufferLines,
                );

                const shouldTruncate = approxCellHeight > this.props.parentCellHeight;
                return shouldTruncate;
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
