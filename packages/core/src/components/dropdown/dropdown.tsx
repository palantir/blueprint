/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import { Classes, IProps, Position, Utils } from "../../common";
import { InputGroup } from "../forms/inputGroup";
import { Menu } from "../menu/menu";
import { MenuDivider } from "../menu/menuDivider";
import { IMenuItemProps, MenuItem } from "../menu/menuItem";
import { IPopoverProps, Popover } from "../popover/popover";

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
     * Make sure to include a React key prop in the returned React element and propogate the click handler.
     * @default <MenuItem {...props} key={`__item_${props.id}`} />
     */
    menuItemRenderer?: (props: IDropdownMenuItemProps) => JSX.Element;

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
    searchQuery?: string;
    value: DropdownItemId;
}

@PureRender
export class Dropdown extends React.Component<IDropdownProps, {}> {

    public static defaultProps: IDropdownProps = {
        filterEnabled: true,
        filterIsCaseSensitive: false,
        filterPlaceholder: "Filter...",
        items: {
            default: [],
        },
        menuItemRenderer: (props: IDropdownMenuItemProps) => {
            return <MenuItem {...props} key={`__item_${props.text}`} />;
        },
        noResultsText: "No results",
        placeholder: "Select",
        popoverProps: {
            position: Position.BOTTOM,
        },
        targetRenderer: (props: { children: React.ReactNode }) => {
            return <a>{props.children}</a>;
        },
    };

    public state: IDropdownState = {
        searchQuery: "",
        value: undefined,
    };

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

        let caretPosition: string;
        switch (popoverProps.position) {
            case Position.TOP:
            case Position.TOP_LEFT:
            case Position.TOP_RIGHT:
                caretPosition = "up";
                break;
            case Position.LEFT:
            case Position.LEFT_BOTTOM:
            case Position.LEFT_TOP:
                caretPosition = "left";
                break;
            case Position.RIGHT:
            case Position.RIGHT_BOTTOM:
            case Position.RIGHT_TOP:
                caretPosition = "right";
                break;
            case Position.BOTTOM:
            case Position.BOTTOM_LEFT:
            case Position.BOTTOM_RIGHT:
            default:
                caretPosition = "down";
        }

        return targetRenderer({
            children: [
                targetText,
                <span
                    className={classNames("pt-icon-standard", `pt-icon-caret-${caretPosition}`)}
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
            placeholder={this.props.filterPlaceholder}
            value={this.state.searchQuery}
        />;
    }

    private handleSearchChange = ({ currentTarget }: React.KeyboardEvent<HTMLInputElement>) => {
        this.setState({
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

    private renderMenuItem(props: IDropdownMenuItemProps) {
        const { menuItemRenderer } = this.props;
        const oldClickHandler = props.onClick;
        props.onClick = (event: React.MouseEvent<HTMLLIElement>) => {
            Utils.safeInvoke(oldClickHandler, event);
            this.handleItemClick(props.id);
        };
        return menuItemRenderer(props);
    }

    private handleItemClick = (id: DropdownItemId) => {
        this.setState({
            value: id,
        });
    }

    private findItemById(id: DropdownItemId): IDropdownMenuItemProps {
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
