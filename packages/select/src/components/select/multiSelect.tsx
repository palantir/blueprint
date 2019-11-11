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
    Classes as CoreClasses,
    DISPLAYNAME_PREFIX,
    IPopoverProps,
    ITagInputProps,
    Keys,
    Popover,
    Position,
    TagInput,
    TagInputAddMethod,
    Utils,
} from "@blueprintjs/core";
import { Classes, IListItemsProps } from "../../common";
import { IQueryListRendererProps, QueryList } from "../query-list/queryList";

export interface IMultiSelectProps<T> extends IListItemsProps<T> {
    /**
     * Whether the component should take up the full width of its container.
     * This overrides `popoverProps.fill` and `tagInputProps.fill`.
     */
    fill?: boolean;

    /**
     * Whether the popover opens on key down or when `TagInput` is focused.
     * @default false
     */
    openOnKeyDown?: boolean;

    /**
     * Input placeholder text. Shorthand for `tagInputProps.placeholder`.
     * @default "Search..."
     */
    placeholder?: string;

    /** Props to spread to `Popover`. Note that `content` cannot be changed. */
    popoverProps?: Partial<IPopoverProps> & object;

    /** Controlled selected values. */
    selectedItems?: T[];

    /** Props to spread to `TagInput`. Use `query` and `onQueryChange` to control the input. */
    tagInputProps?: Partial<ITagInputProps> & object;

    /** Custom renderer to transform an item into tag content. */
    tagRenderer: (item: T) => React.ReactNode;
}

export interface IMultiSelectState {
    isOpen: boolean;
}

export class MultiSelect<T> extends React.PureComponent<IMultiSelectProps<T>, IMultiSelectState> {
    public static displayName = `${DISPLAYNAME_PREFIX}.MultiSelect`;

    public static defaultProps = {
        fill: false,
        placeholder: "Search...",
    };

    public static ofType<T>() {
        return MultiSelect as new (props: IMultiSelectProps<T>) => MultiSelect<T>;
    }

    public state: IMultiSelectState = {
        isOpen: (this.props.popoverProps && this.props.popoverProps.isOpen) || false,
    };

    private TypedQueryList = QueryList.ofType<T>();
    private input: HTMLInputElement | null = null;
    private queryList: QueryList<T> | null = null;
    private refHandlers = {
        input: (ref: HTMLInputElement | null) => {
            this.input = ref;
            Utils.safeInvokeMember(this.props.tagInputProps, "inputRef", ref);
        },
        queryList: (ref: QueryList<T> | null) => (this.queryList = ref),
    };

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
        const { inputProps = {} } = tagInputProps;
        inputProps.className = classNames(inputProps.className, Classes.MULTISELECT_TAG_INPUT_INPUT);

        const handleTagInputAdd = (values: any[], method: TagInputAddMethod) => {
            if (method === "paste") {
                handlePaste(values);
            }
        };

        return (
            <Popover
                autoFocus={false}
                canEscapeKeyClose={true}
                enforceFocus={false}
                isOpen={this.state.isOpen}
                position={Position.BOTTOM_LEFT}
                {...popoverProps}
                className={classNames(listProps.className, popoverProps.className)}
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
                        onAdd={handleTagInputAdd}
                        onInputChange={listProps.handleQueryChange}
                        values={selectedItems.map(this.props.tagRenderer)}
                    />
                </div>
                <div onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
                    {listProps.itemList}
                </div>
            </Popover>
        );
    };

    private handleItemSelect = (item: T, evt?: React.SyntheticEvent<HTMLElement>) => {
        if (this.input != null) {
            this.input.focus();
        }
        Utils.safeInvoke(this.props.onItemSelect, item, evt);
    };

    private handleQueryChange = (query: string, evt?: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ isOpen: query.length > 0 || !this.props.openOnKeyDown });
        Utils.safeInvoke(this.props.onQueryChange, query, evt);
    };

    private handlePopoverInteraction = (nextOpenState: boolean) =>
        // deferring to rAF to get properly updated document.activeElement
        requestAnimationFrame(() => {
            if (this.input != null && this.input !== document.activeElement) {
                // the input is no longer focused so we can close the popover
                this.setState({ isOpen: false });
            } else if (!this.props.openOnKeyDown) {
                // open the popover when focusing the tag input
                this.setState({ isOpen: true });
            }
            Utils.safeInvokeMember(this.props.popoverProps, "onInteraction", nextOpenState);
        });

    private handlePopoverOpened = (node: HTMLElement) => {
        if (this.queryList != null) {
            // scroll active item into view after popover transition completes and all dimensions are stable.
            this.queryList.scrollActiveItemIntoView();
        }
        Utils.safeInvokeMember(this.props.popoverProps, "onOpened", node);
    };

    private getTagInputKeyDownHandler = (handleQueryListKeyDown: React.KeyboardEventHandler<HTMLElement>) => {
        return (e: React.KeyboardEvent<HTMLElement>) => {
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
                Utils.safeInvoke(handleQueryListKeyDown, e);
            }
        };
    };

    private getTagInputKeyUpHandler = (handleQueryListKeyUp: React.KeyboardEventHandler<HTMLElement>) => {
        return (e: React.KeyboardEvent<HTMLElement>) => {
            const isTargetingInput = (e.target as HTMLElement).classList.contains(Classes.MULTISELECT_TAG_INPUT_INPUT);

            // only handle events when the focus is on the actual <input> inside the TagInput, as that's
            // what QueryList is designed to do
            if (this.state.isOpen && isTargetingInput) {
                Utils.safeInvoke(handleQueryListKeyUp, e);
            }
        };
    };
}
