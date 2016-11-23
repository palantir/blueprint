/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { isFunction, safeInvoke } from "../../common/utils";
import * as ContextMenu from "./contextMenu";

export interface IContextMenuTarget extends React.Component<any, any> {
    renderContextMenu(e: React.MouseEvent<HTMLElement>): JSX.Element ;
}

export function ContextMenuTarget<T extends { prototype: IContextMenuTarget }>(constructor: T) {
    const { render, renderContextMenu } = constructor.prototype;

    if (!isFunction(renderContextMenu)) {
        throw new Error(`@ContextMenuTarget-decorated class must implement \`renderContextMenu\`. ${constructor}`);
    }

    // patching classes like this requires preserving function context
    // tslint:disable-next-line only-arrow-functions
    constructor.prototype.render = function(this: IContextMenuTarget) {
        /* tslint:disable:no-invalid-this */
        const element = render.call(this) as JSX.Element;

        if (element == null) {
            // always return `element` in case caller is distinguishing between `null` and `undefined`
            return element;
        }

        const oldOnContextMenu = element.props.onContextMenu as React.MouseEventHandler<HTMLElement>;
        const onContextMenu = (e: React.MouseEvent<HTMLElement>) => {
            // support nested menus (inner menu target would have called preventDefault())
            if (e.defaultPrevented) {
                return;
            }

            const menu = this.renderContextMenu(e);
            if (menu != null) {
                e.preventDefault();
                ContextMenu.show(menu, { left: e.clientX, top: e.clientY });
            }

            safeInvoke(oldOnContextMenu, e);
        };

        return React.cloneElement(element, { onContextMenu });
        /* tslint:enable:no-invalid-this */
    };
};
