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

import {
    DISPLAYNAME_PREFIX,
    HTMLInputProps,
    IInputGroupProps,
    InputGroup,
    IPopoverProps,
    Keys,
    Popover,
    Position,
    Utils,
} from "@blueprintjs/core";
import { Classes, IListItemsProps } from "../../common";
import { IQueryListRendererProps, QueryList } from "../query-list/queryList";

export interface ISuggestProps<T> extends IListItemsProps<T> {
    /**
     * Whether the popover should close after selecting an item.
     * @default true
     */
    closeOnSelect?: boolean;

    /** Whether the input field should be disabled. */
    disabled?: boolean;

    /**
     * Whether the component should take up the full width of its container.
     * This overrides `popoverProps.fill` and `inputProps.fill`.
     */
    fill?: boolean;

    /**
     * Props to spread to the query `InputGroup`. To control this input, use
     * `query` and `onQueryChange` instead of `inputProps.value` and
     * `inputProps.onChange`.
     */
    inputProps?: IInputGroupProps & HTMLInputProps;

    /** Custom renderer to transform an item into a string for the input value. */
    inputValueRenderer: (item: T) => string;

    /**
     * The uncontrolled default selected item.
     * This prop is ignored if `selectedItem` is used to control the state.
     */
    defaultSelectedItem?: T;

    /**
     * The currently selected item, or `null` to indicate that no item is selected.
     * If omitted or `undefined`, this prop will be uncontrolled (managed by the component's state).
     * Use `onItemSelect` to listen for updates.
     */
    selectedItem?: T | null;

    /**
     * Whether the popover opens on key down or when the input is focused.
     * @default false
     */
    openOnKeyDown?: boolean;

    /** Props to spread to `Popover`. Note that `content` cannot be changed. */
    popoverProps?: Partial<IPopoverProps> & object;

    /**
     * Whether the active item should be reset to the first matching item _when
     * the popover closes_. The query will also be reset to the empty string.
     * @default false
     */
    resetOnClose?: boolean;
}

export interface ISuggestState<T> {
    isOpen: boolean;
    selectedItem: T | null;
}

