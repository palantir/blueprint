/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as classNames from "classnames";
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

export class ProgressBar extends React.PureComponent<IProgressBarProps, {}> {
    public static displayName = "Blueprint2.ProgressBar";

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
