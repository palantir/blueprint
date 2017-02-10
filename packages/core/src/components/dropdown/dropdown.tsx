/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import { Classes, IProps, Keys, Position, Utils } from "../../common";
import { InputGroup } from "../forms/inputGroup";
import { Menu } from "../menu/menu";
import { MenuDivider } from "../menu/menuDivider";
import { IMenuItemProps, MenuItem } from "../menu/menuItem";
import { IPopoverProps, Popover } from "../popover/popover";
import { getCaretIconClass } from "./popoverUtils";
import { findIndexByPredicate } from "./utils";

export type DropdownItemId = string;

export interface IDropdownMenuItemProps extends IMenuItemProps {
    /**
     * Unique identifier.
     */
    id: DropdownItemId;
}

export interface IDropdownProps extends IProps {
    /**
     * Whether to render a search input inside the dropdown which filters items.
     * @default true
     */
    filterEnabled?: boolean;

    /**
     * @default false
     */
    filterIsCaseSensitive?: boolean;

    /**
     * @default "Filter..."
     */
    filterPlaceholder?: string;

    /**
     * All available dropdown choices, optionally organized into groups.
     * If items.default is provided, groups are ignored.
     * @default { default: [] }
     */
    items: {
        default?: IDropdownMenuItemProps[];
        [groupName: string]: IDropdownMenuItemProps[];
    };

    /**
     * A custom renderer to use for each dropdown menu item.
     * @default MenuItemFactory
     */
    menuItemRenderer?: (props: IDropdownMenuItemProps) => JSX.Element;

    /**
     * @default "No results"
     */
    noResultsText?: string;

    /**
     * Callback fired when an item is selected.
     */
    onChange?: (id: DropdownItemId) => void;

    /**
     * Placeholder text rendered in the popover target when nothing is selected.
     * @default "Select"
     */
    placeholder?: string;

    /**
     * Any custom popover props used to override default values.
     */
    popoverProps?: Partial<IPopoverProps>;

    /**
     * A custom renderer to use for the dropdown target.
     * Children supplied to this renderer will include the target text as well as a caret icon span
     * indicating which direction the dropdown will open in.
     * @default renderer produces an <a> tag
     */
    targetRenderer?: (props: { children: React.ReactNode }) => JSX.Element;
}

export interface IDropdownState {
    focussedItem: DropdownItemId | "input";
    searchQuery?: string;
    value: DropdownItemId;
}

@PureRender
export class Dropdown extends React.Component<IDropdownProps, IDropdownState> {

    public static defaultProps: IDropdownProps = {
        filterEnabled: true,
        filterIsCaseSensitive: false,
        filterPlaceholder: "Filter...",
        items: {
            default: [],
        },
        menuItemRenderer: (itemProps) => <MenuItem {...itemProps} />,
        noResultsText: "No results",
        placeholder: "Select",
        targetRenderer: (props: { children: React.ReactNode }) => {
            return <a>{props.children}</a>;
        },
    };

    private get visibleItems(): IDropdownMenuItemProps[] {
        const { filterEnabled, filterIsCaseSensitive, items } = this.props;
        const { searchQuery } = this.state;

        const searchPredicate = (props: IDropdownMenuItemProps) => {
            if (filterEnabled && searchQuery !== undefined && searchQuery.length > 0) {
                const searchText = filterIsCaseSensitive ? props.text : props.text.toLowerCase();
                const query = filterIsCaseSensitive ? searchQuery : searchQuery.toLowerCase();
                return searchText.indexOf(query) >= 0;
            } else {
                return true;
            }
        };

        if (items.default !== undefined) {
            return items.default.filter(searchPredicate);
        } else {
            const visibleItems = [];
            for (const groupName of Object.keys(items)) {
                visibleItems.push(...items[groupName].filter(searchPredicate));
            }
            return visibleItems;
        }
    }

    public constructor(props: IDropdownProps, context?: any) {
        super(props, context);
        this.state = {
            focussedItem: props.filterEnabled ? "input" : undefined,
            searchQuery: "",
            value: undefined,
        };
    }

    public render() {
        const { className, filterEnabled, popoverProps } = this.props;
        const popoverContent = (
            <div>
                {filterEnabled && this.renderFilterInput()}
                {this.renderMenu()}
            </div>
        );

        return (
            <div className={classNames(Classes.DROPDOWN, className)}>
                <Popover
                    position={Position.BOTTOM}
                    {...popoverProps}
                    content={popoverContent}
                    popoverClassName={classNames(Classes.DROPDOWN_POPOVER, popoverProps.popoverClassName)}
                >
                    {this.renderTarget()}
                </Popover>
            </div>
        );
    }

