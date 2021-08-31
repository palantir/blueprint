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

import { Button, MenuItem } from "@blueprintjs/core";
import { Select, SelectProps } from "@blueprintjs/select";

import {
    areFilmsEqual,
    createFilm,
    filmSelectProps,
    Film,
    maybeAddCreatedFilmToArrays,
    maybeDeleteCreatedFilmFromArrays,
    renderCreateFilmOption,
    TOP_100_FILMS,
} from "./films";

const FilmSelect = Select.ofType<Film>();

type Props = Omit<
    SelectProps<Film>,
    | "createNewItemFromQuery"
    | "createNewItemRenderer"
    | "items"
    | "itemsEqual"
    | "noResults"
    | "onItemSelect"
    | keyof typeof filmSelectProps
> & {
    allowCreate?: boolean;
};

// eslint-disable-next-line import/no-default-export
export default function ({ allowCreate = false, fill, ...restProps }: Props) {
    const maybeCreateNewItemFromQuery = allowCreate ? createFilm : undefined;
    const maybeCreateNewItemRenderer = allowCreate ? renderCreateFilmOption : null;

    const [items, setItems] = React.useState(filmSelectProps.items);
    const [createdItems, setCreatedItems] = React.useState<Film[]>([]);
    const [film, setFilm] = React.useState(TOP_100_FILMS[0]);
    const handleItemSelect = React.useCallback((newFilm: Film) => {
        // Delete the old film from the list if it was newly created.
        const step1Result = maybeDeleteCreatedFilmFromArrays(items, createdItems, film);
        // Add the new film to the list if it is newly created.
        const step2Result = maybeAddCreatedFilmToArrays(step1Result.items, step1Result.createdItems, newFilm);
        setCreatedItems(step2Result.createdItems);
        setFilm(newFilm);
        setItems(step2Result.items);
    }, []);

    return (
        <FilmSelect
            {...filmSelectProps}
            createNewItemFromQuery={maybeCreateNewItemFromQuery}
            createNewItemRenderer={maybeCreateNewItemRenderer}
            itemsEqual={areFilmsEqual}
            noResults={<MenuItem disabled={true} text="No results." />}
            onItemSelect={handleItemSelect}
            items={items}
            fill={fill}
            {...restProps}
        >
            <Button
                icon="film"
                rightIcon="caret-down"
                text={film ? `${film.title} (${film.year})` : "(No selection)"}
                disabled={restProps.disabled}
                fill={fill}
            />
        </FilmSelect>
    );
}
