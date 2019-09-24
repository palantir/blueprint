/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import { AbstractPureComponent2, Alignment, Classes } from "../../common";
import { DISPLAYNAME_PREFIX, HTMLDivProps, IProps } from "../../common/props";

export interface IButtonGroupProps extends IProps, HTMLDivProps {
    /**
     * Text alignment within button. By default, icons and text will be centered
     * within the button. Passing `"left"` or `"right"` will align the button
     * text to that side and push `icon` and `rightIcon` to either edge. Passing
     * `"center"` will center the text and icons together.
     */
    alignText?: Alignment;

    /**
     * Whether the button group should take up the full width of its container.
     * @default false
     */
    fill?: boolean;

    /**
     * Whether the child buttons should appear with minimal styling.
     * @default false
     */
    minimal?: boolean;

    /**
     * Whether the child buttons should appear with large styling.
     * @default false
     */
    large?: boolean;

    /**
     * Whether the button group should appear with vertical styling.
     * @default false
     */
    vertical?: boolean;
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
@polyfill
export class ButtonGroup extends AbstractPureComponent2<IButtonGroupProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.ButtonGroup`;

    public render() {
        const { alignText, className, fill, minimal, large, vertical, ...htmlProps } = this.props;
        const buttonGroupClasses = classNames(
            Classes.BUTTON_GROUP,
            {
                [Classes.FILL]: fill,
                [Classes.LARGE]: large,
                [Classes.MINIMAL]: minimal,
                [Classes.VERTICAL]: vertical,
            },
            Classes.alignmentClass(alignText),
            className,
        );
        return (
            <div {...htmlProps} className={buttonGroupClasses}>
                {this.props.children}
            </div>
        );
    }
}
