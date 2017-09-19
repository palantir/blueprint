/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { Button, Intent, Switch } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs";

import { Popover2, Tooltip2 } from "../src";

export class Tooltip2Example extends BaseExample<{ isOpen: boolean }> {
    public state = {
        isOpen: false,
    };

    protected renderExample() {
        // using JSX instead of strings for all content so the tooltips will re-render
        // with every update for dark theme inheritance.
        const lotsOfText = (
            <span>
                In facilisis scelerisque dui vel dignissim. Sed nunc orci, ultricies congue vehicula quis, facilisis a
                orci.
            </span>
        );
        return (
            <div className="docs-tooltip2-example">
                <div>
                    Inline text can have&nbsp;
                    <Tooltip2
                        className="pt-tooltip-indicator"
                        content={
                            <em>
                                This tooltip contains an <strong>em</strong> tag.
                            </em>
                        }
                    >
                        a tooltip.
                    </Tooltip2>
                </div>
                <div>
                    <Tooltip2 content={lotsOfText}>Or, hover anywhere over this whole line.</Tooltip2>
                </div>
                <div>
                    This line's tooltip&nbsp;
                    <Tooltip2 className="pt-tooltip-indicator" content={<span>disabled</span>} disabled={true}>
                        is disabled.
                    </Tooltip2>
                </div>
                <div>
                    This line's tooltip&nbsp;
                    <Tooltip2
                        className="pt-tooltip-indicator"
                        content={<span>BRRAAAIINS</span>}
                        isOpen={this.state.isOpen}
                    >
                        is controlled by external state.
                    </Tooltip2>
                    <Switch
                        checked={this.state.isOpen}
                        label="Open"
                        onChange={this.toggleControlledTooltip2}
                        style={{ display: "inline-block", marginBottom: 0, marginLeft: 20 }}
                    />
                </div>
                <div>
                    <Tooltip2
                        className="pt-tooltip-indicator"
                        content="Intent.PRIMARY"
                        inline={true}
                        intent={Intent.PRIMARY}
                        placement="left"
                    >
                        Available
                    </Tooltip2>&nbsp;
                    <Tooltip2
                        className="pt-tooltip-indicator"
                        content="Intent.SUCCESS"
                        inline={true}
                        intent={Intent.SUCCESS}
                        placement="top"
                    >
                        in the full
                    </Tooltip2>&nbsp;
                    <Tooltip2
                        className="pt-tooltip-indicator"
                        content="Intent.WARNING"
                        inline={true}
                        intent={Intent.WARNING}
                        placement="bottom"
                    >
                        range of
                    </Tooltip2>&nbsp;
                    <Tooltip2
                        className="pt-tooltip-indicator"
                        content="Intent.DANGER"
                        inline={true}
                        intent={Intent.DANGER}
                        placement="right"
                    >
                        visual intents!
                    </Tooltip2>
                </div>
                <br />
                <Popover2 content={<h1>Popover!</h1>} placement="right" popoverClassName="pt-popover-content-sizing">
                    <Tooltip2 content={<span>This button also has a popover!</span>} placement="right" inline={true}>
                        <Button intent={Intent.SUCCESS} text="Hover and click me" />
                    </Tooltip2>
                </Popover2>
            </div>
        );
    }

    private toggleControlledTooltip2 = () => {
        this.setState({ isOpen: !this.state.isOpen });
    };
}
