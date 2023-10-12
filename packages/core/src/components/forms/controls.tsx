/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { Classes, mergeRefs } from "../../common";
import { DISPLAYNAME_PREFIX } from "../../common/props";
import type { ControlProps } from "./controlProps";

/** Internal props for Checkbox/Radio/Switch to render correctly. */
interface ControlInternalProps extends ControlProps {
    type: "checkbox" | "radio";
    typeClassName: string;
    indicatorChildren?: React.ReactNode;
}

/**
 * Renders common control elements, with additional props to customize appearance.
 * This component is not exported and is only used within this module for `Checkbox`, `Radio`, and `Switch` below.
 */
const ControlInternal: React.FC<ControlInternalProps> = React.forwardRef<HTMLLabelElement, ControlInternalProps>(
    (props, ref) => {
        const {
            alignIndicator,
            children,
            className,
            indicatorChildren,
            inline,
            inputRef,
            label,
            labelElement,
            large,
            style,
            type,
            typeClassName,
            tagName = "label",
            ...htmlProps
        } = props;
        const classes = classNames(
            Classes.CONTROL,
            typeClassName,
            {
                [Classes.DISABLED]: htmlProps.disabled,
                [Classes.INLINE]: inline,
                [Classes.LARGE]: large,
            },
            Classes.alignmentClass(alignIndicator),
            className,
        );

        return React.createElement(
            tagName,
            { className: classes, style, ref },
            <input {...htmlProps} ref={inputRef} type={type} />,
            <span className={Classes.CONTROL_INDICATOR}>{indicatorChildren}</span>,
            label,
            labelElement,
            children,
        );
    },
);
ControlInternal.displayName = `${DISPLAYNAME_PREFIX}.Control`;

//
// Switch
//

export interface SwitchProps extends ControlProps {
    /**
     * Text to display inside the switch indicator when checked.
     * If `innerLabel` is provided and this prop is omitted, then `innerLabel`
     * will be used for both states.
     *
     * @default innerLabel
     */
    innerLabelChecked?: string;

    /**
     * Text to display inside the switch indicator when unchecked.
     */
    innerLabel?: string;
}

/**
 * Switch component.
 *
 * @see https://blueprintjs.com/docs/#core/components/switch
 */
export const Switch: React.FC<SwitchProps> = React.forwardRef(
    ({ innerLabelChecked, innerLabel, ...controlProps }, ref) => {
        const switchLabels =
            innerLabel || innerLabelChecked
                ? [
                      <div key="checked" className={Classes.CONTROL_INDICATOR_CHILD}>
                          <div className={Classes.SWITCH_INNER_TEXT}>
                              {innerLabelChecked ? innerLabelChecked : innerLabel}
                          </div>
                      </div>,
                      <div key="unchecked" className={Classes.CONTROL_INDICATOR_CHILD}>
                          <div className={Classes.SWITCH_INNER_TEXT}>{innerLabel}</div>
                      </div>,
                  ]
                : null;
        return (
            <ControlInternal
                {...controlProps}
                indicatorChildren={switchLabels}
                ref={ref}
                type="checkbox"
                typeClassName={Classes.SWITCH}
            />
        );
    },
);
Switch.displayName = `${DISPLAYNAME_PREFIX}.Switch`;

//
// Radio
//

export type RadioProps = ControlProps;

/**
 * Radio component.
 *
 * @see https://blueprintjs.com/docs/#core/components/radio
 */
export const Radio: React.FC<RadioProps> = React.forwardRef((props, ref) => (
    <ControlInternal {...props} ref={ref} type="radio" typeClassName={Classes.RADIO} />
));
Radio.displayName = `${DISPLAYNAME_PREFIX}.Radio`;

//
// Checkbox
//

export interface CheckboxProps extends ControlProps {
    /** Whether this checkbox is initially indeterminate (uncontrolled mode). */
    defaultIndeterminate?: boolean;

    /**
     * Whether this checkbox is indeterminate, or "partially checked."
     * The checkbox will appear with a small dash instead of a tick to indicate that the value
     * is not exactly true or false.
     *
     * Note that this prop takes precendence over `checked`: if a checkbox is marked both
     * `checked` and `indeterminate` via props, it will appear as indeterminate in the DOM.
     */
    indeterminate?: boolean;
}

/**
 * Checkbox component.
 *
 * @see https://blueprintjs.com/docs/#core/components/checkbox
 */
export const Checkbox: React.FC<CheckboxProps> = React.forwardRef((props, ref) => {
    const { defaultIndeterminate, indeterminate, onChange, ...controlProps } = props;
    const [isIndeterminate, setIsIndeterminate] = React.useState<boolean>(
        indeterminate || defaultIndeterminate || false,
    );

    const localInputRef = React.useRef<HTMLInputElement>(null);
    const inputRef = props.inputRef === undefined ? localInputRef : mergeRefs(props.inputRef, localInputRef);

    const handleChange = React.useCallback(
        (evt: React.ChangeEvent<HTMLInputElement>) => {
            // update state immediately only if uncontrolled
            if (indeterminate === undefined) {
                setIsIndeterminate(evt.target.indeterminate);
            }
            // otherwise wait for props change. always invoke handler.
            onChange?.(evt);
        },
        [indeterminate, onChange],
    );

    React.useEffect(() => {
        if (indeterminate !== undefined) {
            setIsIndeterminate(indeterminate);
        }
    }, [indeterminate]);

    React.useEffect(() => {
        if (localInputRef.current != null) {
            localInputRef.current.indeterminate = isIndeterminate;
        }
    }, [localInputRef, isIndeterminate]);

    return (
        <ControlInternal
            {...controlProps}
            inputRef={inputRef}
            onChange={handleChange}
            ref={ref}
            type="checkbox"
            typeClassName={Classes.CHECKBOX}
        />
    );
});
Checkbox.displayName = `${DISPLAYNAME_PREFIX}.Checkbox`;
