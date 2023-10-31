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

import classNames from "classnames";
import * as React from "react";

import { Classes } from "../../common";
import { DISPLAYNAME_PREFIX } from "../../common/props";
import { ControlCard, type ControlCardProps } from "./controlCard";

export type SwitchCardProps = Omit<ControlCardProps, "controlKind">;

/**
 * Switch Card component.
 *
 * @see https://blueprintjs.com/docs/#core/components/control-card.switch-card
 */
export const SwitchCard: React.FC<SwitchCardProps> = React.forwardRef((props, ref) => {
    const className = classNames(props.className, Classes.SWITCH_CONTROL_CARD);
    return <ControlCard {...props} className={className} controlKind="switch" ref={ref} />;
});
SwitchCard.displayName = `${DISPLAYNAME_PREFIX}.SwitchCard`;
