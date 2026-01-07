/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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

import { memo } from "react";

import { Button, Intent, Spinner, SpinnerSize, TextArea, Tooltip } from "@blueprintjs/core";

import { ExampleCard } from "./ExampleCard";

const WIDTH = 300;

export const TextAreaExample = memo(() => {
    return (
        <div className="example-row">
            <ExampleCard label="TextArea" subLabel="Default" width={WIDTH}>
                {Object.values(Intent).map(intent => (
                    <TextArea
                        key={`${intent}-textarea`}
                        fill={true}
                        intent={intent}
                        placeholder={`${intent.charAt(0).toUpperCase() + intent.slice(1)} textarea`}
                    />
                ))}
            </ExampleCard>
            <ExampleCard label="TextArea" subLabel="Disabled" width={WIDTH}>
                {Object.values(Intent).map(intent => (
                    <TextArea
                        disabled={true}
                        key={`${intent}-textarea-disabled`}
                        fill={true}
                        intent={intent}
                        placeholder={`(Disabled) ${intent.charAt(0).toUpperCase() + intent.slice(1)} textarea`}
                    />
                ))}
            </ExampleCard>
            <ExampleCard label="TextArea" subLabel="Right element (copy)" width={WIDTH}>
                {Object.values(Intent).map(intent => (
                    <TextArea
                        key={`${intent}-textarea-copy`}
                        fill={true}
                        intent={intent}
                        placeholder={`${intent.charAt(0).toUpperCase() + intent.slice(1)} textarea`}
                        leftElement={
                            <Tooltip content="Copy to clipboard">
                                <Button icon="duplicate" variant="minimal" />
                            </Tooltip>
                        }
                    />
                ))}
            </ExampleCard>
            <ExampleCard label="TextArea" subLabel="Loading" width={WIDTH}>
                {Object.values(Intent).map(intent => (
                    <TextArea
                        key={`${intent}-textarea-loading`}
                        fill={true}
                        intent={intent}
                        placeholder={`${intent.charAt(0).toUpperCase() + intent.slice(1)} textarea`}
                        rightElement={<Spinner size={SpinnerSize.SMALL} />}
                    />
                ))}
            </ExampleCard>
        </div>
    );
});

TextAreaExample.displayName = "DemoApp.TextAreaExample";
