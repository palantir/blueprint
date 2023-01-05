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
export type DialogBodyProps = IDialogBodyProps;
/** @deprecated use DialogBodyProps */
export interface IDialogBodyProps extends Props {
    /** Dialog contents. */
    children?: React.ReactNode;

    /**
     * Enable scrolling for the container
     *
     * @default true
     */
    enablePadding?: boolean;

    /**
     * Enable scrolling for the container
     *
     * @default true
     */
    useOverflowScrollContainer?: boolean;
}

export class DialogBody extends AbstractPureComponent2<DialogBodyProps> {
    public static defaultProps: DialogBodyProps = {
        useOverflowScrollContainer: true,
        enablePadding: true,
    };

    public render() {
        return (
            <div role="dialogbody" className={classNames(this.props.className, {[Classes.DIALOG_BODY_SCROLL_CONTAINER]: this.props.useOverflowScrollContainer, [Classes.DIALOG_BODY_PADDING]: this.props.enablePadding})}>
                {this.props.children}
            </div>
        );
    }
}
