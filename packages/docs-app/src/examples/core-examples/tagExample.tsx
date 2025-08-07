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

import { useCallback, useState } from "react";

import { Button, H5, Intent, Switch, Tag } from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

import { IntentSelect } from "./common/intentSelect";

const INITIAL_TAGS = ["London", "New York", "San Francisco", "Seattle"];

export const TagExample: React.FC<ExampleProps> = props => {
    const [active, setActive] = useState(false);
    const [fill, setFill] = useState(false);
    const [icon, setIcon] = useState(false);
    const [intent, setIntent] = useState<Intent>(Intent.NONE);
    const [interactive, setInteractive] = useState(false);
    const [large, setLarge] = useState(false);
    const [minimal, setMinimal] = useState(false);
    const [removable, setRemovable] = useState(false);
    const [endIcon, setEndIcon] = useState(false);
    const [round, setRound] = useState(false);
    const [tags, setTags] = useState(INITIAL_TAGS);

    const handleRemove = useCallback(
        (tag: string) => () => setTags(tags.filter(t => t !== tag)),
        [tags],
    );

    const handleReset = useCallback(() => setTags(INITIAL_TAGS), []);

    const options = (
        <>
            <H5>Props</H5>
            <Switch label="Active" checked={active} onChange={handleBooleanChange(setActive)} />
            <Switch label="Fill" checked={fill} onChange={handleBooleanChange(setFill)} />
            <Switch label="Large" checked={large} onChange={handleBooleanChange(setLarge)} />
            <Switch label="Minimal" checked={minimal} onChange={handleBooleanChange(setMinimal)} />
            <Switch
                label="Interactive"
                checked={interactive}
                onChange={handleBooleanChange(setInteractive)}
            />
            <Switch
                label="Removable"
                checked={removable}
                onChange={handleBooleanChange(setRemovable)}
            />
            <Switch label="Round" checked={round} onChange={handleBooleanChange(setRound)} />
            <Switch label="Start icon" checked={icon} onChange={handleBooleanChange(setIcon)} />
            <Switch label="End icon" checked={endIcon} onChange={handleBooleanChange(setEndIcon)} />
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
                    endIcon={endIcon ? "map" : undefined}
                    fill={fill}
                    icon={icon ? "home" : undefined}
                    intent={intent}
                    interactive={interactive}
                    minimal={minimal}
                    onRemove={removable ? handleRemove(tag) : undefined}
                    round={round}
                    size={large ? "large" : undefined}
                >
                    {tag}
                </Tag>
            ))}
        </Example>
    );
};
