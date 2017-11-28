/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, Hotkey, Hotkeys, HotkeysTarget, MenuItem, Position, Switch, Toaster } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange } from "@blueprintjs/docs";
import { Omnibox } from "@blueprintjs/labs";
import * as Films from "./films";

const FilmOmnibox = Omnibox.ofType<Films.Film>();

export interface IOmniboxExampleState {
    isOpen: boolean;
    resetOnSelect: boolean;
}

@HotkeysTarget
export class OmniboxExample extends BaseExample<IOmniboxExampleState> {
    public state: IOmniboxExampleState = {
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
                    label="Show Omnibox"
                    onKeyDown={this.handleToggle}
                />
            </Hotkeys>
        );
    }

    protected renderExample() {
        return (
            <div>
                <FilmOmnibox
                    {...Films}
                    {...this.state}
                    noResults={<MenuItem disabled={true} text="No results." />}
                    onItemSelect={this.handleItemSelect}
                    onClose={this.handleClose}
                    inputProps={{ onBlur: this.handleBlur }}
                />
                <Toaster position={Position.TOP} ref={this.refHandlers.toaster} />
                <span>
                    <Button text="Click to show Omnibox" onClick={this.handleClick} />
                    {" or press "}
                    <span className="pt-key-combo">
                        <kbd className="pt-key pt-modifier-key">
                            <span className="pt-icon-standard pt-icon-key-command" />
                            cmd
                        </kbd>
                        <kbd className="pt-key">K</kbd>
                    </span>
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

    private handleItemSelect = (film: Films.Film) => {
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
