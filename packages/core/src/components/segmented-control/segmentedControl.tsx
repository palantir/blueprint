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

import { Classes, Intent } from "../../common";
import {
    DISPLAYNAME_PREFIX,
    type HTMLDivProps,
    type OptionProps,
    type Props,
    removeNonHTMLProps,
} from "../../common/props";
import { Button } from "../button/buttons";

export type SegmentedControlIntent = typeof Intent.NONE | typeof Intent.PRIMARY;

/**
 * SegmentedControl component props.
 */
export interface SegmentedControlProps
    extends Props,
        Omit<HTMLDivProps, "onChange">,
        React.RefAttributes<HTMLDivElement> {
    defaultValue?: string;
    intent?: SegmentedControlIntent;
    onChange?: (value: string) => void;
    options: Array<OptionProps<string>>;
    value?: string;
}

/**
 * Segmented control component.
 *
 * @see https://blueprintjs.com/docs/#core/components/segmented-control
 */
export const SegmentedControl: React.FC<SegmentedControlProps> = React.forwardRef((props, ref) => {
    const { className, options, defaultValue, intent, onChange, value: controlledValue, ...htmlProps } = props;

    const [localValue, setLocalValue] = React.useState<string | undefined>(defaultValue);
    const selectedValue = controlledValue ?? localValue;

    const handleOptionClick = React.useCallback(
        (newSelectedValue: string) => {
            setLocalValue(newSelectedValue);
            onChange?.(newSelectedValue);
        },
        [onChange],
    );

    return (
        <div className={classNames(Classes.SEGMENTED_CONTROL, className)} ref={ref} {...removeNonHTMLProps(htmlProps)}>
            {options.map(option => (
                <SegmentedControlOption
                    {...option}
                    intent={intent}
                    isSelected={selectedValue === option.value}
                    key={option.value}
                    onClick={handleOptionClick}
                />
            ))}
        </div>
    );
});
SegmentedControl.defaultProps = {
    defaultValue: undefined,
    intent: Intent.NONE,
};
SegmentedControl.displayName = `${DISPLAYNAME_PREFIX}.SegmentedControl`;

interface SegmentedControlOptionProps extends OptionProps<string>, Pick<SegmentedControlProps, "intent"> {
    isSelected: boolean;
    onClick: (value: string) => void;
}

function SegmentedControlOption({ intent, isSelected, label, onClick, value }: SegmentedControlOptionProps) {
    const handleClick = React.useCallback(() => onClick?.(value), [onClick, value]);

    return (
        <Button onClick={handleClick} intent={isSelected ? intent : Intent.NONE} minimal={!isSelected} small={true}>
            {label}
        </Button>
    );
}
SegmentedControlOption.displayName = `${DISPLAYNAME_PREFIX}.SegmentedControlOption`;
