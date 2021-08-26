/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import {
    AbstractPureComponent2,
    Classes as CoreClasses,
    DISPLAYNAME_PREFIX,
    IPopoverProps,
    TagInputProps,
    Keys,
    Popover,
    PopoverInteractionKind,
    Position,
    TagInput,
    TagInputAddMethod,
    refHandler,
    setRef,
} from "@blueprintjs/core";

import { Classes, IListItemsProps } from "../../common";
import { IQueryListRendererProps, QueryList } from "../query-list/queryList";

// N.B. selectedItems should really be a required prop, but is left optional for backwards compatibility

// eslint-disable-next-line deprecation/deprecation
export type MultiSelectProps<T> = IMultiSelectProps<T>;
/** @deprecated use MultiSelectProps */
export interface IMultiSelectProps<T> extends IListItemsProps<T> {
    /**
     * Whether the component should take up the full width of its container.
     * This overrides `popoverProps.fill` and `tagInputProps.fill`.
     */
    fill?: boolean;

    /**
     * Callback invoked when an item is removed from the selection by
     * removing its tag in the TagInput. This is generally more useful than
     * `tagInputProps.onRemove`  because it receives the removed value instead of
     * the value's rendered `ReactNode` tag.
     *
     * It is not recommended to supply _both_ this prop and `tagInputProps.onRemove`.
     */
    onRemove?: (value: T, index: number) => void;

    /**
     * If true, the component waits until a keydown event in the TagInput
     * before opening its popover.
     *
     * If false, the popover opens immediately after a mouse click focuses
     * the component's TagInput.
     *
     * N.B. the behavior of this prop differs slightly from the same one
     * in the Suggest component; see https://github.com/palantir/blueprint/issues/4152.
     *
     * @default false
     */
    openOnKeyDown?: boolean;

    /**
     * Input placeholder text. Shorthand for `tagInputProps.placeholder`.
     *
     * @default "Search..."
     */
    placeholder?: string;

    /** Props to spread to `Popover`. Note that `content` cannot be changed. */
    // eslint-disable-next-line @typescript-eslint/ban-types
    popoverProps?: Partial<IPopoverProps> & object;

    /** Controlled selected values. */
    selectedItems?: T[];

    /** Props to spread to `TagInput`. Use `query` and `onQueryChange` to control the input. */
    // eslint-disable-next-line @typescript-eslint/ban-types
    tagInputProps?: Partial<TagInputProps> & object;

    /** Custom renderer to transform an item into tag content. */
    tagRenderer: (item: T) => React.ReactNode;
}

export interface IMultiSelectState {
    isOpen: boolean;
}

export class MultiSelect<T> extends AbstractPureComponent2<MultiSelectProps<T>, IMultiSelectState> {
    public static displayName = `${DISPLAYNAME_PREFIX}.MultiSelect`;

    public static defaultProps = {
        fill: false,
        placeholder: "Search...",
    };

    public static ofType<U>() {
        return MultiSelect as new (props: MultiSelectProps<U>) => MultiSelect<U>;
    }

    public state: IMultiSelectState = {
        isOpen: (this.props.popoverProps && this.props.popoverProps.isOpen) || false,
    };

    private TypedQueryList = QueryList.ofType<T>();

    public input: HTMLInputElement | null = null;

    public queryList: QueryList<T> | null = null;

    private refHandlers: {
        input: React.RefCallback<HTMLInputElement>;
        queryList: React.RefCallback<QueryList<T>>;
    } = {
        input: refHandler(this, "input", this.props.tagInputProps?.inputRef),
        queryList: (ref: QueryList<T> | null) => (this.queryList = ref),
    };

    public componentDidUpdate(prevProps: MultiSelectProps<T>) {
        if (prevProps.tagInputProps?.inputRef !== this.props.tagInputProps?.inputRef) {
            setRef(prevProps.tagInputProps?.inputRef, null);
            this.refHandlers.input = refHandler(this, "input", this.props.tagInputProps?.inputRef);
            setRef(this.props.tagInputProps?.inputRef, this.input);
        }
    }

    public render() {
        // omit props specific to this component, spread the rest.
        const { openOnKeyDown, popoverProps, tagInputProps, ...restProps } = this.props;

        return (
            <this.TypedQueryList
                {...restProps}
                onItemSelect={this.handleItemSelect}
                onQueryChange={this.handleQueryChange}
                ref={this.refHandlers.queryList}
                renderer={this.renderQueryList}
            />
        );
    }

