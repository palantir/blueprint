/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
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

import { Button, NonIdealState } from "@blueprintjs/core";

import { ExampleCard } from "./ExampleCard";

export function NonIdealStateExample() {
    const description = (
        <div>
            Your search didn't match any files.
            <br />
            Try searching for something else, or create a new file.
        </div>
    );

    return (
        <ExampleCard label="NonIdealState">
            <NonIdealState
                title="No search results"
                icon="search"
                description={description}
                action={<Button text="New file" icon="plus" outlined={true} intent="primary" />}
            />
        </ExampleCard>
    );
}
