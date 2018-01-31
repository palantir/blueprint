/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
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
    public static displayName = "Blueprint2.Menu";

    public render() {
        return (
            <ul className={classNames(Classes.MENU, this.props.className)} ref={this.props.ulRef}>
                {this.props.children}
            </ul>
        );
    }
}
