/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
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
    Classes as CoreClasses,
    DISPLAYNAME_PREFIX,
    Keys,
    mergeRefs,
    refHandler,
    setRef,
    TagInput,
    TagInputAddMethod,
    TagInputProps,
    Utils,
} from "@blueprintjs/core";
import { Popover2, Popover2ClickTargetHandlers, Popover2TargetProps, PopupKind } from "@blueprintjs/popover2";

import { Classes, ListItemsProps, SelectPopoverProps } from "../../common";
import { QueryList, QueryListRendererProps } from "../query-list/queryList";

export interface MultiSelect2Props<T> extends ListItemsProps<T>, SelectPopoverProps {
    /**
     * Whether the component is non-interactive.
     * If true, the list's item renderer will not be called.
     *
     * @default false
     */
    disabled?: boolean;

    /**
     * Whether the component should take up the full width of its container.
     */
    fill?: boolean;

    /**
     * Props to spread to the `Menu` listbox containing the selectable options.
     */
    menuProps?: React.HTMLAttributes<HTMLUListElement>;

    /**
     * If provided, this component will render a "clear" button inside its TagInput.
     * Clicking that button will invoke this callback to clear all items from the current selection.
     */
    onClear?: () => void;

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

    /** Controlled selected values. */
    selectedItems: T[];

    /**
     * Props to pass to the [TagInput component](##core/components/tag-input).
     *
     * Some properties are unavailable:
     * - `tagInputProps.inputValue`: use `query` instead
     * - `tagInputProps.onInputChange`: use `onQueryChange` instead
     *
     * Some properties are available, but discouraged. If you find yourself using these due to a bug in MultiSelect2
     * or some edge case which is not handled by `onItemSelect`, `onItemsPaste`, `onRemove`, and `onClear`, please
     * file a bug in the Blueprint repo:
     * - `tagInputProps.onChange`
     *
     * Notes for `tagInputProps.rightElement`:
     * - you are responsible for disabling any elements you may render here when the overall `MultiSelect2` is disabled
     * - if the `onClear` prop is defined, this element will override/replace the default rightElement,
     *   which is a "clear" button that removes all items from the current selection.
     */
    tagInputProps?: Partial<Omit<TagInputProps, "inputValue" | "onInputChange">>;

    /** Custom renderer to transform an item into tag content. */
    tagRenderer: (item: T) => React.ReactNode;
}

export interface MultiSelect2State {
    isOpen: boolean;
}

/**
 * Multi select (v2) component.
 *
 * @see https://blueprintjs.com/docs/#select/multi-select2
 */
export class MultiSelect2<T> extends AbstractPureComponent2<MultiSelect2Props<T>, MultiSelect2State> {
    public static displayName = `${DISPLAYNAME_PREFIX}.MultiSelect2`;

    private listboxId = Utils.uniqueId("listbox");

    public static defaultProps = {
        disabled: false,
        fill: false,
        placeholder: "Search...",
    };

    /** @deprecated no longer necessary now that the TypeScript parser supports type arguments on JSX element tags */
    public static ofType<U>() {
        return MultiSelect2 as new (props: MultiSelect2Props<U>) => MultiSelect2<U>;
    }

    public state: MultiSelect2State = {
        isOpen: (this.props.popoverProps && this.props.popoverProps.isOpen) || false,
    };

    public input: HTMLInputElement | null = null;

    public queryList: QueryList<T> | null = null;

    private refHandlers: {
        input: React.RefCallback<HTMLInputElement>;
        popover: React.RefObject<Popover2>;
        queryList: React.RefCallback<QueryList<T>>;
    } = {
        input: refHandler(this, "input", this.props.tagInputProps?.inputRef),
        popover: React.createRef(),
        queryList: (ref: QueryList<T> | null) => (this.queryList = ref),
    };

    public componentDidUpdate(prevProps: MultiSelect2Props<T>) {
        if (prevProps.tagInputProps?.inputRef !== this.props.tagInputProps?.inputRef) {
            setRef(prevProps.tagInputProps?.inputRef, null);
            this.refHandlers.input = refHandler(this, "input", this.props.tagInputProps?.inputRef);
            setRef(this.props.tagInputProps?.inputRef, this.input);
        }
        if (
            (prevProps.onClear === undefined && this.props.onClear !== undefined) ||
            (prevProps.onClear !== undefined && this.props.onClear === undefined)
        ) {
            this.forceUpdate();
        }
    }

    public render() {
        // omit props specific to this component, spread the rest.
        const { menuProps, openOnKeyDown, popoverProps, tagInputProps, ...restProps } = this.props;

        return (
            <QueryList<T>
                {...restProps}
                menuProps={{
                    "aria-label": "selectable options",
                    ...menuProps,
                    "aria-multiselectable": true,
                    id: this.listboxId,
                }}
                onItemSelect={this.handleItemSelect}
                onQueryChange={this.handleQueryChange}
                ref={this.refHandlers.queryList}
                renderer={this.renderQueryList}
            />
        );
    }

