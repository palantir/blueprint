/* Copyright 2021 Palantir Technologies, Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.*/

import * as React from "react";

import { Intent, TagInput, TagProps } from "@blueprintjs/core";

import { ExampleCard } from "./ExampleCard";

const VALUES: React.ReactNode[] = ["Alice", "Brad", "Cece", "David", "Ernie"];

const INTENTS = Object.values(Intent);

export class TagInputExample extends React.PureComponent {
    private getDefaultTagProps = (_v: React.ReactNode, index: number): TagProps => ({
        intent: INTENTS[index % INTENTS.length],
    });

    private getMinimalTagProps = (_v: React.ReactNode, index: number): TagProps => ({
        intent: INTENTS[index % INTENTS.length],
        minimal: true,
    });

    public render() {
        return (
            <div className="example-row">
                <ExampleCard label="Tag input" subLabel="Default">
                    <div className="tag-input-container">
                        {INTENTS.map(intent => (
                            <TagInput
                                key={`${intent}-default-tag-input`}
                                intent={intent}
                                leftIcon="user"
                                placeholder="Separate values with commas..."
                                values={VALUES}
                                tagProps={this.getDefaultTagProps}
                            />
                        ))}
                    </div>
                </ExampleCard>
                <ExampleCard label="Tag input" subLabel="Minimal">
                    <div className="tag-input-container">
                        {INTENTS.map(intent => (
                            <TagInput
                                key={`${intent}-minimal-tag-input`}
                                intent={intent}
                                leftIcon="user"
                                placeholder="Separate values with commas..."
                                values={VALUES}
                                tagProps={this.getMinimalTagProps}
                            />
                        ))}
                    </div>
                </ExampleCard>
            </div>
        );
    }
}
