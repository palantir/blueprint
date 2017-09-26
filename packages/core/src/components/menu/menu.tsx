/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import * as Classes from "../../common/classes";
import { IProps } from "../../common/props";

export interface IMenuProps extends IProps {
    /** Ref handler that receives the HTML `<ul>` element backing this component. */
    ulRef?: (ref: HTMLUListElement) => any;
}

export class Menu extends React.Component<IMenuProps, {}> {
    public static displayName = "Blueprint.Menu";

    public render() {
        return (
            <ul className={classNames(Classes.MENU, this.props.className)} ref={this.props.ulRef}>
                {this.props.children}
            </ul>
        );
    }
}

export const MenuFactory = React.createFactory(Menu);
