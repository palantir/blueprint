/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, Intent, Switch, Tag } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange, handleStringChange } from "@blueprintjs/docs-theme";
import { IntentSelect } from "./common/intentSelect";

export interface ITagExampleState {
    intent: Intent;
    interactive: boolean;
    large: boolean;
    minimal: boolean;
    removable: boolean;
    tags: string[];
}

export class TagExample extends BaseExample<ITagExampleState> {
    public state: ITagExampleState = {
        intent: Intent.NONE,
        interactive: false,
        large: false,
        minimal: false,
        removable: false,
        tags: INITIAL_TAGS,
    };

    protected className = "docs-tag-example";

    private handleIntentChange = handleStringChange((intent: Intent) => this.setState({ intent }));
    private handleLargeChange = handleBooleanChange(large => this.setState({ large }));
    private handleMinimalChange = handleBooleanChange(minimal => this.setState({ minimal }));
    private handleRemovableChange = handleBooleanChange(removable => this.setState({ removable }));
    private handleInteractiveChange = handleBooleanChange(interactive => this.setState({ interactive }));

    protected renderExample() {
        const { removable, ...tagProps } = this.state;
        const tags = this.state.tags.map(tag => {
            const onRemove = () => this.setState({ tags: this.state.tags.filter(t => t !== tag) });
            return (
                <Tag key={tag} onRemove={removable && onRemove} {...tagProps}>
                    {tag}
                </Tag>
            );
        });
        return <div>{tags}</div>;
    }

    protected renderOptions() {
        const { intent, interactive, large, minimal, removable } = this.state;
        return [
            [
                <Switch key="large" label="Large" checked={large} onChange={this.handleLargeChange} />,
                <Switch key="minimal" label="Minimal" checked={minimal} onChange={this.handleMinimalChange} />,
                <Switch key="removable" label="Removable" checked={removable} onChange={this.handleRemovableChange} />,
                <Switch
                    key="interactive"
                    label="Interactive"
                    checked={interactive}
                    onChange={this.handleInteractiveChange}
                />,
            ],
            [<IntentSelect key="intent" intent={intent} onChange={this.handleIntentChange} />],
            [<Button key="reset" text="Reset tags" onClick={this.resetTags} />],
        ];
    }

    private resetTags = () => this.setState({ tags: INITIAL_TAGS });
}

const INITIAL_TAGS = ["@jkillian", "@adahiya", "@ggray", "@allorca", "@bdwyer", "@piotrk"];
