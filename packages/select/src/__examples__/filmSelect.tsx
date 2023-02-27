/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

import { Button } from "@blueprintjs/core";
import { MenuItem2 } from "@blueprintjs/popover2";

import type { ItemRenderer } from "../common";
import { Select2, Select2Props } from "../components/select/select2";
import {
    areFilmsEqual,
    createFilm,
    Film,
    filterFilm,
    getFilmItemProps,
    maybeAddCreatedFilmToArrays,
    maybeDeleteCreatedFilmFromArrays,
    renderCreateFilmMenuItem,
    TOP_100_FILMS,
} from "./films";

type FilmSelectProps = Omit<
    Select2Props<Film>,
    | "createNewItemFromQuery"
    | "createNewItemRenderer"
    | "itemPredicate"
    | "itemRenderer"
    | "items"
    | "itemsEqual"
    | "noResults"
    | "onItemSelect"
> & {
    allowCreate?: boolean;
};

export function FilmSelect({ allowCreate = false, fill, ...restProps }: FilmSelectProps) {
    const [items, setItems] = React.useState([...TOP_100_FILMS]);
    const [createdItems, setCreatedItems] = React.useState<Film[]>([]);
    const [selectedFilm, setSelectedFilm] = React.useState(TOP_100_FILMS[0]);
    const handleItemSelect = React.useCallback((newFilm: Film) => {
        // Delete the old film from the list if it was newly created.
        const step1Result = maybeDeleteCreatedFilmFromArrays(items, createdItems, selectedFilm);
        // Add the new film to the list if it is newly created.
        const step2Result = maybeAddCreatedFilmToArrays(step1Result.items, step1Result.createdItems, newFilm);
        setCreatedItems(step2Result.createdItems);
        setSelectedFilm(newFilm);
        setItems(step2Result.items);
    }, []);

    const itemRenderer = React.useCallback<ItemRenderer<Film>>(
        (film, props) => {
            if (!props.modifiers.matchesPredicate) {
                return null;
            }
            return <MenuItem2 {...getFilmItemProps(film, props)} selected={film === selectedFilm} />;
        },
        [selectedFilm],
    );

    return (
        <Select2<Film>
            createNewItemFromQuery={allowCreate ? createFilm : undefined}
            createNewItemRenderer={allowCreate ? renderCreateFilmMenuItem : undefined}
            fill={fill}
            itemPredicate={filterFilm}
            itemRenderer={itemRenderer}
            items={items}
            itemsEqual={areFilmsEqual}
            menuProps={{ "aria-label": "films" }}
            noResults={<MenuItem2 disabled={true} text="No results." roleStructure="listoption" />}
            onItemSelect={handleItemSelect}
            {...restProps}
        >
            <Button
                disabled={restProps.disabled}
                fill={fill}
                icon="film"
                rightIcon="caret-down"
                text={selectedFilm ? `${selectedFilm.title} (${selectedFilm.year})` : "(No selection)"}
            />
        </Select2>
    );
}
