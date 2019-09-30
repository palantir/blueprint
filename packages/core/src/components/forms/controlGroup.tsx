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
import { AbstractPureComponent2, Classes } from "../../common";
import { DISPLAYNAME_PREFIX, HTMLDivProps, IProps } from "../../common/props";

export interface IControlGroupProps extends IProps, HTMLDivProps {
    /**
     * Whether the control group should take up the full width of its container.
     * @default false
     */
    fill?: boolean;

    /**
     * Whether the control group should appear with vertical styling.
     * @default false
     */
    vertical?: boolean;
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
@polyfill
export class ControlGroup extends AbstractPureComponent2<IControlGroupProps, {}> {
    public static displayName = `${DISPLAYNAME_PREFIX}.ControlGroup`;

    public render() {
        const { children, className, fill, vertical, ...htmlProps } = this.props;

        const rootClasses = classNames(
            Classes.CONTROL_GROUP,
            {
                [Classes.FILL]: fill,
                [Classes.VERTICAL]: vertical,
            },
            className,
        );

        return (
            <div {...htmlProps} className={rootClasses}>
                {children}
            </div>
        );
    }
}
