/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, H5, Intent, ITagProps, MenuItem, Switch } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";
import { ItemRenderer, MultiSelect } from "@blueprintjs/select";
import { filmSelectProps, IFilm, TOP_100_FILMS } from "./films";

const FilmMultiSelect = MultiSelect.ofType<IFilm>();

const INTENTS = [Intent.NONE, Intent.PRIMARY, Intent.SUCCESS, Intent.DANGER, Intent.WARNING];

export interface IMultiSelectExampleState {
    films: IFilm[];
    hasInitialContent: boolean;
    intent: boolean;
    openOnKeyDown: boolean;
    popoverMinimal: boolean;
    resetOnSelect: boolean;
    tagMinimal: boolean;
}

export class MultiSelectExample extends React.PureComponent<IExampleProps, IMultiSelectExampleState> {
    public state: IMultiSelectExampleState = {
        films: [],
        hasInitialContent: false,
        intent: false,
        openOnKeyDown: false,
        popoverMinimal: true,
        resetOnSelect: true,
        tagMinimal: false,
    };

    private handleKeyDownChange = this.handleSwitchChange("openOnKeyDown");
    private handleResetChange = this.handleSwitchChange("resetOnSelect");
    private handlePopoverMinimalChange = this.handleSwitchChange("popoverMinimal");
    private handleTagMinimalChange = this.handleSwitchChange("tagMinimal");
    private handleIntentChange = this.handleSwitchChange("intent");
    private handleInitialContentChange = this.handleSwitchChange("hasInitialContent");

    public render() {
        const { films, hasInitialContent, tagMinimal, popoverMinimal, ...flags } = this.state;
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

        const clearButton = films.length > 0 ? <Button icon="cross" minimal={true} onClick={this.handleClear} /> : null;

        return (
            <Example options={this.renderOptions()} {...this.props}>
                <FilmMultiSelect
                    {...filmSelectProps}
                    {...flags}
                    initialContent={initialContent}
                    itemRenderer={this.renderFilm}
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
        this.setState({ films: [...this.state.films, film] });
    }

    private deselectFilm(index: number) {
        this.setState({ films: this.state.films.filter((_film, i) => i !== index) });
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
}