export class Suggest<T> extends React.PureComponent<ISuggestProps<T>, ISuggestState<T>> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Suggest`;

    public static defaultProps: Partial<ISuggestProps<any>> = {
        closeOnSelect: true,
        fill: false,
        openOnKeyDown: false,
        resetOnClose: false,
    };

    public static ofType<T>() {
        return Suggest as new (props: ISuggestProps<T>) => Suggest<T>;
    }

    public state: ISuggestState<T> = {
        isOpen: (this.props.popoverProps != null && this.props.popoverProps.isOpen) || false,
        selectedItem: this.getInitialSelectedItem(),
    };

    private TypedQueryList = QueryList.ofType<T>();
    private input: HTMLInputElement | null = null;
    private queryList: QueryList<T> | null = null;
    private refHandlers = {
        input: (ref: HTMLInputElement | null) => {
            this.input = ref;
            Utils.safeInvokeMember(this.props.inputProps, "inputRef", ref);
        },
        queryList: (ref: QueryList<T> | null) => (this.queryList = ref),
    };

    public render() {
        // omit props specific to this component, spread the rest.
        const { disabled, inputProps, popoverProps, ...restProps } = this.props;

        return (
            <this.TypedQueryList
                {...restProps}
                onItemSelect={this.handleItemSelect}
                ref={this.refHandlers.queryList}
                renderer={this.renderQueryList}
            />
        );
    }

    public componentDidUpdate(_prevProps: ISuggestProps<T>, prevState: ISuggestState<T>) {
        // If the selected item prop changes, update the underlying state.
        if (this.props.selectedItem !== undefined && this.props.selectedItem !== this.state.selectedItem) {
            this.setState({ selectedItem: this.props.selectedItem });
        }

        if (this.state.isOpen && !prevState.isOpen && this.queryList != null) {
            this.queryList.scrollActiveItemIntoView();
        }
    }

    private renderQueryList = (listProps: IQueryListRendererProps<T>) => {
        const { fill, inputProps = {}, popoverProps = {} } = this.props;
        const { isOpen, selectedItem } = this.state;
        const { handleKeyDown, handleKeyUp } = listProps;
        const { autoComplete = "off", placeholder = "Search..." } = inputProps;

        const selectedItemText = selectedItem ? this.props.inputValueRenderer(selectedItem) : "";
        // placeholder shows selected item while open.
        const inputPlaceholder = isOpen && selectedItemText ? selectedItemText : placeholder;
        // value shows query when open, and query remains when closed if nothing is selected.
        // if resetOnClose is enabled, then hide query when not open. (see handlePopoverOpening)
        const inputValue = isOpen
            ? listProps.query
            : selectedItemText || (this.props.resetOnClose ? "" : listProps.query);

        if (fill) {
            popoverProps.fill = true;
            inputProps.fill = true;
        }

        return (
            <Popover
                autoFocus={false}
                enforceFocus={false}
                isOpen={isOpen}
                position={Position.BOTTOM_LEFT}
                {...popoverProps}
                className={classNames(listProps.className, popoverProps.className)}
                onInteraction={this.handlePopoverInteraction}
                popoverClassName={classNames(Classes.SELECT_POPOVER, popoverProps.popoverClassName)}
                onOpening={this.handlePopoverOpening}
                onOpened={this.handlePopoverOpened}
            >
                <InputGroup
                    autoComplete={autoComplete}
                    disabled={this.props.disabled}
                    {...inputProps}
                    inputRef={this.refHandlers.input}
                    onChange={listProps.handleQueryChange}
                    onFocus={this.handleInputFocus}
                    onKeyDown={this.getTargetKeyDownHandler(handleKeyDown)}
                    onKeyUp={this.getTargetKeyUpHandler(handleKeyUp)}
                    placeholder={inputPlaceholder}
                    value={inputValue}
                />
                <div onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
                    {listProps.itemList}
                </div>
            </Popover>
        );
    };

    private selectText = () => {
        // wait until the input is properly focused to select the text inside of it
        requestAnimationFrame(() => {
            if (this.input != null) {
                this.input.setSelectionRange(0, this.input.value.length);
            }
        });
    };

    private handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        this.selectText();

        // TODO can we leverage Popover.openOnTargetFocus for this?
        if (!this.props.openOnKeyDown) {
            this.setState({ isOpen: true });
        }

        Utils.safeInvokeMember(this.props.inputProps, "onFocus", event);
    };

    private handleItemSelect = (item: T, event?: React.SyntheticEvent<HTMLElement>) => {
        let nextOpenState: boolean;
        if (!this.props.closeOnSelect) {
            if (this.input != null) {
                this.input.focus();
            }
            this.selectText();
            nextOpenState = true;
        } else {
            if (this.input != null) {
                this.input.blur();
            }
            nextOpenState = false;
        }
        // the internal state should only change when uncontrolled.
        if (this.props.selectedItem === undefined) {
            this.setState({
                isOpen: nextOpenState,
                selectedItem: item,
            });
        } else {
            // otherwise just set the next open state.
            this.setState({ isOpen: nextOpenState });
        }

        Utils.safeInvoke(this.props.onItemSelect, item, event);
    };

    private getInitialSelectedItem(): T | null {
        // controlled > uncontrolled > default
        if (this.props.selectedItem !== undefined) {
            return this.props.selectedItem;
        } else if (this.props.defaultSelectedItem !== undefined) {
            return this.props.defaultSelectedItem;
        } else {
            return null;
        }
    }

    private handlePopoverInteraction = (nextOpenState: boolean) =>
        requestAnimationFrame(() => {
            if (this.input != null && this.input !== document.activeElement) {
                // the input is no longer focused so we can close the popover
                this.setState({ isOpen: false });
            }
            Utils.safeInvokeMember(this.props.popoverProps, "onInteraction", nextOpenState);
        });

    private handlePopoverOpening = (node: HTMLElement) => {
        // reset query before opening instead of when closing to prevent flash of unfiltered items.
        // this is a limitation of the interactions between QueryList state and Popover transitions.
        if (this.props.resetOnClose && this.queryList) {
            this.queryList.setQuery("", true);
        }
        Utils.safeInvokeMember(this.props.popoverProps, "onOpening", node);
    };

    private handlePopoverOpened = (node: HTMLElement) => {
        // scroll active item into view after popover transition completes and all dimensions are stable.
        if (this.queryList != null) {
            this.queryList.scrollActiveItemIntoView();
        }
        Utils.safeInvokeMember(this.props.popoverProps, "onOpened", node);
    };

    private getTargetKeyDownHandler = (
        handleQueryListKeyDown: React.EventHandler<React.KeyboardEvent<HTMLElement>>,
    ) => {
        return (evt: React.KeyboardEvent<HTMLInputElement>) => {
            const { which } = evt;

            if (which === Keys.ESCAPE || which === Keys.TAB) {
                if (this.input != null) {
                    this.input.blur();
                }
                this.setState({ isOpen: false });
            } else if (
                this.props.openOnKeyDown &&
                which !== Keys.BACKSPACE &&
                which !== Keys.ARROW_LEFT &&
                which !== Keys.ARROW_RIGHT
            ) {
                this.setState({ isOpen: true });
            }

            if (this.state.isOpen) {
                Utils.safeInvoke(handleQueryListKeyDown, evt);
            }

            Utils.safeInvokeMember(this.props.inputProps, "onKeyDown", evt);
        };
    };

    private getTargetKeyUpHandler = (handleQueryListKeyUp: React.EventHandler<React.KeyboardEvent<HTMLElement>>) => {
        return (evt: React.KeyboardEvent<HTMLInputElement>) => {
            if (this.state.isOpen) {
                Utils.safeInvoke(handleQueryListKeyUp, evt);
            }
            Utils.safeInvokeMember(this.props.inputProps, "onKeyUp", evt);
        };
    };
}
