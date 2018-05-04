/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Icon, Switch, Tag, TagGroup } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange } from "@blueprintjs/docs-theme";

export interface ITagGroupExampleState {
    large: boolean;
    round: boolean;
}

export class TagGroupExample extends BaseExample<ITagGroupExampleState> {
    public state: ITagGroupExampleState = {
        large: false,
        round: false,
    };

    protected className = "docs-tag-group-example";

    private handleLargeChange = handleBooleanChange(large => this.setState({ large }));
    private handleRoundChange = handleBooleanChange(round => this.setState({ round }));

    protected renderExample() {
        const { large, round } = this.state;

        return (
            <div style={{ height: 40 }}>
                <TagGroup large={large} round={round}>
                    <Tag>
                        <Icon icon="git-branch" />
                        develop
                        <Icon icon="caret-down" />
                    </Tag>
                    <Tag>
                        <Icon icon="small-cross" />
                    </Tag>
                </TagGroup>
            </div>
        );
    }

    protected renderOptions() {
        const { large, round } = this.state;

        return [
            [
                <Switch key="large" label="Large" checked={large} onChange={this.handleLargeChange} />,
                <Switch key="round" label="Round" checked={round} onChange={this.handleRoundChange} />,
            ],
        ];
    }
}
