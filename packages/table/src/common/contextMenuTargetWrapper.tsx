/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { ContextMenuTarget, IProps } from "@blueprintjs/core";
import * as React from "react";

export interface IContextMenuTargetWrapper extends IProps {
    renderContextMenu: (e: React.MouseEvent<HTMLElement>) => JSX.Element;
    style: React.CSSProperties;
}

/**
 * Since the ContextMenuTarget uses the `onContextMenu` prop instead
 * `element.addEventListener`, the prop can be lost. This wrapper helps us
 * maintain context menu fuctionality when doing fancy React.cloneElement
 * chains.
 */
@ContextMenuTarget
export class ContextMenuTargetWrapper extends React.Component<IContextMenuTargetWrapper, {}> {
    public render() {
        const { className, children, style } = this.props;
        return <div className={className} style={style}>{children}</div>;
    }

    public renderContextMenu(e: React.MouseEvent<HTMLElement>) {
        return this.props.renderContextMenu(e);
    }
}
