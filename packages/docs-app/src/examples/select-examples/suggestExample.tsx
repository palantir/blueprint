/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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

import { useCallback, useState } from "react";

import { H5, MenuItem, Switch } from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";
import { type ItemRenderer, Suggest } from "@blueprintjs/select";
import {
    areFilmsEqual,
    createFilm,
    type Film,
    filterFilm,
    getFilmItemProps,
    maybeAddCreatedFilmToArrays,
    maybeDeleteCreatedFilmFromArrays,
    renderCreateFilmMenuItem,
    TOP_100_FILMS,
} from "@blueprintjs/select/examples";

export const SuggestExample: React.FC<ExampleProps> = props => {
    const [allowCreate, setAllowCreate] = useState(false);
    const [closeOnSelect, setCloseOnSelect] = useState(true);
    const [createdItems, setCreatedItems] = useState<Film[]>([]);
    const [disabled, setDisabled] = useState(false);
    const [fill, setFill] = useState(false);
    const [items, setItems] = useState([...TOP_100_FILMS]);
    const [matchTargetWidth, setMatchTargetWidth] = useState(false);
    const [minimal, setMinimal] = useState(true);
    const [openOnKeyDown, setOpenOnKeyDown] = useState(false);
    const [resetOnClose, setResetOnClose] = useState(false);
    const [resetOnQuery, setResetOnQuery] = useState(true);
    const [resetOnSelect, setResetOnSelect] = useState(false);
    const [selectedFilm, setSelectedFilm] = useState(TOP_100_FILMS[0]);

    const renderFilmItem: ItemRenderer<Film> = useCallback(
        (film, rendererProps) => {
            if (!rendererProps.modifiers.matchesPredicate) {
                return null;
            }
            return (
                <MenuItem
                    {...getFilmItemProps(film, rendererProps)}
                    roleStructure="listoption"
                    selected={film === selectedFilm}
                />
            );
        },
        [selectedFilm],
    );

    const handleValueChange = useCallback(
        (newSelectedFilm: Film) => {
            // delete the old film from the list if it was newly created
            const { createdItems: currentCreatedItems, items: currentItems } =
                maybeDeleteCreatedFilmFromArrays(items, createdItems, newSelectedFilm);
            // add the new film to the list if it is newly created
            const { createdItems: nextCreatedItems, items: nextItems } =
                maybeAddCreatedFilmToArrays(currentItems, currentCreatedItems, newSelectedFilm);
            setCreatedItems(nextCreatedItems);
            setItems(nextItems);
            setSelectedFilm(newSelectedFilm);
        },
        [createdItems, items],
    );

    const options = (
        <>
            <H5>Props</H5>
            <Switch
                checked={closeOnSelect}
                label="Close on select"
                onChange={handleBooleanChange(setCloseOnSelect)}
            />
            <Switch
                checked={openOnKeyDown}
                label="Open popover on key down"
                onChange={handleBooleanChange(setOpenOnKeyDown)}
            />
            <Switch
                checked={resetOnClose}
                label="Reset on close"
                onChange={handleBooleanChange(setResetOnClose)}
            />
            <Switch
                checked={resetOnQuery}
                label="Reset on query"
                onChange={handleBooleanChange(setResetOnQuery)}
            />
            <Switch
                checked={resetOnSelect}
                label="Reset on select"
                onChange={handleBooleanChange(setResetOnSelect)}
            />
            <Switch
                checked={allowCreate}
                label="Allow creating new items"
                onChange={handleBooleanChange(setAllowCreate)}
            />
            <H5>Appearance props</H5>
            <Switch
                checked={disabled}
                label="Disabled"
                onChange={handleBooleanChange(setDisabled)}
            />
            <Switch
                checked={fill}
                label="Fill container width"
                onChange={handleBooleanChange(setFill)}
            />
            <H5>Popover props</H5>
            <Switch
                checked={matchTargetWidth}
                label="Match target width"
                onChange={handleBooleanChange(setMatchTargetWidth)}
            />
            <Switch
                checked={minimal}
                label="Minimal popover style"
                onChange={handleBooleanChange(setMinimal)}
            />
        </>
    );

    return (
        <Example options={options} {...props}>
            <Suggest
                closeOnSelect={closeOnSelect}
                createNewItemFromQuery={allowCreate ? createFilm : undefined}
                createNewItemRenderer={allowCreate ? renderCreateFilmMenuItem : null}
                disabled={disabled}
                fill={fill}
                inputValueRenderer={renderInputValue}
                itemPredicate={filterFilm}
                itemRenderer={renderFilmItem}
                items={items}
                itemsEqual={areFilmsEqual}
                noResults={noResults}
                onItemSelect={handleValueChange}
                openOnKeyDown={openOnKeyDown}
                popoverProps={{ matchTargetWidth, minimal }}
                resetOnClose={resetOnClose}
                resetOnQuery={resetOnQuery}
                resetOnSelect={resetOnSelect}
            />
        </Example>
    );
};

const noResults = <MenuItem disabled={true} text="No results." roleStructure="listoption" />;

const renderInputValue = (film: Film) => film.title;
