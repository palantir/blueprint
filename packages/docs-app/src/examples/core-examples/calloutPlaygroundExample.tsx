/*
 * Copyright 2024 Palantir Technologies, Inc. All rights reserved.
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

export const CalloutPlaygroundExample: React.FC<DocsExampleProps> = props => {
    const [compact, setCompact] = React.useState(false);
    const [contentIndex, setContentIndex] = React.useState(0);
    const [icon, setIcon] = React.useState<IconName>();
    const [intent, setIntent] = React.useState<Intent>();
    const [minimal, setMinimal] = React.useState(false);
    const [showTitle, setShowTitle] = React.useState(true);

    const options = (
        <>
            <H5>Props</H5>
            <Switch checked={showTitle} label="Title" onChange={handleBooleanChange(setShowTitle)} />
            <Switch checked={compact} label="Compact" onChange={handleBooleanChange(setCompact)} />
            <Switch checked={minimal} label="Minimal" onChange={handleBooleanChange(setMinimal)} />
            <IntentSelect intent={intent} onChange={setIntent} showClearButton={true} />
            <IconSelect iconName={icon} onChange={setIcon} />
            <H5>Children</H5>
            <Label>
                Example content
                <HTMLSelect value={contentIndex} onChange={handleNumberChange(setContentIndex)}>
                    {EXAMPLE_CONTENT_OPTIONS.map((opt, i) => (
                        <option key={i} value={i}>
                            {opt.label}
                        </option>
                    ))}
                </HTMLSelect>
            </Label>
        </>
    );

    return (
        <Example options={options} {...props}>
            <Callout
                compact={compact}
                icon={icon}
                intent={intent}
                minimal={minimal}
                title={showTitle ? "Title" : undefined}
            >
                {EXAMPLE_CONTENT_OPTIONS[contentIndex].content}
            </Callout>
        </Example>
    );
};

const EXAMPLE_CONTENT_OPTIONS = [
    {
        content: (
            <React.Fragment>
                Long-form information about the important content. This text is styled as{" "}
                <a href="#core/typography.running-text">"Running text"</a>, so it may contain things like headers,
                links, lists, <Code>code</Code> etc.
            </React.Fragment>
        ),
        label: "Text with formatting",
    },
    { content: "Long-form information about the important content", label: "Simple text string" },
    { content: <Button text="Example button" intent="primary" />, label: "Button" },
    { content: undefined, label: "Empty" },
];
