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

import { Code, H5, Intent, MenuItem, Switch, TagProps } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";
import { Popover2 } from "@blueprintjs/popover2";
import { ItemRenderer, MultiSelect2 } from "@blueprintjs/select";

import {
    areFilmsEqual,
    arrayContainsFilm,
    createFilm,
    filmSelectProps,
    IFilm,
    maybeAddCreatedFilmToArrays,
    maybeDeleteCreatedFilmFromArrays,
    renderCreateFilmOption,
    TOP_100_FILMS,
} from "../../common/films";
import { PropCodeTooltip } from "../../common/propCodeTooltip";

const FilmMultiSelect = MultiSelect2.ofType<IFilm>();

const INTENTS = [Intent.NONE, Intent.PRIMARY, Intent.SUCCESS, Intent.DANGER, Intent.WARNING];

export interface IMultiSelectExampleState {
    allowCreate: boolean;
    createdItems: IFilm[];
    disabled: boolean;
    fill: boolean;
    films: IFilm[];
    hasInitialContent: boolean;
    intent: boolean;
    items: IFilm[];
    matchTargetWidth: boolean;
    openOnKeyDown: boolean;
    popoverMinimal: boolean;
    resetOnSelect: boolean;
    showClearButton: boolean;
    tagMinimal: boolean;
}

export class MultiSelectExample extends React.PureComponent<IExampleProps, IMultiSelectExampleState> {
    public state: IMultiSelectExampleState = {
        allowCreate: false,
        createdItems: [],
        disabled: false,
        fill: false,
        films: [],
        hasInitialContent: false,
        intent: false,
        items: filmSelectProps.items,
        matchTargetWidth: false,
        openOnKeyDown: false,
        popoverMinimal: true,
        resetOnSelect: true,
        showClearButton: true,
        tagMinimal: false,
    };

    private popoverRef: React.RefObject<Popover2<any>> = React.createRef();

    private handleAllowCreateChange = this.handleSwitchChange("allowCreate");

    private handleDisabledChange = this.handleSwitchChange("disabled");

    private handleFillChange = this.handleSwitchChange("fill");

    private handleInitialContentChange = this.handleSwitchChange("hasInitialContent");

    private handleIntentChange = this.handleSwitchChange("intent");

    private handleKeyDownChange = this.handleSwitchChange("openOnKeyDown");

    private handleMatchTargetWidthChange = this.handleSwitchChange("matchTargetWidth");

    private handlePopoverMinimalChange = this.handleSwitchChange("popoverMinimal");

    private handleResetChange = this.handleSwitchChange("resetOnSelect");

    private handleShowClearButtonChange = this.handleSwitchChange("showClearButton");

    private handleTagMinimalChange = this.handleSwitchChange("tagMinimal");

    public render() {
        const { allowCreate, films, hasInitialContent, tagMinimal, popoverMinimal, matchTargetWidth, ...flags } =
            this.state;
        const getTagProps = (_value: React.ReactNode, index: number): TagProps => ({
            intent: this.state.intent ? INTENTS[index % INTENTS.length] : Intent.NONE,
            minimal: tagMinimal,
        });

        const initialContent = this.state.hasInitialContent ? (
            <MenuItem disabled={true} text={`${TOP_100_FILMS.length} items loaded.`} roleStructure="listoption" />
        ) : // explicit undefined (not null) for default behavior (show full list)
        undefined;
        const maybeCreateNewItemFromQuery = allowCreate ? createFilm : undefined;
        const maybeCreateNewItemRenderer = allowCreate ? renderCreateFilmOption : null;

        return (
            <Example options={this.renderOptions()} {...this.props}>
                <FilmMultiSelect
                    {...filmSelectProps}
                    {...flags}
                    createNewItemFromQuery={maybeCreateNewItemFromQuery}
                    createNewItemRenderer={maybeCreateNewItemRenderer}
                    initialContent={initialContent}
                    itemRenderer={this.renderFilm}
                    itemsEqual={areFilmsEqual}
                    // we may customize the default filmSelectProps.items by
                    // adding newly created items to the list, so pass our own
                    items={this.state.items}
                    menuProps={{ "aria-label": "films" }}
                    noResults={<MenuItem disabled={true} text="No results." roleStructure="listoption" />}
                    onClear={this.state.showClearButton ? this.handleClear : undefined}
                    onItemSelect={this.handleFilmSelect}
                    onItemsPaste={this.handleFilmsPaste}
                    popoverProps={{ matchTargetWidth, minimal: popoverMinimal }}
                    popoverRef={this.popoverRef}
                    tagRenderer={this.renderTag}
                    tagInputProps={{
                        onRemove: this.handleTagRemove,
                        tagProps: getTagProps,
                    }}
                    selectedItems={this.state.films}
                />
            </Example>
        );
    }

