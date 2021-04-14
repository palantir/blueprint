/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

import React from "react";

import { Button, ButtonGroup, Classes, H1, Popover, Switch, Tooltip } from "@blueprintjs/core";
import { Example, ExampleProps } from "@blueprintjs/docs-theme";

export interface TooltipExampleState {
    isOpen: boolean;
}

export class TooltipExample extends React.PureComponent<ExampleProps, TooltipExampleState> {
    public static displayName = "TooltipExample";

    public state: TooltipExampleState = {
        isOpen: false,
    };

    public render() {
        // using JSX instead of strings for all content so the tooltips will re-render
        // with every update for dark theme inheritance.
        const lotsOfText = (
            <span>
                In facilisis scelerisque dui vel dignissim. Sed nunc orci, ultricies congue vehicula quis, facilisis a
                orci.
            </span>
        );
        const jsxContent = (
            <em>
                This tooltip contains an <strong>em</strong> tag.
            </em>
        );
        return (
            <Example options={false} {...this.props}>
                <div>
                    Inline text can have{" "}
                    <Tooltip className={Classes.TOOLTIP_INDICATOR} content={jsxContent}>
                        a tooltip.
                    </Tooltip>
                </div>
                <div>
                    <Tooltip content={lotsOfText}>Or, hover anywhere over this whole line.</Tooltip>
                </div>
                <div>
                    This line's tooltip{" "}
                    <Tooltip className={Classes.TOOLTIP_INDICATOR} content={<span>disabled</span>} disabled={true}>
                        is disabled.
                    </Tooltip>
                </div>
                <div>
                    This line's tooltip{" "}
                    <Tooltip
                        className={Classes.TOOLTIP_INDICATOR}
                        content={<span>This tooltip has the minimal style applied!</span>}
                        minimal={true}
                    >
                        is minimal.
                    </Tooltip>
                </div>
                <div>
                    This line's tooltip{" "}
                    <Tooltip
                        className={Classes.TOOLTIP_INDICATOR}
                        content={<span>BRRAAAIINS</span>}
                        isOpen={this.state.isOpen}
                    >
                        is controlled by external state.
                    </Tooltip>
                    <Switch
                        checked={this.state.isOpen}
                        label="Open"
                        onChange={this.toggleControlledTooltip}
                        style={{ display: "inline-block", marginBottom: 0, marginLeft: 20 }}
                    />
                </div>
                <div>
                    <Tooltip
                        className={Classes.TOOLTIP_INDICATOR}
                        content="primary"
                        intent="primary"
                        placement="left"
                        usePortal={false}
                    >
                        Available
                    </Tooltip>{" "}
                    <Tooltip
                        className={Classes.TOOLTIP_INDICATOR}
                        content="success"
                        intent="success"
                        placement="top"
                        usePortal={false}
                    >
                        in the full
                    </Tooltip>{" "}
                    <Tooltip
                        className={Classes.TOOLTIP_INDICATOR}
                        content="warning"
                        intent="warning"
                        placement="bottom"
                        usePortal={false}
                    >
                        range of
                    </Tooltip>{" "}
                    <Tooltip
                        className={Classes.TOOLTIP_INDICATOR}
                        content="danger"
                        intent="danger"
                        placement="right"
                        usePortal={false}
                    >
                        visual intents!
                    </Tooltip>
                </div>
                <br />
                <Popover
                    content={<H1>Popover!</H1>}
                    placement="right"
                    popoverClassName={Classes.POPOVER_CONTENT_SIZING}
                >
                    <Tooltip content={<span>This button also has a popover!</span>} placement="right" usePortal={false}>
                        <Button intent="success" text="Hover and click me" />
                    </Tooltip>
                </Popover>
                <br />

                <ButtonGroup>
                    <Tooltip content="Each" placement="bottom">
                        <Button intent="primary" text="Group" />
                    </Tooltip>
                    <Tooltip content="has" placement="bottom">
                        <Button intent="primary" text="of" />
                    </Tooltip>
                    <Tooltip content="a tooltip" placement="bottom">
                        <Button intent="primary" text="buttons" />
                    </Tooltip>
                </ButtonGroup>
            </Example>
        );
    }

    private toggleControlledTooltip = () => {
        this.setState({ isOpen: !this.state.isOpen });
    };
}
