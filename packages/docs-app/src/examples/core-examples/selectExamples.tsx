/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import dedent from "dedent";

import { Button, Classes, Menu, MenuItem } from "@blueprintjs/core";
import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";
import { Select, type ItemListRenderer, type ItemPredicate, type ItemRenderer } from "@blueprintjs/select";
import * as React from "react";
import { TOP_100_FILMS, type Film } from "@blueprintjs/select/examples";
import classNames from "classnames";

export const SelectBasicExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        import { Button, MenuItem } from "@blueprintjs/core";
        import { Select, type ItemRenderer } from "@blueprintjs/select";

        const renderItem: ItemRenderer<string> = (item, { handleClick, ref }) => (
            <MenuItem
                key={item}
                onClick={handleClick}
                ref={ref}
                roleStructure="listoption"
                text={item}
            />
        }

        function Example() {
            const items = ["One", "Two", "Three", "Four", "Five"];
            const [selectedItem, setSelectedItem] = React.useState<string | undefined>(undefined);
           
            return (
                <Select<string>
                    filterable={false}
                    itemRenderer={renderItem}
                    items={items}
                    onItemSelect={setSelectedItem}
                >
                    <Button text={selectedItem ?? "(No selection)"} endIcon="double-caret-vertical" />
                </Select> 
            );
        }
    `;

    const items = ["One", "Two", "Three", "Four", "Five"];
    const [selectedItem, setSelectedItem] = React.useState<string | undefined>(undefined);
    const renderItem: ItemRenderer<string> = (item, { handleClick, ref }) => (
        <MenuItem key={item} onClick={handleClick} ref={ref} roleStructure="listoption" text={item} />
    );

    return (
        <CodeExample code={code} {...props}>
            <Select<string> filterable={false} itemRenderer={renderItem} items={items} onItemSelect={setSelectedItem}>
                <Button text={selectedItem ?? "(No selection)"} endIcon="double-caret-vertical" />
            </Select>
        </CodeExample>
    );
};

export const SelectFilteringExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        import { Button, MenuItem } from "@blueprintjs/core"; 
        import { Select, type ItemPredicate, type ItemRenderer } from "@blueprintjs/select";

        const filterItem: ItemPredicate<string> = (query, item) => item.toLowerCase().includes(query.toLowerCase());
        const renderItem: ItemRenderer<string> = (item, { handleClick, modifiers, ref }) => {
            if (!modifiers.matchesPredicate) {
                return null;
            }
            return (
                <MenuItem
                    key={item}
                    onClick={handleClick}
                    ref={ref}
                    roleStructure="listoption"
                    text={item}
                />
            );
        };
        
        function Example() {
            const items = ["One", "Two", "Three", "Four", "Five"];
            const [selectedItem, setSelectedItem] = React.useState<string | undefined>(undefined);

            return (
                <Select<string>
                    itemPredicate={filterItem}
                    itemRenderer={renderItem}
                    items={items}
                    noResults={<MenuItem disabled={true} text="No results" roleStructure="listoption" />}
                    onItemSelect={setSelectedItem}
                >
                    <Button text={selectedItem ?? "(No selection)"} endIcon="double-caret-vertical" />
                </Select>
            );
        }
    `;

    const items = ["One", "Two", "Three", "Four", "Five"];
    const [selectedItem, setSelectedItem] = React.useState<string | undefined>(undefined);
    const filterItem: ItemPredicate<string> = (query, item) => item.toLowerCase().includes(query.toLowerCase());
    const renderItem: ItemRenderer<string> = (item, { handleClick, modifiers, ref }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return <MenuItem key={item} onClick={handleClick} ref={ref} roleStructure="listoption" text={item} />;
    };

    return (
        <CodeExample code={code} {...props}>
            <Select<string>
                itemPredicate={filterItem}
                itemRenderer={renderItem}
                items={items}
                noResults={<MenuItem disabled={true} text="No results" roleStructure="listoption" />}
                onItemSelect={setSelectedItem}
            >
                <Button text={selectedItem ?? "(No selection)"} endIcon="double-caret-vertical" />
            </Select>
        </CodeExample>
    );
};

