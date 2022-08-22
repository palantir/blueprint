/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import classNames from "classnames";
import * as React from "react";

import { AbstractPureComponent2, Classes, refHandler, setRef } from "../../common";
import { DISPLAYNAME_PREFIX, IntentProps, Props } from "../../common/props";

// eslint-disable-next-line deprecation/deprecation
export type TextAreaProps = ITextAreaProps;
/** @deprecated use TextAreaProps */
export interface ITextAreaProps extends IntentProps, Props, React.TextareaHTMLAttributes<HTMLTextAreaElement> {
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
    inputRef?: React.Ref<HTMLTextAreaElement>;
}

export interface ITextAreaState {
    height?: number;
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
export class TextArea extends AbstractPureComponent2<TextAreaProps, ITextAreaState> {
    public static displayName = `${DISPLAYNAME_PREFIX}.TextArea`;

    public state: ITextAreaState = {};

    // used to measure and set the height of the component on first mount
    public textareaElement: HTMLTextAreaElement | null = null;

    private handleRef: React.RefCallback<HTMLTextAreaElement> = refHandler(
        this,
        "textareaElement",
        this.props.inputRef,
    );

    public componentDidMount() {
        if (this.props.growVertically && this.textareaElement !== null) {
            // HACKHACK: this should probably be done in getSnapshotBeforeUpdate
            /* eslint-disable-next-line react/no-did-mount-set-state */
            this.setState({
                height: this.textareaElement?.scrollHeight,
            });
        }
    }

    public componentDidUpdate(prevProps: TextAreaProps) {
        if (prevProps.inputRef !== this.props.inputRef) {
            setRef(prevProps.inputRef, null);
            this.handleRef = refHandler(this, "textareaElement", this.props.inputRef);
            setRef(this.props.inputRef, this.textareaElement);
        }
    }

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

        // add explicit height style while preserving user-supplied styles if they exist
        let { style = {} } = htmlProps;
        if (growVertically && this.state.height != null) {
            // this style object becomes non-extensible when mounted (at least in the enzyme renderer),
            // so we make a new one to add a property
            style = {
                ...style,
                height: `${this.state.height}px`,
            };
        }

        return (
            <textarea
                {...htmlProps}
                className={rootClasses}
                onChange={this.handleChange}
                ref={this.handleRef}
                style={style}
            />
        );
    }

    private handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
