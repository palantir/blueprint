/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Classes, MenuItem, Switch } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs";
import { Suggest } from "@blueprintjs/select";
import * as Films from "./films";

const FilmSuggest = Suggest.ofType<Films.Film>();

export interface ISuggestExampleState {
    closeOnSelect?: boolean;
    film?: Films.Film;
    minimal?: boolean;
    openOnKeyDown?: boolean;
}

export class SuggestExample extends BaseExample<ISuggestExampleState> {
    public state: ISuggestExampleState = {
        closeOnSelect: true,
        film: Films.items[0],
        minimal: true,
        openOnKeyDown: false,
    };

    private handleCloseOnSelectChange = this.handleSwitchChange("closeOnSelect");
    private handleOpenOnKeyDownChange = this.handleSwitchChange("openOnKeyDown");
    private handleMinimalChange = this.handleSwitchChange("minimal");

    protected renderExample() {
        const { film, minimal, ...flags } = this.state;
        return (
            <FilmSuggest
                {...Films}
                {...flags}
                inputValueRenderer={this.renderInputValue}
                noResults={<MenuItem disabled={true} text="No results." />}
                onItemSelect={this.handleValueChange}
                popoverProps={{ popoverClassName: minimal ? Classes.MINIMAL : "" }}
            />
        );
    }

    protected renderOptions() {
        return [
            [
                <Switch
                    key="closeOnSelect"
                    label="Close on select"
                    checked={this.state.closeOnSelect}
                    onChange={this.handleCloseOnSelectChange}
                />,
                <Switch
                    key="openOnKeyDown"
                    label="Open popover on key down"
                    checked={this.state.openOnKeyDown}
                    onChange={this.handleOpenOnKeyDownChange}
                />,
                <Switch
                    key="minimal"
                    label="Minimal popover style"
                    checked={this.state.minimal}
                    onChange={this.handleMinimalChange}
                />,
            ],
        ];
    }

    private renderInputValue = (film: Films.Film) => film.title;

    private handleValueChange = (film: Films.Film) => this.setState({ film });

    private handleSwitchChange(prop: keyof ISuggestExampleState) {
        return (event: React.FormEvent<HTMLInputElement>) => {
            this.setState({ [prop]: event.currentTarget.checked });
        };
    }
}
