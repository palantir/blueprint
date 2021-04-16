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

// we need some empty interfaces to show up in docs
// HACKHACK: these components should go in separate files
/* eslint-disable max-classes-per-file, @typescript-eslint/no-empty-interface */

import classNames from "classnames";
import * as React from "react";
import { polyfill } from "react-lifecycles-compat";

import { AbstractPureComponent2, Alignment, Classes, IRef, refHandler, setRef } from "../../common";
import { DISPLAYNAME_PREFIX, HTMLInputProps, Props } from "../../common/props";

// eslint-disable-next-line deprecation/deprecation
export type ControlProps = IControlProps;
/** @deprecated use ControlProps */
export interface IControlProps extends Props, HTMLInputProps {
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

    /** Ref handler that receives HTML `<input>` element backing this component. */
    inputRef?: IRef<HTMLInputElement>;

    /** Whether the control should appear as an inline element. */
    inline?: boolean;

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
interface IControlInternalProps extends ControlProps {
    type: "checkbox" | "radio";
    typeClassName: string;
    indicatorChildren?: React.ReactNode;
}

/**
 * Renders common control elements, with additional props to customize appearance.
 * This component is not exported and is only used in this file for `Checkbox`, `Radio`, and `Switch` below.
 */
const Control: React.FunctionComponent<IControlInternalProps> = ({
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
}) => {
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
        { className: classes, style },
        <input {...htmlProps} ref={inputRef} type={type} />,
        <span className={Classes.CONTROL_INDICATOR}>{indicatorChildren}</span>,
        label,
        labelElement,
        children,
    );
};

//
// Switch
//

// eslint-disable-next-line deprecation/deprecation
export type SwitchProps = ISwitchProps;
/** @deprecated use SwitchProps */
export interface ISwitchProps extends ControlProps {
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

@polyfill
export class Switch extends AbstractPureComponent2<SwitchProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Switch`;

    public render() {
        const { innerLabelChecked, innerLabel, ...controlProps } = this.props;
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
            <Control
                {...controlProps}
                type="checkbox"
                typeClassName={Classes.SWITCH}
                indicatorChildren={switchLabels}
            />
        );
    }
}

//
// Radio
//

/** @deprecated use RadioProps */
export type IRadioProps = ControlProps;
// eslint-disable-next-line deprecation/deprecation
export type RadioProps = IRadioProps;

@polyfill
export class Radio extends AbstractPureComponent2<RadioProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Radio`;

    public render() {
        return <Control {...this.props} type="radio" typeClassName={Classes.RADIO} />;
    }
}

//
// Checkbox
//

// eslint-disable-next-line deprecation/deprecation
export type CheckboxProps = ICheckboxProps;
/** @deprecated use CheckboxProps */
export interface ICheckboxProps extends ControlProps {
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

export interface ICheckboxState {
    // Checkbox adds support for uncontrolled indeterminate state
    indeterminate: boolean;
}

@polyfill
export class Checkbox extends AbstractPureComponent2<CheckboxProps, ICheckboxState> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Checkbox`;

    public static getDerivedStateFromProps({ indeterminate }: CheckboxProps): ICheckboxState | null {
        // put props into state if controlled by props
        if (indeterminate != null) {
            return { indeterminate };
        }

        return null;
    }

    public state: ICheckboxState = {
        indeterminate: this.props.indeterminate || this.props.defaultIndeterminate || false,
    };

    // must maintain internal reference for `indeterminate` support
    public input: HTMLInputElement | null = null;

    private handleInputRef: IRef<HTMLInputElement> = refHandler(this, "input", this.props.inputRef);

    public render() {
        const { defaultIndeterminate, indeterminate, ...controlProps } = this.props;
        return (
            <Control
                {...controlProps}
                inputRef={this.handleInputRef}
                onChange={this.handleChange}
                type="checkbox"
                typeClassName={Classes.CHECKBOX}
            />
        );
    }

    public componentDidMount() {
        this.updateIndeterminate();
    }

    public componentDidUpdate(prevProps: CheckboxProps) {
        this.updateIndeterminate();
        if (prevProps.inputRef !== this.props.inputRef) {
            setRef(prevProps.inputRef, null);
            this.handleInputRef = refHandler(this, "input", this.props.inputRef);
            setRef(this.props.inputRef, this.input);
        }
    }

    private updateIndeterminate() {
        if (this.input != null) {
            this.input.indeterminate = this.state.indeterminate;
        }
    }

    private handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const { indeterminate } = evt.target;
        // update state immediately only if uncontrolled
        if (this.props.indeterminate == null) {
            this.setState({ indeterminate });
        }
        // otherwise wait for props change. always invoke handler.
        this.props.onChange?.(evt);
    };
}
