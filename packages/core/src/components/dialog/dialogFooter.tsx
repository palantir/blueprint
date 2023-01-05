/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

import { AbstractPureComponent2, Classes } from "../../common";
import { Props } from "../../common/props";

// eslint-disable-next-line deprecation/deprecation
export type DialogFooterProps = IDialogFooterProps;
/** @deprecated use DialogFooterProps */
export interface IDialogFooterProps extends Props {
    /** Left hand side of the footer */
    children?: React.ReactNode;

    /** Buttons displayed on the right hand side of the footer */
    actions?: React.ReactNode;

    /** Buttons displayed on the right hand side of the footer
     *
     * @default true;
     */
    fixed?: boolean;
}

export class DialogFooter extends AbstractPureComponent2<DialogFooterProps> {
    public static defaultProps: DialogFooterProps = {
        fixed: true
    };

    public render() {
        return (
            <div className={classNames(Classes.DIALOG_FOOTER, this.props.className, {[Classes.DIALOG_FIXED_FOOTER]: this.props.fixed})} role="dialogfooter">
                {this.maybeRenderLeftHandSide()}

                {this.maybeRenderActions()}
            </div>
        );
    }

    private maybeRenderLeftHandSide() {
        const { children } = this.props;
        if (children == null) {
            return undefined;
        }
        return (
            <div className={Classes.DIALOG_FOOTER_LEFT}>
                {children}
            </div>
        );
    }

    private maybeRenderActions() {
        const { actions } = this.props;
        if (actions == null) {
            return undefined;
        }
        return (
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                {actions}
            </div>
        );
    }
}
