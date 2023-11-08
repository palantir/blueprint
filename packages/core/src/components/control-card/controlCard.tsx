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
import { DISPLAYNAME_PREFIX, type HTMLInputProps } from "../../common/props";
import { Card, type CardProps } from "../card/card";
import type { CheckedControlProps, ControlProps } from "../forms/controlProps";
import { Checkbox, Switch } from "../forms/controls";
import { useCheckedControl } from "./useCheckedControl";

export type ControlKind = "switch" | "checkbox";

/**
 * Subset of {@link Card} which can be used to adjust its behavior.
 */
type SupportedCardProps = Omit<CardProps, "interactive" | "onChange">;

/**
 * Subset of {@link ControlProps} which can be used to adjust its behavior.
 */
type SupportedControlProps = Pick<ControlProps, keyof CheckedControlProps | "alignIndicator" | "disabled" | "inputRef">;

export interface ControlCardProps extends SupportedCardProps, SupportedControlProps {
    /**
     * Which kind of form control to render inside the card.
     */
    controlKind: ControlKind;

    // N.B. this is split out of the root properties in the inerface because it would conflict with CardProps' HTMLDivProps
    /**
     * HTML input attributes to forward to the control `<input>` element.
     */
    inputProps?: HTMLInputProps;

    /**
     * Whether the component should use "selected" Card styling when checked.
     *
     * @default true
     */
    showAsSelectedWhenChecked?: boolean;
}

/**
 * ControlCard component, used to render a {@link Card} with a form control.
 *
 * @internal
 */

export const ControlCard: React.FC<ControlCardProps> = React.forwardRef((props, ref) => {
    const {
        alignIndicator,
        checked: _checked,
        children: labelContent,
        className,
        controlKind,
        defaultChecked: _defaultChecked,
        disabled,
        inputProps,
        inputRef,
        onChange: _onChange,
        showAsSelectedWhenChecked,
        ...cardProps
    } = props;

    const { checked, onChange } = useCheckedControl(props);

    // use a container element to achieve a good flex layout
    const labelElement = <div className={Classes.CONTROL_CARD_LABEL}>{labelContent}</div>;
    const controlProps: ControlProps = {
        alignIndicator,
        checked,
        disabled,
        inline: true,
        inputRef,
        labelElement,
        onChange,
        ...inputProps,
    };
    const classes = classNames(Classes.CONTROL_CARD, className, {
        [Classes.SELECTED]: showAsSelectedWhenChecked && checked,
    });

    return (
        <Card interactive={!disabled} className={classes} ref={ref} {...cardProps}>
            {controlKind === "switch" ? (
                <Switch {...controlProps} />
            ) : controlKind === "checkbox" ? (
                <Checkbox {...controlProps} />
            ) : (
                props.children
            )}
        </Card>
    );
});
ControlCard.defaultProps = {
    alignIndicator: "right",
    showAsSelectedWhenChecked: true,
};
ControlCard.displayName = `${DISPLAYNAME_PREFIX}.ControlCard`;
