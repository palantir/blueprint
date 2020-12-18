/*
 * Copyright 2020 Palantir Technologies, Inc. All rights reserved.
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

import { Button } from "@blueprintjs/core";
import { Example } from "@blueprintjs/docs-theme";
import { Select } from "@blueprintjs/select";
import { IFilm, renderFilm } from "../films";
import { AsyncExampleReactComponent, IAsyncExampleState } from "./base";

const FilmSelect = Select.ofType<IFilm>();

export interface ISelectAsyncExampleState extends IAsyncExampleState {
    selectedFilm?: IFilm;
}

export class SelectAsyncExample extends AsyncExampleReactComponent<ISelectAsyncExampleState> {
    public state: ISelectAsyncExampleState = {
        items: [],
    };

    public render() {
        const { items, selectedFilm, loading } = this.state;

        return (
            <Example {...this.props}>
                <FilmSelect
                    items={items}
                    itemRenderer={renderFilm}
                    onItemSelect={this.handleValueChange}
                    onQueryChange={query => this.mockAsyncOperation(query)}
                    loading={loading}
                >
                    <Button
                        icon="film"
                        rightIcon="caret-down"
                        text={selectedFilm ? `${selectedFilm.title} (${selectedFilm.year})` : "(No selection)"}
                    />
                </FilmSelect>
            </Example>
        );
    }

    private handleValueChange = (film: IFilm) => {
        this.setState({
            selectedFilm: film,
        });
    };
}
