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

/* eslint-disable deprecation/deprecation */

import React from "react";

import { Props } from "@blueprintjs/core";
import { ContextMenu2, ContextMenu2RenderProps } from "@blueprintjs/popover2";

export interface ContextMenuTargetWrapperProps extends Props {
    renderContextMenu: (props: ContextMenu2RenderProps) => JSX.Element;
    style: React.CSSProperties;
}

/**
 * Since ContextMenu2 uses the `onContextMenu` prop instead of
 * `element.addEventListener`, the prop can be lost. This wrapper helps us
 * maintain context menu fuctionality when doing fancy React.cloneElement
 * chains.
 */
export class ContextMenuTargetWrapper extends React.PureComponent<ContextMenuTargetWrapperProps> {
    public render() {
        const { className, children, renderContextMenu, style } = this.props;
        return (
            <ContextMenu2 content={renderContextMenu}>
                <div className={className} style={style}>
                    {children}
                </div>
            </ContextMenu2>
        );
    }
}
