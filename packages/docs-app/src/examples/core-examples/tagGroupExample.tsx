/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

// import { Button, Intent, Switch, Tag, TagGroup } from "@blueprintjs/core";
import { Icon, Intent, Switch, Tag, TagGroup } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange } from "@blueprintjs/docs-theme";
// import { IntentSelect } from "./common/intentSelect";

export interface ITagGroupExampleState {
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

export class TagGroupExample extends BaseExample<ITagGroupExampleState> {
    public state: ITagGroupExampleState = {
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

    protected className = "docs-tag-group-example";

    // private handleIntentChange = handleStringChange((intent: Intent) => this.setState({ intent }));
    // private handleInteractiveChange = handleBooleanChange(interactive => this.setState({ interactive }));
    private handleLargeChange = handleBooleanChange(large => this.setState({ large }));
    // private handleMinimalChange = handleBooleanChange(minimal => this.setState({ minimal }));
    // private handleRemovableChange = handleBooleanChange(removable => this.setState({ removable }));
    // private handleRoundChange = handleBooleanChange(round => this.setState({ round }));

    protected renderExample() {
        const { large } = this.state;
        // const tags = this.state.tags.map(tag => {
        //     const onRemove = () => this.setState({ tags: this.state.tags.filter(t => t !== tag) });
        //     return (
        //         <Tag key={tag} {...tagProps}>
        //             {tag}
        //         </Tag>
        //     );
        // });
        // return <TagGroup>{tags}</TagGroup>;
        return (
            <TagGroup large={large}>
                <Tag>
                    <Icon icon="git-branch" />
                    develop
                    <Icon icon="caret-down" />
                </Tag>
                <Tag>
                    <Icon icon="small-cross" />
                </Tag>
            </TagGroup>
        );
    }

    protected renderOptions() {
        const { large } = this.state;
        return [[<Switch key="large" label="Large" checked={large} onChange={this.handleLargeChange} />]];
    }

    // protected renderOptions() {
    //     const { intent, interactive, large, minimal, removable, round } = this.state;
    //     return [
    //         [
    //             <Switch key="large" label="Large" checked={large} onChange={this.handleLargeChange} />,
    //             <Switch key="minimal" label="Minimal" checked={minimal} onChange={this.handleMinimalChange} />,
    //             <Switch key="round" label="Round" checked={round} onChange={this.handleRoundChange} />,
    //             <Switch
    //                 key="interactive"
    //                 label="Interactive"
    //                 checked={interactive}
    //                 onChange={this.handleInteractiveChange}
    //             />,
    //         ],
    //         [<Switch key="removable" label="Removable" checked={removable} onChange={this.handleRemovableChange} />],
    //         [
    //             <IntentSelect key="intent" intent={intent} onChange={this.handleIntentChange} />,
    //             <Button key="reset" text="Reset tags" onClick={this.resetTags} />,
    //         ],
    //     ];
    // }

    // private resetTags = () => this.setState({ tags: INITIAL_TAGS });
}

const INITIAL_TAGS = ["@jkillian", "@adahiya", "@ggray", "@allorca", "@bdwyer", "@piotrk"];