    private renderQueryList = (listProps: QueryListRendererProps<T>) => {
        const { disabled, popoverContentProps = {}, popoverProps = {} } = this.props;
        const { handleKeyDown, handleKeyUp } = listProps;

        const popoverRef =
            this.props.popoverRef === undefined
                ? this.refHandlers.popover
                : mergeRefs(this.refHandlers.popover, this.props.popoverRef);

        // N.B. no need to set `popoverProps.fill` since that is unused with the `renderTarget` API
        return (
            <Popover2
                autoFocus={false}
                canEscapeKeyClose={true}
                disabled={disabled}
                enforceFocus={false}
                isOpen={this.state.isOpen}
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
                popoverClassName={classNames(Classes.MULTISELECT_POPOVER, popoverProps.popoverClassName)}
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
        (listProps: QueryListRendererProps<T>, isOpen: boolean) =>
        // N.B. pull out `isOpen` so that it's not forwarded to the DOM, but remember not to use it directly
        // since it may be stale (`renderTarget` is not re-invoked on this.state changes).
        // eslint-disable-next-line react/display-name
        ({ isOpen: _isOpen, ref, ...targetProps }: Popover2TargetProps & Popover2ClickTargetHandlers) => {
            const {
                disabled,
                fill,
                onClear,
                placeholder,
                popoverProps = {},
                popoverTargetProps = {},
                selectedItems,
                tagInputProps = {},
            } = this.props;
            const { handleKeyDown, handleKeyUp } = listProps;

            if (disabled) {
                tagInputProps.disabled = true;
            }
            if (fill) {
                tagInputProps.fill = true;
            }

            // add our own inputProps.className so that we can reference it in event handlers
            const inputProps = {
                ...tagInputProps.inputProps,
                className: classNames(tagInputProps.inputProps?.className, Classes.MULTISELECT_TAG_INPUT_INPUT),
            };

            const maybeClearButton =
                onClear !== undefined && selectedItems.length > 0 ? (
                    // use both aria-label and title a11y attributes here, for screen readers
                    // and mouseover interactions respectively
                    <Button
                        aria-label="Clear selected items"
                        disabled={disabled}
                        icon="cross"
                        minimal={true}
                        onClick={this.handleClearButtonClick}
                        title="Clear selected items"
                    />
                ) : undefined;

            const { targetTagName = "div" } = popoverProps;

            return React.createElement(
                targetTagName,
                {
                    "aria-autocomplete": "list",
                    "aria-controls": this.listboxId,
                    ...popoverTargetProps,
                    ...targetProps,
                    "aria-disabled": disabled,
                    "aria-expanded": isOpen,
                    // Note that we must set FILL here in addition to TagInput to get the wrapper element to full width
                    className: classNames(targetProps.className, popoverTargetProps.className, {
                        [CoreClasses.FILL]: fill,
                    }),
                    // Normally, Popover2 would also need to attach its own `onKeyDown` handler via `targetProps`,
                    // but in our case we fully manage that interaction and listen for key events to open/close
                    // the popover, so we elide it from the DOM.
                    onKeyDown: this.getTagInputKeyDownHandler(handleKeyDown),
                    onKeyUp: this.getTagInputKeyUpHandler(handleKeyUp),
                    ref,
                    role: "combobox",
                },
                <TagInput
                    placeholder={placeholder}
                    rightElement={maybeClearButton}
                    {...tagInputProps}
                    className={classNames(Classes.MULTISELECT, tagInputProps.className)}
                    inputRef={this.refHandlers.input}
                    inputProps={inputProps}
                    inputValue={listProps.query}
                    onAdd={this.getTagInputAddHandler(listProps)}
                    onInputChange={listProps.handleQueryChange}
                    onRemove={this.handleTagRemove}
                    values={selectedItems.map(this.props.tagRenderer)}
                />,
            );
        };

    private handleItemSelect = (item: T, evt?: React.SyntheticEvent<HTMLElement>) => {
        if (this.input != null) {
            this.input.focus();
        }
        this.props.onItemSelect?.(item, evt);
        this.refHandlers.popover.current?.reposition(); // reposition when size of input changes
    };

    private handleQueryChange = (query: string, evt?: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ isOpen: query.length > 0 || !this.props.openOnKeyDown });
        this.props.onQueryChange?.(query, evt);
    };

    // Popover interaction kind is CLICK, so this only handles click events.
    // Note that we defer to the next animation frame in order to get the latest activeElement
    private handlePopoverInteraction = (nextOpenState: boolean, evt?: React.SyntheticEvent<HTMLElement>) =>
        this.requestAnimationFrame(() => {
            const isInputFocused = this.input === Utils.getActiveElement(this.input);

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
        const { selectedItems, onRemove, tagInputProps } = this.props;
        onRemove?.(selectedItems[index], index);
        tagInputProps?.onRemove?.(tag, index);
        this.refHandlers.popover.current?.reposition(); // reposition when size of input changes
    };

    private getTagInputAddHandler =
        (listProps: QueryListRendererProps<T>) => (values: any[], method: TagInputAddMethod) => {
            if (method === "paste") {
                listProps.handlePaste(values);
            }
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

            this.props.popoverTargetProps?.onKeyDown?.(e);
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

            this.props.popoverTargetProps?.onKeyDown?.(e);
        };
    };

    private handleClearButtonClick = () => {
        this.props.onClear?.();
        this.refHandlers.popover.current?.reposition(); // reposition when size of input changes
    };
}
