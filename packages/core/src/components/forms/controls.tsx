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

import { Alignment, Classes, mergeRefs } from "../../common";
import { DISPLAYNAME_PREFIX, HTMLInputProps, Props } from "../../common/props";

export interface ControlProps extends Props, HTMLInputProps, React.RefAttributes<HTMLLabelElement> {
    // NOTE: HTML props are duplicated here to provide control-specific documentation

    /**
     * Alignment of the indicator within container.
     *
     * @default Alignment.LEFT
     */
    alignIndicator?: Alignment;

    /** Whether the control is checked. */
    checked?: boolean;

    /** JSX label for the control. */
    children?: React.ReactNode;

    /** Whether the control is initially checked (uncontrolled mode). */
    defaultChecked?: boolean;

    /** Whether the control is non-interactive. */
    disabled?: boolean;

    /** Whether the control should appear as an inline element. */
    inline?: boolean;

    /** Ref attached to the HTML `<input>` element backing this component. */
    inputRef?: React.Ref<HTMLInputElement>;

    /**
     * Text label for the control.
     *
     * Use `children` or `labelElement` to supply JSX content. This prop actually supports JSX elements,
     * but TypeScript will throw an error because `HTMLAttributes` only allows strings.
     */
    label?: string;

    /**
     * JSX Element label for the control.
     *
     * This prop is a workaround for TypeScript consumers as the type definition for `label` only
     * accepts strings. JavaScript consumers can provide a JSX element directly to `label`.
     */
    labelElement?: React.ReactNode;

    /** Whether this control should use large styles. */
    large?: boolean;

    /** Event handler invoked when input value is changed. */
    onChange?: React.FormEventHandler<HTMLInputElement>;

    /**
     * Name of the HTML tag that wraps the checkbox.
     *
     * By default a `<label>` is used, which effectively enlarges the click
     * target to include all of its children. Supply a different tag name if
     * this behavior is undesirable or you're listening to click events from a
     * parent element (as the label can register duplicate clicks).
     *
     * @default "label"
     */
    tagName?: keyof JSX.IntrinsicElements;
}

/** Internal props for Checkbox/Radio/Switch to render correctly. */
interface ControlInternalProps extends ControlProps {
    type: "checkbox" | "radio";
    typeClassName: string;
    indicatorChildren?: React.ReactNode;
}

/**
 * Renders common control elements, with additional props to customize appearance.
 * This function is not exported and is only used within this module for `Checkbox`, `Radio`, and `Switch` below.
 */
function renderControl(props: ControlInternalProps, ref: React.Ref<HTMLLabelElement>) {
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
}

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
        return renderControl(
            {
                ...controlProps,
                indicatorChildren: switchLabels,
                type: "checkbox",
                typeClassName: Classes.SWITCH,
            },
            ref,
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
export const Radio: React.FC<RadioProps> = React.forwardRef((props, ref) =>
    renderControl(
        {
            ...props,
            type: "radio",
            typeClassName: Classes.RADIO,
        },
        ref,
    ),
);
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
        [onChange],
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

    return renderControl(
        {
            ...controlProps,
            inputRef,
            onChange: handleChange,
            type: "checkbox",
            typeClassName: Classes.CHECKBOX,
        },
        ref,
    );
});
Checkbox.displayName = `${DISPLAYNAME_PREFIX}.Checkbox`;
