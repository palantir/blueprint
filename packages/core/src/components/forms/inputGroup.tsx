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
import { polyfill } from "react-lifecycles-compat";
import { AbstractPureComponent2, Classes } from "../../common";
import {
    DISPLAYNAME_PREFIX,
    HTMLInputProps,
    IControlledProps,
    IIntentProps,
    IProps,
    MaybeElement,
    removeNonHTMLProps,
} from "../../common/props";
import { Icon, IconName } from "../icon/icon";

const DEFAULT_RIGHT_ELEMENT_WIDTH = 10;

// NOTE: This interface does not extend HTMLInputProps due to incompatiblity with `IControlledProps`.
// Instead, we union the props in the component definition, which does work and properly disallows `string[]` values.
export interface IInputGroupProps extends IControlledProps, IIntentProps, IProps {
    /**
     * Whether the input is non-interactive.
     * Note that `rightElement` must be disabled separately; this prop will not affect it.
     * @default false
     */
    disabled?: boolean;

    /**
     * Whether the component should take up the full width of its container.
     */
    fill?: boolean;

    /** Ref handler that receives HTML `<input>` element backing this component. */
    inputRef?: (ref: HTMLInputElement | null) => any;

    /**
     * Name of a Blueprint UI icon (or an icon element) to render on the left side of the input group,
     * before the user's cursor.
     */
    leftIcon?: IconName | MaybeElement;

    /** Whether this input should use large styles. */
    large?: boolean;

    /** Whether this input should use small styles. */
    small?: boolean;

    /** Placeholder text in the absence of any value. */
    placeholder?: string;

    /**
     * Element to render on right side of input.
     * For best results, use a minimal button, tag, or small spinner.
     */
    rightElement?: JSX.Element;

    /** Whether the input (and any buttons) should appear with rounded caps. */
    round?: boolean;

    /**
     * HTML `input` type attribute.
     * @default "text"
     */
    type?: string;
}

export interface IInputGroupState {
    rightElementWidth: number;
}

@polyfill
export class InputGroup extends AbstractPureComponent2<IInputGroupProps & HTMLInputProps, IInputGroupState> {
    public static displayName = `${DISPLAYNAME_PREFIX}.InputGroup`;

    public state: IInputGroupState = {
        rightElementWidth: DEFAULT_RIGHT_ELEMENT_WIDTH,
    };

    private rightElement: HTMLElement;
    private refHandlers = {
        rightElement: (ref: HTMLSpanElement) => (this.rightElement = ref),
    };

    public render() {
        const { className, disabled, fill, intent, large, small, leftIcon, round } = this.props;
        const classes = classNames(
            Classes.INPUT_GROUP,
            Classes.intentClass(intent),
            {
                [Classes.DISABLED]: disabled,
                [Classes.FILL]: fill,
                [Classes.LARGE]: large,
                [Classes.SMALL]: small,
                [Classes.ROUND]: round,
            },
            className,
        );
        const style: React.CSSProperties = { ...this.props.style, paddingRight: this.state.rightElementWidth };

        return (
            <div className={classes}>
                <Icon icon={leftIcon} />
                <input
                    type="text"
                    {...removeNonHTMLProps(this.props)}
                    className={Classes.INPUT}
                    ref={this.props.inputRef}
                    style={style}
                />
                {this.maybeRenderRightElement()}
            </div>
        );
    }

    public componentDidMount() {
        if (this.rightElement != null) {
            const { clientWidth } = this.rightElement;
            // small threshold to prevent infinite loops
            if (Math.abs(clientWidth - this.state.rightElementWidth) > 2) {
                this.setState({ rightElementWidth: clientWidth });
            }
        }
    }

    private maybeRenderRightElement() {
        const { rightElement } = this.props;
        if (rightElement == null) {
            return undefined;
        }
        return (
            <span className={Classes.INPUT_ACTION} ref={this.refHandlers.rightElement}>
                {rightElement}
            </span>
        );
    }
}
