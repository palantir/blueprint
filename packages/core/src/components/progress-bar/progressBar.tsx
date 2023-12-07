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

import { AbstractPureComponent, Classes } from "../../common";
import { DISPLAYNAME_PREFIX, type IntentProps, type Props } from "../../common/props";
import { clamp } from "../../common/utils";

export interface ProgressBarProps extends Props, IntentProps {
    /**
     * Whether the background should animate.
     *
     * @default true
     */
    animate?: boolean;

    /**
     * Whether the background should be striped.
     *
     * @default true
     */
    stripes?: boolean;

    /**
     * A value between 0 and 1 (inclusive) representing how far along the operation is.
     * Values below 0 or above 1 will be interpreted as 0 or 1, respectively.
     * Omitting this prop will result in an "indeterminate" progress meter that fills the entire bar.
     */
    value?: number;
}

/**
 * Progress bar component.
 *
 * @see https://blueprintjs.com/docs/#core/components/progress-bar
 */
export class ProgressBar extends AbstractPureComponent<ProgressBarProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.ProgressBar`;

    public render() {
        const { animate = true, className, intent, stripes = true, value } = this.props;
        const classes = classNames(
            Classes.PROGRESS_BAR,
            Classes.intentClass(intent),
            { [Classes.PROGRESS_NO_ANIMATION]: !animate, [Classes.PROGRESS_NO_STRIPES]: !stripes },
            className,
        );
        const percent = value == null ? undefined : 100 * clamp(value, 0, 1);
        // don't set width if value is null (rely on default CSS value)
        const width = percent == null ? undefined : percent + "%";

        return (
            <div
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={percent == null ? undefined : Math.round(percent)}
                className={classes}
                role="progressbar"
            >
                <div className={Classes.PROGRESS_METER} style={{ width }} />
            </div>
        );
    }
}
