/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import { Button, Callout, Code, H5, HTMLSelect, type Intent, Label, Switch } from "@blueprintjs/core";
import { type DocsExampleProps, Example, handleBooleanChange, handleNumberChange } from "@blueprintjs/docs-theme";
import type { IconName } from "@blueprintjs/icons";

import { IconSelect } from "./common/iconSelect";
import { IntentSelect } from "./common/intentSelect";

export const CalloutExample: React.FC<DocsExampleProps> = props => {
    const [compact, setCompact] = React.useState(false);
    const [contentIndex, setContentIndex] = React.useState(0);
    const [showTitle, setShowTitle] = React.useState(true);
    const [icon, setIcon] = React.useState<IconName>();
    const [intent, setIntent] = React.useState<Intent>();
    const [isRightElementVisible, setIsRightElementVisible] = React.useState(false);

    /* eslint-disable react/jsx-key */
    const children = [
        <React.Fragment>
            Long-form information about the important content. This text is styled as{" "}
            <a href="#core/typography.running-text">"Running text"</a>, so it may contain things like headers, links,
            lists, <Code>code</Code> etc.
        </React.Fragment>,
        "Long-form information about the important content",
        <Button text="Example button" intent="primary" />,
        undefined,
    ][contentIndex];
    /* eslint-enable react/jsx-key */

    const options = (
        <>
            <H5>Props</H5>
            <Switch checked={showTitle} label="Title" onChange={handleBooleanChange(setShowTitle)} />
            <Switch checked={compact} label="Compact" onChange={handleBooleanChange(setCompact)} />
            <Switch
                checked={isRightElementVisible}
                label="Right element"
                onChange={handleBooleanChange(setIsRightElementVisible)}
            />
            <IntentSelect intent={intent} onChange={setIntent} showClearButton={true} />
            <IconSelect iconName={icon} onChange={setIcon} />
            <H5>Children</H5>
            <Label>
                Example content
                <HTMLSelect value={contentIndex} onChange={handleNumberChange(setContentIndex)}>
                    <option value={0}>Text with formatting</option>
                    <option value={1}>Simple text string</option>
                    <option value={2}>Button</option>
                    <option value={3}>Empty</option>
                </HTMLSelect>
            </Label>
        </>
    );

    return (
        <Example options={options} {...props}>
            <Callout
                {...{ compact, intent, icon }}
                rightElement={isRightElementVisible ? <Button text="Button" /> : undefined}
                title={showTitle ? "Visually important content" : undefined}
            >
                {children}
            </Callout>
        </Example>
    );
};
