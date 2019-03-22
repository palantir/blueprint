/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";
import * as Classes from "../../common/classes";
import { DISPLAYNAME_PREFIX, IIntentProps, IProps } from "../../common/props";

export interface ITextAreaProps extends IIntentProps, IProps, React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    /**
     * Whether the text area should take up the full width of its container.
     */
    fill?: boolean;

    /**
     * Whether the text area should appear with large styling.
     */
    large?: boolean;

    /**
     * Whether the text area should appear with small styling.
     */
    small?: boolean;

    /**
     * Whether the text area should automatically grow vertically to accomodate content.
     */
    growVertically?: boolean;

    /**
     * Ref handler that receives HTML `<textarea>` element backing this component.
     */
    inputRef?: (ref: HTMLTextAreaElement | null) => any;
}

export interface ITextAreaState {
    height?: number;
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
export class TextArea extends React.PureComponent<ITextAreaProps, ITextAreaState> {
    public static displayName = `${DISPLAYNAME_PREFIX}.TextArea`;

    public state: ITextAreaState = {};

    public render() {
        const { className, fill, inputRef, intent, large, small, growVertically, ...htmlProps } = this.props;

        const rootClasses = classNames(
            Classes.INPUT,
            Classes.intentClass(intent),
            {
                [Classes.FILL]: fill,
                [Classes.LARGE]: large,
                [Classes.SMALL]: small,
            },
            className,
        );

        const styleProps =
            this.props.growVertically && this.state.height != null
                ? {
                      style: {
                          height: `${this.state.height}px`,
                      },
                  }
                : {};

        return (
            <textarea {...htmlProps} {...styleProps} className={rootClasses} ref={inputRef} onChange={this.onChange} />
        );
    }

    private onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (this.props.growVertically) {
            this.setState({
                height: e.target.scrollHeight,
            });
        }

        if (this.props.onChange != null) {
            this.props.onChange(e);
        }
    };
}
