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
    AbstractPureComponent2,
    Button,
    DISPLAYNAME_PREFIX,
    InputGroupProps2,
    InputGroup,
    IPopoverProps,
    IRef,
    Keys,
    Popover,
    Position,
    refHandler,
    setRef,
} from "@blueprintjs/core";

import { Classes, IListItemsProps } from "../../common";
import { IQueryListRendererProps, QueryList } from "../query-list/queryList";

// eslint-disable-next-line deprecation/deprecation
export type SelectProps<T> = ISelectProps<T>;
/** @deprecated use SelectProps */
export interface ISelectProps<T> extends IListItemsProps<T> {
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
     * Whether the component is non-interactive.
     * If true, the list's item renderer will not be called.
     * Note that you'll also need to disable the component's children, if appropriate.
     *
     * @default false
     */
    disabled?: boolean;

    /**
     * Props to spread to the query `InputGroup`. Use `query` and
     * `onQueryChange` instead of `inputProps.value` and `inputProps.onChange`
     * to control this input.
     */
    inputProps?: InputGroupProps2;

    /**
     * Whether the select popover should be styled so that it matches the width of the target.
     * This is done using a popper.js modifier passed through `popoverProps`.
     *
     * Note that setting `matchTargetWidth={true}` will also set `popoverProps.usePortal={false}` and `popoverProps.wrapperTagName="div"`.
     *
     * @default false
     */
    matchTargetWidth?: boolean;

    /** Props to spread to `Popover`. Note that `content` cannot be changed. */
    // eslint-disable-next-line @typescript-eslint/ban-types
    popoverProps?: Partial<IPopoverProps> & object;

    /**
     * Whether the active item should be reset to the first matching item _when
     * the popover closes_. The query will also be reset to the empty string.
     *
     * @default false
     */
    resetOnClose?: boolean;
}

export interface ISelectState {
    isOpen: boolean;
}

export class Select<T> extends AbstractPureComponent2<SelectProps<T>, ISelectState> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Select`;

    public static ofType<U>() {
        return Select as new (props: SelectProps<U>) => Select<U>;
    }

    public state: ISelectState = { isOpen: false };

    private TypedQueryList = QueryList.ofType<T>();

    public inputElement: HTMLInputElement | null = null;

    private queryList: QueryList<T> | null = null;

    private previousFocusedElement: HTMLElement | undefined;

    private handleInputRef: IRef<HTMLInputElement> = refHandler(this, "inputElement", this.props.inputProps?.inputRef);

    private handleQueryListRef = (ref: QueryList<T> | null) => (this.queryList = ref);

    public render() {
        // omit props specific to this component, spread the rest.
        const { filterable, inputProps, popoverProps, ...restProps } = this.props;

        return (
            <this.TypedQueryList
                {...restProps}
                onItemSelect={this.handleItemSelect}
                ref={this.handleQueryListRef}
                renderer={this.renderQueryList}
            />
        );
    }

    public componentDidUpdate(prevProps: SelectProps<T>, prevState: ISelectState) {
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
            fill,
            filterable = true,
            disabled = false,
            inputProps = {},
            popoverProps = {},
            matchTargetWidth,
        } = this.props;

        if (fill) {
            popoverProps.fill = true;
        }

        if (matchTargetWidth) {
            if (popoverProps.modifiers == null) {
                popoverProps.modifiers = {};
            }

            popoverProps.modifiers.minWidth = {
                enabled: true,
                fn: data => {
                    data.styles.width = `${data.offsets.reference.width}px`;
                    return data;
                },
                order: 800,
            };

            popoverProps.usePortal = false;
            popoverProps.wrapperTagName = "div";
        }

        const input = (
            <InputGroup
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
        return (
            /* eslint-disable-next-line deprecation/deprecation */
            <Popover
                autoFocus={false}
                enforceFocus={false}
                isOpen={this.state.isOpen}
                disabled={disabled}
                position={Position.BOTTOM_LEFT}
                {...popoverProps}
                className={classNames(listProps.className, popoverProps.className)}
                onInteraction={this.handlePopoverInteraction}
                popoverClassName={classNames(Classes.SELECT_POPOVER, popoverProps.popoverClassName, {
                    [Classes.SELECT_MATCH_TARGET_WIDTH]: matchTargetWidth,
                })}
                onOpening={this.handlePopoverOpening}
                onOpened={this.handlePopoverOpened}
                onClosing={this.handlePopoverClosing}
            >
                <div
                    onKeyDown={this.state.isOpen ? handleKeyDown : this.handleTargetKeyDown}
                    onKeyUp={this.state.isOpen ? handleKeyUp : undefined}
                >
                    {this.props.children}
                </div>
                <div onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
                    {filterable ? input : undefined}
                    {listProps.itemList}
                </div>
                {/* eslint-disable-next-line deprecation/deprecation */}
            </Popover>
        );
    };

    private maybeRenderClearButton(query: string) {
        return query.length > 0 ? <Button icon="cross" minimal={true} onClick={this.resetQuery} /> : undefined;
    }

    private handleTargetKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        // open popover when arrow key pressed on target while closed
        // HACKHACK: https://github.com/palantir/blueprint/issues/4165
        // eslint-disable-next-line deprecation/deprecation
        if (event.which === Keys.ARROW_UP || event.which === Keys.ARROW_DOWN) {
            event.preventDefault();
            this.setState({ isOpen: true });
        }
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
