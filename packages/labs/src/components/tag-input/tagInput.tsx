/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import {
    AbstractComponent,
    Classes as CoreClasses,
    HTMLInputProps,
    IProps,
    ITagProps,
    Keys,
    Tag,
    Utils,
} from "@blueprintjs/core";
import * as Classes from "../../common/classes";

export interface ITagInputProps extends IProps {
    /** React props to pass to the `<input>` element */
    inputProps?: HTMLInputProps;

    /**
     * Callback invoked when new tags are added by the user pressing `enter` on the input.
     * Receives the current value of the input field split by `separator` into an array.
     * New tags are expected to be appended to the list.
     *
     * The input will be cleared after `onAdd` is invoked _unless_ the callback explicitly
     * returns `false`. This is useful if the provided `value` is somehow invalid and should
     * not be added as a tag.
     */
    onAdd?: (values: string[]) => boolean | void;

    /**
     * Callback invoked when new tags are added or removed. Receives the updated list of `values`:
     * new tags are appended to the end of the list, removed tags are removed at their index.
     *
     * Like `onAdd`, the input will be cleared after this handler is invoked _unless_ the callback
     * explicitly returns `false`.
     *
     * This callback essentially implements basic `onAdd` and `onRemove` functionality and merges
     * the two handlers into one to simplify controlled usage.
     */
    onChange?: (values: string[]) => boolean | void;

    /**
     * Callback invoked when the user clicks the X button on a tag.
     * Receives value and index of removed tag.
     */
    onRemove?: (value: string, index: number) => void;

    /**
     * HTML input placeholder text which will not appear if `values` contains any items.
     * Use `inputProps.placeholder` if you want the placeholder text to _always_ appear.
     *
     * If you define both `placeholder` and `inputProps.placeholder`, then the former will appear
     * when `values` is empty and the latter at all other times.
     */
    placeholder?: string;

    /**
     * Separator pattern used to split input text into multiple values.
     * Explicit `false` value disables splitting (note that `onAdd` will still receive an array of length 1).
     * @default  \/,\s*\/g
     */
    separator?: string | RegExp | false;

    /**
     * React props to pass to each `Tag`. Provide an object to pass the same props to every tag,
     * or a function to customize props per tag.
     *
     * If you define `onRemove` here then you will have to implement your own tag removal
     * handling as `TagInput`'s own `onRemove` handler will never be invoked.
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

/** special value for absence of active tag */
const NONE = -1;

@PureRender
export class TagInput extends AbstractComponent<ITagInputProps, ITagInputState> {
    public static displayName = "Blueprint.TagInput";

    public static defaultProps: Partial<ITagInputProps> & object = {
        inputProps: {},
        separator: /,\s*/g,
        tagProps: {},
    };

    public state: ITagInputState = {
        activeIndex: NONE,
        inputValue: "",
        isInputFocused: false,
    };

    private inputElement: HTMLInputElement;
    private refHandlers = {
        input: (ref: HTMLInputElement) => {
            this.inputElement = ref;
            // can't use safeInvoke cuz inputProps.ref can be `string | function`
            const refHandler = this.props.inputProps.ref;
            if (Utils.isFunction(refHandler)) {
                refHandler(ref);
            }
        },
    };

