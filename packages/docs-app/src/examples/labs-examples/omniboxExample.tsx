/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as classNames from "classnames";
import * as React from "react";

import {
    Button,
    Classes,
    Hotkey,
    Hotkeys,
    HotkeysTarget,
    MenuItem,
    Position,
    Switch,
    Toaster,
} from "@blueprintjs/core";
import { BaseExample, handleBooleanChange } from "@blueprintjs/docs";
import { ISelectItemRendererProps, Omnibox } from "@blueprintjs/labs";
import { Film, TOP_100_FILMS } from "./data";

const FilmOmnibox = Omnibox.ofType<Film>();

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
                    {...this.state}
                    items={TOP_100_FILMS}
                    itemPredicate={this.filterFilm}
                    itemRenderer={this.renderFilm}
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

    private handleClick = (_event: React.MouseEvent<HTMLElement>) => {
        this.setState({ isOpen: true });
    };

    private handleItemSelect = (film: Film) => {
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
