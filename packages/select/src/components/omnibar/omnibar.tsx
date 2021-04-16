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

import { DISPLAYNAME_PREFIX, InputGroupProps2, InputGroup, OverlayProps, Overlay } from "@blueprintjs/core";

import { Classes, IListItemsProps } from "../../common";
import { IQueryListRendererProps, QueryList } from "../query-list/queryList";

// eslint-disable-next-line deprecation/deprecation
export type OmnibarProps<T> = IOmnibarProps<T>;
/** @deprecated use OmnibarProps */
export interface IOmnibarProps<T> extends IListItemsProps<T> {
    /**
     * Props to spread to the query `InputGroup`. Use `query` and
     * `onQueryChange` instead of `inputProps.value` and `inputProps.onChange`
     * to control this input.
     */
    inputProps?: InputGroupProps2;

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

export class Omnibar<T> extends React.PureComponent<OmnibarProps<T>> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Omnibar`;

    public static ofType<U>() {
        return Omnibar as new (props: OmnibarProps<U>) => Omnibar<U>;
    }

    private TypedQueryList = QueryList.ofType<T>();

    public render() {
        // omit props specific to this component, spread the rest.
        const { isOpen, inputProps, overlayProps, ...restProps } = this.props;
        const initialContent = "initialContent" in this.props ? this.props.initialContent : null;

        return <this.TypedQueryList {...restProps} initialContent={initialContent} renderer={this.renderQueryList} />;
    }

    private renderQueryList = (listProps: IQueryListRendererProps<T>) => {
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
                        leftIcon="search"
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
