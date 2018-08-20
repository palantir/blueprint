/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import { DIVIDER, FILL, VERTICAL } from "../../common/classes";
import { DISPLAYNAME_PREFIX, IProps } from "../../common/props";

export interface IDividerProps extends IProps, React.HTMLAttributes<HTMLElement> {
    /**
     * Whether the divider should extend to the edges of its container. Enabling
     * this prop removes the margins on either end of the divider line (based on
     * `vertical` prop)
     */
    fill?: boolean;

    /**
     * HTML tag to use for element.
     * @default "div"
     */
    tagName?: keyof JSX.IntrinsicElements;

    /**
     * Whether this divider appears in a vertical list.
     *
     * The orientation of the divider will be perpendicular to this prop, such
     * that a horizontal divider appears as a vertical line between two row
     * siblings.
     *
     * Therefore, `<Divider vertical />` will render a _horizontal line_ for
     * consistency with other components that support the `vertical` modifier to
     * render their children in a column instead of a row, like `<ButtonGroup>`.
     *
     * @default false
     */
    vertical?: boolean;
}

export class Divider extends React.PureComponent<IDividerProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Divider`;

    public render() {
        const { className, fill, vertical, tagName: TagName = "div", ...htmlProps } = this.props;
        const classes = classNames(DIVIDER, { [FILL]: fill, [VERTICAL]: vertical }, className);
        return <TagName {...htmlProps} className={classes} />;
    }
}
