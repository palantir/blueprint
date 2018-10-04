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
    resetOnQuery: boolean;
    resetOnSelect: boolean;
    disableItems: boolean;
    disabled: boolean;
}

export class SelectExample extends React.PureComponent<IExampleProps, ISelectExampleState> {
    public state: ISelectExampleState = {
        disableItems: false,
        disabled: false,
        film: TOP_100_FILMS[0],
        filterable: true,
        hasInitialContent: false,
        minimal: false,
        resetOnClose: false,
        resetOnQuery: true,
        resetOnSelect: false,
    };

    private handleDisabledChange = this.handleSwitchChange("disabled");
    private handleFilterableChange = this.handleSwitchChange("filterable");
    private handleInitialContentChange = this.handleSwitchChange("hasInitialContent");
    private handleItemDisabledChange = this.handleSwitchChange("disableItems");
    private handleMinimalChange = this.handleSwitchChange("minimal");
    private handleResetOnCloseChange = this.handleSwitchChange("resetOnClose");
    private handleResetOnQueryChange = this.handleSwitchChange("resetOnQuery");
    private handleResetOnSelectChange = this.handleSwitchChange("resetOnSelect");

    public render() {
        const { disabled, disableItems, film, minimal, ...flags } = this.state;

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
                    itemDisabled={this.isItemDisabled}
                    initialContent={initialContent}
                    noResults={<MenuItem disabled={true} text="No results." />}
                    onItemSelect={this.handleValueChange}
                    popoverProps={{ minimal }}
                >
                    <Button
                        icon="film"
                        rightIcon="caret-down"
                        text={film ? `${film.title} (${film.year})` : "(No selection)"}
                        disabled={disabled}
                    />
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
                    label="Reset on query"
                    checked={this.state.resetOnQuery}
                    onChange={this.handleResetOnQueryChange}
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
                <Switch
                    label="Disable films before 2000"
                    checked={this.state.disableItems}
                    onChange={this.handleItemDisabledChange}
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

    private handleValueChange = (film: IFilm) => this.setState({ film });

    private handleSwitchChange(prop: keyof ISelectExampleState) {
        return (event: React.FormEvent<HTMLInputElement>) => {
            const checked = event.currentTarget.checked;
            this.setState(state => ({ ...state, [prop]: checked }));
        };
    }

    private isItemDisabled = (film: IFilm) => this.state.disableItems && film.year < 2000;
}
