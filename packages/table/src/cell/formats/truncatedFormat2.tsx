/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
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

import classNames from "classnames";
import * as React from "react";

import { DISPLAYNAME_PREFIX, Icon } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";

import * as Classes from "../../common/classes";
import { Utils } from "../../common/utils";
import { Locator } from "../../locator";
import { ITruncatedFormatState, TruncatedFormatProps, TruncatedPopoverMode } from "./truncatedFormat";

// amount in pixels that the content div width changes when truncated vs when
// not truncated. Note: could be modified by styles
// Note 2: this doesn't come from the width of the popover element, but the "right" style
// on the div, which comes from styles
const CONTENT_DIV_WIDTH_DELTA = 25;

/**
 * Truncated cell format (v2) component.
 *
 * @see https://blueprintjs.com/docs/#table/api.truncatedformat2
 */
export class TruncatedFormat2 extends React.PureComponent<TruncatedFormatProps, ITruncatedFormatState> {
    public static displayName = `${DISPLAYNAME_PREFIX}.TruncatedFormat2`;

    public static defaultProps: TruncatedFormatProps = {
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

    private contentDiv: HTMLDivElement | null | undefined;

    private handleContentDivRef = (ref: HTMLDivElement | null) => (this.contentDiv = ref);

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
        if (!detectTruncation && truncateLength! > 0 && cellContent.length > truncateLength!) {
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

        // `<Popover2>` will always check the content's position on update
        // regardless if it is open or not. This negatively affects perf due to
        // layout thrashing. So instead we manage the popover state ourselves
        // and mimic its popover target
        if (this.state.isPopoverOpen) {
            const popoverClasses = classNames(
                Classes.TABLE_TRUNCATED_POPOVER,
                preformatted ? Classes.TABLE_POPOVER_WHITESPACE_PRE : Classes.TABLE_POPOVER_WHITESPACE_NORMAL,
            );
            const popoverContent = <div className={popoverClasses}>{children}</div>;
            return (
                <Popover2
                    className={Classes.TABLE_TRUNCATED_POPOVER_TARGET}
                    content={popoverContent}
                    isOpen={true}
                    onClose={this.handlePopoverClose}
                    placement="bottom"
                    rootBoundary="document"
                >
                    <Icon icon="more" />
                </Popover2>
            );
        } else {
            // NOTE: This structure matches what `<Popover2>` does internally. If `<Popover2>` changes, this must be updated.
            return (
                <span className={Classes.TABLE_TRUNCATED_POPOVER_TARGET} onClick={this.handlePopoverOpen}>
                    <Icon icon="more" />
                </span>
            );
        }
    }

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
                    : truncateLength! > 0 && content.length > truncateLength!;
            case TruncatedPopoverMode.WHEN_TRUNCATED_APPROX:
                if (!detectTruncation) {
                    return truncateLength! > 0 && content.length > truncateLength!;
                }
                if (this.props.parentCellHeight == null || this.props.parentCellWidth == null) {
                    return false;
                }

                const { approximateCharWidth, approximateLineHeight, cellHorizontalPadding, numBufferLines } =
                    measureByApproxOptions!;

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

        if (this.contentDiv == null) {
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
