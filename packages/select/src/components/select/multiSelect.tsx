/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import {
    DISPLAYNAME_PREFIX,
    IPopoverProps,
    ITagInputProps,
    Keys,
    Popover,
    Position,
    TagInput,
    Utils,
} from "@blueprintjs/core";
import { Classes, IListItemsProps } from "../../common";
import { IQueryListRendererProps, QueryList } from "../query-list/queryList";

export interface IMultiSelectProps<T> extends IListItemsProps<T> {
    /** Controlled selected values. */
    selectedItems?: T[];

    /**
     * Whether the popover opens on key down or when `TagInput` is focused.
     * @default false
     */
    openOnKeyDown?: boolean;

    /** Props to spread to `Popover`. Note that `content` cannot be changed. */
    popoverProps?: Partial<IPopoverProps> & object;

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

    public static ofType<T>() {
        return MultiSelect as new (props: IMultiSelectProps<T>) => MultiSelect<T>;
    }

    public state: IMultiSelectState = {
        isOpen: (this.props.popoverProps && this.props.popoverProps.isOpen) || false,
    };

    private TypedQueryList = QueryList.ofType<T>();
    private input?: HTMLInputElement | null;
    private queryList?: QueryList<T> | null;
    private refHandlers = {
        input: (ref: HTMLInputElement | null) => {
            this.input = ref;
            const { tagInputProps = {} } = this.props;
            Utils.safeInvoke(tagInputProps.inputRef, ref);
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
        const { tagInputProps = {}, popoverProps = {}, selectedItems = [] } = this.props;
        const { handleKeyDown, handleKeyUp } = listProps;

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
                    onKeyDown={this.getTargetKeyDownHandler(handleKeyDown)}
                    onKeyUp={this.state.isOpen ? handleKeyUp : undefined}
                >
                    <TagInput
                        placeholder="Search..."
                        {...tagInputProps}
                        className={classNames(Classes.MULTISELECT, tagInputProps.className)}
                        inputRef={this.refHandlers.input}
                        inputValue={listProps.query}
                        onInputChange={listProps.handleQueryChange}
                        values={selectedItems.map(this.props.tagRenderer)}
                    />
                </div>
                <div onKeyDown={this.getTargetKeyDownHandler(handleKeyDown)} onKeyUp={handleKeyUp}>
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
        requestAnimationFrame(() => {
            // deferring to rAF to get properly updated activeElement
            const { popoverProps = {} } = this.props;
            if (this.input != null && this.input !== document.activeElement) {
                // the input is no longer focused so we can close the popover
                this.setState({ isOpen: false });
            } else if (!this.props.openOnKeyDown) {
                // open the popover when focusing the tag input
                this.setState({ isOpen: true });
            }
            Utils.safeInvoke(popoverProps.onInteraction, nextOpenState);
        });

    private handlePopoverOpened = (node: HTMLElement) => {
        const { popoverProps = {} } = this.props;
        if (this.queryList != null) {
            // scroll active item into view after popover transition completes and all dimensions are stable.
            this.queryList.scrollActiveItemIntoView();
        }
        Utils.safeInvoke(popoverProps.onOpened, node);
    };

    private getTargetKeyDownHandler = (
        handleQueryListKeyDown: React.EventHandler<React.KeyboardEvent<HTMLElement>>,
    ) => {
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

            if (this.state.isOpen) {
                Utils.safeInvoke(handleQueryListKeyDown, e);
            }
        };
    };
}
