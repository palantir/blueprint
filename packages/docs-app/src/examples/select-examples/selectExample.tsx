/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, MenuItem, Switch } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs";
import { Select } from "@blueprintjs/select";
import * as Films from "./films";

const FilmSelect = Select.ofType<Films.Film>();

export interface ISelectExampleState {
    film?: Films.Film;
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
        film: Films.items[0],
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
            <MenuItem disabled={true} text={`${Films.items.length} items loaded.`} />
        ) : (
            undefined
        );

        return (
            <FilmSelect
                {...Films}
                {...flags}
                disabled={disabled}
                initialContent={initialContent}
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

    private handleValueChange = (film: Films.Film) => this.setState({ film });

    private handleSwitchChange(prop: keyof ISelectExampleState) {
        return (event: React.FormEvent<HTMLInputElement>) => {
            this.setState({ [prop]: event.currentTarget.checked });
        };
    }
}
