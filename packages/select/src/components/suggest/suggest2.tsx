/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
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

/** @fileoverview "V2" variant of Suggest which uses Popover2 instead of Popover2 */

import classNames from "classnames";
import * as React from "react";

import {
    AbstractPureComponent2,
    DISPLAYNAME_PREFIX,
    InputGroup,
    InputGroupProps2,
    Keys,
    mergeRefs,
    refHandler,
    setRef,
    Utils,
} from "@blueprintjs/core";
import { Popover2, Popover2ClickTargetHandlers, Popover2TargetProps, PopupKind } from "@blueprintjs/popover2";

import { Classes, ListItemsProps, SelectPopoverProps } from "../../common";
import { QueryList, QueryListRendererProps } from "../query-list/queryList";

export interface Suggest2Props<T> extends ListItemsProps<T>, Omit<SelectPopoverProps, "popoverTargetProps"> {
    /**
     * Whether the popover should close after selecting an item.
     *
     * @default true
     */
    closeOnSelect?: boolean;

    /** Whether the input field should be disabled. */
    disabled?: boolean;

    /**
     * Whether the component should take up the full width of its container.
     */
    fill?: boolean;

    /**
     * Props to pass to the query [InputGroup component](#core/components/text-inputs.input-group).
     *
     * Some properties are unavailable:
     * - `inputProps.value`: use `query` instead
     * - `inputProps.onChange`: use `onQueryChange` instead
     * - `inputProps.disabled`: use `disabled` instead
     * - `inputProps.fill`: use `fill` instead
     *
     * Other notes:
     * - `inputProps.tagName` will override `popoverProps.targetTagName`
     * - `inputProps.className` will work as expected, but this is redundant with the simpler `className` prop
     */
    inputProps?: Partial<Omit<InputGroupProps2, "disabled" | "fill" | "value" | "onChange">>;

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
     * HTML attributes to add to the `Menu` listbox containing the selectable options.
     */
    menuProps?: React.HTMLAttributes<HTMLUListElement>;

    /**
     * If true, the component waits until a keydown event in the TagInput
     * before opening its popover.
     *
     * If false, the popover opens immediately after a mouse click or TAB key
     * interaction focuses the component's TagInput.
     *
     * @default false
     */
    openOnKeyDown?: boolean;

    /**
     * Whether the active item should be reset to the first matching item _when
     * the popover closes_. The query will also be reset to the empty string.
     *
     * @default false
     */
    resetOnClose?: boolean;
}

export interface Suggest2State<T> {
    isOpen: boolean;
    selectedItem: T | null;
}

/**
 * Suggest (v2) component.
 *
 * @see https://blueprintjs.com/docs/#select/suggest2
 */