    public render() {
        const { className, inputProps, placeholder, values } = this.props;

        const classes = classNames(CoreClasses.INPUT, Classes.TAG_INPUT, {
            [CoreClasses.ACTIVE]: this.state.isInputFocused,
        }, className);

        const resolvedPlaceholder = placeholder == null || values.length > 0
            ? inputProps.placeholder
            : placeholder;

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
                    placeholder={resolvedPlaceholder}
                    ref={this.refHandlers.input}
                    className={classNames(Classes.INPUT_GHOST, inputProps.className)}
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

    private getNextActiveIndex(direction: number) {
        const { activeIndex } = this.state;
        const totalItems = this.props.values.length;

        if (activeIndex === NONE && direction < 0) {
            // nothing active, moving left: select last
            return totalItems - 1;
        } else if (activeIndex === NONE && direction > 0) {
            // nothing active, moving right: do nothing
            return NONE;
        } else {
            // otherwise, move in direction and clamp to bounds.
            // note that upper bound allows going one beyond last item
            // so focus can move off the right end, into the text input.
            return Utils.clamp(activeIndex + direction, 0, totalItems);
        }
    }

    /**
     * Splits inputValue on separator prop and removes outer whitespace from each new value.
     * Empty values are ignored.
     */
    private getValues(inputValue: string) {
        const { separator } = this.props;
        const newValue = inputValue.trim();
        if (separator === false) {
            return [newValue];
        } else {
            // NOTE: split() typings define two overrides for string and RegExp which doesn't play
            // well with union prop type, so we'll just cast to one of the valid types.
            return newValue.split(separator as RegExp).filter((val) => val.length > 0);
        }

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
            this.setState({ activeIndex: NONE, isInputFocused: false });
        }
    })

    private handleInputFocus = (event: React.FocusEvent<HTMLElement>) => {
        this.setState({ isInputFocused: true });
        Utils.safeInvoke(this.props.inputProps.onFocus, event);
    }

    private handleInputChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
        this.setState({ activeIndex: NONE, inputValue: event.currentTarget.value });
        Utils.safeInvoke(this.props.inputProps.onChange, event);
    }

    private handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const { selectionEnd, value } = event.currentTarget;
        if (event.which === Keys.ENTER && value.length > 0) {
            // enter key on non-empty string invokes onAdd
            const newValues = this.getValues(value);
            let shouldClearInput = Utils.safeInvoke(this.props.onAdd, newValues);
            if (Utils.isFunction(this.props.onChange)) {
                shouldClearInput = shouldClearInput || this.props.onChange([...this.props.values, ...newValues]);
            }
            // only explicit return false cancels text clearing
            if (shouldClearInput !== false) {
                this.setState({ inputValue: "" });
            }
        } else if (selectionEnd === 0 && this.props.values.length > 0) {
            // cursor at beginning of input allows interaction with tags.
            // use selectionEnd to verify cursor position and no text selection.
            if (event.which === Keys.ARROW_LEFT || event.which === Keys.ARROW_RIGHT) {
                const nextIndex = this.getNextActiveIndex(event.which === Keys.ARROW_RIGHT ? 1 : -1);
                if (nextIndex !== this.state.activeIndex) {
                    event.preventDefault();
                    this.setState({ activeIndex: nextIndex });
                }
            } else if (event.which === Keys.BACKSPACE) {
                this.handleBackspaceToRemove(event);
            }
        }
        Utils.safeInvoke(this.props.inputProps.onKeyDown, event);
    }

    private handleRemoveTag = (event: React.MouseEvent<HTMLSpanElement>) => {
        // using data attribute to simplify callback logic -- one handler for all children
        const index = +event.currentTarget.parentElement.getAttribute("data-tag-index");
        this.removeIndexFromValues(index);
    }

    private handleBackspaceToRemove(event: React.KeyboardEvent<HTMLInputElement>) {
        const previousActiveIndex = this.state.activeIndex;
        // always move leftward one item (this will focus last item if nothing is focused)
        this.setState({ activeIndex: this.getNextActiveIndex(-1) });
        // delete item if there was a previous valid selection (ignore first backspace to focus last item)
        if (this.isValidIndex(previousActiveIndex)) {
            event.preventDefault();
            this.removeIndexFromValues(previousActiveIndex);
        }
    }

    /** Invokes `onAdd` and `onChange` accordingly to remove the item at the given index. */
    private removeIndexFromValues(index: number) {
        const { onChange, onRemove, values } = this.props;
        Utils.safeInvoke(onRemove, values[index], index);
        if (Utils.isFunction(onChange)) {
            onChange(values.filter((_, i) => i !== index));
        }
    }

    /** Returns whether the given index represents a valid item in `this.props.values`. */
    private isValidIndex(index: number) {
        return index !== NONE && index < this.props.values.length;
    }
}
