/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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
import { Example, ExampleProps } from "@blueprintjs/docs-theme";
import { ItemRenderer, MultiSelect2 } from "@blueprintjs/select";
import { areFilmsEqual, Film, filterFilm, getFilmItemProps, TOP_100_FILMS } from "@blueprintjs/select/examples";

interface ExampleState {
    hasFocus: boolean;
    items: Film[];
    selectedItems: Film[];
}

export class MultiSelectEditableOnClickExample extends React.PureComponent<ExampleProps, ExampleState> {
    public state: ExampleState = {
        hasFocus: false,
        items: TOP_100_FILMS,
        selectedItems: [],
    };

    public render() {
        return (
            <Example {...this.props}>
                <MultiSelect2<Film>
                    itemPredicate={filterFilm}
                    itemRenderer={this.renderFilm}
                    items={this.state.items}
                    itemsEqual={areFilmsEqual}
                    menuProps={{ "aria-label": "films" }}
                    noResults={<MenuItem disabled={true} text="No results." roleStructure="listoption" />}
                    onClear={this.handleClear}
                    onItemSelect={this.handleFilmSelect}
                    onItemsPaste={this.handleFilmsPaste}
                    popoverProps={{
                        onClosed: this.handlePopoverClosed,
                    }}
                    readOnly={!this.state.hasFocus}
                    tagRenderer={this.renderTag}
                    tagInputProps={{
                        onClick: this.handleTagInputClick,
                        onRemove: this.handleTagRemove,
                    }}
                    selectedItems={this.state.selectedItems}
                />
            </Example>
        );
    }

    private renderTag = (film: Film) => film.title;

    private renderFilm: ItemRenderer<Film> = (film, props) => {
        if (!props.modifiers.matchesPredicate) {
            return null;
        }

        return (
            <MenuItem
                {...getFilmItemProps(film, props)}
                selected={this.isFilmSelected(film)}
                shouldDismissPopover={false}
                text={`${film.rank}. ${film.title}`}
            />
        );
    };

    private handlePopoverClosed = () => {
        this.setState({ hasFocus: false });
    };

    private handleTagInputClick = () => {
        this.setState({ hasFocus: true });
    };

    private handleTagRemove = (_tag: React.ReactNode, index: number) => {
        this.deselectFilm(index);
    };

    private getSelectedFilmIndex(film: Film) {
        return this.state.selectedItems.indexOf(film);
    }

    private isFilmSelected(film: Film) {
        return this.getSelectedFilmIndex(film) !== -1;
    }

    private selectFilm(film: Film) {
        this.selectFilms([film]);
    }

    private selectFilms(selectedItems: Film[]) {
        this.setState({ selectedItems });
    }

    private deselectFilm(index: number) {
        this.setState(({ selectedItems }) => ({
            selectedItems: selectedItems.filter((_film, i) => i !== index),
        }));
    }

    private handleFilmSelect = (film: Film) => {
        if (!this.isFilmSelected(film)) {
            this.selectFilm(film);
        } else {
            this.deselectFilm(this.getSelectedFilmIndex(film));
        }
    };

    private handleFilmsPaste = (films: Film[]) => {
        // On paste, don't bother with deselecting already selected values, just
        // add the new ones.
        this.selectFilms(films);
    };

    private handleClear = () => {
        this.setState({ selectedItems: [] });
    };
}