export const SelectCustomItemTypeExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        import { Button, MenuItem } from "@blueprintjs/core"; 
        import { Select, type ItemPredicate, type ItemRenderer } from "@blueprintjs/select";

        interface Film {
            title: string;
            year: number;
            rank: number;
        }

        const TOP_100_FILMS: Film[] = [
            { title: "The Shawshank Redemption", year: 1994 },
            { title: "The Godfather", year: 1972 },
            // ...
        ].map((film, index) => ({ ...film, rank: index + 1 }));

        const filterFilm: ItemPredicate<Film> = (query, film, _index, exactMatch) => {
            const normalizedTitle = film.title.toLowerCase();
            const normalizedQuery = query.toLowerCase();

            if (exactMatch) {
                return normalizedTitle === normalizedQuery;
            } else {
                return \`$\{film.rank}. $\{normalizedTitle} $\{film.year}\`.indexOf(normalizedQuery) >= 0;
            }
        };

        const renderFilm: ItemRenderer<Film> = (film, { handleClick, handleFocus, modifiers, ref }) => {
            if (!modifiers.matchesPredicate) {
                return null;
            }
            return (
                <MenuItem
                    active={modifiers.active}
                    disabled={modifiers.disabled}
                    key={film.rank}
                    label={film.year.toString()}
                    onClick={handleClick}
                    onFocus={handleFocus}
                    ref={ref}
                    roleStructure="listoption"
                    text={\`$\{film.rank}. $\{film.title}\`}
                />
            );
        };

        function Example() {
            const [selectedFilm, setSelectedFilm] = React.useState<Film | undefined>(undefined);

            return (
                <Select<Film>
                    itemPredicate={filterFilm}
                    itemRenderer={renderFilm}
                    items={TOP_100_FILMS}
                    noResults={<MenuItem disabled={true} text="No results" roleStructure="listoption" />}
                    onItemSelect={setSelectedFilm}
                >
                    <Button text={selectedFilm?.title ?? "(No selection)"} endIcon="double-caret-vertical" />
                </Select>
            );
        }
    `;

    const [selectedFilm, setSelectedFilm] = React.useState<Film | undefined>(undefined);
    const filterFilm: ItemPredicate<Film> = (query, film, _index, exactMatch) => {
        const normalizedTitle = film.title.toLowerCase();
        const normalizedQuery = query.toLowerCase();

        if (exactMatch) {
            return normalizedTitle === normalizedQuery;
        } else {
            return `${film.rank}. ${normalizedTitle} ${film.year}`.indexOf(normalizedQuery) >= 0;
        }
    };
    const renderFilm: ItemRenderer<Film> = (film, { handleClick, handleFocus, modifiers, ref }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return (
            <MenuItem
                active={modifiers.active}
                disabled={modifiers.disabled}
                key={film.rank}
                label={film.year.toString()}
                onClick={handleClick}
                onFocus={handleFocus}
                ref={ref}
                roleStructure="listoption"
                text={`${film.rank}. ${film.title}`}
            />
        );
    };

    return (
        <CodeExample code={code} {...props}>
            <Select<Film>
                itemPredicate={filterFilm}
                itemRenderer={renderFilm}
                items={TOP_100_FILMS}
                noResults={<MenuItem disabled={true} text="No results" roleStructure="listoption" />}
                onItemSelect={setSelectedFilm}
            >
                <Button text={selectedFilm?.title ?? "(No selection)"} endIcon="double-caret-vertical" />
            </Select>
        </CodeExample>
    );
};

export const SelectButtonStylingExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        <Select {...selectProps}>
            <Button alignText="left" endIcon="double-caret-vertical" {...buttonProps} />
        </Select> 
    `;

    const items = ["One", "Two", "Three", "Four", "Five"];
    const [selectedItem, setSelectedItem] = React.useState<string | undefined>(undefined);
    const renderItem: ItemRenderer<string> = (item, { handleClick, ref }) => (
        <MenuItem key={item} onClick={handleClick} ref={ref} roleStructure="listoption" text={item} />
    );

    return (
        <CodeExample code={code} {...props}>
            <Select<string> filterable={false} itemRenderer={renderItem} items={items} onItemSelect={setSelectedItem}>
                <Button
                    alignText="left"
                    endIcon="double-caret-vertical"
                    fill={true}
                    text={selectedItem ?? "(No selection)"}
                />
            </Select>
        </CodeExample>
    );
};

export const SelectPlaceholderStylingExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        <Select {...selectProps}>
            <Button
                textClassName={classNames({
                    [Classes.TEXT_MUTED]: selectedItem === undefined,
                })}
                {...buttonProps}
            />
        </Select> 
    `;

    const items = ["One", "Two", "Three", "Four", "Five"];
    const [selectedItem, setSelectedItem] = React.useState<string | undefined>(undefined);
    const renderItem: ItemRenderer<string> = (item, { handleClick, ref }) => (
        <MenuItem key={item} onClick={handleClick} ref={ref} roleStructure="listoption" text={item} />
    );

    return (
        <CodeExample code={code} {...props}>
            <Select<string> filterable={false} itemRenderer={renderItem} items={items} onItemSelect={setSelectedItem}>
                <Button
                    endIcon="double-caret-vertical"
                    text={selectedItem ?? "(No selection)"}
                    textClassName={classNames({
                        [Classes.TEXT_MUTED]: selectedItem === undefined,
                    })}
                />
            </Select>
        </CodeExample>
    );
};