export class Suggest2<T> extends AbstractPureComponent2<Suggest2Props<T>, Suggest2State<T>> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Suggest2`;

    public static defaultProps: Partial<Suggest2Props<any>> = {
        closeOnSelect: true,
        fill: false,
        openOnKeyDown: false,
        resetOnClose: false,
    };

    /** @deprecated no longer necessary now that the TypeScript parser supports type arguments on JSX element tags */
    public static ofType<U>() {
        return Suggest2 as new (props: Suggest2Props<U>) => Suggest2<U>;
    }

    public state: Suggest2State<T> = {
        isOpen: (this.props.popoverProps != null && this.props.popoverProps.isOpen) || false,
        selectedItem: this.getInitialSelectedItem(),
    };

    public inputElement: HTMLInputElement | null = null;

    private queryList: QueryList<T> | null = null;

    private handleInputRef: React.Ref<HTMLInputElement> = refHandler(
        this,
        "inputElement",
        this.props.inputProps?.inputRef,
    );

    private handleQueryListRef = (ref: QueryList<T> | null) => (this.queryList = ref);

    private listboxId = Utils.uniqueId("listbox");

    public render() {
        // omit props specific to this component, spread the rest.
        const { disabled, inputProps, menuProps, popoverProps, ...restProps } = this.props;

        return (
            <QueryList<T>
                {...restProps}
                menuProps={{ "aria-label": "selectable options", ...menuProps, id: this.listboxId }}
                initialActiveItem={this.props.selectedItem ?? undefined}
                onItemSelect={this.handleItemSelect}
                ref={this.handleQueryListRef}
                renderer={this.renderQueryList}
            />
        );
    }

    public componentDidUpdate(prevProps: Suggest2Props<T>, prevState: Suggest2State<T>) {
        if (prevProps.inputProps?.inputRef !== this.props.inputProps?.inputRef) {
            setRef(prevProps.inputProps?.inputRef, null);
            this.handleInputRef = refHandler(this, "inputElement", this.props.inputProps?.inputRef);
            setRef(this.props.inputProps?.inputRef, this.inputElement);
        }

        // If the selected item prop changes, update the underlying state.
        if (this.props.selectedItem !== undefined && this.props.selectedItem !== this.state.selectedItem) {
            this.setState({ selectedItem: this.props.selectedItem });
        }

        if (this.state.isOpen === false && prevState.isOpen === true) {
            // just closed, likely by keyboard interaction
            // wait until the transition ends so there isn't a flash of content in the popover
            /* eslint-disable-next-line deprecation/deprecation */
            const timeout = this.props.popoverProps?.transitionDuration ?? Popover2.defaultProps.transitionDuration;
            setTimeout(() => this.maybeResetActiveItemToSelectedItem(), timeout);
        }

        if (this.state.isOpen && !prevState.isOpen && this.queryList != null) {
            this.queryList.scrollActiveItemIntoView();
        }
    }

    private renderQueryList = (listProps: QueryListRendererProps<T>) => {
        const { popoverContentProps = {}, popoverProps = {}, popoverRef } = this.props;
        const { isOpen } = this.state;
        const { handleKeyDown, handleKeyUp } = listProps;

        // N.B. no need to set `popoverProps.fill` since that is unused with the `renderTarget` API
        return (
            <Popover2
                autoFocus={false}
                enforceFocus={false}
                isOpen={isOpen}
                placement={popoverProps.position || popoverProps.placement ? undefined : "bottom-start"}
                {...popoverProps}
                className={classNames(listProps.className, popoverProps.className)}
                content={
                    <div {...popoverContentProps} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
                        {listProps.itemList}
                    </div>
                }
                interactionKind="click"
                onInteraction={this.handlePopoverInteraction}
                onOpened={this.handlePopoverOpened}
                onOpening={this.handlePopoverOpening}
                popoverClassName={classNames(Classes.SUGGEST_POPOVER, popoverProps.popoverClassName)}
                popupKind={PopupKind.LISTBOX}
                ref={popoverRef}
                renderTarget={this.getPopoverTargetRenderer(listProps, isOpen)}
            />
        );
    };

    // We use the renderTarget API to flatten the rendered DOM and make it easier to implement features like
    // the "fill" prop. Note that we must take `isOpen` as an argument to force this render function to be called
    // again after that state changes.
    private getPopoverTargetRenderer =
        (listProps: QueryListRendererProps<T>, isOpen: boolean) =>
        // eslint-disable-next-line react/display-name
        ({
            // pull out `isOpen` so that it's not forwarded to the DOM
            isOpen: _isOpen,
            ref,
            ...targetProps
        }: Popover2TargetProps & Popover2ClickTargetHandlers) => {
            const { disabled, fill, inputProps = {}, inputValueRenderer, popoverProps = {}, resetOnClose } = this.props;
            const { selectedItem } = this.state;
            const { handleKeyDown, handleKeyUp } = listProps;

            const selectedItemText = selectedItem == null ? "" : inputValueRenderer(selectedItem);
            const { autoComplete = "off", placeholder = "Search..." } = inputProps;
            // placeholder shows selected item while open.
            const inputPlaceholder = isOpen && selectedItemText ? selectedItemText : placeholder;
            // value shows query when open, and query remains when closed if nothing is selected.
            // if resetOnClose is enabled, then hide query when not open. (see handlePopoverOpening)
            const inputValue = isOpen
                ? listProps.query
                : selectedItemText === ""
                ? resetOnClose
                    ? ""
                    : listProps.query
                : selectedItemText;

            return (
                <InputGroup
                    aria-controls={this.listboxId}
                    autoComplete={autoComplete}
                    disabled={disabled}
                    tagName={popoverProps.targetTagName}
                    {...targetProps}
                    {...inputProps}
                    aria-autocomplete="list"
                    aria-expanded={isOpen}
                    className={classNames(targetProps.className, inputProps.className)}
                    fill={fill}
                    inputRef={mergeRefs(this.handleInputRef, ref)}
                    onChange={listProps.handleQueryChange}
                    onFocus={this.handleInputFocus}
                    onKeyDown={this.getTargetKeyDownHandler(handleKeyDown)}
                    onKeyUp={this.getTargetKeyUpHandler(handleKeyUp)}
                    placeholder={inputPlaceholder}
                    role="combobox"
                    value={inputValue}
                />
            );
        };

    private selectText = () => {
        // wait until the input is properly focused to select the text inside of it
        this.requestAnimationFrame(() => {
            this.inputElement?.setSelectionRange(0, this.inputElement.value.length);
        });
    };

    private handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        this.selectText();

        // TODO can we leverage Popover2.openOnTargetFocus for this?
        if (!this.props.openOnKeyDown) {
            this.setState({ isOpen: true });
        }

        this.props.inputProps?.onFocus?.(event);
    };

    private handleItemSelect = (item: T, event?: React.SyntheticEvent<HTMLElement>) => {
        let nextOpenState: boolean;

        if (!this.props.closeOnSelect) {
            this.inputElement?.focus();
            this.selectText();
            nextOpenState = true;
        } else {
            this.inputElement?.blur();
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

        this.props.onItemSelect?.(item, event);
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

    // Popover2 interaction kind is CLICK, so this only handles click events.
    // Note that we defer to the next animation frame in order to get the latest activeElement
    private handlePopoverInteraction = (nextOpenState: boolean, event?: React.SyntheticEvent<HTMLElement>) =>
        this.requestAnimationFrame(() => {
            const isInputFocused = this.inputElement === Utils.getActiveElement(this.inputElement);
            if (this.inputElement != null && !isInputFocused) {
                // the input is no longer focused, we should close the popover
                this.setState({ isOpen: false });
            }
            this.props.popoverProps?.onInteraction?.(nextOpenState, event);
        });

    private handlePopoverOpening = (node: HTMLElement) => {
        // reset query before opening instead of when closing to prevent flash of unfiltered items.
        // this is a limitation of the interactions between QueryList state and Popover2 transitions.
        if (this.props.resetOnClose && this.queryList) {
            this.queryList.setQuery("", true);
        }
        this.props.popoverProps?.onOpening?.(node);
    };

    private handlePopoverOpened = (node: HTMLElement) => {
        // scroll active item into view after popover transition completes and all dimensions are stable.
        if (this.queryList != null) {
            this.queryList.scrollActiveItemIntoView();
        }
        this.props.popoverProps?.onOpened?.(node);
    };

    private getTargetKeyDownHandler = (
        handleQueryListKeyDown: React.EventHandler<React.KeyboardEvent<HTMLElement>>,
    ) => {
        return (evt: React.KeyboardEvent<HTMLInputElement>) => {
            // HACKHACK: https://github.com/palantir/blueprint/issues/4165
            // eslint-disable-next-line deprecation/deprecation
            const { which } = evt;

            if (which === Keys.ESCAPE || which === Keys.TAB) {
                this.inputElement?.blur();
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
                handleQueryListKeyDown?.(evt);
            }

            this.props.inputProps?.onKeyDown?.(evt);
        };
    };

    private getTargetKeyUpHandler = (handleQueryListKeyUp: React.EventHandler<React.KeyboardEvent<HTMLElement>>) => {
        return (evt: React.KeyboardEvent<HTMLInputElement>) => {
            if (this.state.isOpen) {
                handleQueryListKeyUp?.(evt);
            }
            this.props.inputProps?.onKeyUp?.(evt);
        };
    };

    private maybeResetActiveItemToSelectedItem() {
        const shouldResetActiveItemToSelectedItem =
            this.props.activeItem === undefined && this.state.selectedItem !== null && !this.props.resetOnSelect;

        if (this.queryList !== null && shouldResetActiveItemToSelectedItem) {
            this.queryList.setActiveItem(this.props.selectedItem ?? this.state.selectedItem);
        }
    }
}
