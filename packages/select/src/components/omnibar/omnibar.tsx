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

import { DISPLAYNAME_PREFIX, InputGroup, type InputGroupProps, Overlay, type OverlayProps } from "@blueprintjs/core";
import { Search } from "@blueprintjs/icons";

import { Classes, type ListItemsProps } from "../../common";
import { QueryList, type QueryListRendererProps } from "../query-list/queryList";

export interface OmnibarProps<T> extends ListItemsProps<T> {
    /**
     * Props to spread to the query `InputGroup`. Use `query` and
     * `onQueryChange` instead of `inputProps.value` and `inputProps.onChange`
     * to control this input.
     */
    inputProps?: InputGroupProps;

    /**
     * Toggles the visibility of the omnibar.
     * This prop is required because the component is controlled.
     */
    isOpen: boolean;

    /**
     * A callback that is invoked when user interaction causes the omnibar to
     * close, such as clicking on the overlay or pressing the `esc` key (if
     * enabled). Receives the event from the user's interaction, if there was an
     * event (generally either a mouse or key event).
     *
     * Note that due to controlled usage, this component will not actually close
     * itself until the `isOpen` prop becomes `false`.
     * .
     */
    onClose?: (event?: React.SyntheticEvent<HTMLElement>) => void;

    /** Props to spread to `Overlay`. */
    overlayProps?: Partial<OverlayProps>;
}

/**
 * Omnibar component.
 *
 * @see https://blueprintjs.com/docs/#select/omnibar
 */
export class Omnibar<T> extends React.PureComponent<OmnibarProps<T>> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Omnibar`;

    public static ofType<U>() {
        return Omnibar as new (props: OmnibarProps<U>) => Omnibar<U>;
    }

    public render() {
        // omit props specific to this component, spread the rest.
        const { isOpen, inputProps, overlayProps, ...restProps } = this.props;
        const initialContent = "initialContent" in this.props ? this.props.initialContent : null;

        return (
            <QueryList<T>
                {...restProps}
                // Omnibar typically does not keep track of and/or show its selection state like other
                // select components, so it's more of a menu than a listbox. This means that users should return
                // MenuItems with roleStructure="menuitem" (the default value) in `props.itemRenderer`.
                menuProps={{ role: "menu" }}
                initialContent={initialContent}
                renderer={this.renderQueryList}
            />
        );
    }

    private renderQueryList = (listProps: QueryListRendererProps<T>) => {
        const { inputProps = {}, isOpen, overlayProps = {} } = this.props;
        const { handleKeyDown, handleKeyUp } = listProps;
        const handlers = isOpen ? { onKeyDown: handleKeyDown, onKeyUp: handleKeyUp } : {};

        return (
            <Overlay
                hasBackdrop={true}
                {...overlayProps}
                isOpen={isOpen}
                className={classNames(Classes.OMNIBAR_OVERLAY, overlayProps.className)}
                onClose={this.handleOverlayClose}
            >
                <div className={classNames(Classes.OMNIBAR, listProps.className)} {...handlers}>
                    <InputGroup
                        autoFocus={true}
                        large={true}
                        leftIcon={<Search />}
                        placeholder="Search..."
                        {...inputProps}
                        onChange={listProps.handleQueryChange}
                        value={listProps.query}
                    />
                    {listProps.itemList}
                </div>
            </Overlay>
        );
    };

    private handleOverlayClose = (event: React.SyntheticEvent<HTMLElement>) => {
        this.props.overlayProps?.onClose?.(event);
        this.props.onClose?.(event);
    };
}
