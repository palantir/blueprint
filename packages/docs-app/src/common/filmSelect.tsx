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
import { ItemRenderer, Select2, Select2Props } from "@blueprintjs/select";

import {
    areFilmsEqual,
    createFilm,
    filterFilm,
    getFilmItemProps,
    IFilm,
    maybeAddCreatedFilmToArrays,
    maybeDeleteCreatedFilmFromArrays,
    renderCreateFilmOption,
    TOP_100_FILMS,
} from "./films";

const FilmSelect = Select2.ofType<IFilm>();

type Props = Omit<
    Select2Props<IFilm>,
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

// eslint-disable-next-line import/no-default-export
export default function ({ allowCreate = false, fill, ...restProps }: Props) {
    const maybeCreateNewItemFromQuery = allowCreate ? createFilm : undefined;
    const maybeCreateNewItemRenderer = allowCreate ? renderCreateFilmOption : null;

    const [items, setItems] = React.useState([...TOP_100_FILMS]);
    const [createdItems, setCreatedItems] = React.useState<IFilm[]>([]);
    const [selectedFilm, setSelectedFilm] = React.useState(TOP_100_FILMS[0]);
    const handleItemSelect = React.useCallback((newFilm: IFilm) => {
        // Delete the old film from the list if it was newly created.
        const step1Result = maybeDeleteCreatedFilmFromArrays(items, createdItems, selectedFilm);
        // Add the new film to the list if it is newly created.
        const step2Result = maybeAddCreatedFilmToArrays(step1Result.items, step1Result.createdItems, newFilm);
        setCreatedItems(step2Result.createdItems);
        setSelectedFilm(newFilm);
        setItems(step2Result.items);
    }, []);

    const itemRenderer = React.useCallback<ItemRenderer<IFilm>>(
        (film, props) => {
            if (!props.modifiers.matchesPredicate) {
                return null;
            }
            return <MenuItem {...getFilmItemProps(film, props)} selected={film === selectedFilm} />;
        },
        [selectedFilm],
    );

    return (
        <FilmSelect
            createNewItemFromQuery={maybeCreateNewItemFromQuery}
            createNewItemRenderer={maybeCreateNewItemRenderer}
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
                disabled={restProps.disabled}
                fill={fill}
                icon="film"
                rightIcon="caret-down"
                text={selectedFilm ? `${selectedFilm.title} (${selectedFilm.year})` : "(No selection)"}
            />
        </FilmSelect>
    );
}
