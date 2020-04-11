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

import * as React from "react";
import { polyfill } from 'react-lifecycles-compat';
import { Intent } from '../../common';

export interface IStepConnectorProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Sets the step as active.  If using `Stepper`, this is defaulted to true if `activeStep` prop matches step index.
     */
    active?: boolean;

    /**
     * If true, the `icon` prop will be overriden by "error" and the `intent` prop will be overridden by "danger".
     */
    error?: boolean;

    /**
     * If true, the `icon` prop will be overriden by "tick" and the `intent` prop will be overridden by "success".
     */
    completed?: boolean;

    /**
     * Sets the step as active.  If using `Stepper`, this is defaulted to true if based on `disabled` prop is true.
     */
    disabled?: boolean;

    /**
     * Forces an intent color.  This is normally defaulted based on the `error` and `completed` props.
     */
    intent?: Intent;
}

@polyfill
export class StepConnector extends React.PureComponent<IStepConnectorProps> {
    public static readonly displayName = "StepConnector";

    public render() {
        return (
            <div className="bp3-step-connector">
                <span className="bp3-step-connector-line" />
            </div>
        )
    }
}
