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

import * as classNames from "classnames";
import * as React from "react";

import { Classes, MenuItem, Switch } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs";
import { ISelectItemRendererProps, Suggest } from "../src";
import { Film, TOP_100_FILMS } from "./data";

const FilmSuggest = Suggest.ofType<Film>();

export interface ISuggestExampleState {
    closeOnSelect?: boolean;
    film?: Film;
    minimal?: boolean;
    openOnKeyDown?: boolean;
}

export class SuggestExample extends BaseExample<ISuggestExampleState> {
    public state: ISuggestExampleState = {
        closeOnSelect: true,
        film: TOP_100_FILMS[0],
        minimal: true,
        openOnKeyDown: false,
    };

    private handleCloseOnSelectChange = this.handleSwitchChange("closeOnSelect");
    private handleOpenOnKeyDownChange = this.handleSwitchChange("openOnKeyDown");
    private handleMinimalChange = this.handleSwitchChange("minimal");

    protected renderExample() {
        const { film, minimal, ...flags } = this.state;
        return (
            <FilmSuggest
                {...flags}
                inputValueRenderer={this.renderInputValue}
                items={TOP_100_FILMS}
                itemPredicate={this.filterFilm}
                itemRenderer={this.renderFilm}
                noResults={<MenuItem disabled={true} text="No results." />}
                onItemSelect={this.handleValueChange}
                popoverProps={{ popoverClassName: minimal ? Classes.MINIMAL : "" }}
            />
        );
    }

    protected renderOptions() {
        return [
            [
                <Switch
                    key="closeOnSelect"
                    label="Close on select"
                    checked={this.state.closeOnSelect}
                    onChange={this.handleCloseOnSelectChange}
                />,
                <Switch
                    key="openOnKeyDown"
                    label="Open popover on key down"
                    checked={this.state.openOnKeyDown}
                    onChange={this.handleOpenOnKeyDownChange}
                />,
                <Switch
                    key="minimal"
                    label="Minimal popover style"
                    checked={this.state.minimal}
                    onChange={this.handleMinimalChange}
                />,
            ],
        ];
    }

    private renderFilm({ handleClick, isActive, item: film }: ISelectItemRendererProps<Film>) {
        const classes = classNames({
            [Classes.ACTIVE]: isActive,
            [Classes.INTENT_PRIMARY]: isActive,
        });
        return (
            <MenuItem
                className={classes}
                label={film.year.toString()}
                key={film.rank}
                onClick={handleClick}
                text={`${film.rank}. ${film.title}`}
            />
        );
    }

    private renderInputValue = (film: Film) => {
        return film.title;
    };

    private filterFilm(query: string, film: Film, index: number) {
        return `${index + 1}. ${film.title.toLowerCase()} ${film.year}`.indexOf(query.toLowerCase()) >= 0;
    }

    private handleValueChange = (film: Film) => this.setState({ film });

    private handleSwitchChange(prop: keyof ISuggestExampleState) {
        return (event: React.FormEvent<HTMLInputElement>) => {
            this.setState({ [prop]: event.currentTarget.checked });
        };
    }
}
