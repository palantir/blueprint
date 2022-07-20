/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
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

import { Code } from "@blueprintjs/core";
import { Tooltip2, Tooltip2Props } from "@blueprintjs/popover2";

/**
 * Opinionated subset of tooltip props.
 * Specify content or snippet, but not both.
 */
export interface PropCodeTooltipProps
    extends Omit<Tooltip2Props, "content" | "snippet" | "placement" | "interactionKind"> {
    content?: JSX.Element;
    snippet?: string;
}

/**
 * An explanatory tooltip for a component prop control rendered inside the options
 * of a @blueprintjs/docs-theme `<Example>`. This component will render its provided `props.snippet`
 * inside a `<Code>` element as the tooltip content.
 */
export const PropCodeTooltip: React.FC<PropCodeTooltipProps> = ({ snippet, ...props }) => {
    return <Tooltip2 content={<Code>{snippet}</Code>} {...props} placement="left" interactionKind="hover" />;
};
