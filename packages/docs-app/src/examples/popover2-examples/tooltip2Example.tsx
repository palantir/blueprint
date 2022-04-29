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

import * as React from "react";

import { Button, ButtonGroup, H1, Switch } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";
import { Classes, Popover2, Tooltip2 } from "@blueprintjs/popover2";

export interface ITooltip2ExampleState {
    isOpen: boolean;
}

export class Tooltip2Example extends React.PureComponent<IExampleProps, ITooltip2ExampleState> {
    public static displayName = "Tooltip2Example";

    public state: ITooltip2ExampleState = {
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
                    <Tooltip2 className={Classes.TOOLTIP2_INDICATOR} content={jsxContent}>
                        a tooltip.
                    </Tooltip2>
                </div>
                <div>
                    <Tooltip2 content={lotsOfText}>Or, hover anywhere over this whole line.</Tooltip2>
                </div>
                <div>
                    This line's tooltip{" "}
                    <Tooltip2 className={Classes.TOOLTIP2_INDICATOR} content={<span>disabled</span>} disabled={true}>
                        is disabled.
                    </Tooltip2>
                </div>
                <div>
                    This line's tooltip{" "}
                    <Tooltip2
                        className={Classes.TOOLTIP2_INDICATOR}
                        content={<span>This tooltip has the minimal style applied!</span>}
                        minimal={true}
                    >
                        is minimal.
                    </Tooltip2>
                </div>
                <div>
                    This line's tooltip{" "}
                    <Tooltip2
                        className={Classes.TOOLTIP2_INDICATOR}
                        content={<span>BRRAAAIINS</span>}
                        isOpen={this.state.isOpen}
                    >
                        is controlled by external state.
                    </Tooltip2>
                    <Switch
                        checked={this.state.isOpen}
                        label="Open"
                        onChange={this.toggleControlledTooltip}
                        style={{ display: "inline-block", marginBottom: 0, marginLeft: 20 }}
                    />
                </div>
                <div>
                    <Tooltip2
                        className={Classes.TOOLTIP2_INDICATOR}
                        content="primary"
                        intent="primary"
                        placement="left"
                        usePortal={false}
                    >
                        Available
                    </Tooltip2>{" "}
                    <Tooltip2
                        className={Classes.TOOLTIP2_INDICATOR}
                        content="success"
                        intent="success"
                        placement="top"
                        usePortal={false}
                    >
                        in the full
                    </Tooltip2>{" "}
                    <Tooltip2
                        className={Classes.TOOLTIP2_INDICATOR}
                        content="warning"
                        intent="warning"
                        placement="bottom"
                        usePortal={false}
                    >
                        range of
                    </Tooltip2>{" "}
                    <Tooltip2
                        className={Classes.TOOLTIP2_INDICATOR}
                        content="danger"
                        intent="danger"
                        placement="right"
                        usePortal={false}
                    >
                        visual intents!
                    </Tooltip2>
                </div>
                <br />
                <Popover2
                    content={<H1>Popover!</H1>}
                    placement="right"
                    popoverClassName={Classes.POPOVER2_CONTENT_SIZING}
                >
                    <Tooltip2
                        content={<span>This button also has a popover!</span>}
                        openOnTargetFocus={false}
                        placement="right"
                        usePortal={false}
                    >
                        <Button intent="success" text="Hover and click me" />
                    </Tooltip2>
                </Popover2>
                <br />

                <ButtonGroup>
                    <Tooltip2 content="Each" placement="bottom">
                        <Button intent="primary" text="Group" />
                    </Tooltip2>
                    <Tooltip2 content="has" placement="bottom">
                        <Button intent="primary" text="of" />
                    </Tooltip2>
                    <Tooltip2 content="a tooltip" placement="bottom">
                        <Button intent="primary" text="buttons" />
                    </Tooltip2>
                </ButtonGroup>
            </Example>
        );
    }

    private toggleControlledTooltip = () => {
        this.setState({ isOpen: !this.state.isOpen });
    };
}
