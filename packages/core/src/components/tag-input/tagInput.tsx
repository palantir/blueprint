/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import { AbstractComponent } from "../../common/abstractComponent";
import * as Classes from "../../common/classes";
import * as Keys from "../../common/keys";
import { HTMLInputProps, IProps } from "../../common/props";
import * as Utils from "../../common/utils";
import { Icon, IconName } from "../icon/icon";
import { ITagProps, Tag } from "../tag/tag";

export interface ITagInputProps extends IProps {
    /**
     * Whether the component is non-interactive.
     * Note that you'll also need to disable the component's `rightElement`,
     * if appropriate.
     * @default false
     */
    disabled?: boolean;

    /** React props to pass to the `<input>` element */
    inputProps?: HTMLInputProps;

    /** Name of the icon (the part after `pt-icon-`) to render on left side of input. */
    leftIconName?: IconName;

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
     *
     * **Note about typed usage:** Your handler can declare a subset type of `React.ReactNode[]`,
     * such as `string[]` or `Array<string | JSX.Element>`, to match the type of your `values` array:
     * ```tsx
     * <TagInput
     *     onChange={(values: string[]) => this.setState({ values })}
     *     values={["apple", "banana", "cherry"]}
     * />
     * ```
     */
    onChange?: (values: React.ReactNode[]) => boolean | void;

    /**
     * Callback invoked when the user clicks the X button on a tag.
     * Receives value and index of removed tag.
     */
    onRemove?: (value: string, index: number) => void;

    /**
     * Input placeholder text which will not appear if `values` contains any items
     * (consistent with default HTML input behavior).
     * Use `inputProps.placeholder` if you want the placeholder text to _always_ appear.
     *
     * If you define both `placeholder` and `inputProps.placeholder`, then the former will appear
     * when `values` is empty and the latter at all other times.
     */
    placeholder?: string;

    /**
     * Element to render on right side of input.
     * For best results, use a small minimal button, tag, or spinner.
     */
    rightElement?: JSX.Element;

    /**
     * Separator pattern used to split input text into multiple values.
     * Explicit `false` value disables splitting (note that `onAdd` will still receive an array of length 1).
     * @default ","
     */
    separator?: string | RegExp | false;

    /**
     * React props to pass to each `Tag`. Provide an object to pass the same props to every tag,
     * or a function to customize props per tag.
     *
     * If you define `onRemove` here then you will have to implement your own tag removal
     * handling as `TagInput`'s own `onRemove` handler will never be invoked.
     */
    tagProps?: ITagProps | ((value: React.ReactNode, index: number) => ITagProps);

    /**
     * Controlled tag values. Each value will be rendered inside a `Tag`, which can be customized
     * using `tagProps`. Therefore, any valid React node can be used as a `TagInput` value; falsy
     * values will not be rendered.
     *
     * __Note about typed usage:__ If you know your `values` will always be of a certain `ReactNode`
     * subtype, such as `string` or `ReactChild`, you can use that type on all your handlers
     * to simplify type logic.
     */
    values: React.ReactNode[];
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
        separator: ",",
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
        const { className, inputProps, leftIconName, placeholder, values } = this.props;

        const classes = classNames(
            Classes.INPUT,
            Classes.TAG_INPUT,
            {
                [Classes.ACTIVE]: this.state.isInputFocused,
                [Classes.DISABLED]: this.props.disabled,
            },
            className,
        );
        const isLarge = classes.indexOf(Classes.LARGE) > NONE;

        // use placeholder prop only if it's defined and values list is empty or contains only falsy values
        const isSomeValueDefined = values.some(val => !!val);
        const resolvedPlaceholder = placeholder == null || isSomeValueDefined ? inputProps.placeholder : placeholder;

