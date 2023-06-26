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

import { Alignment, Classes } from "../../common";
import { DISPLAYNAME_PREFIX, Props } from "../../common/props";
import { Switch, SwitchProps } from "../forms/controls";
import { Card, CardProps } from "./card";

export interface SwitchCardProps extends Props, SwitchProps {
    cardProps?: CardProps;
}

/**
 * Switch Card component.
 *
 * @see https://blueprintjs.com/docs/#core/components/card#switch-card
 */
export const SwitchCard: React.FC<SwitchCardProps> = React.forwardRef(props => {
    const { className, cardProps, children, ...switchProps } = props;
    const classes = classNames(Classes.CARD_SWITCH, className);

    const isControlled = switchProps.checked != null;

    const handleChange = React.useCallback(
        evemt => {
            if (isControlled && switchProps.onChange != null) {
                switchProps?.onChange(evemt);
            }
        },
        [switchProps],
    );

    return (
        <Card interactive={isControlled} className={classes} onClick={handleChange} {...cardProps}>
            <Switch labelElement={children} inline={true} alignIndicator={Alignment.RIGHT} {...switchProps} />
        </Card>
    );
});
SwitchCard.defaultProps = {};
SwitchCard.displayName = `${DISPLAYNAME_PREFIX}.SwitchCard`;
