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
import { IMultiSelectItemRendererProps, MultiSelect } from "../src";
import { Film, TOP_100_FILMS } from "./data";

const FilmMultiSelect = MultiSelect.ofType<Film>();

const INTENTS = [Intent.NONE, Intent.PRIMARY, Intent.SUCCESS, Intent.DANGER, Intent.WARNING];

export interface IMultiSelectExampleState {
    film?: Film;
    intent?: boolean;
    openOnKeyDown?: boolean;
    popoverMinimal?: boolean;
    resetOnSelect?: boolean;
    tagMinimal?: boolean;
}

export class MultiSelectExample extends BaseExample<IMultiSelectExampleState> {
    public state: IMultiSelectExampleState = {
        film: TOP_100_FILMS[0],
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

    protected renderExample() {
        const { film, tagMinimal, popoverMinimal, ...flags } = this.state;
        const getTagProps = (_value: string, index: number): ITagProps => ({
            className: tagMinimal ? Classes.MINIMAL : "",
            intent: this.state.intent ? INTENTS[index % INTENTS.length] : Intent.NONE,
        });

        return (
            <FilmMultiSelect
                {...flags}
                items={TOP_100_FILMS}
                itemPredicate={this.filterFilm}
                itemRenderer={this.renderFilm}
                noResults={<MenuItem disabled text="No results." />}
                onItemSelect={this.handleValueChange}
                popoverProps={{ popoverClassName: popoverMinimal ? Classes.MINIMAL : "" }}
                tagRenderer={this.renderTag}
                tagInputProps={{ tagProps: getTagProps }}
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
            ],
            [
                <Switch
                    key="minimaltag"
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
                    key="minimalpopover"
                    label="Minimal popover style"
                    checked={this.state.popoverMinimal}
                    onChange={this.handlePopoverMinimalChange}
                />,
            ],
        ];
    }

    private renderTag = (film: Film) => {
        return film.title;
    }

    private renderFilm({ handleClick, isActive, isSelected, item: film }: IMultiSelectItemRendererProps<Film>) {
        const classes = classNames({
            [Classes.ACTIVE]: isActive,
            [Classes.INTENT_PRIMARY]: isActive,
        });

        return (
            <MenuItem
                className={classes}
                iconName={isSelected ? "tick" : "blank"}
                key={film.rank}
                label={film.year.toString()}
                onClick={handleClick}
                text={`${film.rank}. ${film.title}`}
                shouldDismissPopover={false}
            />
        );
    }

    private filterFilm(query: string, film: Film, index: number) {
        return `${index + 1}. ${film.title.toLowerCase()} ${film.year}`.indexOf(query.toLowerCase()) >= 0;
    }

    private handleValueChange = (film: Film) => this.setState({ film });

    private handleSwitchChange(prop: keyof IMultiSelectExampleState) {
        return (event: React.FormEvent<HTMLInputElement>) => {
            this.setState({ [prop]: event.currentTarget.checked });
        };
    }
}
