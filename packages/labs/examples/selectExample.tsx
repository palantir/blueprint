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
import { ISelectItemRendererProps, Select } from "../src";
import { Film, TOP_100_FILMS } from "./data";

const FilmSelect = Select.ofType<Film>();

export interface ISelectExampleState {
    film?: Film;
    filterable?: boolean;
    minimal?: boolean;
    resetOnSelect?: boolean;
}

export class SelectExample extends BaseExample<ISelectExampleState> {

    public state: ISelectExampleState = {
        film: TOP_100_FILMS[0],
        filterable: true,
        minimal: false,
        resetOnSelect: false,
    };

    private handleFilterableChange = this.handleSwitchChange("filterable");
    private handleMinimalChange = this.handleSwitchChange("minimal");
    private handleResetChange = this.handleSwitchChange("resetOnSelect");

    protected renderExample() {
        const { film, minimal, ...flags } = this.state;
        return (
            <FilmSelect
                {...flags}
                items={TOP_100_FILMS}
                itemPredicate={this.filterFilm}
                itemRenderer={this.renderFilm}
                noResults={<MenuItem disabled text="No results." />}
                onItemSelect={this.handleValueChange}
                popoverProps={{ popoverClassName: minimal ? Classes.MINIMAL : "" }}
            >
                <Button
                    rightIconName="double-caret-vertical"
                    text={film ? film.title : "(No selection)"}
                />
            </FilmSelect>
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
                <Switch
                    key="minimal"
                    label="Minimal style"
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

    private filterFilm(query: string, film: Film, index: number) {
        return `${index + 1}. ${film.title.toLowerCase()} ${film.year}`.indexOf(query.toLowerCase()) >= 0;
    }

    private handleValueChange = (film: Film) => this.setState({ film });

    private handleSwitchChange(prop: keyof ISelectExampleState) {
        return (event: React.FormEvent<HTMLInputElement>) => {
            this.setState({ [prop]: event.currentTarget.checked });
        };
    }
}
