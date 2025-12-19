/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";

import { Button, MenuItem } from "@blueprintjs/core";

import type { ItemRenderer } from "../../common";
import { Select } from "./select";

import {
    areFilmsEqual,
    type Film,
    filterFilm,
    getFilmItemProps,
    renderFilm,
    TOP_100_FILMS,
} from "../../__examples__/films";

const FILM_SUBSET = TOP_100_FILMS.slice(0, 10);

const meta = {
    title: "Select/Select",
    component: Select,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Select<Film>>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Select with a small list of films. Type to filter, click to select.
 */
export const Basic: Story = {
    render: function SelectBasic() {
        const [selected, setSelected] = useState<Film | undefined>(undefined);
        const itemRenderer = useCallback<ItemRenderer<Film>>(
            (film, props) => {
                if (!props.modifiers.matchesPredicate) {
                    return null;
                }
                return (
                    <MenuItem
                        key={film.rank}
                        {...getFilmItemProps(film, props)}
                        roleStructure="listoption"
                        selected={film === selected}
                        tagName="div"
                    />
                );
            },
            [selected],
        );
        return (
            <Select<Film>
                itemPredicate={filterFilm}
                itemRenderer={itemRenderer}
                items={FILM_SUBSET}
                itemsEqual={areFilmsEqual}
                menuProps={{ "aria-label": "films" }}
                noResults={<MenuItem disabled={true} text="No results." roleStructure="listoption" />}
                onItemSelect={setSelected}
            >
                <Button
                    alignText="start"
                    endIcon="caret-down"
                    icon="film"
                    text={selected ? `${selected.title} (${selected.year})` : "(No selection)"}
                />
            </Select>
        );
    },
};

/**
 * Select using the shared renderFilm helper (no selected state in renderer).
 */
export const WithRenderFilm: Story = {
    render: function SelectWithRenderFilm() {
        const [selected, setSelected] = useState<Film | undefined>(undefined);
        return (
            <Select<Film>
                itemPredicate={filterFilm}
                itemRenderer={renderFilm}
                items={FILM_SUBSET}
                itemsEqual={areFilmsEqual}
                noResults={<MenuItem disabled={true} text="No results." roleStructure="listoption" />}
                onItemSelect={setSelected}
            >
                <Button
                    alignText="start"
                    endIcon="caret-down"
                    text={selected ? `${selected.title} (${selected.year})` : "(No selection)"}
                />
            </Select>
        );
    },
};
