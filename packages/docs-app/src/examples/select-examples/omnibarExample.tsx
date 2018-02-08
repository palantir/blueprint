/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import {
    Button,
    Hotkey,
    Hotkeys,
    HotkeysTarget,
    KeyCombo,
    MenuItem,
    Position,
    Switch,
    Toaster,
} from "@blueprintjs/core";
import { BaseExample, handleBooleanChange } from "@blueprintjs/docs-theme";
import { Omnibar } from "@blueprintjs/select";
import { filmSelectProps, IFilm } from "./films";

const FilmOmnibar = Omnibar.ofType<IFilm>();

export interface IOmnibarExampleState {
    isOpen: boolean;
    resetOnSelect: boolean;
}

@HotkeysTarget
export class OmnibarExample extends BaseExample<IOmnibarExampleState> {
    public state: IOmnibarExampleState = {
        isOpen: false,
        resetOnSelect: true,
    };

    private handleResetChange = handleBooleanChange(resetOnSelect => this.setState({ resetOnSelect }));

    private toaster: Toaster;
    private refHandlers = {
        toaster: (ref: Toaster) => (this.toaster = ref),
    };

    public renderHotkeys() {
        return (
            <Hotkeys>
                <Hotkey
                    allowInInput={true}
                    global={true}
                    combo="meta + k"
                    label="Show Omnibar"
                    onKeyDown={this.handleToggle}
                />
            </Hotkeys>
        );
    }

    protected renderExample() {
        return (
            <div>
                <FilmOmnibar
                    {...filmSelectProps}
                    {...this.state}
                    noResults={<MenuItem disabled={true} text="No results." />}
                    onItemSelect={this.handleItemSelect}
                    onClose={this.handleClose}
                    inputProps={{ onBlur: this.handleBlur }}
                />
                <Toaster position={Position.TOP} ref={this.refHandlers.toaster} />
                <span>
                    <Button text="Click to show Omnibar" onClick={this.handleClick} />
                    {" or press "}
                    <KeyCombo combo="meta + k" />
                </span>
            </div>
        );
    }

    protected renderOptions() {
        return [
            [
                <Switch
                    key="reset"
                    label="Reset on select"
                    checked={this.state.resetOnSelect}
                    onChange={this.handleResetChange}
                />,
            ],
        ];
    }

    private handleClick = (_event: React.MouseEvent<HTMLElement>) => {
        this.setState({ isOpen: true });
    };

    private handleItemSelect = (film: IFilm) => {
        this.setState({ isOpen: false });

        this.toaster.show({
            message: (
                <span>
                    You selected <strong>{film.title}</strong>.
                </span>
            ),
        });
    };

    private handleClose = () => this.setState({ isOpen: false });

    private handleBlur = () => this.setState({ isOpen: false });

    private handleToggle = () => this.setState({ isOpen: !this.state.isOpen });
}
