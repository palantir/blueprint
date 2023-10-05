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
import { DISPLAYNAME_PREFIX, HTMLInputProps } from "../../common/props";
import { ControlProps, Switch } from "../forms/controls";
import { Card, CardProps } from "../card/card";

/**
 * Subset of {@link Card} which can be used to adjust its behavior.
 */
type SupportedCardProps = Omit<CardProps, "interactive" | "onChange">;

/**
 * Subset of {@link ControlProps} which can be used to adjust its behavior.
 */
type SupportedControlProps = Pick<ControlProps, "checked" | "defaultChecked" | "disabled" | "inputRef" | "onChange">;

export interface ControlCardProps extends SupportedCardProps, SupportedControlProps {
    /**
     * Which kind of form control to render inside the card.
     */
    controlKind: "switch";

    // N.B. this is split out of the root properties in the inerface because it would conflict with CardProps' HTMLDivProps
    /**
     * HTML input attributes to forward to the control `<input>` element.
     */
    inputProps?: HTMLInputProps;
}

/**
 * ControlCard component, used to render a {@link Card} with a form control.
 *
 * @internal
 */
export const ControlCard: React.FC<ControlCardProps> = React.forwardRef(props => {
    const {
        checked,
        children: controlLabel,
        className,
        controlKind,
        defaultChecked,
        disabled,
        inputProps,
        inputRef,
        ...cardProps
    } = props;

    const classes = classNames(Classes.CONTROL_CARD, className, {
        [Classes.SWITCH_CONTROL_CARD]: controlKind === "switch",
    });

    const controlProps: ControlProps = {
        checked,
        defaultChecked,
        disabled,
        inputRef,
        labelElement: controlLabel,
        ...inputProps,
    };

    return (
        <Card interactive={!disabled} className={classes} {...cardProps}>
            {controlKind === "switch" ? (
                <Switch inline={true} alignIndicator="right" {...controlProps} />
            ) : (
                controlLabel
            )}
        </Card>
    );
});
ControlCard.defaultProps = {};
ControlCard.displayName = `${DISPLAYNAME_PREFIX}.ControlCard`;
