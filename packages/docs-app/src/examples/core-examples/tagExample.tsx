/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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

import { Button, H5, Intent, Switch, Tag } from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

import { IntentSelect } from "./common/intentSelect";

const INITIAL_TAGS = ["London", "New York", "San Francisco", "Seattle"];

export const TagExample: React.FC<ExampleProps> = props => {
    const [active, setActive] = React.useState(false);
    const [fill, setFill] = React.useState(false);
    const [icon, setIcon] = React.useState(false);
    const [intent, setIntent] = React.useState<Intent>(Intent.NONE);
    const [interactive, setInteractive] = React.useState(false);
    const [large, setLarge] = React.useState(false);
    const [minimal, setMinimal] = React.useState(false);
    const [removable, setRemovable] = React.useState(false);
    const [rightIcon, setRightIcon] = React.useState(false);
    const [round, setRound] = React.useState(false);
    const [tags, setTags] = React.useState(INITIAL_TAGS);

    const handleRemove = React.useCallback((tag: string) => () => setTags(tags.filter(t => t !== tag)), [tags]);

    const handleReset = React.useCallback(() => setTags(INITIAL_TAGS), []);

    const options = (
        <>
            <H5>Props</H5>
            <Switch label="Active" checked={active} onChange={handleBooleanChange(setActive)} />
            <Switch label="Fill" checked={fill} onChange={handleBooleanChange(setFill)} />
            <Switch label="Large" checked={large} onChange={handleBooleanChange(setLarge)} />
            <Switch label="Minimal" checked={minimal} onChange={handleBooleanChange(setMinimal)} />
            <Switch label="Interactive" checked={interactive} onChange={handleBooleanChange(setInteractive)} />
            <Switch label="Removable" checked={removable} onChange={handleBooleanChange(setRemovable)} />
            <Switch label="Round" checked={round} onChange={handleBooleanChange(setRound)} />
            <Switch label="Left icon" checked={icon} onChange={handleBooleanChange(setIcon)} />
            <Switch label="Right icon" checked={rightIcon} onChange={handleBooleanChange(setRightIcon)} />
            <IntentSelect intent={intent} onChange={setIntent} />
            <H5>Example</H5>
            <Button icon="refresh" text="Reset tags" onClick={handleReset} />
        </>
    );

    return (
        <Example options={options} {...props}>
            {tags.map(tag => (
                <Tag
                    key={tag}
                    active={active}
                    fill={fill}
                    icon={icon ? "home" : undefined}
                    intent={intent}
                    interactive={interactive}
                    large={large}
                    minimal={minimal}
                    onRemove={removable ? handleRemove(tag) : undefined}
                    rightIcon={rightIcon ? "map" : undefined}
                    round={round}
                >
                    {tag}
                </Tag>
            ))}
        </Example>
    );
};
