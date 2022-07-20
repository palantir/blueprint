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

/** @fileoverview "V2" variant of Select which uses Popover2 instead of Popover */

import classNames from "classnames";
import * as React from "react";

import {
    AbstractPureComponent2,
    Button,
    Classes as CoreClasses,
    DISPLAYNAME_PREFIX,
    InputGroup,
    InputGroupProps2,
    IRef,
    Keys,
    refHandler,
    setRef,
    Utils,
} from "@blueprintjs/core";
import { Popover2, Popover2TargetProps, PopupKind } from "@blueprintjs/popover2";

import { Classes, IListItemsProps, SelectPopoverProps } from "../../common";
import { IQueryListRendererProps, QueryList } from "../query-list/queryList";

export interface Select2Props<T> extends IListItemsProps<T>, SelectPopoverProps {
    /**
     * Element which triggers the select popover. In most cases, you should display
     * the name or label of the curently selected item here.
     */
    children?: React.ReactNode;

    /**
     * Whether the component is non-interactive.
     * If true, the list's item renderer will not be called.
     * Note that you'll also need to disable the component's children, if appropriate.
     *
     * @default false
     */
    disabled?: boolean;

    /**
     * Whether the component should take up the full width of its container.
     * This overrides `popoverProps.fill`. You also have to ensure that the child
     * component has `fill` set to `true` or is styled appropriately.
     */
    fill?: boolean;

    /**
     * Whether the dropdown list can be filtered.
     * Disabling this option will remove the `InputGroup` and ignore `inputProps`.
     *
     * @default true
     */
    filterable?: boolean;

    /**
     * Props to spread to the query `InputGroup`. Use `query` and
     * `onQueryChange` instead of `inputProps.value` and `inputProps.onChange`
     * to control this input.
     */
    inputProps?: InputGroupProps2;

    /**
     * Props to spread to the `Menu` listbox containing the selectable options.
     */
    menuProps?: React.HTMLProps<HTMLUListElement>;

    /**
     * Props to add to the popover target wrapper element.
     */
    popoverTargetProps?: React.HTMLAttributes<HTMLDivElement>;

    /**
     * Whether the active item should be reset to the first matching item _when
     * the popover closes_. The query will also be reset to the empty string.
     *
     * @default false
     */
    resetOnClose?: boolean;
}

export interface Select2State {
    isOpen: boolean;
}

