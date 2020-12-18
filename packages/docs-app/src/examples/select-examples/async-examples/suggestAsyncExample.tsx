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

import { MenuItem } from "@blueprintjs/core";
import { Example } from "@blueprintjs/docs-theme";
import { Suggest } from "@blueprintjs/select";
import { IFilm, renderFilm, TOP_100_FILMS } from "../films";
import { AsyncExampleReactComponent, IAsyncExampleState } from "./base";

const FilmSuggest = Suggest.ofType<IFilm>();

export interface ISuggestAsyncExampleState extends IAsyncExampleState {
    selectedFilm?: IFilm;
}

export class SuggestAsyncExample extends AsyncExampleReactComponent<ISuggestAsyncExampleState> {
    public state: ISuggestAsyncExampleState = {
        items: TOP_100_FILMS,
    };

    public render() {
        const { items, loading } = this.state;

        return (
            <Example {...this.props}>
                <FilmSuggest
                    inputValueRenderer={this.renderInputValue}
                    items={items}
                    noResults={<MenuItem disabled={true} text="No results." />}
                    onItemSelect={this.handleValueChange}
                    itemRenderer={renderFilm}
                    onQueryChange={this.mockAsyncOperation}
                    loading={loading}
                />
            </Example>
        );
    }

    private renderInputValue = (film: IFilm) => film.title;

    private handleValueChange = (film: IFilm) => {
        this.setState({ selectedFilm: film });
    };
}
