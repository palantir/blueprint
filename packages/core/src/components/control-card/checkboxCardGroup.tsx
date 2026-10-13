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

import { CheckboxCard, type CheckboxCardProps } from "./checkboxCard";

export interface CheckboxCardGroupProps extends Props, HTMLDivProps {
    /**
     * CheckboxCard elements to render in the group.
     */
    children?: React.ReactNode;

    /**
     * Whether the group and _all_ its checkbox cards are disabled.
     * Individual checkbox cards can be disabled using their `disabled` prop.
     */
    disabled?: boolean;

    /**
     * Whether the checkbox cards are to be displayed inline (horizontally).
     *
     * @default false
     */
    inline?: boolean;

    /** Optional label text to display above the checkbox cards. */
    label?: React.ReactNode;
}

/**
 * Checkbox card group component, used to lay out a group of CheckboxCard components.
 *
 * @see https://blueprintjs.com/docs/#core/components/control-card.checkbox-card-group
 */
export const CheckboxCardGroup: React.FC<CheckboxCardGroupProps> = props => {
    const { children, className, disabled, inline, label, ...htmlProps } = props;

    const labelId = useMemo(() => uniqueId("label"), []);

    const renderChildren = () => {
        if (disabled == null) {
            return children;
        }

        return Children.map(children, child => {
            if (isElementOfType(child, CheckboxCard)) {
                return cloneElement(child as React.ReactElement<CheckboxCardProps>, {
                    disabled: (child.props as CheckboxCardProps).disabled || disabled,
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

CheckboxCardGroup.displayName = `${DISPLAYNAME_PREFIX}.CheckboxCardGroup`;
