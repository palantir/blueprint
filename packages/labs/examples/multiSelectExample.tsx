/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import { Classes, Intent, ITagProps, MenuItem, Switch } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs";
import { ISelectItemRendererProps, MultiSelect } from "../src";
import { Film, TOP_100_FILMS } from "./data";

const FilmMultiSelect = MultiSelect.ofType<Film>();

const INTENTS = [Intent.NONE, Intent.PRIMARY, Intent.SUCCESS, Intent.DANGER, Intent.WARNING];

export interface IMultiSelectExampleState {
    films?: Film[];
    hasInitialContent?: boolean;
    intent?: boolean;
    openOnKeyDown?: boolean;
    popoverMinimal?: boolean;
    resetOnSelect?: boolean;
    tagMinimal?: boolean;
}

export class MultiSelectExample extends BaseExample<IMultiSelectExampleState> {
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

    protected renderExample() {
        const { films, hasInitialContent, tagMinimal, popoverMinimal, ...flags } = this.state;
        const getTagProps = (_value: string, index: number): ITagProps => ({
            className: tagMinimal ? Classes.MINIMAL : "",
            intent: this.state.intent ? INTENTS[index % INTENTS.length] : Intent.NONE,
        });

        const initialContent = this.state.hasInitialContent ? (
            <MenuItem disabled={true} text={`${TOP_100_FILMS.length} items loaded.`} />
        ) : (
            undefined
        );

        return (
            <FilmMultiSelect
                {...flags}
                initialContent={initialContent}
                items={TOP_100_FILMS}
                itemPredicate={this.filterFilm}
                itemRenderer={this.renderFilm}
                noResults={<MenuItem disabled text="No results." />}
                onItemSelect={this.handleFilmSelect}
                popoverProps={{ popoverClassName: popoverMinimal ? Classes.MINIMAL : "" }}
                tagRenderer={this.renderTag}
                tagInputProps={{ tagProps: getTagProps, onRemove: this.handleTagRemove }}
                selectedItems={this.state.films}
            />
        );
    }

    protected renderOptions() {
        return [
            [
                <Switch
                    key="focus"
                    label="Open popover on key down"
                    checked={this.state.openOnKeyDown}
                    onChange={this.handleKeyDownChange}
                />,
                <Switch
                    key="reset"
                    label="Reset query on select"
                    checked={this.state.resetOnSelect}
                    onChange={this.handleResetChange}
                />,
                <Switch
                    key="hasInitialContent"
                    label="Use initial content"
                    checked={this.state.hasInitialContent}
                    onChange={this.handleInitialContentChange}
                />,
            ],
            [
                <Switch
                    key="minimal-tag"
                    label="Minimal tag style"
                    checked={this.state.tagMinimal}
                    onChange={this.handleTagMinimalChange}
                />,
                <Switch
                    key="intent"
                    label="Cycle through tag intents"
                    checked={this.state.intent}
                    onChange={this.handleIntentChange}
                />,
                <Switch
                    key="minimal-popover"
                    label="Minimal popover style"
                    checked={this.state.popoverMinimal}
                    onChange={this.handlePopoverMinimalChange}
                />,
            ],
        ];
    }

    private renderTag = (film: Film) => {
        return film.title;
    };

    private renderFilm = ({ handleClick, isActive, item: film }: ISelectItemRendererProps<Film>) => {
        const classes = classNames({
            [Classes.ACTIVE]: isActive,
            [Classes.INTENT_PRIMARY]: isActive,
        });

        return (
            <MenuItem
                className={classes}
                iconName={this.isFilmSelected(film) ? "tick" : "blank"}
                key={film.rank}
                label={film.year.toString()}
                onClick={handleClick}
                text={`${film.rank}. ${film.title}`}
                shouldDismissPopover={false}
            />
        );
    };

    private filterFilm(query: string, film: Film, index: number) {
        return `${index + 1}. ${film.title.toLowerCase()} ${film.year}`.indexOf(query.toLowerCase()) >= 0;
    }

    private handleTagRemove = (_tag: string, index: number) => {
        this.deselectFilm(index);
    };

    private getSelectedFilmIndex(film: Film) {
        return this.state.films.indexOf(film);
    }

    private isFilmSelected(film: Film) {
        return this.getSelectedFilmIndex(film) !== -1;
    }

    private selectFilm(film: Film) {
        this.setState({ films: [...this.state.films, film] });
    }

    private deselectFilm(index: number) {
        this.setState({ films: this.state.films.filter((_film, i) => i !== index) });
    }

    private handleFilmSelect = (film: Film) => {
        if (!this.isFilmSelected(film)) {
            this.selectFilm(film);
        } else {
            this.deselectFilm(this.getSelectedFilmIndex(film));
        }
    };

    private handleSwitchChange(prop: keyof IMultiSelectExampleState) {
        return (event: React.FormEvent<HTMLInputElement>) => {
            this.setState({ [prop]: event.currentTarget.checked });
        };
    }
}
