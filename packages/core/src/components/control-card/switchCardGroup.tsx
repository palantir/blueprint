/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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
import { Children, cloneElement, useMemo } from "react";

import { Classes, DISPLAYNAME_PREFIX, type HTMLDivProps, type Props, removeNonHTMLProps } from "../../common";
import { isElementOfType, uniqueId } from "../../common/utils";

import { SwitchCard, type SwitchCardProps } from "./switchCard";

export interface SwitchCardGroupProps extends Props, HTMLDivProps {
    /**
     * SwitchCard elements to render in the group.
     */
    children?: React.ReactNode;

    /**
     * Whether the group and _all_ its switch cards are disabled.
     * Individual switch cards can be disabled using their `disabled` prop.
     */
    disabled?: boolean;

    /**
     * Whether the switch cards are to be displayed inline (horizontally).
     *
     * @default false
     */
    inline?: boolean;

    /** Optional label text to display above the switch cards. */
    label?: React.ReactNode;
}

/**
 * Switch card group component, used to lay out a group of SwitchCard components.
 *
 * @see https://blueprintjs.com/docs/#core/components/control-card.switch-card-group
 */
export const SwitchCardGroup: React.FC<SwitchCardGroupProps> = props => {
    const { children, className, disabled, inline, label, ...htmlProps } = props;

    const labelId = useMemo(() => uniqueId("label"), []);

    const renderChildren = () => {
        if (disabled == null) {
            return children;
        }

        return Children.map(children, child => {
            if (isElementOfType(child, SwitchCard)) {
                return cloneElement(child as React.ReactElement<SwitchCardProps>, {
                    disabled: (child.props as SwitchCardProps).disabled || disabled,
                });
            }
            return child;
        });
    };

    return (
        <div
            role="group"
            aria-labelledby={label ? labelId : undefined}
            {...removeNonHTMLProps(htmlProps)}
            className={classNames(Classes.CONTROL_CARD_GROUP, { [Classes.INLINE]: inline }, className)}
        >
            {label && (
                <label className={Classes.LABEL} id={labelId}>
                    {label}
                </label>
            )}
            {renderChildren()}
        </div>
    );
};

SwitchCardGroup.displayName = `${DISPLAYNAME_PREFIX}.SwitchCardGroup`;
