/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";
import * as Classes from "../../common/classes";
import { IIntentProps, IProps } from "../../common/props";

export interface ITextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, IIntentProps, IProps {
    /**
     * Whether the text area should take up the full width of its container.
     */
    fill?: boolean;

    /**
     * Whether the text area should appear with large styling.
     */
    large?: boolean;
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
export class TextArea extends React.PureComponent<ITextAreaProps, {}> {
    public static displayName = "Blueprint2.TextArea";

    public render() {
        const { className, fill, intent, large, ...htmlProps } = this.props;

        const rootClasses = classNames(
            Classes.INPUT,
            Classes.intentClass(intent),
            {
                [Classes.FILL]: fill,
                [Classes.LARGE]: large,
            },
            className,
        );

        return <textarea {...htmlProps} className={rootClasses} />;
    }
}
