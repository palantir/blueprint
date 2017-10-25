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

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import { Classes, IIntentProps, IProps } from "../../common";
import { IconName } from "../icon/icon";

/** This component also supports the full range of HTML `<div>` props. */
export interface ICalloutProps extends IIntentProps, IProps {
    /** Name of icon to render on left-hand side. */
    iconName?: IconName;

    /**
     * String content of optional title element.
     *
     * Due to a conflict with the HTML prop types, to provide JSX content simply pass
     * `<h5>JSX title content<h5>` as first `children` element instead of using this prop.
     */
    title?: string;
}

@PureRender
export class Callout extends React.Component<ICalloutProps & React.HTMLAttributes<HTMLDivElement>, {}> {
    public render() {
        const { className, children, iconName, intent, title, ...htmlProps } = this.props;
        const classes = classNames(
            Classes.CALLOUT,
            Classes.intentClass(intent),
            Classes.iconClass(iconName),
            className,
        );
        return (
            <div className={classes} {...htmlProps}>
                {title && <h5>{title}</h5>}
                {children}
            </div>
        );
    }
}
