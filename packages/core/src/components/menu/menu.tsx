/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as classNames from "classnames";
import * as React from "react";

import * as Classes from "../../common/classes";
import { IProps } from "../../common/props";
import { IMenuItemContext, MenuItemContextTypes } from "./context";

export interface IMenuProps extends IProps {
    /** Ref handler that receives the HTML `<ul>` element backing this component. */
    ulRef?: (ref: HTMLUListElement) => any;

    /**
     * Boundary element for position of submenu. If submenu reaches the edge of the boundary,
     * it will flip to the other side.
     * This prop will apply to all `MenuItem`s inside this `Menu`, via React context.
     * @see https://popper.js.org/popper-documentation.html#modifiers..flip.boundariesElement
     * @default "viewport"
     */
    submenuBoundaryElement?: "scrollParent" | "viewport" | "window" | Element;

    /**
     * Pixel width of minimum distance between boundary element and submenu content.
     * Submenus will flip to the other side if they come within this distance of the boundary.
     * This prop will apply to all `MenuItem`s inside this `Menu`, via React context.
     * @see https://popper.js.org/popper-documentation.html#modifiers..preventOverflow.padding
     * @default 5
     */
    submenuBoundaryPadding?: number;
}

export class Menu extends React.Component<IMenuProps, {}> {
    public static childContextTypes = MenuItemContextTypes;
    public static displayName = "Blueprint2.Menu";
    public static defaultProps: IMenuProps = {
        submenuBoundaryElement: "viewport",
        submenuBoundaryPadding: 5,
    };

    public render() {
        return (
            <ul className={classNames(Classes.MENU, this.props.className)} ref={this.props.ulRef}>
                {this.props.children}
            </ul>
        );
    }

    public getChildContext(): IMenuItemContext {
        return {
            getSubmenuPopperModifiers: () => {
                const { submenuBoundaryElement: boundariesElement, submenuBoundaryPadding: padding } = this.props;
                return {
                    flip: { boundariesElement, padding },
                    preventOverflow: { boundariesElement, padding },
                };
            },
        };
    }
}
