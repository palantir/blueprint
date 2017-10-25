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

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import * as Classes from "../../common/classes";
import { IIntentProps, IProps } from "../../common/props";
import { clamp } from "../../common/utils";

export interface IProgressBarProps extends IProps, IIntentProps {
    /**
     * A value between 0 and 1 (inclusive) representing how far along the operation is.
     * Values below 0 or above 1 will be interpreted as 0 or 1, respectively.
     * Omitting this prop will result in an "indeterminate" progress meter that fills the entire bar.
     */
    value?: number;
}

@PureRender
export class ProgressBar extends React.Component<IProgressBarProps, {}> {
    public static displayName = "Blueprint.ProgressBar";

    public render() {
        const { className, intent, value } = this.props;
        const classes = classNames("pt-progress-bar", Classes.intentClass(intent), className);
        // don't set width if value is null (rely on default CSS value)
        const width = value == null ? null : 100 * clamp(value, 0, 1) + "%";

        return (
            <div className={classes}>
                <div className="pt-progress-meter" style={{ width }} />
            </div>
        );
    }
}

export const ProgressBarFactory = React.createFactory(ProgressBar);
