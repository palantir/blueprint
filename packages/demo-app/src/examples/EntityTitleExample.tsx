/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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

import { Classes, EntityTitle, H4, Intent, Tag, UL } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { ExampleCard } from "./ExampleCard";

export function EntityTitleExample() {
    return (
        <ExampleCard label="Entity title">
            <UL className={Classes.LIST_UNSTYLED}>
                <li>
                    <EntityTitle icon={IconNames.ADD} title="Title" />
                </li>
                <li>
                    <EntityTitle heading={H4} icon={IconNames.ADD} title="With heading" />
                </li>
                <li>
                    <EntityTitle icon={IconNames.ADD} title="Title" subtitle="With subtitle" />
                </li>
                <li>
                    <EntityTitle
                        ellipsize={true}
                        icon={IconNames.ADD}
                        title="A somewhat longer title"
                        subtitle="With subtitle"
                    />
                </li>
            </UL>
            <div>
                <EntityTitle
                    icon={IconNames.CITATION}
                    fill={true}
                    title="Id"
                    tags={[
                        <Tag key="1" icon={IconNames.KEY} intent={Intent.SUCCESS} minimal={true}>
                            Primary key
                        </Tag>,
                        <Tag key="2" minimal={true}>
                            1
                        </Tag>,
                    ]}
                />
                <EntityTitle
                    icon={IconNames.CITATION}
                    fill={true}
                    title="Title"
                    tags={[
                        <Tag key="1" minimal={true}>
                            Title
                        </Tag>,
                        <Tag key="2" minimal={true}>
                            2
                        </Tag>,
                    ]}
                />
                <EntityTitle
                    icon={IconNames.ARRAY_STRING}
                    fill={true}
                    title="Tags"
                    tags={
                        <Tag key="1" minimal={true}>
                            3
                        </Tag>
                    }
                />
            </div>
        </ExampleCard>
    );
}
