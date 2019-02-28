/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, H5, Intent, ITagProps, MenuItem, Switch } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";
import { ItemRenderer, MultiSelect } from "@blueprintjs/select";
import { areFilmsEqual, createFilm, filmSelectProps, IFilm, renderCreateFilmOption, TOP_100_FILMS } from "./films";

const FilmMultiSelect = MultiSelect.ofType<IFilm>();

const INTENTS = [Intent.NONE, Intent.PRIMARY, Intent.SUCCESS, Intent.DANGER, Intent.WARNING];

export interface IMultiSelectExampleState {
    allowCreate: boolean;
    createdItems: IFilm[];
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

        const clearButton = films.length > 0 ? <Button icon="cross" minimal={true} onClick={this.handleClear} /> : null;

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
                    noResults={<MenuItem disabled={true} text="No results." />}
                    onItemSelect={this.handleFilmSelect}
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
        const { createdItems, films, items } = this.state;
        const isNewlyCreatedItem = !this.arrayContainsFilm(items, film);
        this.setState({
            createdItems: isNewlyCreatedItem ? this.addFilmToArray(createdItems, film) : createdItems,
            // Avoid re-creating an item that is already selected (the "Create
            // Item" option will be shown even if it matches an already selected
            // item).
            films: !this.arrayContainsFilm(films, film) ? [...films, film] : films,
            // Add a created film to `items` so that the film can be deselected.
            items: isNewlyCreatedItem ? this.addFilmToArray(items, film) : items,
        });
    }

    private deselectFilm(index: number) {
        const { createdItems, films, items } = this.state;

        const film = films[index];
        const wasItemCreatedByUser = this.arrayContainsFilm(createdItems, film);

        // Delete the item if the user manually created it.
        this.setState({
            createdItems: wasItemCreatedByUser ? this.deleteFilmFromArray(createdItems, film) : createdItems,
            films: films.filter((_film, i) => i !== index),
            items: wasItemCreatedByUser ? this.deleteFilmFromArray(items, film) : items,
        });
    }

    private handleFilmSelect = (film: IFilm) => {
        if (!this.isFilmSelected(film)) {
            this.selectFilm(film);
        } else {
            this.deselectFilm(this.getSelectedFilmIndex(film));
        }
    };

    private handleSwitchChange(prop: keyof IMultiSelectExampleState) {
        return (event: React.FormEvent<HTMLInputElement>) => {
            const checked = event.currentTarget.checked;
            this.setState(state => ({ ...state, [prop]: checked }));
        };
    }

    private handleClear = () => this.setState({ films: [] });

    private arrayContainsFilm(films: IFilm[], filmToFind: IFilm): boolean {
        return films.find(f => f.title === filmToFind.title) !== undefined;
    }

    private addFilmToArray(films: IFilm[], filmToAdd: IFilm) {
        return [...films, filmToAdd];
    }

    private deleteFilmFromArray(films: IFilm[], filmToDelete: IFilm) {
        return films.filter(film => film !== filmToDelete);
    }
}
