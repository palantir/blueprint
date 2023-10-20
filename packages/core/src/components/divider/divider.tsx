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

import { AbstractPureComponent } from "../../common";
import { DIVIDER } from "../../common/classes";
import { DISPLAYNAME_PREFIX, type Props } from "../../common/props";

export interface DividerProps extends Props, React.HTMLAttributes<HTMLElement> {
    /**
     * HTML tag to use for element.
     *
     * @default "div"
     */
    tagName?: keyof JSX.IntrinsicElements;
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */

/**
 * Divider component.
 *
 * @see https://blueprintjs.com/docs/#core/components/divider
 */
export class Divider extends AbstractPureComponent<DividerProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Divider`;

    public render(): JSX.Element {
        const { className, tagName = "div", ...htmlProps } = this.props;
        const classes = classNames(DIVIDER, className);
        return React.createElement(tagName, {
            ...htmlProps,
            className: classes,
        });
    }
}
