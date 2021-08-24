/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";

import { H5, MenuItem, Switch } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";

import { IFilm, TOP_100_FILMS } from "../../common/films";
import FilmSelect from "../../common/filmSelect";

export interface ISelectExampleState {
    allowCreate: boolean;
    createFirst: boolean;
    createdItems: IFilm[];
    fill: boolean;
    filterable: boolean;
    hasInitialContent: boolean;
    minimal: boolean;
    resetOnClose: boolean;
    resetOnQuery: boolean;
    resetOnSelect: boolean;
    disableItems: boolean;
    disabled: boolean;
    matchTargetWidth: false;
}

export class SelectExample extends React.PureComponent<IExampleProps, ISelectExampleState> {
    public state: ISelectExampleState = {
        allowCreate: false,
        createFirst: false,
        createdItems: [],
        disableItems: false,
        disabled: false,
        fill: false,
        filterable: true,
        hasInitialContent: false,
        matchTargetWidth: false,
        minimal: false,
        resetOnClose: false,
        resetOnQuery: true,
        resetOnSelect: false,
    };

    private handleAllowCreateChange = this.handleSwitchChange("allowCreate");

    private handleCreateFirstChange = this.handleSwitchChange("createFirst");

    private handleDisabledChange = this.handleSwitchChange("disabled");

    private handleFillChange = this.handleSwitchChange("fill");

    private handleFilterableChange = this.handleSwitchChange("filterable");

    private handleInitialContentChange = this.handleSwitchChange("hasInitialContent");

    private handleItemDisabledChange = this.handleSwitchChange("disableItems");

    private handleMinimalChange = this.handleSwitchChange("minimal");

    private handleResetOnCloseChange = this.handleSwitchChange("resetOnClose");

    private handleResetOnQueryChange = this.handleSwitchChange("resetOnQuery");

    private handleResetOnSelectChange = this.handleSwitchChange("resetOnSelect");

    private handleMatchTargetWidthChange = this.handleSwitchChange("matchTargetWidth");

    public render() {
        const { allowCreate, disabled, disableItems, minimal, ...flags } = this.state;

        const initialContent = this.state.hasInitialContent ? (
            <MenuItem disabled={true} text={`${TOP_100_FILMS.length} items loaded.`} />
        ) : undefined;

        return (
            <Example options={this.renderOptions()} {...this.props}>
                <FilmSelect
                    {...flags}
                    allowCreate={allowCreate}
                    createNewItemPosition={this.state.createFirst ? "first" : "last"}
                    disabled={disabled}
                    itemDisabled={this.isItemDisabled}
                    initialContent={initialContent}
                    popoverProps={{ minimal }}
                />
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
                <Switch label="Fill container width" checked={this.state.fill} onChange={this.handleFillChange} />
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
                <Switch
                    label="Match target width"
                    checked={this.state.matchTargetWidth}
                    onChange={this.handleMatchTargetWidthChange}
                />
                <Switch
                    label="Allow creating new items"
                    checked={this.state.allowCreate}
                    onChange={this.handleAllowCreateChange}
                />
                <Switch
                    label="Create new position: first"
                    disabled={!this.state.allowCreate}
                    checked={this.state.createFirst}
                    onChange={this.handleCreateFirstChange}
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

    private handleSwitchChange(prop: keyof ISelectExampleState) {
        return (event: React.FormEvent<HTMLInputElement>) => {
            const checked = event.currentTarget.checked;
            this.setState(state => ({ ...state, [prop]: checked }));
        };
    }

    private isItemDisabled = (film: IFilm) => this.state.disableItems && film.year < 2000;
}
