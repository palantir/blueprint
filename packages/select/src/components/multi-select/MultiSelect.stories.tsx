/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";

import { MenuItem } from "@blueprintjs/core";

import type { ItemRenderer } from "../../common";
import { MultiSelect } from "./multiSelect";

import { areFilmsEqual, type Film, filterFilm, getFilmItemProps, TOP_100_FILMS } from "../../__examples__/films";

const FILM_SUBSET = TOP_100_FILMS.slice(0, 10);

const meta = {
    title: "Select/MultiSelect",
    component: MultiSelect,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof MultiSelect<Film>>;

export default meta;
type Story = StoryObj<typeof meta>;

function useFilmMultiSelect(initialSelected: Film[] = []) {
    const [selectedItems, setSelectedItems] = useState<Film[]>(initialSelected);
    const onItemSelect = useCallback((film: Film) => {
        setSelectedItems(prev =>
            prev.some(f => areFilmsEqual(f, film)) ? prev.filter(f => !areFilmsEqual(f, film)) : [...prev, film],
        );
    }, []);
    return { selectedItems, onItemSelect };
}

/**
 * MultiSelect with a small list of films. Select multiple; tags show selected titles.
 */
export const Basic: Story = {
    render: function MultiSelectBasic() {
        const { selectedItems, onItemSelect } = useFilmMultiSelect();
        const itemRenderer = useCallback<ItemRenderer<Film>>(
            (film, props) => {
                if (!props.modifiers.matchesPredicate) {
                    return null;
                }
                const isSelected = selectedItems.some(f => areFilmsEqual(f, film));
                return (
                    <MenuItem
                        key={film.rank}
                        {...getFilmItemProps(film, props)}
                        roleStructure="listoption"
                        selected={isSelected}
                        tagName="div"
                    />
                );
            },
            [selectedItems],
        );
        return (
            <div style={{ minWidth: 300 }}>
                <MultiSelect<Film>
                    itemPredicate={filterFilm}
                    itemRenderer={itemRenderer}
                    items={FILM_SUBSET}
                    itemsEqual={areFilmsEqual}
                    noResults={<MenuItem disabled={true} text="No results." roleStructure="listoption" />}
                    onItemSelect={onItemSelect}
                    selectedItems={selectedItems}
                    tagRenderer={(film: Film) => film.title}
                />
            </div>
        );
    },
};
