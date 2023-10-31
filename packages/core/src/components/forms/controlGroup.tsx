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

import { Classes } from "../../common";
import { DISPLAYNAME_PREFIX, type HTMLDivProps, type Props } from "../../common/props";

export interface ControlGroupProps extends Props, HTMLDivProps, React.RefAttributes<HTMLDivElement> {
    /** Group contents. */
    children?: React.ReactNode;

    /**
     * Whether the control group should take up the full width of its container.
     *
     * @default false
     */
    fill?: boolean;

    /**
     * Whether the control group should appear with vertical styling.
     *
     * @default false
     */
    vertical?: boolean;
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
/**
 * Control group component.
 *
 * @see https://blueprintjs.com/docs/#core/components/control-group
 */
export const ControlGroup: React.FC<ControlGroupProps> = React.forwardRef<HTMLDivElement, ControlGroupProps>(
    (props, ref) => {
        const { children, className, fill, vertical, ...htmlProps } = props;

        const rootClasses = classNames(
            Classes.CONTROL_GROUP,
            {
                [Classes.FILL]: fill,
                [Classes.VERTICAL]: vertical,
            },
            className,
        );

        return (
            <div {...htmlProps} ref={ref} className={rootClasses}>
                {children}
            </div>
        );
    },
);
ControlGroup.displayName = `${DISPLAYNAME_PREFIX}.ControlGroup`;
