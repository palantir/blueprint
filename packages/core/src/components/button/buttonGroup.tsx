/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";
import * as Classes from "../../common/classes";
import { IProps } from "../../common/props";

export interface IButtonGroupProps extends IProps {
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
     * CSS styles to apply to the alert.
     */
    style?: React.CSSProperties;

    /**
     * Whether the button group should appear with vertical styling.
     * @default false
     */
    vertical?: boolean;
}

@PureRender
export class ButtonGroup extends React.Component<IButtonGroupProps, {}> {
    public static displayName = "Blueprint.ButtonGroup";

    public render() {
        const className = classNames(
            Classes.BUTTON_GROUP,
            {
                [Classes.FILL]: this.props.fill,
                [Classes.MINIMAL]: this.props.minimal,
                [Classes.LARGE]: this.props.large,
                [Classes.VERTICAL]: this.props.vertical,
            },
            this.props.className,
        );
        return (
            <div className={className} style={this.props.style}>
                {this.props.children}
            </div>
        );
    }
}
