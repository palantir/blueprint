/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import { DIVIDER } from "../../common/classes";
import { DISPLAYNAME_PREFIX, IProps } from "../../common/props";

export interface IDividerProps extends IProps, React.HTMLAttributes<HTMLElement> {
    /**
     * HTML tag to use for element.
     * @default "div"
     */
    tagName?: keyof JSX.IntrinsicElements;
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
export class Divider extends React.PureComponent<IDividerProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Divider`;

    public render() {
        const { className, tagName: TagName = "div", ...htmlProps } = this.props;
        const classes = classNames(DIVIDER, className);
        return <TagName {...htmlProps} className={classes} />;
    }
}
