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

import { AbstractPureComponent, Classes } from "../../common";
import type { Props } from "../../common/props";

export interface DialogFooterProps extends Props {
    /** Child contents are rendered on the left side of the footer. */
    children?: React.ReactNode;

    /** Dialog actions (typically buttons) are rendered on the right side of the footer. */
    actions?: React.ReactNode;

    /**
     * Use a "minimal" appearance for the footer, simply applying an HTML role and
     * some visual padding. This is useful for small dialogs, and should not be used
     * with `<DialogBody useOverflowScrollContainer>`.
     *
     * Note that this is the default behavior when using the CSS API, since that's
     * how the `-dialog-footer` class was first introduced, so these styles are
     * applied without a "modifier" class.
     *
     * When using the JS component API, `minimal` is false by default.
     *
     * Show the footer close from the content.
     * Do not use with scroll body
     * Use for small dialogs (confirm)
     *
     * @default false;
     */
    minimal?: boolean;
}

/**
 * Dialog footer component.
 *
 * @see https://blueprintjs.com/docs/#core/components/dialog.dialog-footer-props
 */
export class DialogFooter extends AbstractPureComponent<DialogFooterProps> {
    public static defaultProps: DialogFooterProps = {
        minimal: false,
    };

    public render() {
        return (
            <div
                className={classNames(Classes.DIALOG_FOOTER, this.props.className, {
                    [Classes.DIALOG_FOOTER_FIXED]: !this.props.minimal,
                })}
            >
                {this.renderMainSection()}
                {this.maybeRenderActionsSection()}
            </div>
        );
    }

    /** Render the main footer section (left aligned). */
    private renderMainSection() {
        return <div className={Classes.DIALOG_FOOTER_MAIN_SECTION}>{this.props.children}</div>;
    }

    /** Optionally render the footer actions (right aligned). */
    private maybeRenderActionsSection() {
        const { actions } = this.props;
        if (actions == null) {
            return undefined;
        }
        return <div className={Classes.DIALOG_FOOTER_ACTIONS}>{actions}</div>;
    }
}
