/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
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
    hasInitialContent?: boolean;
    minimal?: boolean;
    resetOnClose?: boolean;
    resetOnSelect?: boolean;
    disabled?: boolean;
}

export class SelectExample extends BaseExample<ISelectExampleState> {
    public state: ISelectExampleState = {
        disabled: false,
        film: TOP_100_FILMS[0],
        filterable: true,
        hasInitialContent: false,
        minimal: false,
        resetOnClose: false,
        resetOnSelect: false,
    };

    private handleFilterableChange = this.handleSwitchChange("filterable");
    private handleMinimalChange = this.handleSwitchChange("minimal");
    private handleResetOnCloseChange = this.handleSwitchChange("resetOnClose");
    private handleResetOnSelectChange = this.handleSwitchChange("resetOnSelect");
    private handleInitialContentChange = this.handleSwitchChange("hasInitialContent");
    private handleDisabledChange = this.handleSwitchChange("disabled");

    protected renderExample() {
        const { disabled, film, minimal, ...flags } = this.state;

        const initialContent = this.state.hasInitialContent ? (
            <MenuItem disabled={true} text={`${TOP_100_FILMS.length} items loaded.`} />
        ) : (
            undefined
        );

        return (
            <FilmSelect
                {...flags}
                disabled={disabled}
                initialContent={initialContent}
                items={TOP_100_FILMS}
                itemPredicate={this.filterFilm}
                itemRenderer={this.renderFilm}
                noResults={<MenuItem disabled={true} text="No results." />}
                onItemSelect={this.handleValueChange}
                popoverProps={{ minimal }}
            >
                <Button rightIconName="caret-down" text={film ? film.title : "(No selection)"} disabled={disabled} />
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
                    key="resetOnClose"
                    label="Reset on close"
                    checked={this.state.resetOnClose}
                    onChange={this.handleResetOnCloseChange}
                />,
                <Switch
                    key="resetOnSelect"
                    label="Reset on select"
                    checked={this.state.resetOnSelect}
                    onChange={this.handleResetOnSelectChange}
                />,
                <Switch
                    key="minimal"
                    label="Minimal popover style"
                    checked={this.state.minimal}
                    onChange={this.handleMinimalChange}
                />,
                <Switch
                    key="disabled"
                    label="Disabled"
                    checked={this.state.disabled}
                    onChange={this.handleDisabledChange}
                />,
                <Switch
                    key="hasInitialContent"
                    label="Use initial content"
                    checked={this.state.hasInitialContent}
                    onChange={this.handleInitialContentChange}
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
