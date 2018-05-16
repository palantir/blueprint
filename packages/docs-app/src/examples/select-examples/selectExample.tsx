/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, H5, MenuItem, Switch } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";
import { Select } from "@blueprintjs/select";
import { filmSelectProps, IFilm, TOP_100_FILMS } from "./films";

const FilmSelect = Select.ofType<IFilm>();

export interface ISelectExampleState {
    film: IFilm;
    filterable: boolean;
    hasInitialContent: boolean;
    minimal: boolean;
    resetOnClose: boolean;
    resetOnSelect: boolean;
    disabled: boolean;
}

export class SelectExample extends React.PureComponent<IExampleProps, ISelectExampleState> {
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

    public render() {
        const { disabled, film, minimal, ...flags } = this.state;

        const initialContent = this.state.hasInitialContent ? (
            <MenuItem disabled={true} text={`${TOP_100_FILMS.length} items loaded.`} />
        ) : (
            undefined
        );

        return (
            <Example options={this.renderOptions()} {...this.props}>
                <FilmSelect
                    {...filmSelectProps}
                    {...flags}
                    disabled={disabled}
                    initialContent={initialContent}
                    noResults={<MenuItem disabled={true} text="No results." />}
                    onItemSelect={this.handleValueChange}
                    popoverProps={{ minimal }}
                >
                    <Button rightIcon="caret-down" text={film ? film.title : "(No selection)"} disabled={disabled} />
                </FilmSelect>
            </Example>
        );
    }

    protected renderOptions() {
        return (
            <>
                <H5>Props</H5>
                <Switch label="Disabled" checked={this.state.disabled} onChange={this.handleDisabledChange} />
                <Switch label="Filterable" checked={this.state.filterable} onChange={this.handleFilterableChange} />
                <Switch
                    label="Reset on close"
                    checked={this.state.resetOnClose}
                    onChange={this.handleResetOnCloseChange}
                />
                <Switch
                    label="Reset on select"
                    checked={this.state.resetOnSelect}
                    onChange={this.handleResetOnSelectChange}
                />
                <Switch
                    label="Use initial content"
                    checked={this.state.hasInitialContent}
                    onChange={this.handleInitialContentChange}
                />
                <H5>Example</H5>
                <Switch
                    label="Minimal popover style"
                    checked={this.state.minimal}
                    onChange={this.handleMinimalChange}
                />
            </>
        );
    }

    private handleValueChange = (film: IFilm) => this.setState({ film });

    private handleSwitchChange(prop: keyof ISelectExampleState) {
        return (event: React.FormEvent<HTMLInputElement>) => {
            const checked = event.currentTarget.checked;
            this.setState(state => ({ ...state, [prop]: checked }));
        };
    }
}
