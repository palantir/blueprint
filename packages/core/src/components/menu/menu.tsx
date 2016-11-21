/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as classNames from "classnames";
import * as React from "react";

import * as Classes from "../../common/classes";
import { IProps } from "../../common/props";

export interface IMenuProps extends IProps {
}

export class Menu extends React.Component<IMenuProps, {}> {
    public static displayName = "Blueprint.Menu";

    public render() {
        return <ul className={classNames(Classes.MENU, this.props.className)}>{this.props.children}</ul>;
    }
}

export let MenuFactory = React.createFactory(Menu);
