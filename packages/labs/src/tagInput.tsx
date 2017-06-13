/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import { AbstractComponent, Classes, HTMLInputProps, IProps, ITagProps, Keys, Tag, Utils } from "@blueprintjs/core";

export interface ITagInputProps extends IProps {
    /** React props to pass to the `<input>` element */
    inputProps?: HTMLInputProps;

    /**
     * Callback invoked when a new tag is added by the user pressing `enter` on the input.
     * Receives the current value of the input field. New tags are expected to be appended to
     * the list.
     */
    onAdd?: (value: string) => void;

    /**
     * Callback invoked when the user clicks the X button on a tag.
     * Receives value and index of removed tag.
     */
    onRemove?: (value: string, index: number) => void;

    /**
     * React props to pass to each `Tag`. Provide an object to pass the same props to every tag,
     * or a function to customize props per tag.
     *
     * If you define `onRemove` here then you will have to implement your own tag removal
     * handling as the `TagInput` `onRemove` prop will never be invoked.
     */
    tagProps?: ITagProps | ((value: string, index: number) => ITagProps);

    /** Controlled tag values. */
    values: string[];
}

export interface ITagInputState {
    inputValue?: string;
    isInputFocused?: boolean;
}

@PureRender
export class TagInput extends AbstractComponent<ITagInputProps, ITagInputState> {
    public static displayName = "Blueprint.TagInput";

    public static defaultProps: Partial<ITagInputProps> = {
        inputProps: {},
        tagProps: {},
    };

    public state: ITagInputState = { inputValue: "", isInputFocused: false };

    private inputElement: HTMLInputElement;
    private refHandlers = {
        input: (ref: HTMLInputElement) => this.inputElement = ref,
    };

    public render() {
        const { inputProps, tagProps, values } = this.props;

        const classes = classNames(Classes.INPUT, "pt-tag-input", {
            [Classes.ACTIVE]: this.state.isInputFocused,
        }, this.props.className);

        const tags = values.map((tag, i) => {
            const props = Utils.isFunction(tagProps) ? tagProps(tag, i) : tagProps;
            return <Tag data-tag-index={i} key={tag + "__" + i} onRemove={this.handleRemoveTag} {...props}>{tag}</Tag>;
        });
        return (
            <div className={classes} onClick={this.handleContainerClick}>
                {tags}
                <input
                    {...inputProps}
                    onBlur={this.handleInputBlur}
                    onFocus={this.handleInputFocus}
                    onChange={this.handleInputChange}
                    onKeyDown={this.handleInputKeyDown}
                    ref={this.refHandlers.input}
                    value={this.state.inputValue}
                    className={classNames("pt-input-invisible", inputProps.className)}
                />
            </div>
        );
    }

    private handleContainerClick = () => {
        if (this.inputElement != null) {
            this.inputElement.focus();
        }
    }

    private handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        this.setState({ isInputFocused: false });
        Utils.safeInvoke(this.props.inputProps.onBlur, event);
    }

    private handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        this.setState({ isInputFocused: true });
        Utils.safeInvoke(this.props.inputProps.onFocus, event);
    }

    private handleInputChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
        this.setState({ inputValue: event.currentTarget.value });
        Utils.safeInvoke(this.props.inputProps.onChange, event);
    }

    private handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
        if (event.which === Keys.ENTER && value.length > 0) {
            Utils.safeInvoke(this.props.onAdd, value);
            this.setState({ inputValue: "" });
        } else if (event.which === Keys.BACKSPACE && value.length === 0) {
            const lastIndex = this.props.values.length - 1;
            Utils.safeInvoke(this.props.onRemove, this.props.values[lastIndex], lastIndex);
        }
        Utils.safeInvoke(this.props.inputProps.onKeyDown, event);
    }

    private handleRemoveTag = (event: React.MouseEvent<HTMLSpanElement>) => {
        // using data attribute to simplify callback logic -- one handler for all children
        const index = +event.currentTarget.parentElement.getAttribute("data-tag-index");
        Utils.safeInvoke(this.props.onRemove, this.props.values[index], index);
    }
}