    private renderQueryList = (listProps: IQueryListRendererProps<T>) => {
        const { fill, tagInputProps = {}, popoverProps = {}, selectedItems = [], placeholder } = this.props;
        const { handlePaste, handleKeyDown, handleKeyUp } = listProps;

        if (fill) {
            popoverProps.fill = true;
            tagInputProps.fill = true;
        }

        // add our own inputProps.className so that we can reference it in event handlers
        const inputProps = {
            ...tagInputProps.inputProps,
            className: classNames(tagInputProps.inputProps?.className, Classes.MULTISELECT_TAG_INPUT_INPUT),
        };

        const handleTagInputAdd = (values: any[], method: TagInputAddMethod) => {
            if (method === "paste") {
                handlePaste(values);
            }
        };

        return (
            /* eslint-disable-next-line deprecation/deprecation */
            <Popover
                autoFocus={false}
                canEscapeKeyClose={true}
                enforceFocus={false}
                isOpen={this.state.isOpen}
                position={Position.BOTTOM_LEFT}
                {...popoverProps}
                className={classNames(listProps.className, popoverProps.className)}
                interactionKind={PopoverInteractionKind.CLICK}
                onInteraction={this.handlePopoverInteraction}
                popoverClassName={classNames(Classes.MULTISELECT_POPOVER, popoverProps.popoverClassName)}
                onOpened={this.handlePopoverOpened}
            >
                <div
                    onKeyDown={this.getTagInputKeyDownHandler(handleKeyDown)}
                    onKeyUp={this.getTagInputKeyUpHandler(handleKeyUp)}
                >
                    <TagInput
                        placeholder={placeholder}
                        {...tagInputProps}
                        className={classNames(Classes.MULTISELECT, tagInputProps.className)}
                        inputRef={this.refHandlers.input}
                        inputProps={inputProps}
                        inputValue={listProps.query}
                        /* eslint-disable-next-line react/jsx-no-bind */
                        onAdd={handleTagInputAdd}
                        onInputChange={listProps.handleQueryChange}
                        onRemove={this.handleTagRemove}
                        values={selectedItems.map(this.props.tagRenderer)}
                    />
                </div>
                <div onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
                    {listProps.itemList}
                </div>
                {/* eslint-disable-next-line deprecation/deprecation */}
            </Popover>
        );
    };

    private handleItemSelect = (item: T, evt?: React.SyntheticEvent<HTMLElement>) => {
        if (this.input != null) {
            this.input.focus();
        }
        this.props.onItemSelect?.(item, evt);
    };

    private handleQueryChange = (query: string, evt?: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ isOpen: query.length > 0 || !this.props.openOnKeyDown });
        this.props.onQueryChange?.(query, evt);
    };

    // Popover interaction kind is CLICK, so this only handles click events.
    // Note that we defer to the next animation frame in order to get the latest document.activeElement
    private handlePopoverInteraction = (nextOpenState: boolean, evt?: React.SyntheticEvent<HTMLElement>) =>
        this.requestAnimationFrame(() => {
            const isInputFocused = this.input === document.activeElement;

            if (this.input != null && !isInputFocused) {
                // input is no longer focused, we should close the popover
                this.setState({ isOpen: false });
            } else if (!this.props.openOnKeyDown) {
                // we should open immediately on click focus events
                this.setState({ isOpen: true });
            }

            this.props.popoverProps?.onInteraction?.(nextOpenState, evt);
        });

    private handlePopoverOpened = (node: HTMLElement) => {
        if (this.queryList != null) {
            // scroll active item into view after popover transition completes and all dimensions are stable.
            this.queryList.scrollActiveItemIntoView();
        }
        this.props.popoverProps?.onOpened?.(node);
    };

    private handleTagRemove = (tag: React.ReactNode, index: number) => {
        const { selectedItems = [], onRemove, tagInputProps } = this.props;
        onRemove?.(selectedItems[index], index);
        tagInputProps?.onRemove?.(tag, index);
    };

    private getTagInputKeyDownHandler = (handleQueryListKeyDown: React.KeyboardEventHandler<HTMLElement>) => {
        return (e: React.KeyboardEvent<HTMLElement>) => {
            // HACKHACK: https://github.com/palantir/blueprint/issues/4165
            // eslint-disable-next-line deprecation/deprecation
            const { which } = e;

            if (which === Keys.ESCAPE || which === Keys.TAB) {
                // By default the escape key will not trigger a blur on the
                // input element. It must be done explicitly.
                if (this.input != null) {
                    this.input.blur();
                }
                this.setState({ isOpen: false });
            } else if (!(which === Keys.BACKSPACE || which === Keys.ARROW_LEFT || which === Keys.ARROW_RIGHT)) {
                this.setState({ isOpen: true });
            }

            const isTargetingTagRemoveButton = (e.target as HTMLElement).closest(`.${CoreClasses.TAG_REMOVE}`) != null;

            if (this.state.isOpen && !isTargetingTagRemoveButton) {
                handleQueryListKeyDown?.(e);
            }
        };
    };

    private getTagInputKeyUpHandler = (handleQueryListKeyUp: React.KeyboardEventHandler<HTMLElement>) => {
        return (e: React.KeyboardEvent<HTMLElement>) => {
            const isTargetingInput = (e.target as HTMLElement).classList.contains(Classes.MULTISELECT_TAG_INPUT_INPUT);

            // only handle events when the focus is on the actual <input> inside the TagInput, as that's
            // what QueryList is designed to do
            if (this.state.isOpen && isTargetingInput) {
                handleQueryListKeyUp?.(e);
            }
        };
    };
}
