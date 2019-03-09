/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, H5, Intent, Switch, Tag } from "@blueprintjs/core";
import { Example, handleBooleanChange, handleStringChange, IExampleProps } from "@blueprintjs/docs-theme";
import { IntentSelect } from "./common/intentSelect";

export interface ITagExampleState {
    fill: boolean;
    icon: boolean;
    intent: Intent;
    interactive: boolean;
    large: boolean;
    minimal: boolean;
    removable: boolean;
    rightIcon: boolean;
    round: boolean;
    tags: string[];
}

export class TagExample extends React.PureComponent<IExampleProps, ITagExampleState> {
    public state: ITagExampleState = {
        fill: false,
        icon: false,
        intent: Intent.NONE,
        interactive: false,
        large: false,
        minimal: false,
        removable: false,
        rightIcon: false,
        round: false,
        tags: INITIAL_TAGS,
    };

    private handleFillChange = handleBooleanChange(fill => this.setState({ fill }));
    private handleIconChange = handleBooleanChange(icon => this.setState({ icon }));
    private handleIntentChange = handleStringChange((intent: Intent) => this.setState({ intent }));
    private handleInteractiveChange = handleBooleanChange(interactive => this.setState({ interactive }));
    private handleLargeChange = handleBooleanChange(large => this.setState({ large }));
    private handleMinimalChange = handleBooleanChange(minimal => this.setState({ minimal }));
    private handleRemovableChange = handleBooleanChange(removable => this.setState({ removable }));
    private handleRightIconChange = handleBooleanChange(rightIcon => this.setState({ rightIcon }));
    private handleRoundChange = handleBooleanChange(round => this.setState({ round }));

    public render() {
        const { icon, removable, rightIcon, tags, ...tagProps } = this.state;
        const tagElements = tags.map(tag => {
            const onRemove = () => this.setState({ tags: this.state.tags.filter(t => t !== tag) });
            return (
                <Tag
                    key={tag}
                    onRemove={removable && onRemove}
                    icon={icon === true ? "home" : undefined}
                    rightIcon={rightIcon === true ? "map" : undefined}
                    {...tagProps}
                >
                    {tag}
                </Tag>
            );
        });
        return (
            <Example options={this.renderOptions()} {...this.props}>
                {tagElements}
            </Example>
        );
    }

    private renderOptions() {
        const { fill, icon, intent, interactive, large, minimal, removable, rightIcon, round } = this.state;
        return (
            <>
                <H5>Props</H5>
                <Switch label="Fill" checked={fill} onChange={this.handleFillChange} />
                <Switch label="Large" checked={large} onChange={this.handleLargeChange} />
                <Switch label="Minimal" checked={minimal} onChange={this.handleMinimalChange} />
                <Switch label="Interactive" checked={interactive} onChange={this.handleInteractiveChange} />
                <Switch label="Removable" checked={removable} onChange={this.handleRemovableChange} />
                <Switch label="Round" checked={round} onChange={this.handleRoundChange} />
                <Switch label="Left icon" checked={icon} onChange={this.handleIconChange} />
                <Switch label="Right icon" checked={rightIcon} onChange={this.handleRightIconChange} />
                <IntentSelect intent={intent} onChange={this.handleIntentChange} />
                <H5>Example</H5>
                <Button icon="refresh" text="Reset tags" onClick={this.resetTags} />
            </>
        );
    }

    private resetTags = () => this.setState({ tags: INITIAL_TAGS });
}

const INITIAL_TAGS = ["London", "New York", "San Francisco", "Seattle"];
