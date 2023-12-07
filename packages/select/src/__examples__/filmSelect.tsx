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

import classNames from "classnames";
import * as React from "react";

import { Button, Classes, MenuItem } from "@blueprintjs/core";

import type { ItemRenderer } from "../common";
import { Select, type SelectProps } from "../components/select/select";
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
} from "./films";

type FilmSelectProps = Omit<
    SelectProps<Film>,
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
    const [selectedFilm, setSelectedFilm] = React.useState<Film | undefined>(undefined);
    const handleItemSelect = React.useCallback(
        (newFilm: Film) => {
            // Delete the old film from the list if it was newly created.
            const step1Result = maybeDeleteCreatedFilmFromArrays(items, createdItems, selectedFilm);
            // Add the new film to the list if it is newly created.
            const step2Result = maybeAddCreatedFilmToArrays(step1Result.items, step1Result.createdItems, newFilm);
            setCreatedItems(step2Result.createdItems);
            setSelectedFilm(newFilm);
            setItems(step2Result.items);
        },
        [createdItems, items, selectedFilm],
    );

    const itemRenderer = React.useCallback<ItemRenderer<Film>>(
        (film, props) => {
            if (!props.modifiers.matchesPredicate) {
                return null;
            }
            return (
                <MenuItem
                    {...getFilmItemProps(film, props)}
                    roleStructure="listoption"
                    selected={film === selectedFilm}
                />
            );
        },
        [selectedFilm],
    );

    return (
        <Select<Film>
            createNewItemFromQuery={allowCreate ? createFilm : undefined}
            createNewItemRenderer={allowCreate ? renderCreateFilmMenuItem : undefined}
            fill={fill}
            itemPredicate={filterFilm}
            itemRenderer={itemRenderer}
            items={items}
            itemsEqual={areFilmsEqual}
            menuProps={{ "aria-label": "films" }}
            noResults={<MenuItem disabled={true} text="No results." roleStructure="listoption" />}
            onItemSelect={handleItemSelect}
            {...restProps}
        >
            <Button
                alignText="left"
                disabled={restProps.disabled}
                fill={fill}
                icon="film"
                rightIcon="caret-down"
                text={maybeRenderSelectedFilm(selectedFilm) ?? "(No selection)"}
                textClassName={classNames({
                    [Classes.TEXT_MUTED]: selectedFilm === undefined,
                })}
            />
        </Select>
    );
}

function maybeRenderSelectedFilm(selectedFilm: Film | undefined) {
    return selectedFilm ? `${selectedFilm.title} (${selectedFilm.year})` : undefined;
}
