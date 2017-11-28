/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";
import * as Classes from "../../common/classes";
import { IProps } from "../../common/props";

export interface IButtonGroupProps extends IProps, React.HTMLProps<HTMLDivElement> {
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
@PureRender
export class ButtonGroup extends React.Component<IButtonGroupProps, {}> {
    public static displayName = "Blueprint.ButtonGroup";

    public render() {
        const { className, fill, minimal, large, vertical, ...htmlProps } = this.props;
        const buttonGroupClasses = classNames(
            Classes.BUTTON_GROUP,
            {
                [Classes.FILL]: fill,
                [Classes.MINIMAL]: minimal,
                [Classes.LARGE]: large,
                [Classes.VERTICAL]: vertical,
            },
            className,
        );
        return (
            <div {...htmlProps} className={buttonGroupClasses}>
                {this.props.children}
            </div>
        );
    }
}
