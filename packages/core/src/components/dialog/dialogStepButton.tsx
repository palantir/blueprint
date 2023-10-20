/*
 * Copyright 2020 Palantir Technologies, Inc. All rights reserved.
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

import type { ButtonSharedPropsAndAttributes } from "../button/buttonProps";
import { AnchorButton } from "../button/buttons";
import { Tooltip, type TooltipProps } from "../tooltip/tooltip";

export type DialogStepButtonProps = Partial<ButtonSharedPropsAndAttributes> & {
    /** If defined, the button will be wrapped with a tooltip with the specified content. */
    tooltipContent?: TooltipProps["content"];
};

export function DialogStepButton({ tooltipContent, ...props }: DialogStepButtonProps) {
    const button = <AnchorButton {...props} />;

    if (tooltipContent !== undefined) {
        return <Tooltip content={tooltipContent}>{button}</Tooltip>;
    } else {
        return button;
    }
}
