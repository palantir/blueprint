/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { H5, MenuItem, Switch } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";
import { Suggest } from "@blueprintjs/select";
import { filmSelectProps, IFilm, TOP_100_FILMS } from "./films";

const FilmSuggest = Suggest.ofType<IFilm>();

export interface ISuggestExampleState {
    closeOnSelect: boolean;
    film: IFilm;
    minimal: boolean;
    openOnKeyDown: boolean;
    resetOnClose: boolean;
    resetOnQuery: boolean;
    resetOnSelect: boolean;
}

export class SuggestExample extends React.PureComponent<IExampleProps, ISuggestExampleState> {
    public state: ISuggestExampleState = {
        closeOnSelect: true,
        film: TOP_100_FILMS[0],
        minimal: true,
        openOnKeyDown: false,
        resetOnClose: false,
        resetOnQuery: true,
        resetOnSelect: false,
    };

    private handleCloseOnSelectChange = this.handleSwitchChange("closeOnSelect");
    private handleOpenOnKeyDownChange = this.handleSwitchChange("openOnKeyDown");
    private handleMinimalChange = this.handleSwitchChange("minimal");
    private handleResetOnCloseChange = this.handleSwitchChange("resetOnClose");
    private handleResetOnQueryChange = this.handleSwitchChange("resetOnQuery");
    private handleResetOnSelectChange = this.handleSwitchChange("resetOnSelect");

    public render() {
        const { film, minimal, ...flags } = this.state;
        return (
            <Example options={this.renderOptions()} {...this.props}>
                <FilmSuggest
                    {...filmSelectProps}
                    {...flags}
                    inputValueRenderer={this.renderInputValue}
                    noResults={<MenuItem disabled={true} text="No results." />}
                    onItemSelect={this.handleValueChange}
                    popoverProps={{ minimal }}
                />
            </Example>
        );
    }

    protected renderOptions() {
        return (
            <>
                <H5>Props</H5>
                <Switch
                    label="Close on select"
                    checked={this.state.closeOnSelect}
                    onChange={this.handleCloseOnSelectChange}
                />
                <Switch
                    label="Open popover on key down"
                    checked={this.state.openOnKeyDown}
                    onChange={this.handleOpenOnKeyDownChange}
                />
                <Switch
                    label="Reset on close"
                    checked={this.state.resetOnClose}
                    onChange={this.handleResetOnCloseChange}
                />
                <Switch
                    label="Reset on query"
                    checked={this.state.resetOnQuery}
                    onChange={this.handleResetOnQueryChange}
                />
                <Switch
                    label="Reset on select"
                    checked={this.state.resetOnSelect}
                    onChange={this.handleResetOnSelectChange}
                />
                <H5>Popover props</H5>
                <Switch
                    label="Minimal popover style"
                    checked={this.state.minimal}
                    onChange={this.handleMinimalChange}
                />
            </>
        );
    }

    private renderInputValue = (film: IFilm) => film.title;

    private handleValueChange = (film: IFilm) => this.setState({ film });

    private handleSwitchChange(prop: keyof ISuggestExampleState) {
        return (event: React.FormEvent<HTMLInputElement>) => {
            const checked = event.currentTarget.checked;
            this.setState(state => ({ ...state, [prop]: checked }));
        };
    }
}
