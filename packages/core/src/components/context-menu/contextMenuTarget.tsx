/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";
import * as ReactDOM from "react-dom";

import { CONTEXTMENU_WARN_DECORATOR_NO_METHOD } from "../../common/errors";
import { isFunction, safeInvoke } from "../../common/utils";
import { isDarkTheme } from "../../common/utils/isDarkTheme";
import * as ContextMenu from "./contextMenu";

export interface IContextMenuTarget extends React.Component<any, any> {
    renderContextMenu(e: React.MouseEvent<HTMLElement>): JSX.Element | undefined;
    onContextMenuClose?(): void;
}

export function ContextMenuTarget<T extends { prototype: IContextMenuTarget }>(constructor: T) {
    const { render, renderContextMenu, onContextMenuClose } = constructor.prototype;

    if (!isFunction(renderContextMenu)) {
        console.warn(CONTEXTMENU_WARN_DECORATOR_NO_METHOD);
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

            if (isFunction(this.renderContextMenu)) {
                const menu = this.renderContextMenu(e);
                if (menu != null) {
                    const htmlElement = ReactDOM.findDOMNode(this);
                    const darkTheme = htmlElement != null && isDarkTheme(htmlElement);
                    e.preventDefault();
                    ContextMenu.show(menu, { left: e.clientX, top: e.clientY }, onContextMenuClose, darkTheme);
                }
            }

            safeInvoke(oldOnContextMenu, e);
        };

        return React.cloneElement(element, { onContextMenu });
        /* tslint:enable:no-invalid-this */
    };
}
