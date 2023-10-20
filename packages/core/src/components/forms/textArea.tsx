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

import { AbstractPureComponent, Classes, refHandler, setRef } from "../../common";
import { DISPLAYNAME_PREFIX, type IntentProps, type Props } from "../../common/props";
import { AsyncControllableTextArea } from "./asyncControllableTextArea";

export interface TextAreaProps extends IntentProps, Props, React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    /**
     * Set this to `true` if you will be controlling the `value` of this input with asynchronous updates.
     * These may occur if you do not immediately call setState in a parent component with the value from
     * the `onChange` handler, or if working with certain libraries like __redux-form__.
     *
     * @default false
     */
    asyncControl?: boolean;

    /**
     * Whether the component should automatically resize vertically as a user types in the text input.
     * This will disable manual resizing in the vertical dimension.
     *
     * @default false
     */
    autoResize?: boolean;

    /**
     * Whether the text area should take up the full width of its container.
     *
     * @default false
     */
    fill?: boolean;

    /**
     * Whether the text area should automatically grow vertically to accomodate content.
     *
     * @deprecated use the `autoResize` prop instead.
     */
    growVertically?: boolean;

    /**
     * Ref handler that receives HTML `<textarea>` element backing this component.
     */
    inputRef?: React.Ref<HTMLTextAreaElement>;

    /**
     * Whether the text area should appear with large styling.
     *
     * @default false
     */
    large?: boolean;

    /**
     * Whether the text area should appear with small styling.
     *
     * @default false
     */
    small?: boolean;
}

export interface TextAreaState {
    height?: number;
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
/**
 * Text area component.
 *
 * @see https://blueprintjs.com/docs/#core/components/text-area
 */
export class TextArea extends AbstractPureComponent<TextAreaProps, TextAreaState> {
    public static defaultProps: TextAreaProps = {
        autoResize: false,
        fill: false,
        large: false,
        small: false,
    };

    public static displayName = `${DISPLAYNAME_PREFIX}.TextArea`;

    public state: TextAreaState = {};

    // used to measure and set the height of the component on first mount
    public textareaElement: HTMLTextAreaElement | null = null;

    private handleRef: React.RefCallback<HTMLTextAreaElement> = refHandler(
        this,
        "textareaElement",
        this.props.inputRef,
    );

    private maybeSyncHeightToScrollHeight = () => {
        // eslint-disable-next-line deprecation/deprecation
        const { autoResize, growVertically } = this.props;

        if (this.textareaElement != null) {
            const { scrollHeight } = this.textareaElement;

            if (autoResize) {
                // set height to 0 to force scrollHeight to be the minimum height to fit
                // the content of the textarea
                this.textareaElement.style.height = "0px";
                this.textareaElement.style.height = scrollHeight.toString() + "px";
                this.setState({ height: scrollHeight });
            } else if (growVertically && scrollHeight > 0) {
                // N.B. this code path will be deleted in Blueprint v6.0 when `growVertically` is removed
                this.setState({ height: scrollHeight });
            }
        }

        if (this.props.autoResize && this.textareaElement != null) {
            // set height to 0 to force scrollHeight to be the minimum height to fit
            // the content of the textarea
            this.textareaElement.style.height = "0px";

            const { scrollHeight } = this.textareaElement;
            this.textareaElement.style.height = scrollHeight.toString() + "px";
            this.setState({ height: scrollHeight });
        }
    };

    public componentDidMount() {
        this.maybeSyncHeightToScrollHeight();
    }

    public componentDidUpdate(prevProps: TextAreaProps) {
        if (prevProps.inputRef !== this.props.inputRef) {
            setRef(prevProps.inputRef, null);
            this.handleRef = refHandler(this, "textareaElement", this.props.inputRef);
            setRef(this.props.inputRef, this.textareaElement);
        }

        if (prevProps.value !== this.props.value || prevProps.style !== this.props.style) {
            this.maybeSyncHeightToScrollHeight();
        }
    }

    public render() {
        const {
            asyncControl,
            autoResize,
            className,
            fill,
            // eslint-disable-next-line deprecation/deprecation
            growVertically,
            inputRef,
            intent,
            large,
            small,
            ...htmlProps
        } = this.props;

        const rootClasses = classNames(
            Classes.INPUT,
            Classes.TEXT_AREA,
            Classes.intentClass(intent),
            {
                [Classes.FILL]: fill,
                [Classes.LARGE]: large,
                [Classes.SMALL]: small,
                [Classes.TEXT_AREA_AUTO_RESIZE]: autoResize,
            },
            className,
        );

        // add explicit height style while preserving user-supplied styles if they exist
        let { style = {} } = htmlProps;
        if ((autoResize || growVertically) && this.state.height != null) {
            // this style object becomes non-extensible when mounted (at least in the enzyme renderer),
            // so we make a new one to add a property
            style = {
                ...style,
                height: `${this.state.height}px`,
            };
        }

        const TextAreaComponent = asyncControl ? AsyncControllableTextArea : "textarea";

        return (
            <TextAreaComponent
                {...htmlProps}
                className={rootClasses}
                onChange={this.handleChange}
                style={style}
                ref={this.handleRef}
            />
        );
    }

    private handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.maybeSyncHeightToScrollHeight();
        this.props.onChange?.(e);
    };
}
