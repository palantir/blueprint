/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";
import { Alignment } from "../../common/alignment";
import * as Classes from "../../common/classes";
import { HTMLDivProps, IProps } from "../../common/props";

export interface IButtonGroupProps extends IProps, HTMLDivProps {
    /**
     * Text alignment of button contents.
     * This prop only has an effect if buttons are wider than their default widths.
     *
     * `align={Alignment.LEFT}` will left-align button text and push `rightIcon` to right side.
     * `align={Alignment.RIGHT}` right-aligns text and pushes `icon` to left side.
     */
    alignText?: Alignment;

    /**
     * Whether the button group should take up the full width of its container.
     * @default false
     */
    fill?: boolean;

    /**
     * Whether the child buttons should appear with minimal styling.
     * @default false
     */
    minimal?: boolean;

    /**
     * Whether the child buttons should appear with large styling.
     * @default false
     */
    large?: boolean;

    /**
     * Whether the button group should appear with vertical styling.
     * @default false
     */
    vertical?: boolean;
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
export class ButtonGroup extends React.PureComponent<IButtonGroupProps, {}> {
    public static displayName = "Blueprint2.ButtonGroup";

    public render() {
        const { alignText, className, fill, minimal, large, vertical, ...htmlProps } = this.props;
        const buttonGroupClasses = classNames(
            Classes.BUTTON_GROUP,
            {
                [Classes.FILL]: fill,
                [Classes.LARGE]: large,
                [Classes.MINIMAL]: minimal,
                [Classes.VERTICAL]: vertical,
            },
            Classes.alignmentClass(alignText),
            className,
        );
        return (
            <div {...htmlProps} className={buttonGroupClasses}>
                {this.props.children}
            </div>
        );
    }
}
