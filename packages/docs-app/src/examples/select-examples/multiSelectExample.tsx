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

import { Button, H5, Intent, ITagProps, MenuItem, Switch } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";
import { ItemRenderer, MultiSelect } from "@blueprintjs/select";
import {
    areFilmsEqual,
    arrayContainsFilm,
    createFilm,
    filmSelectProps,
    IFilm,
    maybeAddCreatedFilmToArrays,
    maybeDeleteCreatedFilmFromArrays,
    renderCreateFilmOption,
    TOP_100_FILMS,
} from "./films";

const FilmMultiSelect = MultiSelect.ofType<IFilm>();

const INTENTS = [Intent.NONE, Intent.PRIMARY, Intent.SUCCESS, Intent.DANGER, Intent.WARNING];

export interface IMultiSelectExampleState {
    allowCreate: boolean;
    createdItems: IFilm[];
    fill: boolean;
    films: IFilm[];
    hasInitialContent: boolean;
    intent: boolean;
    items: IFilm[];
    openOnKeyDown: boolean;
    popoverMinimal: boolean;
    resetOnSelect: boolean;
    tagMinimal: boolean;
}

export class MultiSelectExample extends React.PureComponent<IExampleProps, IMultiSelectExampleState> {
    public state: IMultiSelectExampleState = {
        allowCreate: false,
        createdItems: [],
        fill: false,
        films: [],
        hasInitialContent: false,
        intent: false,
        items: filmSelectProps.items,
        openOnKeyDown: false,
        popoverMinimal: true,
        resetOnSelect: true,
        tagMinimal: false,
    };

    private handleAllowCreateChange = this.handleSwitchChange("allowCreate");
    private handleKeyDownChange = this.handleSwitchChange("openOnKeyDown");
    private handleResetChange = this.handleSwitchChange("resetOnSelect");
    private handlePopoverMinimalChange = this.handleSwitchChange("popoverMinimal");
    private handleTagMinimalChange = this.handleSwitchChange("tagMinimal");
    private handleFillChange = this.handleSwitchChange("fill");
    private handleIntentChange = this.handleSwitchChange("intent");
    private handleInitialContentChange = this.handleSwitchChange("hasInitialContent");

    public render() {
        const { allowCreate, films, hasInitialContent, tagMinimal, popoverMinimal, ...flags } = this.state;
        const getTagProps = (_value: string, index: number): ITagProps => ({
            intent: this.state.intent ? INTENTS[index % INTENTS.length] : Intent.NONE,
            minimal: tagMinimal,
        });

        const initialContent = this.state.hasInitialContent ? (
            <MenuItem disabled={true} text={`${TOP_100_FILMS.length} items loaded.`} />
        ) : (
            // explicit undefined (not null) for default behavior (show full list)
            undefined
        );
        const maybeCreateNewItemFromQuery = allowCreate ? createFilm : undefined;
        const maybeCreateNewItemRenderer = allowCreate ? renderCreateFilmOption : null;

        const clearButton =
            films.length > 0 ? <Button icon="cross" minimal={true} onClick={this.handleClear} /> : undefined;

        return (
            <Example options={this.renderOptions()} {...this.props}>
                <FilmMultiSelect
                    {...filmSelectProps}
                    {...flags}
                    createNewItemFromQuery={maybeCreateNewItemFromQuery}
                    createNewItemRenderer={maybeCreateNewItemRenderer}
                    initialContent={initialContent}
                    itemRenderer={this.renderFilm}
                    itemsEqual={areFilmsEqual}
                    // we may customize the default filmSelectProps.items by
                    // adding newly created items to the list, so pass our own
                    items={this.state.items}
                    noResults={<MenuItem disabled={true} text="No results." />}
                    onItemSelect={this.handleFilmSelect}
                    onItemsPaste={this.handleFilmsPaste}
                    popoverProps={{ minimal: popoverMinimal }}
                    tagRenderer={this.renderTag}
                    tagInputProps={{ tagProps: getTagProps, onRemove: this.handleTagRemove, rightElement: clearButton }}
                    selectedItems={this.state.films}
                />
            </Example>
        );
    }

