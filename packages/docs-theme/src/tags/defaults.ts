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

import { ITag } from "@documentalist/client";
import React from "react";

import { CssExample } from "./css";
import { Heading } from "./heading";
import { Method } from "./method";
import { SeeTag } from "./see";
import { TypescriptExample } from "./typescript";

export function createDefaultRenderers(): Record<string, React.ComponentType<ITag>> {
    return {
        css: CssExample,
        // HACKHACK https://github.com/palantir/blueprint/issues/4342
        heading: Heading as React.ComponentType<ITag>,
        interface: TypescriptExample,
        method: Method,
        page: () => null,
        see: SeeTag,
    };
}
