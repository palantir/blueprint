/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import { Classes, IProps, Position } from "../../common";
import { Menu } from "../menu/menu";
import { MenuDivider } from "../menu/menuDivider";
import { IMenuItemProps, MenuItem } from "../menu/menuItem";
import { Popover } from "../popover/popover";

export type DropdownItemId = string;

export interface IDropdownMenuItem extends IMenuItemProps {
    /**
     * Unique identifier.
     */
    id: DropdownItemId;
}

export interface IDropdownProps extends IProps {
    /**
     * Items to render
     * If items.default is provided, groups are ignored.
     * @default { default: [] }
     */
    items: {
        default?: IDropdownMenuItem[];
        [groupName: string]: IDropdownMenuItem[];
    };

    /**
     * @default "No results"
     */
    noResultsText?: string;

    /**
     * Placeholder text rendered in the popover target when nothing is selected.
     * @default "Select"
     */
    placeholder?: string;

    /**
     * Whether to render a search input inside the dropdown which filters items.
     * @default true
     */
    searchEnabled?: boolean;

    /**
     * @default false
     */
    searchIsCaseSensitive?: boolean;

    /**
     * @default "Search..."
     */
    searchPlaceholder?: string;
}

export interface IDropdownState {
    searchQuery?: string;
    value: DropdownItemId;
}

@PureRender
export class Dropdown extends React.Component<IDropdownProps, {}> {
    public static defaultProps: IDropdownProps = {
        items: {
            default: [],
        },
        noResultsText: "No results",
        placeholder: "Select",
        searchEnabled: true,
        searchIsCaseSensitive: false,
        searchPlaceholder: "Search...",
    };

    public state: IDropdownState = {
        searchQuery: "",
        value: undefined,
    };

    public render() {
        const { className, placeholder, searchEnabled } = this.props;
        const targetText = (this.state.value === undefined)
            ? placeholder
            : this.findItemById(this.state.value).text;
        const popoverContent = (
            <div>
                {searchEnabled && this.renderSearchInput()}
                {this.renderMenu()}
            </div>
        );

        return (
            <div className={classNames(Classes.DROPDOWN, className)}>
                <Popover
                    content={popoverContent}
                    popoverClassName={Classes.DROPDOWN_POPOVER}
                    position={Position.BOTTOM}
                >
                    <a className="pt-dropdown-target">
                        {targetText}
                        <span className="pt-icon-standard pt-icon-caret-down" />
                    </a>
                </Popover>
            </div>
        );
    }

    private renderSearchInput() {
        return <input
            className={classNames(Classes.INPUT, Classes.DROPDOWN_SEARCH)}
            onChange={this.handleSearchChange}
            type="search"
            value={this.state.searchQuery}
        />;
    }

    private handleSearchChange = ({ currentTarget }: React.KeyboardEvent<HTMLInputElement>) => {
        this.setState({
            searchQuery: currentTarget.value,
        });
    }

    private renderMenu() {
        const { items, noResultsText, searchEnabled, searchIsCaseSensitive } = this.props;
        const { searchQuery } = this.state;
        const searchPredicate = (props: IDropdownMenuItem) => {
            if (searchEnabled && searchQuery !== undefined && searchQuery.length > 0) {
                const searchText = searchIsCaseSensitive ? props.text : props.text.toLowerCase();
                const query = searchIsCaseSensitive ? searchQuery : searchQuery.toLowerCase();
                return searchText.indexOf(query) >= 0;
            } else {
                return true;
            }
        };
        let menuContents: JSX.Element[] = [];

        if (items.default !== undefined) {
            menuContents = items.default.filter(searchPredicate).map(renderMenuItemWithKey);
        } else {
            for (const groupName of Object.keys(items)) {
                // only show this group if it fulfills the search predicate
                const filteredItems = items[groupName].filter(searchPredicate);
                if (filteredItems.length > 0) {
                    menuContents.push(<MenuDivider key={`__divider_${groupName}`} title={groupName} />);
                    menuContents.concat(filteredItems.map(renderMenuItemWithKey));
                }
            }
        }

        if (menuContents.length === 0) {
            menuContents.push(<MenuItem
                text={noResultsText}
                disabled={true}
            />);
        }

        return <Menu>{menuContents}</Menu>;
    }

    private findItemById(id: DropdownItemId): IDropdownMenuItem {
        const { items } = this.props;
        if (items.default !== undefined) {
            return items.default.filter((props) => props.id === id)[0];
        } else {
            for (const groupName of Object.keys(items)) {
                const maybeItem = items[groupName].filter((props) => props.id === id);
                if (maybeItem.length > 0) {
                    return maybeItem[0];
                }
            }
            return undefined;
        }
    }
}

function renderMenuItemWithKey(props: IMenuItemProps) {
    return <MenuItem {...props} key={`__item_${props.text}`} />;
}