    protected renderOptions() {
        return (
            <>
                <H5>Props</H5>
                <Switch
                    label="Open popover on key down"
                    checked={this.state.openOnKeyDown}
                    onChange={this.handleKeyDownChange}
                />
                <Switch
                    label="Reset query on select"
                    checked={this.state.resetOnSelect}
                    onChange={this.handleResetChange}
                />
                <Switch
                    label="Use initial content"
                    checked={this.state.hasInitialContent}
                    onChange={this.handleInitialContentChange}
                />
                <Switch
                    label="Allow creating new films"
                    checked={this.state.allowCreate}
                    onChange={this.handleAllowCreateChange}
                />
                <Switch label="Fill container width" checked={this.state.fill} onChange={this.handleFillChange} />
                <H5>Tag props</H5>
                <Switch
                    label="Minimal tag style"
                    checked={this.state.tagMinimal}
                    onChange={this.handleTagMinimalChange}
                />
                <Switch
                    label="Cycle through tag intents"
                    checked={this.state.intent}
                    onChange={this.handleIntentChange}
                />
                <H5>Popover props</H5>
                <Switch
                    label="Minimal popover style"
                    checked={this.state.popoverMinimal}
                    onChange={this.handlePopoverMinimalChange}
                />
            </>
        );
    }

    private renderTag = (film: IFilm) => film.title;

    // NOTE: not using Films.itemRenderer here so we can set icons.
    private renderFilm: ItemRenderer<IFilm> = (film, { modifiers, handleClick }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return (
            <MenuItem
                active={modifiers.active}
                icon={this.isFilmSelected(film) ? "tick" : "blank"}
                key={film.rank}
                label={film.year.toString()}
                onClick={handleClick}
                text={`${film.rank}. ${film.title}`}
                shouldDismissPopover={false}
            />
        );
    };

    private handleTagRemove = (_tag: string, index: number) => {
        this.deselectFilm(index);
    };

    private getSelectedFilmIndex(film: IFilm) {
        return this.state.films.indexOf(film);
    }

    private isFilmSelected(film: IFilm) {
        return this.getSelectedFilmIndex(film) !== -1;
    }

    private selectFilm(film: IFilm) {
        this.selectFilms([film]);
    }

    private selectFilms(filmsToSelect: IFilm[]) {
        const { createdItems, films, items } = this.state;

        let nextCreatedItems = createdItems.slice();
        let nextFilms = films.slice();
        let nextItems = items.slice();

        filmsToSelect.forEach(film => {
            const results = maybeAddCreatedFilmToArrays(nextItems, nextCreatedItems, film);
            nextItems = results.items;
            nextCreatedItems = results.createdItems;
            // Avoid re-creating an item that is already selected (the "Create
            // Item" option will be shown even if it matches an already selected
            // item).
            nextFilms = !arrayContainsFilm(nextFilms, film) ? [...nextFilms, film] : nextFilms;
        });

        this.setState({
            createdItems: nextCreatedItems,
            films: nextFilms,
            items: nextItems,
        });
    }

    private deselectFilm(index: number) {
        const { films } = this.state;

        const film = films[index];
        const { createdItems: nextCreatedItems, items: nextItems } = maybeDeleteCreatedFilmFromArrays(
            this.state.items,
            this.state.createdItems,
            film,
        );

        // Delete the item if the user manually created it.
        this.setState({
            createdItems: nextCreatedItems,
            films: films.filter((_film, i) => i !== index),
            items: nextItems,
        });
    }

    private handleFilmSelect = (film: IFilm) => {
        if (!this.isFilmSelected(film)) {
            this.selectFilm(film);
        } else {
            this.deselectFilm(this.getSelectedFilmIndex(film));
        }
    };

    private handleFilmsPaste = (films: IFilm[]) => {
        // On paste, don't bother with deselecting already selected values, just
        // add the new ones.
        this.selectFilms(films);
    };

    private handleSwitchChange(prop: keyof IMultiSelectExampleState) {
        return (event: React.FormEvent<HTMLInputElement>) => {
            const checked = event.currentTarget.checked;
            this.setState(state => ({ ...state, [prop]: checked }));
        };
    }

    private handleClear = () => this.setState({ films: [] });
}
