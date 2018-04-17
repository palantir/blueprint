/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";
import * as ReactDOM from "react-dom";

import { IConstructor } from "../../common/constructor";
import {
    CONTEXTMENU_WARN_DECORATOR_NEEDS_REACT_ELEMENT,
    CONTEXTMENU_WARN_DECORATOR_NO_METHOD,
} from "../../common/errors";
import { getDisplayName, isFunction, safeInvoke } from "../../common/utils";
import { isDarkTheme } from "../../common/utils/isDarkTheme";
import * as ContextMenu from "./contextMenu";

export interface IContextMenuTarget extends React.Component<any, any> {
    render(): React.ReactElement<any> | null | undefined;
    renderContextMenu(e: React.MouseEvent<HTMLElement>): JSX.Element | undefined;
    onContextMenuClose?(): void;
}

export function ContextMenuTarget<T extends IConstructor<IContextMenuTarget>>(WrappedComponent: T) {
    if (!isFunction(WrappedComponent.prototype.renderContextMenu)) {
        console.warn(CONTEXTMENU_WARN_DECORATOR_NO_METHOD);
    }

    return class ContextMenuTargetClass extends WrappedComponent {
        public static displayName = `ContextMenuTarget(${getDisplayName(WrappedComponent)})`;

        public render() {
            const element = super.render();

            if (element == null) {
                // always return `element` in case caller is distinguishing between `null` and `undefined`
                return element;
            }

            if (!React.isValidElement<any>(element)) {
                console.warn(CONTEXTMENU_WARN_DECORATOR_NEEDS_REACT_ELEMENT);
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
                        ContextMenu.show(menu, { left: e.clientX, top: e.clientY }, this.onContextMenuClose, darkTheme);
                    }
                }

                safeInvoke(oldOnContextMenu, e);
            };

            return React.cloneElement(element, { onContextMenu });
        }
    };
}