export class Select2<T> extends AbstractPureComponent2<Select2Props<T>, Select2State> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Select2`;

    public static ofType<U>() {
        return Select2 as new (props: Select2Props<U>) => Select2<U>;
    }

    public state: Select2State = { isOpen: false };

    public inputElement: HTMLInputElement | null = null;

    private TypedQueryList = QueryList.ofType<T>();

    private queryList: QueryList<T> | null = null;

    private previousFocusedElement: HTMLElement | undefined;

    private handleInputRef: IRef<HTMLInputElement> = refHandler(this, "inputElement", this.props.inputProps?.inputRef);

    private handleQueryListRef = (ref: QueryList<T> | null) => (this.queryList = ref);

    private listboxId = Utils.uniqueId("listbox");

    public render() {
        // omit props specific to this component, spread the rest.
        const { filterable, inputProps, menuProps, popoverProps, ...restProps } = this.props;

        return (
            <this.TypedQueryList
                {...restProps}
                menuProps={{ "aria-label": "selectable options", ...menuProps, id: this.listboxId }}
                onItemSelect={this.handleItemSelect}
                ref={this.handleQueryListRef}
                renderer={this.renderQueryList}
            />
        );
    }

    public componentDidUpdate(prevProps: Select2Props<T>, prevState: Select2State) {
        if (prevProps.inputProps?.inputRef !== this.props.inputProps?.inputRef) {
            setRef(prevProps.inputProps?.inputRef, null);
            this.handleInputRef = refHandler(this, "inputElement", this.props.inputProps?.inputRef);
            setRef(this.props.inputProps?.inputRef, this.inputElement);
        }

        if (this.state.isOpen && !prevState.isOpen && this.queryList != null) {
            this.queryList.scrollActiveItemIntoView();
        }
    }

    private renderQueryList = (listProps: IQueryListRendererProps<T>) => {
        // not using defaultProps cuz they're hard to type with generics (can't use <T> on static members)
        const {
            filterable = true,
            disabled = false,
            inputProps = {},
            popoverContentProps = {},
            popoverProps = {},
            popoverRef,
        } = this.props;

        const input = (
            <InputGroup
                aria-autocomplete="list"
                leftIcon="search"
                placeholder="Filter..."
                rightElement={this.maybeRenderClearButton(listProps.query)}
                {...inputProps}
                inputRef={this.handleInputRef}
                onChange={listProps.handleQueryChange}
                value={listProps.query}
            />
        );

        const { handleKeyDown, handleKeyUp } = listProps;

        // N.B. no need to set `fill` since that is unused with the `renderTarget` API
        return (
            <Popover2
                autoFocus={false}
                enforceFocus={false}
                isOpen={this.state.isOpen}
                disabled={disabled}
                placement={popoverProps.position || popoverProps.placement ? undefined : "bottom-start"}
                {...popoverProps}
                className={classNames(listProps.className, popoverProps.className)}
                content={
                    <div {...popoverContentProps} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
                        {filterable ? input : undefined}
                        {listProps.itemList}
                    </div>
                }
                onClosing={this.handlePopoverClosing}
                onInteraction={this.handlePopoverInteraction}
                onOpened={this.handlePopoverOpened}
                onOpening={this.handlePopoverOpening}
                popoverClassName={classNames(Classes.SELECT_POPOVER, popoverProps.popoverClassName)}
                popupKind={PopupKind.LISTBOX}
                ref={popoverRef}
                renderTarget={this.getPopoverTargetRenderer(listProps, this.state.isOpen)}
            />
        );
    };

    // We use the renderTarget API to flatten the rendered DOM and make it easier to implement features like
    // the "fill" prop. Note that we must take `isOpen` as an argument to force this render function to be called
    // again after that state changes.
    private getPopoverTargetRenderer =
        (listProps: IQueryListRendererProps<T>, isOpen: boolean) =>
        // N.B. pull out `isOpen` so that it's not forwarded to the DOM, but remember not to use it directly
        // since it may be stale (`renderTarget` is not re-invoked on this.state changes).
        // eslint-disable-next-line react/display-name
        ({ isOpen: _isOpen, ref, ...targetProps }: Popover2TargetProps & React.HTMLProps<HTMLDivElement>) => {
            const { popoverTargetProps } = this.props;
            const { handleKeyDown, handleKeyUp } = listProps;
            return (
                <div
                    aria-controls={this.listboxId}
                    {...popoverTargetProps}
                    {...targetProps}
                    aria-expanded={isOpen}
                    // Note that we must set FILL here in addition to children to get the wrapper element to full width
                    className={classNames(targetProps.className, popoverTargetProps?.className, {
                        [CoreClasses.FILL]: this.props.fill,
                    })}
                    // Normally, Popover2 would also need to attach its own `onKeyDown` handler via `targetProps`,
                    // but in our case we fully manage that interaction and listen for key events to open/close
                    // the popover, so we elide it from the DOM.
                    onKeyDown={isOpen ? handleKeyDown : this.handleTargetKeyDown}
                    onKeyUp={isOpen ? handleKeyUp : undefined}
                    ref={ref}
                    role="combobox"
                >
                    {this.props.children}
                </div>
            );
        };

    private maybeRenderClearButton(query: string) {
        return query.length > 0 ? (
            <Button
                aria-label="Clear filter query"
                icon="cross"
                minimal={true}
                onClick={this.resetQuery}
                title="Clear filter query"
            />
        ) : undefined;
    }

    /**
     * Target wrapper element "keydown" handler while the popover is closed.
     */
    private handleTargetKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        // open popover when arrow key pressed on target while closed
        // HACKHACK: https://github.com/palantir/blueprint/issues/4165
        /* eslint-disable deprecation/deprecation */
        if (event.which === Keys.ARROW_UP || event.which === Keys.ARROW_DOWN) {
            event.preventDefault();
            this.setState({ isOpen: true });
        } else if (Keys.isKeyboardClick(event.keyCode)) {
            this.setState({ isOpen: true });
        }
        /* eslint-enable deprecation/deprecation */
    };

    private handleItemSelect = (item: T, event?: React.SyntheticEvent<HTMLElement>) => {
        this.setState({ isOpen: false });
        this.props.onItemSelect?.(item, event);
    };

    private handlePopoverInteraction = (isOpen: boolean, event?: React.SyntheticEvent<HTMLElement>) => {
        this.setState({ isOpen });
        this.props.popoverProps?.onInteraction?.(isOpen, event);
    };

    private handlePopoverOpening = (node: HTMLElement) => {
        // save currently focused element before popover steals focus, so we can restore it when closing.
        this.previousFocusedElement = document.activeElement as HTMLElement;

        if (this.props.resetOnClose) {
            this.resetQuery();
        }

        this.props.popoverProps?.onOpening?.(node);
    };

    private handlePopoverOpened = (node: HTMLElement) => {
        // scroll active item into view after popover transition completes and all dimensions are stable.
        if (this.queryList != null) {
            this.queryList.scrollActiveItemIntoView();
        }

        this.requestAnimationFrame(() => {
            const { inputProps = {} } = this.props;
            // autofocus is enabled by default
            if (inputProps.autoFocus !== false) {
                this.inputElement?.focus();
            }
        });

        this.props.popoverProps?.onOpened?.(node);
    };

    private handlePopoverClosing = (node: HTMLElement) => {
        // restore focus to saved element.
        // timeout allows popover to begin closing and remove focus handlers beforehand.
        /* istanbul ignore next */
        this.requestAnimationFrame(() => {
            if (this.previousFocusedElement !== undefined) {
                this.previousFocusedElement.focus();
                this.previousFocusedElement = undefined;
            }
        });

        this.props.popoverProps?.onClosing?.(node);
    };

    private resetQuery = () => this.queryList && this.queryList.setQuery("", true);
}
