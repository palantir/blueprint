/*
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import {
    Classes,
    Hotkey,
    Hotkeys,
    HotkeysTarget,
    IconContents,
    InputGroup,
    Keys,
    Popover,
    Position,
    Utils,
} from "@blueprintjs/core";

import * as classNames from "classnames";
import { IHeadingNode, IPageNode } from "documentalist/dist/client";
import { filter } from "fuzzaldrin-plus";
import * as React from "react";
import { findDOMNode } from "react-dom";

import { createKeyEventHandler, eachLayoutNode } from "../common/utils";
import { handleStringChange } from "./baseExample";

export interface INavigatorProps {
    items: Array<IPageNode | IHeadingNode>;
    onNavigate: (id: string) => void;
}

export interface INavigatorState {
    matches: INavigationSection[];
    query: string;
    selectedIndex: number;
}

export interface INavigationSection {
    filterKey: string;
    path: string[];
    route: string;
    title: string;
}

const MENU_PADDING = 5; // $pt-grid-size / 2;

@HotkeysTarget
export class Navigator extends React.PureComponent<INavigatorProps, INavigatorState> {
    public state: INavigatorState = {
        matches: [],
        query: "",
        selectedIndex: 0,
    };

    private inputRef: HTMLElement;
    private menuRef: HTMLElement;
    private refHandlers = {
        input: (ref: HTMLElement) => this.inputRef = ref,
        menu: (ref: HTMLElement) => this.menuRef = ref,
    };

    // this guy must be defined before he's used in handleQueryChange
    // and it just makes sense to be up here with state init
    // tslint:disable:member-ordering
    private resetState = (query = "") => this.setState({ matches: this.getMatches(query), query, selectedIndex: 0 });
    private sections: INavigationSection[];

    /**
     * flag indicating that we should check whether selected item is in viewport after rendering,
     * typically because of keyboard change.
     */
    private shouldCheckSelectedInViewport: boolean;

    private handleQueryChange = handleStringChange(this.resetState);
    private handleKeyDown = createKeyEventHandler({
        [Keys.ARROW_DOWN]: this.selectNext(),
        [Keys.ARROW_UP]: this.selectNext(-1),
        [Keys.ENTER]: () => {
            const activeItem = findDOMNode(this).query(`.${Classes.MENU_ITEM}.${Classes.ACTIVE}`) as HTMLElement;
            if (activeItem != null) {
                activeItem.click();
            }
        },
    });

    public render() {
        return (
            <Popover
                autoFocus={false}
                enforceFocus={false}
                className="docs-navigator"
                content={this.renderPopover()}
                onInteraction={this.handlePopoverInteraction}
                inline={true}
                isOpen={this.state.query.length > 0}
                popoverClassName={Classes.MINIMAL}
                position={Position.BOTTOM_LEFT}
            >
                <InputGroup
                    autoComplete="off"
                    autoFocus={true}
                    inputRef={this.refHandlers.input}
                    leftIconName="search"
                    onChange={this.handleQueryChange}
                    onKeyDown={this.handleKeyDown}
                    placeholder="Search..."
                    type="search"
                    value={this.state.query}
                />
            </Popover>
        );
    }

    public renderHotkeys() {
         return <Hotkeys>
             <Hotkey
                 global={true}
                 combo="shift + s"
                 label="Focus documentation search box"
                 onKeyDown={this.handleFocusSearch}
             />
         </Hotkeys>;
    }

    public componentDidMount() {
        this.sections = [];
        eachLayoutNode(this.props.items, (node, parents) => {
            const { route, title } = node;
            const path = parents.map((p) => p.title).reverse();
            const filterKey = [...path, title].join("/");
            this.sections.push({ filterKey, path, route, title });
        });
    }

    public componentDidUpdate() {
        if (this.shouldCheckSelectedInViewport && this.menuRef != null) {
            const selectedElement = this.menuRef.querySelector(`.${Classes.INTENT_PRIMARY}`) as HTMLElement;
            const { offsetTop: selectedTop, offsetHeight: selectedHeight } = selectedElement;
            const { scrollTop: menuScrollTop, clientHeight: menuHeight } = this.menuRef;
            if (selectedTop + selectedHeight  > menuScrollTop + menuHeight) {
                // offscreen bottom: scroll such that one full item is visible above + menu padding
                this.menuRef.scrollTop = selectedTop - selectedHeight - MENU_PADDING;
            } else if (selectedTop < menuScrollTop) {
                // offscreen top: scroll such that one full item is visible below + menu padding
                this.menuRef.scrollTop = selectedTop - menuHeight + selectedHeight * 2 + MENU_PADDING;
            }
            // reset the flag
            this.shouldCheckSelectedInViewport = false;
        }
    }

    private getMatches(query: string) {
        return filter(this.sections, query, { key: "filterKey" });
    }

    private renderPopover() {
        const { matches, selectedIndex } = this.state;
        let items = matches.map((section, index) => {
            const isSelected = index === selectedIndex;
            const classes = classNames(Classes.MENU_ITEM, Classes.POPOVER_DISMISS, {
                [Classes.ACTIVE]: isSelected,
                [Classes.INTENT_PRIMARY]: isSelected,
            });
            const headerHtml = { __html: section.title };
            // add $icons16-family to font stack to support mixing icons with regular text!
            const pathHtml = { __html: section.path.join(IconContents.CARET_RIGHT) };
            return (
                <a
                    className={classes}
                    href={"#" + section.route}
                    key={section.route}
                    onMouseEnter={this.handleResultHover}
                >
                    <span className="pt-menu-item-text">
                        <small className="docs-result-path pt-text-muted" dangerouslySetInnerHTML={pathHtml} />
                        <div dangerouslySetInnerHTML={headerHtml} />
                    </span>
                </a>
            );
        });
        if (items.length === 0) {
            items = [
                <a className={classNames(Classes.MENU_ITEM, Classes.DISABLED)} key="none">
                    No results. Press <code>esc</code> to reset.
                </a>,
            ];
        }
        return <div className={Classes.MENU} ref={this.refHandlers.menu}>{items}</div>;
    }

    private handleFocusSearch = (e: KeyboardEvent) => {
        if (this.inputRef != null) {
            e.preventDefault();
            this.inputRef.focus();
        }
    }

    private handlePopoverInteraction = (nextOpenState: boolean) => {
        if (!nextOpenState) {
            this.resetState();
        }
    }

    private handleResultHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const el = e.currentTarget as HTMLElement;
        if (el.parentElement != null) {
            const selectedIndex: number = Array.prototype.indexOf.call(el.parentElement.children, el);
            this.setState({ ...this.state, selectedIndex });
        }
    }

    private selectNext(direction = 1) {
        return () => {
            // indicate that the selected item may need to be scrolled into view after update.
            // this is not possible with mouse hover cuz you can't hover on something off screen.
            this.shouldCheckSelectedInViewport = true;
            const { matches, selectedIndex } = this.state;
            this.setState({
                ...this.state,
                selectedIndex: Utils.clamp(selectedIndex + direction, 0, matches.length - 1),
            });
        };
    }
}