    private renderTarget() {
        const { placeholder, popoverProps, targetRenderer } = this.props;
        const targetText = this.state.value === undefined
            ? placeholder
            : this.findItemById(this.state.value).text;

        return targetRenderer({
            children: [
                targetText,
                <span
                    className={classNames("pt-icon-standard", getCaretIconClass(popoverProps))}
                    key="__caret_icon"
                />,
            ],
        });
    }

    private renderFilterInput() {
        return <InputGroup
            autoFocus
            className={Classes.DROPDOWN_SEARCH}
            leftIconName="search"
            onChange={this.handleSearchChange}
            onKeyDown={this.handleKeyDown}
            placeholder={this.props.filterPlaceholder}
            value={this.state.searchQuery}
        />;
    }

    private handleSearchChange = ({ currentTarget }: React.KeyboardEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            searchQuery: currentTarget.value,
        });
    }

    private renderMenu() {
        const { items, noResultsText, filterEnabled, filterIsCaseSensitive } = this.props;
        const { searchQuery } = this.state;
        const searchPredicate = (props: IDropdownMenuItemProps) => {
            if (filterEnabled && searchQuery !== undefined && searchQuery.length > 0) {
                const searchText = filterIsCaseSensitive ? props.text : props.text.toLowerCase();
                const query = filterIsCaseSensitive ? searchQuery : searchQuery.toLowerCase();
                return searchText.indexOf(query) >= 0;
            } else {
                return true;
            }
        };
        let menuContents: JSX.Element[] = [];

        if (items.default !== undefined) {
            menuContents = items.default.filter(searchPredicate).map(this.renderMenuItem, this);
        } else {
            for (const groupName of Object.keys(items)) {
                // only show this group if it fulfills the search predicate
                const filteredItems = items[groupName].filter(searchPredicate);
                if (filteredItems.length > 0) {
                    menuContents.push(<MenuDivider key={`__divider_${groupName}`} title={groupName} />);
                    menuContents.push(...filteredItems.map(this.renderMenuItem, this));
                }
            }
        }

        if (menuContents.length === 0) {
            menuContents.push(<MenuItem
                disabled={true}
                key="__item_no_results"
                text={noResultsText}
            />);
        }

        return <Menu>{menuContents}</Menu>;
    }

    private renderMenuItem(itemProps: IDropdownMenuItemProps) {
        const handleClick = (_event: React.MouseEvent<HTMLDivElement>) => this.handleItemClick(itemProps.id);
        // side effect situation here...
        itemProps.isActive = (itemProps.id === this.state.value);

        return (
            <div
                className="pt-dropdown-menu-item-container"
                key={`__item_${itemProps.id}`}
                onClick={handleClick}
            >
                {Utils.safeInvoke(this.props.menuItemRenderer, itemProps)}
            </div>
        );
    }

    private handleItemClick = (id: DropdownItemId) => {
        this.setState({
            ...this.state,
            value: id,
        }, () => {
            Utils.safeInvoke(this.props.onChange, id);
        });
    }

    private handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>) => {
        // tslint:disable
        if (event.keyCode === Keys.ARROW_DOWN || event.keyCode === Keys.ARROW_UP) {
            const { visibleItems } = this;
            // TODO: type guard
            if ((event.currentTarget as HTMLInputElement).value !== undefined) {
                // is input element
                if (event.keyCode === Keys.ARROW_DOWN) {
                    this.setState({
                        ...this.state,
                        focussedItem: visibleItems[0].id,
                    });
                    event.currentTarget.blur();
                }
            } else {
                // is menu item
                // TODO(adahiya): code never gets here because menu item elements are never focussed
                const currentItemIndex = findIndexByPredicate(visibleItems, ({ id }: IDropdownMenuItemProps) => id === this.state.focussedItem);
                if (currentItemIndex < visibleItems.length) {
                    this.setState({
                        ...this.state,
                        focussedItem: visibleItems[currentItemIndex + 1].id,
                    })
                }
            }
        }
        // tslint:enable
    }

    private findItemById(id: DropdownItemId): IDropdownMenuItemProps {
        const { items } = this.props;
        if (items.default !== undefined) {
            return items.default.filter((props) => props.id === id)[0];
        } else {
            for (const groupName of Object.keys(items)) {
                const [maybeItem] = items[groupName].filter((props) => props.id === id);
                if (maybeItem !== undefined) {
                    return maybeItem;
                }
            }
            return undefined;
        }
    }
}
