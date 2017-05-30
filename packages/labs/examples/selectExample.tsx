/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import { Button, Classes, MenuItem } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs";
import { Select } from "../src";
import { Movie, MOVIES } from "./data";

const MovieSelect = Select.ofType<Movie>();

export interface ISelectExampleState {
    isOpen?: boolean;
    selectQuery?: string;
    selectValue?: Movie;
}

export class SelectExample extends BaseExample<ISelectExampleState> {

    public state: ISelectExampleState = {
        isOpen: false,
        selectQuery: "",
        selectValue: MOVIES[0],
    };

    protected renderExample() {
        return (
            <MovieSelect
                items={MOVIES}
                itemFilterer={this.filterMovie}
                itemRenderer={this.renderMovie}
                noResults={<MenuItem disabled text="No results." />}
                onItemSelect={this.handleValueChange}
                onQueryChange={this.handleSelectQueryChange}
                query={this.state.selectQuery}
            >
                <Button text={this.state.selectValue.title} rightIconName="double-caret-vertical" />
            </MovieSelect>
        );
    }

    private renderMovie(movie: Movie, isSelected: boolean, onClick: React.MouseEventHandler<HTMLElement>) {
        const classes = classNames({
            [Classes.ACTIVE]: isSelected,
            [Classes.INTENT_PRIMARY]: isSelected,
        });
        return (
            <MenuItem
                className={classes}
                label={movie.year.toString()}
                onClick={onClick}
                text={`${movie.rank}. ${movie.title}`}
            />
        );
    }

    private filterMovie(movie: Movie, query: string) {
        return `${movie.title.toLowerCase()} ${movie.year}`.indexOf(query.toLowerCase()) >= 0;
    }

    private handleSelectQueryChange = (event?: React.FormEvent<HTMLInputElement>) => {
        this.setState({ selectQuery: event === undefined ? "" : event.currentTarget.value });
    }

    private handleValueChange = (selectValue: Movie) => this.setState({ selectValue });
}
