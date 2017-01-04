/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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
    Menu,
    Popover,
    Position,
} from "@blueprintjs/core";
import { handleStringChange } from "@blueprintjs/core/examples/common/baseExample";

import * as classNames from "classnames";
import { filter } from "fuzzaldrin-plus";
import * as React from "react";
import { findDOMNode } from "react-dom";

import { createKeyEventHandler } from "../common/utils";
import { IStyleguideSection } from "./styleguide";

export interface INavigatorProps {
    onNavigate: (id: string) => void;
    pages: IStyleguideSection[];
}

export interface INavigatorState {
    query?: string;
    selectedIndex?: number;
}

interface INavigationSection {
    filterKey: string;
    header: string;
    path: string[];
    reference: string;
}

@HotkeysTarget
export class Navigator extends React.PureComponent<INavigatorProps, INavigatorState> {
    public state: INavigatorState = {
        query: "",
        selectedIndex: 0,
    };

    private inputRef: HTMLElement;

    // this guy must be defined before he's used in handleQueryChange
    // and it just makes sense to be up here with state init
    // tslint:disable:member-ordering
    private resetState = (query = "") => this.setState({ query, selectedIndex: 0 });
    private sections: INavigationSection[];

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
                    autoFocus={true}
                    inputRef={this.handleSetSearchInputRef}
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
        this.sections = flattenSections(this.props.pages);
    }

    private getMatches() {
        return filter(this.sections, this.state.query, {
            key: "filterKey",
        });
    }

    private renderPopover() {
        const matches = this.getMatches();
        const selectedIndex = Math.min(matches.length, this.state.selectedIndex);
        let items = matches.map((section, index) => {
            const classes = classNames(Classes.MENU_ITEM, Classes.POPOVER_DISMISS, {
                [Classes.ACTIVE]: index === selectedIndex,
            });
            const headerHtml = { __html: section.header };
            // add $icons16-family to font stack to support mixing icons with regular text!
            const pathHtml = { __html: section.path.join(IconContents.CARET_RIGHT) };
            return (
                <a
                    className={classes}
                    href={"#" + section.reference}
                    key={index}
                    onMouseEnter={this.handleResultHover}
                >
                    <small className="docs-result-path pt-text-muted" dangerouslySetInnerHTML={pathHtml} />
                    <div dangerouslySetInnerHTML={headerHtml} />
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
        return <Menu>{items}</Menu>;
    }

    private handleFocusSearch = (e: KeyboardEvent) => {
        if (this.inputRef != null) {
            e.preventDefault();
            this.inputRef.focus();
        }
    }

    private handleSetSearchInputRef = (ref: Element) => {
        this.inputRef = ref as HTMLElement;
    }

    private handlePopoverInteraction = (nextOpenState: boolean) => {
        if (!nextOpenState) {
            this.resetState();
        }
    }

    private handleResultHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const el = e.currentTarget as HTMLElement;
        const selectedIndex: number = Array.prototype.indexOf.call(el.parentElement.children, el);
        this.setState({ selectedIndex });
    }

    private selectNext(direction = 1) {
        return () => this.setState({
            selectedIndex: Math.max(0, this.state.selectedIndex + direction),
        });
    }
}

// recursive reducer that turns the section tree into a flat array of NavigationSections,
// preprocessed for optimal filtering
function flattenSections(sections: IStyleguideSection[], path: string[] = []) {
    return sections.reduce((array: INavigationSection[], section: IStyleguideSection): INavigationSection[] => {
        const { header, reference } = section;
        const filterKey = [...path, header].join("/");
        return array.concat(
            { header, path, reference, filterKey },
            flattenSections(section.sections, path.concat(header)),
        );
    }, []);
}
