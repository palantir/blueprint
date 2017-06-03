/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import { Button, Classes, MenuItem, Switch } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs";
import { Select } from "../src";
import { Film, TOP_100_FILMS } from "./data";

const MovieSelect = Select.ofType<Film>();

export interface ISelectExampleState {
    film?: Film;
    filterable?: boolean;
    resetOnSelect?: boolean;
}

export class SelectExample extends BaseExample<ISelectExampleState> {

    public state: ISelectExampleState = {
        film: TOP_100_FILMS[0],
        filterable: true,
        resetOnSelect: false,
    };

    protected renderExample() {
        const { film, ...flags } = this.state;
        return (
            <MovieSelect
                {...flags}
                items={TOP_100_FILMS}
                itemPredicate={this.filterFilm}
                itemRenderer={this.renderFilm}
                noResults={<MenuItem disabled text="No results." />}
                onItemSelect={this.handleValueChange}
            >
                <Button text={film ? film.title : "(No selection)"} rightIconName="double-caret-vertical" />
            </MovieSelect>
        );
    }

    protected renderOptions() {
        return [
            [
                <Switch
                    key="filterable"
                    label="Filterable"
                    checked={this.state.filterable}
                    onChange={this.handleFilterableChange}
                />,
                <Switch
                    key="reset"
                    label="Reset on select"
                    checked={this.state.resetOnSelect}
                    onChange={this.handleResetChange}
                />,
            ],
        ];
    }

    private renderFilm(film: Film, isSelected: boolean, onClick: React.MouseEventHandler<HTMLElement>) {
        const classes = classNames({
            [Classes.ACTIVE]: isSelected,
            [Classes.INTENT_PRIMARY]: isSelected,
        });
        return (
            <MenuItem
                className={classes}
                label={film.year.toString()}
                key={film.rank}
                onClick={onClick}
                text={`${film.rank}. ${film.title}`}
            />
        );
    }

    private filterFilm(film: Film, query: string) {
        return `${film.rank}. ${film.title.toLowerCase()} ${film.year}`.indexOf(query.toLowerCase()) >= 0;
    }

    private handleValueChange = (film: Film) => this.setState({ film });

    private handleFilterableChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({ filterable: event.currentTarget.checked });
    }
    private handleResetChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({ resetOnSelect: event.currentTarget.checked });
    }
}
