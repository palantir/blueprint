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

import * as React from "react";

import { Button, MenuItem, Position, Toaster } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";
import { Omnibar } from "@blueprintjs/select";
import { areFilmsEqual, filterFilm, IFilm, renderFilm, TOP_100_FILMS } from "./films";

const FilmOmnibar = Omnibar.ofType<IFilm>();

const MOCK_ASYNC_OPS_DURATION = 500;

export interface IOmnibarAsyncExampleState {
    isOpen: boolean;

    // items - supplied externally from async operation
    filmItems: IFilm[];
    loading: boolean;
}

export class OmnibarAsyncExample extends React.PureComponent<IExampleProps, IOmnibarAsyncExampleState> {
    private mockAsyncOperationTimeout: number = -1;

    public state: IOmnibarAsyncExampleState = {
        isOpen: false,
        filmItems: [],
        loading: false,
    };

    private toaster: Toaster;
    private refHandlers = {
        toaster: (ref: Toaster) => (this.toaster = ref),
    };

    public render() {
        return (
            <Example options={this.renderOptions()} {...this.props}>
                <span>
                    <Button text="Click to show Omnibar" onClick={this.handleClick} />
                </span>

                <FilmOmnibar
                    itemRenderer={renderFilm}
                    items={this.state.filmItems}
                    isOpen={this.state.isOpen}
                    resetOnSelect={true}
                    itemsEqual={areFilmsEqual}
                    noResults={<MenuItem disabled={true} text="No results." />}
                    onItemSelect={this.handleItemSelect}
                    onClose={this.handleClose}
                    onQueryChange={query => {
                        this.mockAsyncOperation(query);
                    }}
                    loading={this.state.loading}
                />
                <Toaster position={Position.TOP} ref={this.refHandlers.toaster} />
            </Example>
        );
    }

    private mockAsyncOperation = (query: string) => {
        window.clearTimeout(this.mockAsyncOperationTimeout);

        if (!this.state.loading) {
            this.setState({ loading: true });
        }

        this.mockAsyncOperationTimeout = window.setTimeout(() => {
            this.setState({
                filmItems: TOP_100_FILMS.filter(film => {
                    return filterFilm(query, film, 0, false);
                }),
                loading: false,
            });
        }, MOCK_ASYNC_OPS_DURATION);
    };

    protected renderOptions(): JSX.Element {
        return null;
    }

    private handleClick = (_event: React.MouseEvent<HTMLElement>) => {
        this.setState({ isOpen: true });
    };

    private handleItemSelect = (film: IFilm) => {
        this.setState({ isOpen: false });

        this.toaster.show({
            message: (
                <span>
                    You selected <strong>{film.title}</strong>.
                </span>
            ),
        });
    };

    private handleClose = () => this.setState({ isOpen: false });
}
