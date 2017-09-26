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
import { Utils } from "../../common/utils";

// Since we measure only the `textContent` of the cell to determine the
// truncation state, we must account for the padding that is applied via CSS to
// the cell.
const CONTAINER_PADDING = 20;

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
    isPopoverOpen: boolean;
}

// const CELL_FONT_PROPERTIES_STRING = `normal normal normal normal 12px / 20px -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", Icons16, sans-serif`;

@PureRender
export class TruncatedFormat extends React.Component<ITruncatedFormatProps, ITruncatedFormatState> {
    public static defaultProps: ITruncatedFormatProps = {
        detectTruncation: true,
        preformatted: false,
        showPopover: TruncatedPopoverMode.WHEN_TRUNCATED,
        truncateLength: 80,
        truncationSuffix: "...",
    };

    public state: ITruncatedFormatState = {
        isPopoverOpen: false,
        isTruncated: false,
    };

    private contentDiv: HTMLDivElement;
    private cachedFontString: string;

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

        // <Popover> will always check the content's position on update
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
            return (
                <span className={Classes.TABLE_TRUNCATED_POPOVER_TARGET} onClick={this.handlePopoverOpen}>
                    <Icon iconName="more" />
                </span>
            );
        }
    }

    private handleContentDivRef = (ref: HTMLDivElement) => (this.contentDiv = ref);

    private handlePopoverOpen = () => {
        this.setState({ isPopoverOpen: true } as ITruncatedFormatState);
    };

    private handlePopoverClose = () => {
        this.setState({ isPopoverOpen: false } as ITruncatedFormatState);
    };

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
            this.setState({ isTruncated: false } as ITruncatedFormatState);
            return;
        }

        if (this.cachedFontString == null) {
            this.cachedFontString = Utils.getFontStringFromDom(this.contentDiv);
        }

        const contentWidth = Utils.measureText(this.contentDiv.textContent, this.cachedFontString).width;
        const containerWidth = parseInt(this.props.parentCellWidth, 10);
        const availableWidth = containerWidth - CONTAINER_PADDING;
        const isTruncated = contentWidth > availableWidth;
        this.setState({ isTruncated } as ITruncatedFormatState);
    }
}