export const SelectDisabledStylingExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        <Select disabled={true} {...selectProps}>
            <Button disabled={true} {...buttonProps} />
        </Select> 
    `;

    const items = ["One", "Two", "Three", "Four", "Five"];
    const [selectedItem, setSelectedItem] = React.useState<string | undefined>(undefined);
    const renderItem: ItemRenderer<string> = (item, { handleClick, ref }) => (
        <MenuItem key={item} onClick={handleClick} ref={ref} roleStructure="listoption" text={item} />
    );

    return (
        <CodeExample code={code} {...props}>
            <Select<string> disabled={true} itemRenderer={renderItem} items={items} onItemSelect={setSelectedItem}>
                <Button disabled={true} endIcon="double-caret-vertical" text={selectedItem ?? "(No selection)"} />
            </Select>
        </CodeExample>
    );
};

export const SelectCustomMenuExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        import { Button, Menu, MenuItem } from "@blueprintjs/core"; 
        import { Select, type ItemListRenderer } from "@blueprintjs/select";

        const renderMenu: ItemListRenderer<string> = ({ items, itemsParentRef, query, renderItem, menuProps }) => {
            const renderedItems = items.map(renderItem).filter(item => item != null);
            return (
                <Menu role="listbox" ulRef={itemsParentRef} {...menuProps}>
                    <MenuItem
                        disabled={true}
                        text={\`Found $\{renderedItems.length} item(s) matching "$\{query}"\`}
                        roleStructure="listoption"
                    />
                    {renderedItems}
                </Menu>
            );
        };
        
        function Example() {
            return (
                <Select itemListRenderer={renderMenu} {...selectProps}>
                    <Button {...buttonProps} />
                </Select>
            );
        }
    `;

    const items = ["One", "Two", "Three", "Four", "Five"];
    const [selectedItem, setSelectedItem] = React.useState<string | undefined>(undefined);
    const filterItem: ItemPredicate<string> = (query, item) => item.toLowerCase().includes(query.toLowerCase());
    const renderItem: ItemRenderer<string> = (item, { handleClick, modifiers, ref }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return <MenuItem key={item} onClick={handleClick} ref={ref} roleStructure="listoption" text={item} />;
    };

    const renderMenu: ItemListRenderer<string> = ({ items, itemsParentRef, query, renderItem, menuProps }) => {
        const renderedItems = items.map(renderItem).filter(item => item != null);
        return (
            <Menu role="listbox" ulRef={itemsParentRef} {...menuProps}>
                <MenuItem
                    disabled={true}
                    text={`Found ${renderedItems.length} item(s) matching "${query}"`}
                    roleStructure="listoption"
                />
                {renderedItems}
            </Menu>
        );
    };

    return (
        <CodeExample code={code} {...props}>
            <Select<string>
                itemListRenderer={renderMenu}
                itemPredicate={filterItem}
                itemRenderer={renderItem}
                items={items}
                noResults={<MenuItem disabled={true} text="No results" roleStructure="listoption" />}
                onItemSelect={setSelectedItem}
            >
                <Button text={selectedItem ?? "(No selection)"} endIcon="double-caret-vertical" />
            </Select>
        </CodeExample>
    );
};

export const SelectCreateNewItemsExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        import { Button, MenuItem } from "@blueprintjs/core"; 
        import { Select } from "@blueprintjs/select";

        const createItem = (query: string) => query;
        const renderCreateItemOption = (
            query: string,
            active: boolean,
            handleClick: React.MouseEventHandler<HTMLElement>,
        ) => {
            return (
                <MenuItem
                    active={active}
                    icon="add"
                    onClick={handleClick}
                    roleStructure="listoption"
                    shouldDismissPopover={true}
                    text={\`Create "$\{query}"\`}
                />
            );
        };
        
        function Example() {
            return (
                <Select<string>
                    createNewItemFromQuery={createItem}
                    createNewItemRenderer={renderCreateItemOption}
                    {...selectProps}
                >
                    <Button {...buttonProps} />
                </Select>
            );
        }
    `;

    const items = ["One", "Two", "Three", "Four", "Five"];
    const [selectedItem, setSelectedItem] = React.useState<string | undefined>(undefined);
    const filterItem: ItemPredicate<string> = (query, item) => item.toLowerCase().includes(query.toLowerCase());
    const renderItem: ItemRenderer<string> = (item, { handleClick, modifiers, ref }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return <MenuItem key={item} onClick={handleClick} ref={ref} roleStructure="listoption" text={item} />;
    };

    const createItem = (query: string) => query;
    const renderCreateItemOption = (
        query: string,
        active: boolean,
        handleClick: React.MouseEventHandler<HTMLElement>,
    ) => {
        return (
            <MenuItem
                active={active}
                icon="add"
                onClick={handleClick}
                roleStructure="listoption"
                shouldDismissPopover={true}
                text={`Create "${query}"`}
            />
        );
    };

    return (
        <CodeExample code={code} {...props}>
            <Select<string>
                createNewItemFromQuery={createItem}
                createNewItemRenderer={renderCreateItemOption}
                itemPredicate={filterItem}
                itemRenderer={renderItem}
                items={items}
                noResults={<MenuItem disabled={true} text="No results" roleStructure="listoption" />}
                onItemSelect={setSelectedItem}
            >
                <Button text={selectedItem ?? "(No selection)"} endIcon="double-caret-vertical" />
            </Select>
        </CodeExample>
    );
};
