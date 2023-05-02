/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

import classNames from "classnames";
import * as React from "react";

import { Classes, Intent, Text } from "@blueprintjs/core";

import { ExampleCard } from "./ExampleCard";

const WIDTH = 200;
export class TextExample extends React.PureComponent {
    public render() {
        return (
            <div className="example-row">
                <ExampleCard label="Text" width={WIDTH}>
                    <Text>Default</Text>
                    <Text className={Classes.TEXT_MUTED}>Muted</Text>
                    {Object.values(Intent).map(intent => (
                        <Text
                            key={`${intent}-text`}
                            className={classNames("text-example", Classes.intentClass(intent as Intent))}
                        >
                            {intent.charAt(0).toUpperCase() + intent.slice(1)}
                        </Text>
                    ))}
                </ExampleCard>
            </div>
        );
    }
}
