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

import { DIVIDER } from "../../common/classes";
import { DISPLAYNAME_PREFIX, IProps } from "../../common/props";

export interface IDividerProps extends IProps, React.HTMLAttributes<HTMLElement> {
    /**
     * HTML tag to use for element.
     * @default "div"
     */
    tagName?: keyof JSX.IntrinsicElements;
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
export class Divider extends React.PureComponent<IDividerProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Divider`;

    public render() {
        const { className, tagName: TagName = "div", ...htmlProps } = this.props;
        const classes = classNames(DIVIDER, className);
        return <TagName {...htmlProps} className={classes} />;
    }
}
