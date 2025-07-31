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

import { useCallback, useRef, useState } from "react";

import { Code, H5, Intent, MenuItem, type Popover, Switch, type TagProps } from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";
import { type ItemRenderer, MultiSelect } from "@blueprintjs/select";
import {
    areFilmsEqual,
    arrayContainsFilm,
    createFilms,
    type Film,
    filterFilm,
    getFilmItemProps,
    maybeAddCreatedFilmToArrays,
    maybeDeleteCreatedFilmFromArrays,
    renderCreateFilmsMenuItem,
    TOP_100_FILMS,
} from "@blueprintjs/select/examples";

import { PropCodeTooltip } from "../../common/propCodeTooltip";

import { MultiSelectCustomTarget } from "./multiSelectCustomTarget";

const INTENTS = [Intent.NONE, Intent.PRIMARY, Intent.SUCCESS, Intent.DANGER, Intent.WARNING];

export const MultiSelectExample: React.FC<ExampleProps> = props => {
    const [allowCreate, setAllowCreate] = useState(false);
    const [createdItems, setCreatedItems] = useState<Film[]>([]);
    const [customTarget, setCustomTarget] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [fill, setFill] = useState(false);
    const [films, setFilms] = useState<Film[]>([]);
    const [hasInitialContent, setHasInitialContent] = useState(false);
    const [intent, setIntent] = useState(false);
    const [items, setItems] = useState<Film[]>(TOP_100_FILMS);
    const [matchTargetWidth, setMatchTargetWidth] = useState(false);
    const [openOnKeyDown, setOpenOnKeyDown] = useState(false);
    const [popoverMinimal, setPopoverMinimal] = useState(true);
    const [resetOnSelect, setResetOnSelect] = useState(true);
    const [showClearButton, setShowClearButton] = useState(true);
    const [tagMinimal, setTagMinimal] = useState(false);

    const popoverRef = useRef<Popover>(null);

    const selectFilms = useCallback(
        (filmsToSelect: Film[]) => {
            let nextCreatedItems = [...createdItems];
            let nextFilms = [...films];
            let nextItems = [...items];

            filmsToSelect.forEach(film => {
                const results = maybeAddCreatedFilmToArrays(nextItems, nextCreatedItems, film);
                nextItems = results.items;
                nextCreatedItems = results.createdItems;
                // Avoid re-creating an item that is already selected (the "Create
                // Item" option will be shown even if it matches an already selected
                // item).
                nextFilms = !arrayContainsFilm(nextFilms, film) ? [...nextFilms, film] : nextFilms;
            });

            setCreatedItems(nextCreatedItems);
            setFilms(nextFilms);
            setItems(nextItems);
        },
        [createdItems, films, items],
    );

    const selectFilm = useCallback(
        (film: Film) => {
            selectFilms([film]);
        },
        [selectFilms],
    );

    const deselectFilm = useCallback(
        (index: number) => {
            const film = films[index];
            const { createdItems: nextCreatedItems, items: nextItems } = maybeDeleteCreatedFilmFromArrays(
                items,
                createdItems,
                film,
            );

            // Delete the item if the user manually created it.
            setCreatedItems(nextCreatedItems);
            setFilms(films.filter((_film, i) => i !== index));
            setItems(nextItems);
        },
        [createdItems, films, items],
    );

    const getSelectedFilmIndex = useCallback((film: Film) => films.indexOf(film), [films]);

    const isFilmSelected = useCallback((film: Film) => getSelectedFilmIndex(film) !== -1, [getSelectedFilmIndex]);

    const handleFilmSelect = useCallback(
        (film: Film) => {
            if (!isFilmSelected(film)) {
                selectFilm(film);
            } else {
                deselectFilm(getSelectedFilmIndex(film));
            }
        },
        [deselectFilm, getSelectedFilmIndex, isFilmSelected, selectFilm],
    );

    const handleTagRemove = useCallback((_tag: React.ReactNode, index: number) => deselectFilm(index), [deselectFilm]);

    const handleFilmsPaste = useCallback(
        (newFilms: Film[]) => {
            // On paste, don't bother with deselecting already selected values,
            // just add the new ones.
            selectFilms(newFilms);
        },
        [selectFilms],
    );

    const handleClear = useCallback(() => setFilms([]), []);

    const renderFilm: ItemRenderer<Film> = useCallback(
        (film, rendererProps) => {
            if (!rendererProps.modifiers.matchesPredicate) {
                return null;
            }
            return (
                <MenuItem
                    {...getFilmItemProps(film, rendererProps)}
                    roleStructure="listoption"
                    selected={isFilmSelected(film)}
                    shouldDismissPopover={false}
                    text={`${film.rank}. ${film.title}`}
                />
            );
        },
        [isFilmSelected],
    );

    const getTagProps = useCallback(
        (_value: React.ReactNode, index: number): TagProps => ({
            intent: intent ? INTENTS[index % INTENTS.length] : Intent.NONE,
            minimal: tagMinimal,
        }),
        [intent, tagMinimal],
    );

    const options = (
        <>
            <H5>Props</H5>
            <Switch
                checked={openOnKeyDown}
                disabled={customTarget}
                label="Open popover on key down"
                onChange={handleBooleanChange(setOpenOnKeyDown)}
            />
            <Switch
                checked={resetOnSelect}
                label="Reset query on select"
                onChange={handleBooleanChange(setResetOnSelect)}
            />
            <Switch
                checked={hasInitialContent}
                label="Use initial content"
                onChange={handleBooleanChange(setHasInitialContent)}
            />
            <PropCodeTooltip
                content={
                    <>
                        <Code>createNewItemFromQuery</Code> and <Code>createNewItemRenderer</Code> are{" "}
                        {allowCreate ? "defined" : "undefined"}
                    </>
                }
            >
                <Switch
                    checked={allowCreate}
                    label="Allow creating new films"
                    onChange={handleBooleanChange(setAllowCreate)}
                />
            </PropCodeTooltip>
            <PropCodeTooltip
                content={
                    <>
                        <Code>onClear</Code> is {showClearButton ? "defined" : "undefined"}
                    </>
                }
            >
                <Switch
                    checked={showClearButton}
                    label="Show clear button"
                    onChange={handleBooleanChange(setShowClearButton)}
                />
            </PropCodeTooltip>
            <PropCodeTooltip
                content={
                    <>
                        <Code>customTarget</Code> is {customTarget ? "defined" : "undefined"}
                    </>
                }
            >
                <Switch
                    checked={customTarget}
                    label="Use Custom Target"
                    onChange={handleBooleanChange(setCustomTarget)}
                />
            </PropCodeTooltip>
            <H5>Appearance props</H5>
            <PropCodeTooltip snippet={`disabled={${disabled.toString()}}`}>
                <Switch checked={disabled} label="Disabled" onChange={handleBooleanChange(setDisabled)} />
            </PropCodeTooltip>
            <PropCodeTooltip snippet={`fill={${fill.toString()}}`}>
                <Switch checked={fill} label="Fill container width" onChange={handleBooleanChange(setFill)} />
            </PropCodeTooltip>
            <H5>Tag props</H5>
            <Switch checked={tagMinimal} label="Minimal tag style" onChange={handleBooleanChange(setTagMinimal)} />
            <Switch checked={intent} label="Cycle through tag intents" onChange={handleBooleanChange(setIntent)} />
            <H5>Popover props</H5>
            <PropCodeTooltip snippet={`popoverProps={{ matchTargetWidth: ${matchTargetWidth.toString()} }}`}>
                <Switch
                    checked={matchTargetWidth}
                    label="Match target width"
                    onChange={handleBooleanChange(setMatchTargetWidth)}
                />
            </PropCodeTooltip>
            <PropCodeTooltip snippet={`popoverProps={{ minimal: ${popoverMinimal.toString()} }}`}>
                <Switch
                    checked={popoverMinimal}
                    label="Minimal popover style"
                    onChange={handleBooleanChange(setPopoverMinimal)}
                />
            </PropCodeTooltip>
        </>
    );

    return (
        <Example options={options} {...props}>
            <MultiSelect
                createNewItemFromQuery={allowCreate ? createFilms : undefined}
                createNewItemRenderer={allowCreate ? renderCreateFilmsMenuItem : null}
                customTarget={customTarget ? renderCustomTarget : undefined}
                disabled={disabled}
                fill={fill}
                initialContent={hasInitialContent ? initialContent : undefined}
                itemPredicate={filterFilm}
                itemRenderer={renderFilm}
                items={items}
                itemsEqual={areFilmsEqual}
                menuProps={{ "aria-label": "films" }}
                noResults={noResults}
                onClear={showClearButton ? handleClear : undefined}
                onItemSelect={handleFilmSelect}
                onItemsPaste={handleFilmsPaste}
                openOnKeyDown={openOnKeyDown}
                popoverProps={{ matchTargetWidth, minimal: popoverMinimal }}
                popoverRef={popoverRef}
                resetOnSelect={resetOnSelect}
                selectedItems={films}
                tagInputProps={{ onRemove: handleTagRemove, tagProps: getTagProps }}
                tagRenderer={renderTag}
            />
        </Example>
    );
};

const initialContent = (
    <MenuItem disabled={true} text={`${TOP_100_FILMS.length} items loaded.`} roleStructure="listoption" />
);

const noResults = <MenuItem disabled={true} text="No results." roleStructure="listoption" />;

const renderTag = (film: Film) => film.title;

const renderCustomTarget = (selectedItems: Film[]) => <MultiSelectCustomTarget count={selectedItems.length} />;
