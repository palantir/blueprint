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
    activeIndex?: number;
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

    public state: ITagInputState = {
        activeIndex: -1,
        inputValue: "",
        isInputFocused: false,
    };

    private inputElement: HTMLInputElement;
    private refHandlers = {
        input: (ref: HTMLInputElement) => {
            this.inputElement = ref;
            const refHandler = this.props.inputProps.ref;
            if (Utils.isFunction(refHandler)) {
                refHandler(ref);
            }
        },
    };

    public render() {
        const { className, inputProps, values } = this.props;

        const classes = classNames(Classes.INPUT, "pt-tag-input", {
            [Classes.ACTIVE]: this.state.isInputFocused,
        }, className);

        return (
            <div
                className={classes}
                onBlur={this.handleBlur}
                onClick={this.handleContainerClick}
            >
                {values.map(this.renderTag)}
                <input
                    value={this.state.inputValue}
                    {...inputProps}
                    onFocus={this.handleInputFocus}
                    onChange={this.handleInputChange}
                    onKeyDown={this.handleInputKeyDown}
                    ref={this.refHandlers.input}
                    className={classNames("pt-input-ghost", inputProps.className)}
                />
            </div>
        );
    }

    private renderTag = (tag: string, index: number) => {
        const { tagProps } = this.props;
        const props = Utils.isFunction(tagProps) ? tagProps(tag, index) : tagProps;
        return (
            <Tag
                active={index === this.state.activeIndex}
                data-tag-index={index}
                key={tag + "__" + index}
                onRemove={this.handleRemoveTag}
                {...props}
            >
                {tag}
            </Tag>
        );
    }

    private handleContainerClick = () => {
        if (this.inputElement != null) {
            this.inputElement.focus();
        }
    }

    private handleBlur = () => requestAnimationFrame(() => {
        // this event is attached to the container element to capture all blur events from inside.
        // we only need to "unfocus" if the blur event is leaving the container.
        // defer this check using rAF so activeElement will have updated.
        if (this.inputElement != null && !this.inputElement.parentElement.contains(document.activeElement)) {
            this.setState({ activeIndex: -1, isInputFocused: false });
        }
    })

    private handleInputFocus = (event: React.FocusEvent<HTMLElement>) => {
        this.setState({ isInputFocused: true });
        Utils.safeInvoke(this.props.inputProps.onFocus, event);
    }

    private handleInputChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
        this.setState({ activeIndex: -1, inputValue: event.currentTarget.value });
        Utils.safeInvoke(this.props.inputProps.onChange, event);
    }

    private handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const { selectionEnd, value } = event.currentTarget;
        if (event.which === Keys.ENTER && value.length > 0) {
            Utils.safeInvoke(this.props.onAdd, value);
            this.setState({ inputValue: "" });
        } else if (selectionEnd === 0 && this.props.values.length > 0) {
            // to adjust active index, cursor must be at start of input (or it is empty)
            if (event.which === Keys.ARROW_LEFT || event.which === Keys.ARROW_RIGHT) {
                this.moveActiveIndex(event);
            } else if (event.which === Keys.BACKSPACE) {
                this.removeActiveIndex(event);
            }
        }
        Utils.safeInvoke(this.props.inputProps.onKeyDown, event);
    }

    private handleRemoveTag = (event: React.MouseEvent<HTMLSpanElement>) => {
        // using data attribute to simplify callback logic -- one handler for all children
        const index = +event.currentTarget.parentElement.getAttribute("data-tag-index");
        Utils.safeInvoke(this.props.onRemove, this.props.values[index], index);
    }

    private moveActiveIndex(event: React.KeyboardEvent<HTMLInputElement>) {
        const { activeIndex } = this.state;
        const direction = event.which === Keys.ARROW_RIGHT ? 1 : -1;
        const totalItems = this.props.values.length;

        let nextActiveIndex = activeIndex;
        if (activeIndex < 0 && direction < 0) {
            // nothing active, moving left: select last
            nextActiveIndex = totalItems - 1;
        } else if (activeIndex < 0 && direction > 0) {
            // nothing active, moving right: do nothing
        } else {
            // otherwise, move in direction and clamp to bounds
            nextActiveIndex = Utils.clamp(activeIndex + direction, 0, totalItems - 1);
        }

        if (nextActiveIndex > 0 && nextActiveIndex === activeIndex) {
            // clear active tag if the same one comes up twice
            nextActiveIndex = -1;
        } else {
            // otherwise, selection changed so prevent input cursor movement
            event.preventDefault();
        }

        this.setState({ activeIndex: nextActiveIndex });
    }

    private removeActiveIndex(event: React.KeyboardEvent<HTMLInputElement>) {
        const { activeIndex } = this.state;
        this.moveActiveIndex(event);
        if (activeIndex >= 0) {
            Utils.safeInvoke(this.props.onRemove, this.props.values[activeIndex], activeIndex);
        }
    }
}