    protected renderOptions() {
        return (
            <>
                <H5>Props</H5>
                <Switch
                    label="Open popover on key down"
                    checked={this.state.openOnKeyDown}
                    onChange={this.handleKeyDownChange}
                />
                <Switch
                    label="Reset query on select"
                    checked={this.state.resetOnSelect}
                    onChange={this.handleResetChange}
                />
                <Switch
                    label="Use initial content"
                    checked={this.state.hasInitialContent}
                    onChange={this.handleInitialContentChange}
                />
                <PropCodeTooltip
                    content={
                        <>
                            <Code>createNewItemFromQuery</Code> and <Code>createNewItemRenderer</Code> are{" "}
                            {this.state.allowCreate ? "defined" : "undefined"}
                        </>
                    }
                >
                    <Switch
                        label="Allow creating new films"
                        checked={this.state.allowCreate}
                        onChange={this.handleAllowCreateChange}
                    />
                </PropCodeTooltip>
                <PropCodeTooltip
                    content={
                        <>
                            <Code>onClear</Code> is {this.state.showClearButton ? "defined" : "undefined"}
                        </>
                    }
                >
                    <Switch
                        label="Show clear button"
                        checked={this.state.showClearButton}
                        onChange={this.handleShowClearButtonChange}
                    />
                </PropCodeTooltip>
                <H5>Appearance props</H5>
                <PropCodeTooltip snippet={`disabled={${this.state.disabled.toString()}}`}>
                    <Switch label="Disabled" checked={this.state.disabled} onChange={this.handleDisabledChange} />
                </PropCodeTooltip>
                <PropCodeTooltip snippet={`fill={${this.state.fill.toString()}}`}>
                    <Switch label="Fill container width" checked={this.state.fill} onChange={this.handleFillChange} />
                </PropCodeTooltip>
                <H5>Tag props</H5>
                <Switch
                    label="Minimal tag style"
                    checked={this.state.tagMinimal}
                    onChange={this.handleTagMinimalChange}
                />
                <Switch
                    label="Cycle through tag intents"
                    checked={this.state.intent}
                    onChange={this.handleIntentChange}
                />
                <H5>Popover props</H5>
                <PropCodeTooltip
                    snippet={`popoverProps={{ matchTargetWidth: ${this.state.matchTargetWidth.toString()} }}`}
                >
                    <Switch
                        label="Match target width"
                        checked={this.state.matchTargetWidth}
                        onChange={this.handleMatchTargetWidthChange}
                    />
                </PropCodeTooltip>
                <PropCodeTooltip snippet={`popoverProps={{ minimal: ${this.state.popoverMinimal.toString()} }}`}>
                    <Switch
                        label="Minimal popover style"
                        checked={this.state.popoverMinimal}
                        onChange={this.handlePopoverMinimalChange}
                    />
                </PropCodeTooltip>
            </>
        );
    }

    private renderTag = (film: IFilm) => film.title;

    // NOTE: not using Films.itemRenderer here so we can set icons.
    private renderFilm: ItemRenderer<IFilm> = (film, { modifiers, handleClick }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return (
            <MenuItem
                selected={modifiers.active}
                icon={this.isFilmSelected(film) ? "tick" : "blank"}
                roleStructure="listoption"
                key={film.rank}
                label={film.year.toString()}
                onClick={handleClick}
                text={`${film.rank}. ${film.title}`}
                shouldDismissPopover={false}
            />
        );
    };

    private handleTagRemove = (_tag: React.ReactNode, index: number) => {
        this.deselectFilm(index);
    };

    private getSelectedFilmIndex(film: IFilm) {
        return this.state.films.indexOf(film);
    }

    private isFilmSelected(film: IFilm) {
        return this.getSelectedFilmIndex(film) !== -1;
    }

    private selectFilm(film: IFilm) {
        this.selectFilms([film]);
    }

    private selectFilms(filmsToSelect: IFilm[]) {
        const { createdItems, films, items } = this.state;

        let nextCreatedItems = createdItems.slice();
        let nextFilms = films.slice();
        let nextItems = items.slice();

        filmsToSelect.forEach(film => {
            const results = maybeAddCreatedFilmToArrays(nextItems, nextCreatedItems, film);
            nextItems = results.items;
            nextCreatedItems = results.createdItems;
            // Avoid re-creating an item that is already selected (the "Create
            // Item" option will be shown even if it matches an already selected
            // item).
            nextFilms = !arrayContainsFilm(nextFilms, film) ? [...nextFilms, film] : nextFilms;
        });

        this.setState({
            createdItems: nextCreatedItems,
            films: nextFilms,
            items: nextItems,
        });
    }

    private deselectFilm(index: number) {
        const { films } = this.state;

        const film = films[index];
        const { createdItems: nextCreatedItems, items: nextItems } = maybeDeleteCreatedFilmFromArrays(
            this.state.items,
            this.state.createdItems,
            film,
        );

        // Delete the item if the user manually created it.
        this.setState({
            createdItems: nextCreatedItems,
            films: films.filter((_film, i) => i !== index),
            items: nextItems,
        });
    }

    private handleFilmSelect = (film: IFilm) => {
        if (!this.isFilmSelected(film)) {
            this.selectFilm(film);
        } else {
            this.deselectFilm(this.getSelectedFilmIndex(film));
        }
    };

    private handleFilmsPaste = (films: IFilm[]) => {
        // On paste, don't bother with deselecting already selected values, just
        // add the new ones.
        this.selectFilms(films);
    };

    private handleSwitchChange(prop: keyof IMultiSelectExampleState) {
        return (event: React.FormEvent<HTMLInputElement>) => {
            const checked = event.currentTarget.checked;
            this.setState(state => ({ ...state, [prop]: checked }));
        };
    }

    private handleClear = () => {
        this.setState({ films: [] });
    };
}
