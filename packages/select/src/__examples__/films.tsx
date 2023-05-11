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

import { MenuItem2, MenuItem2Props } from "@blueprintjs/popover2";

import type { ItemPredicate, ItemRenderer, ItemRendererProps } from "../common";

export interface Film {
    /** Title of film. */
    title: string;
    /** Release year. */
    year: number;
    /** IMDb ranking. */
    rank: number;
}

/** Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top */
export const TOP_100_FILMS: Film[] = [
    { title: "The Shawshank Redemption", year: 1994 },
    { title: "The Godfather", year: 1972 },
    { title: "The Godfather: Part II", year: 1974 },
    { title: "The Dark Knight", year: 2008 },
    { title: "12 Angry Men", year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: "Pulp Fiction", year: 1994 },
    { title: "The Lord of the Rings: The Return of the King", year: 2003 },
    { title: "The Good, the Bad and the Ugly", year: 1966 },
    { title: "Fight Club", year: 1999 },
    { title: "The Lord of the Rings: The Fellowship of the Ring", year: 2001 },
    { title: "Star Wars: Episode V - The Empire Strikes Back", year: 1980 },
    { title: "Forrest Gump", year: 1994 },
    { title: "Inception", year: 2010 },
    { title: "The Lord of the Rings: The Two Towers", year: 2002 },
    { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { title: "Goodfellas", year: 1990 },
    { title: "The Matrix", year: 1999 },
    { title: "Seven Samurai", year: 1954 },
    { title: "Star Wars: Episode IV - A New Hope", year: 1977 },
    { title: "City of God", year: 2002 },
    { title: "Se7en", year: 1995 },
    { title: "The Silence of the Lambs", year: 1991 },
    { title: "It's a Wonderful Life", year: 1946 },
    { title: "Life Is Beautiful", year: 1997 },
    { title: "The Usual Suspects", year: 1995 },
    { title: "Léon: The Professional", year: 1994 },
    { title: "Spirited Away", year: 2001 },
    { title: "Saving Private Ryan", year: 1998 },
    { title: "Once Upon a Time in the West", year: 1968 },
    { title: "American History X", year: 1998 },
    { title: "Interstellar", year: 2014 },
    { title: "Casablanca", year: 1942 },
    { title: "City Lights", year: 1931 },
    { title: "Psycho", year: 1960 },
    { title: "The Green Mile", year: 1999 },
    { title: "The Intouchables", year: 2011 },
    { title: "Modern Times", year: 1936 },
    { title: "Raiders of the Lost Ark", year: 1981 },
    { title: "Rear Window", year: 1954 },
    { title: "The Pianist", year: 2002 },
    { title: "The Departed", year: 2006 },
    { title: "Terminator 2: Judgment Day", year: 1991 },
    { title: "Back to the Future", year: 1985 },
    { title: "Whiplash", year: 2014 },
    { title: "Gladiator", year: 2000 },
    { title: "Memento", year: 2000 },
    { title: "The Prestige", year: 2006 },
    { title: "The Lion King", year: 1994 },
    { title: "Apocalypse Now", year: 1979 },
    { title: "Alien", year: 1979 },
    { title: "Sunset Boulevard", year: 1950 },
    { title: "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb", year: 1964 },
    { title: "The Great Dictator", year: 1940 },
    { title: "Cinema Paradiso", year: 1988 },
    { title: "The Lives of Others", year: 2006 },
    { title: "Grave of the Fireflies", year: 1988 },
    { title: "Paths of Glory", year: 1957 },
    { title: "Django Unchained", year: 2012 },
    { title: "The Shining", year: 1980 },
    { title: "WALL·E", year: 2008 },
    { title: "American Beauty", year: 1999 },
    { title: "The Dark Knight Rises", year: 2012 },
    { title: "Princess Mononoke", year: 1997 },
    { title: "Aliens", year: 1986 },
    { title: "Oldboy", year: 2003 },
    { title: "Once Upon a Time in America", year: 1984 },
    { title: "Witness for the Prosecution", year: 1957 },
    { title: "Das Boot", year: 1981 },
    { title: "Citizen Kane", year: 1941 },
    { title: "North by Northwest", year: 1959 },
    { title: "Vertigo", year: 1958 },
    { title: "Star Wars: Episode VI - Return of the Jedi", year: 1983 },
    { title: "Reservoir Dogs", year: 1992 },
    { title: "Braveheart", year: 1995 },
    { title: "M", year: 1931 },
    { title: "Requiem for a Dream", year: 2000 },
    { title: "Amélie", year: 2001 },
    { title: "A Clockwork Orange", year: 1971 },
    { title: "Like Stars on Earth", year: 2007 },
    { title: "Taxi Driver", year: 1976 },
    { title: "Lawrence of Arabia", year: 1962 },
    { title: "Double Indemnity", year: 1944 },
    { title: "Eternal Sunshine of the Spotless Mind", year: 2004 },
    { title: "Amadeus", year: 1984 },
    { title: "To Kill a Mockingbird", year: 1962 },
    { title: "Toy Story 3", year: 2010 },
    { title: "Logan", year: 2017 },
    { title: "Full Metal Jacket", year: 1987 },
    { title: "Dangal", year: 2016 },
    { title: "The Sting", year: 1973 },
    { title: "2001: A Space Odyssey", year: 1968 },
    { title: "Singin' in the Rain", year: 1952 },
    { title: "Toy Story", year: 1995 },
    { title: "Bicycle Thieves", year: 1948 },
    { title: "The Kid", year: 1921 },
    { title: "Inglourious Basterds", year: 2009 },
    { title: "Snatch", year: 2000 },
    { title: "3 Idiots", year: 2009 },
    { title: "Monty Python and the Holy Grail", year: 1975 },
].map((f, index) => ({ ...f, rank: index + 1 }));

/**
 * Takes the same arguments as `ItemRenderer<Film>`, but returns the common menu item
 * props for that item instead of the rendered element itself. This is useful for implementing
 * custom item renderers.
 */
export function getFilmItemProps(
    film: Film,
    { handleClick, handleFocus, modifiers, ref, query }: ItemRendererProps,
): MenuItem2Props & React.Attributes {
    return {
        active: modifiers.active,
        disabled: modifiers.disabled,
        elementRef: ref,
        key: film.rank,
        label: film.year.toString(),
        onClick: handleClick,
        onFocus: handleFocus,
        roleStructure: "listoption",
        text: highlightText(`${film.rank}. ${film.title}`, query),
    };
}

/**
 * Simple film item renderer _without_ support for "selected" appearance.
 */
export const renderFilm: ItemRenderer<Film> = (film, props) => {
    if (!props.modifiers.matchesPredicate) {
        return null;
    }
    return <MenuItem2 {...getFilmItemProps(film, props)} />;
};

/**
 * Renders a menu item to create a single film from a given query string.
 */
export const renderCreateFilmMenuItem = (
    query: string,
    active: boolean,
    handleClick: React.MouseEventHandler<HTMLElement>,
) => (
    <MenuItem2
        icon="add"
        text={`Create "${query}"`}
        roleStructure="listoption"
        active={active}
        onClick={handleClick}
        shouldDismissPopover={false}
    />
);

/**
 * Renders a menu item to create one or more films from a given query string.
 */
export const renderCreateFilmsMenuItem = (
    query: string,
    active: boolean,
    handleClick: React.MouseEventHandler<HTMLElement>,
) => (
    <MenuItem2
        icon="add"
        text={`Create ${printReadableList(query)}`}
        roleStructure="listoption"
        active={active}
        onClick={handleClick}
        shouldDismissPopover={false}
    />
);

/**
 * Given a user-provided list of strings separated by commas, this helper function parses the list and
 * returns a more readable version of it.
 *
 * For example, the input 'a, b, c' becomes '"a", "b", and "c"'.
 */
function printReadableList(query: string): string {
    return query
        .split(", ")
        .map((title, index, titles) => {
            const separator = index > 0 ? (index === titles.length - 1 ? " and " : ", ") : "";
            return `${separator}"${title}"`;
        })
        .join("");
}

export const filterFilm: ItemPredicate<Film> = (query, film, _index, exactMatch) => {
    const normalizedTitle = film.title.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
        return normalizedTitle === normalizedQuery;
    } else {
        return `${film.rank}. ${normalizedTitle} ${film.year}`.indexOf(normalizedQuery) >= 0;
    }
};

