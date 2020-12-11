/*
 * Copyright 2020 Palantir Technologies, Inc. All rights reserved.
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

export type StepId = string | number;

export interface IMultistepDialogPanelProps {
    updateDialog: (state: { enableNextButton: boolean }) => void;
}

export interface IStepProps extends IProps, Omit<HTMLDivProps, "id" | "title" | "onClick"> {
    /**
     * Unique identifier used to control which step is selected
     * and to generate ARIA attributes for accessibility.
     */
    id: StepId;

    /**
     * Indicates whether the next button should be enabled by default on this step
     */
    nextButtonEnabledByDefault?: boolean;

    /**
     * Space-delimited string of class names applied to multistep dialog panel container.
     */
    panelClassName?: string;

    /**
     * Renders Panel content, rendered by the parent `MultistepDialog` when this step is active.
     * If omitted, no panel will be rendered for this step.
     */
    renderPanel?(props: IMultistepDialogPanelProps): JSX.Element;

    /**
     * Content of step title element, rendered in a list left of the active panel.
     * Can also be set via React `children`.
     */
    title?: React.ReactNode;
}

@polyfill
export class Step extends AbstractPureComponent2<IStepProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Tab`;

    // this component is never rendered directly; see MultistepDialog#renderStepPanel()
    /* istanbul ignore next */
    public render() {
        const { className } = this.props;
        return (
            <div className={Classes.STEP_CONTAINER}>
                <div className={classNames(Classes.STEP, className)} role="steplist" />
            </div>
        );
    }
}