        return (
            <div className={classes} onBlur={this.handleBlur} onClick={this.handleContainerClick}>
                <Icon className={Classes.TAG_INPUT_ICON} iconName={leftIconName} iconSize={isLarge ? 20 : 16} />
                {values.map(this.maybeRenderTag)}
                <input
                    value={this.state.inputValue}
                    {...inputProps}
                    onFocus={this.handleInputFocus}
                    onChange={this.handleInputChange}
                    onKeyDown={this.handleInputKeyDown}
                    placeholder={resolvedPlaceholder}
                    ref={this.refHandlers.input}
                    className={classNames(Classes.INPUT_GHOST, inputProps.className)}
                    disabled={this.props.disabled}
                />
                {this.props.rightElement}
            </div>
        );
    }

    private maybeRenderTag = (tag: React.ReactNode, index: number) => {
        if (!tag) {
            return null;
        }
        const { tagProps } = this.props;
        const props = Utils.isFunction(tagProps) ? tagProps(tag, index) : tagProps;
        return (
            <Tag
                active={index === this.state.activeIndex}
                data-tag-index={index}
                key={tag + "__" + index}
                onRemove={this.props.disabled ? null : this.handleRemoveTag}
                {...props}
            >
                {tag}
            </Tag>
        );
    };

    private getNextActiveIndex(direction: number) {
        const { activeIndex } = this.state;
        if (activeIndex === NONE) {
            // nothing active & moving left: select last defined value. otherwise select nothing.
            return direction < 0 ? this.findNextIndex(this.props.values.length, -1) : NONE;
        } else {
            // otherwise, move in direction and clamp to bounds.
            // note that upper bound allows going one beyond last item
            // so focus can move off the right end, into the text input.
            return this.findNextIndex(activeIndex, direction);
        }
    }

    private findNextIndex(startIndex: number, direction: number) {
        const { values } = this.props;
        let index = startIndex + direction;
        while (index > 0 && index < values.length && !values[index]) {
            index += direction;
        }
        return Utils.clamp(index, 0, values.length);
    }

    /**
     * Splits inputValue on separator prop,
     * trims whitespace from each new value,
     * and ignores empty values.
     */
    private getValues(inputValue: string) {
        const { separator } = this.props;
        // NOTE: split() typings define two overrides for string and RegExp.
        // this does not play well with our union prop type, so we'll just declare it as a valid type.
        return (separator === false ? [inputValue] : inputValue.split(separator as string))
            .map(val => val.trim())
            .filter(val => val.length > 0);
    }

    private handleContainerClick = () => {
        if (this.inputElement != null) {
            this.inputElement.focus();
        }
    };

    private handleBlur = () =>
        requestAnimationFrame(() => {
            // this event is attached to the container element to capture all blur events from inside.
            // we only need to "unfocus" if the blur event is leaving the container.
            // defer this check using rAF so activeElement will have updated.
            if (this.inputElement != null && !this.inputElement.parentElement.contains(document.activeElement)) {
                this.setState({ activeIndex: NONE, isInputFocused: false });
            }
        });

    private handleInputFocus = (event: React.FocusEvent<HTMLElement>) => {
        this.setState({ isInputFocused: true });
        Utils.safeInvoke(this.props.inputProps.onFocus, event);
    };

    private handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ activeIndex: NONE, inputValue: event.currentTarget.value });
        Utils.safeInvoke(this.props.inputProps.onChange, event);
    };

    private handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const { selectionEnd, value } = event.currentTarget;
        if (event.which === Keys.ENTER && value.length > 0) {
            const { onAdd, onChange, values } = this.props;
            // enter key on non-empty string invokes onAdd
            const newValues = this.getValues(value);
            let shouldClearInput = Utils.safeInvoke(onAdd, newValues);
            // avoid a potentially expensive computation if this prop is omitted
            if (Utils.isFunction(onChange)) {
                shouldClearInput = shouldClearInput || onChange([...values, ...newValues]);
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
    };

    private handleRemoveTag = (event: React.MouseEvent<HTMLSpanElement>) => {
        // using data attribute to simplify callback logic -- one handler for all children
        const index = +event.currentTarget.parentElement.getAttribute("data-tag-index");
        this.removeIndexFromValues(index);
    };

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

    /** Remove the item at the given index by invoking `onRemove` and `onChange` accordingly. */
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
