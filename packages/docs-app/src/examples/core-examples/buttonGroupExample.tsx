/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Alignment, AnchorButton, Button, ButtonGroup, Switch } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange } from "@blueprintjs/docs-theme";
import { AlignmentSelect } from "./common/alignmentSelect";

export interface IButtonGroupExampleState {
    alignText: Alignment;
    fill: boolean;
    iconOnly: boolean;
    minimal: boolean;
    large: boolean;
    vertical: boolean;
}

export class ButtonGroupExample extends BaseExample<IButtonGroupExampleState> {
    public state: IButtonGroupExampleState = {
        alignText: Alignment.CENTER,
        fill: false,
        iconOnly: false,
        large: false,
        minimal: false,
        vertical: false,
    };

    private handleFillChange = handleBooleanChange(fill => this.setState({ fill }));
    private handleIconOnlyChange = handleBooleanChange(iconOnly => this.setState({ iconOnly }));
    private handleLargeChange = handleBooleanChange(large => this.setState({ large }));
    private handleMinimalChange = handleBooleanChange(minimal => this.setState({ minimal }));
    private handleVerticalChange = handleBooleanChange(vertical => this.setState({ vertical }));

    protected renderExample() {
        const { iconOnly, ...bgProps } = this.state;
        // have the container take up the full-width if `fill` is true;
        // otherwise, disable full-width styles to keep a vertical button group
        // from taking up the full width.
        const style: React.CSSProperties = { minWidth: 200, flexGrow: this.state.fill ? 1 : undefined };
        return (
            <ButtonGroup style={style} {...bgProps}>
                <Button icon="database">{!iconOnly && "Queries"}</Button>
                <Button icon="function">{!iconOnly && "Functions"}</Button>
                <AnchorButton icon="cog" rightIcon="caret-down">
                    {!iconOnly && "Options"}
                </AnchorButton>
            </ButtonGroup>
        );
    }

    protected renderOptions() {
        return [
            [
                <Switch checked={this.state.fill} key="fill" label="Fill" onChange={this.handleFillChange} />,
                <Switch checked={this.state.large} key="large" label="Large" onChange={this.handleLargeChange} />,
                <Switch
                    checked={this.state.minimal}
                    key="minimal"
                    label="Minimal"
                    onChange={this.handleMinimalChange}
                />,
                <Switch
                    checked={this.state.vertical}
                    key="vertical"
                    label="Vertical"
                    onChange={this.handleVerticalChange}
                />,
                <Switch
                    checked={this.state.iconOnly}
                    key="icon"
                    label="Icons only"
                    onChange={this.handleIconOnlyChange}
                />,
            ],
            [<AlignmentSelect key="align" align={this.state.alignText} onChange={this.handleAlignChange} />],
        ];
    }

    private handleAlignChange = (alignText: Alignment) => this.setState({ alignText });
}
