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

import { AbstractPureComponent, Classes } from "../../common";
import { DISPLAYNAME_PREFIX, type HTMLDivProps, type Props } from "../../common/props";
import type { DialogStepButtonProps } from "./dialogStepButton";

export type DialogStepId = string | number;

export interface DialogStepProps extends Props, Omit<HTMLDivProps, "id" | "title" | "onClick"> {
    /**
     * Unique identifier used to identify which step is selected.
     */
    id: DialogStepId;

    /**
     * Panel content, rendered by the parent `MultistepDialog` when this step is active.
     */
    panel: JSX.Element;

    /**
     * Space-delimited string of class names applied to multistep dialog panel container.
     */
    panelClassName?: string;

    /**
     * Content of step title element, rendered in a list left of the active panel.
     */
    title?: React.ReactNode;

    /**
     * Props for the back button.
     */
    backButtonProps?: DialogStepButtonProps;

    /**
     * Props for the next button.
     */
    nextButtonProps?: DialogStepButtonProps;
}

/**
 * Dialog step component.
 *
 * @see https://blueprintjs.com/docs/#core/components/dialog.dialogstep
 */
export class DialogStep extends AbstractPureComponent<DialogStepProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.DialogStep`;

    // this component is never rendered directly; see MultistepDialog#renderDialogStepPanel()
    /* istanbul ignore next */
    public render() {
        const { className } = this.props;
        return (
            <div className={Classes.DIALOG_STEP_CONTAINER} role="tab">
                <div className={classNames(Classes.DIALOG_STEP, className)} />
            </div>
        );
    }
}
