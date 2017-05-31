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
    query?: string;
}

export class SelectExample extends BaseExample<ISelectExampleState> {

    public state: ISelectExampleState = {
        film: TOP_100_FILMS[0],
        filterable: true,
        query: "",
    };

    protected renderExample() {
        const { film, ...props } = this.state;
        return (
            <MovieSelect
                {...props}
                items={TOP_100_FILMS}
                itemPredicate={this.filterFilm}
                itemRenderer={this.renderFilm}
                noResults={<MenuItem disabled text="No results." />}
                onItemSelect={this.handleValueChange}
                onQueryChange={this.handleQueryChange}
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
        return `${film.title.toLowerCase()} ${film.year}`.indexOf(query.toLowerCase()) >= 0;
    }

    private handleQueryChange = (event?: React.FormEvent<HTMLInputElement>) => {
        this.setState({ query: event === undefined ? "" : event.currentTarget.value });
    }

    private handleValueChange = (film: Film) => this.setState({ film });

    private handleFilterableChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({ filterable: event.currentTarget.checked });
    }
}
