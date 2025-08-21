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

import { Button, Divider, H5, Intent, Switch, TagInput, type TagProps } from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

import { IntentSelect } from "./common/intentSelect";

const INTENTS = [Intent.NONE, Intent.PRIMARY, Intent.SUCCESS, Intent.DANGER, Intent.WARNING];

const VALUES = [
    // supports single JSX elements
    <strong key="al">Albert</strong>,
    // supports JSX "fragments" (don't forget `key` on elements in arrays!)
    ["Bar", <em key="thol">thol</em>, "omew"],
    // and supports simple strings
    "Casper",
    // falsy values are not rendered and ignored by the keyboard
    undefined,
];

export const TagInputExample: React.FC<ExampleProps> = props => {
    const [addOnBlur, setAddOnBlur] = useState(false);
    const [addOnPaste, setAddOnPaste] = useState(true);
    const [autoResize, setAutoResize] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [fill, setFill] = useState(false);
    const [intent, setIntent] = useState<Intent>(Intent.NONE);
    const [large, setLarge] = useState(false);
    const [leftIcon, setLeftIcon] = useState(true);
    const [tagIntents, setTagIntents] = useState(false);
    const [tagMinimal, setTagMinimal] = useState(false);
    const [values, setValues] = useState<React.ReactNode[]>(VALUES);

    const handleClear = useCallback(() => {
        setValues(values.length > 0 ? [] : VALUES);
    }, [values]);

    // define a new function every time so switch changes will cause it to re-render
    // NOTE: avoid this pattern in your app (use this.getTagProps instead); this is only for
    // example purposes!!
    const getTagProps = useCallback(
        (_v: React.ReactNode, index: number): TagProps => ({
            intent: tagIntents ? INTENTS[index % INTENTS.length] : Intent.NONE,
            minimal: tagMinimal,
            size: large ? "large" : undefined,
        }),
        [tagIntents, large, tagMinimal],
    );

    const options = (
        <>
            <H5>Appearance props</H5>
            <Switch label="Large" checked={large} onChange={handleBooleanChange(setLarge)} />
            <Switch
                label="Disabled"
                checked={disabled}
                onChange={handleBooleanChange(setDisabled)}
            />
            <Switch
                label="Left icon"
                checked={leftIcon}
                onChange={handleBooleanChange(setLeftIcon)}
            />
            <Switch
                label="Fill container width"
                checked={fill}
                onChange={handleBooleanChange(setFill)}
            />
            <Divider />
            <IntentSelect intent={intent} onChange={setIntent} />
            <H5>Behavior props</H5>
            <Switch
                label="Add on blur"
                checked={addOnBlur}
                onChange={handleBooleanChange(setAddOnBlur)}
            />
            <Switch
                label="Add on paste"
                checked={addOnPaste}
                onChange={handleBooleanChange(setAddOnPaste)}
            />
            <Switch
                label="Auto resize"
                checked={autoResize}
                onChange={handleBooleanChange(setAutoResize)}
            />
            <H5>Tag props</H5>
            <Switch
                label="Use minimal tags"
                checked={tagMinimal}
                onChange={handleBooleanChange(setTagMinimal)}
            />
            <Switch
                label="Cycle through intents"
                checked={tagIntents}
                onChange={handleBooleanChange(setTagIntents)}
            />
        </>
    );

    return (
        <Example options={options} {...props}>
            <TagInput
                addOnBlur={addOnBlur}
                addOnPaste={addOnPaste}
                autoResize={autoResize}
                disabled={disabled}
                fill={fill}
                intent={intent}
                leftIcon={leftIcon ? "user" : undefined}
                onChange={setValues}
                placeholder="Separate values with commas..."
                rightElement={
                    <Button
                        disabled={disabled}
                        icon={values.length > 1 ? "cross" : "refresh"}
                        onClick={handleClear}
                        variant="minimal"
                    />
                }
                size={large ? "large" : undefined}
                tagProps={getTagProps}
                values={values}
            />
        </Example>
    );
};