function highlightText(text: string, query: string) {
    let lastIndex = 0;
    const words = query
        .split(/\s+/)
        .filter(word => word.length > 0)
        .map(escapeRegExpChars);
    if (words.length === 0) {
        return [text];
    }
    const regexp = new RegExp(words.join("|"), "gi");
    const tokens: React.ReactNode[] = [];
    while (true) {
        const match = regexp.exec(text);
        if (!match) {
            break;
        }
        const length = match[0].length;
        const before = text.slice(lastIndex, regexp.lastIndex - length);
        if (before.length > 0) {
            tokens.push(before);
        }
        lastIndex = regexp.lastIndex;
        tokens.push(<strong key={lastIndex}>{match[0]}</strong>);
    }
    const rest = text.slice(lastIndex);
    if (rest.length > 0) {
        tokens.push(rest);
    }
    return tokens;
}

function escapeRegExpChars(text: string) {
    return text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

export function createFilm(title: string): Film {
    return {
        rank: 100 + Math.floor(Math.random() * 100 + 1),
        title,
        year: new Date().getFullYear(),
    };
}

export function createFilms(query: string): Film[] {
    const titles = query.split(", ");
    return titles.map((title, index) => ({
        rank: 100 + Math.floor(Math.random() * 100 + index),
        title,
        year: new Date().getFullYear(),
    }));
}

export function areFilmsEqual(filmA: Film, filmB: Film) {
    // Compare only the titles (ignoring case) just for simplicity.
    return filmA.title.toLowerCase() === filmB.title.toLowerCase();
}

export function doesFilmEqualQuery(film: Film, query: string) {
    return film.title.toLowerCase() === query.toLowerCase();
}

export function arrayContainsFilm(films: Film[], filmToFind: Film): boolean {
    return films.some((film: Film) => film.title === filmToFind.title);
}

export function addFilmToArray(films: Film[], filmToAdd: Film) {
    return [...films, filmToAdd];
}

export function deleteFilmFromArray(films: Film[], filmToDelete: Film) {
    return films.filter(film => film !== filmToDelete);
}

export function maybeAddCreatedFilmToArrays(
    items: Film[],
    createdItems: Film[],
    film: Film,
): { createdItems: Film[]; items: Film[] } {
    const isNewlyCreatedItem = !arrayContainsFilm(items, film);
    return {
        createdItems: isNewlyCreatedItem ? addFilmToArray(createdItems, film) : createdItems,
        // Add a created film to `items` so that the film can be deselected.
        items: isNewlyCreatedItem ? addFilmToArray(items, film) : items,
    };
}

export function maybeDeleteCreatedFilmFromArrays(
    items: Film[],
    createdItems: Film[],
    film: Film,
): { createdItems: Film[]; items: Film[] } {
    const wasItemCreatedByUser = arrayContainsFilm(createdItems, film);

    // Delete the item if the user manually created it.
    return {
        createdItems: wasItemCreatedByUser ? deleteFilmFromArray(createdItems, film) : createdItems,
        items: wasItemCreatedByUser ? deleteFilmFromArray(items, film) : items,
    };
}
