/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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
import { act } from "react";
import { render } from "@testing-library/react";
import sinon from "sinon";

import { afterEach, beforeEach, describe, expect, it } from "@blueprintjs/test-commons/vitest";
import { Menu } from "@blueprintjs/core";

import {
    type ItemListPredicate,
    type ItemListRenderer,
    type ItemPredicate,
    QueryList,
    type QueryListProps,
    type QueryListRendererProps,
} from "../../index";
import { type Film, renderFilm, TOP_100_FILMS } from "../../__examples__";

describe("<QueryList>", () => {
    const testProps = {
        itemRenderer: sinon.spy(renderFilm),
        items: TOP_100_FILMS.slice(0, 20),
        onActiveItemChange: sinon.spy(),
        onItemSelect: sinon.spy(),
        renderer: sinon.spy((props: QueryListRendererProps<Film>) => <div>{props.itemList}</div>),
    };

    beforeEach(() => {
        testProps.itemRenderer.resetHistory();
        testProps.onActiveItemChange.resetHistory();
        testProps.onItemSelect.resetHistory();
        testProps.renderer.resetHistory();
    });

    describe("items", () => {
        it("should handle controlled changes to the whole items list", () => {
            const { rerender } = render(<QueryList<Film> {...testProps} />);
            const newItems = TOP_100_FILMS.slice(0, 1);
            rerender(<QueryList<Film> {...testProps} items={newItems} />);
            const rendererProps = testProps.renderer.lastCall.args[0] as QueryListRendererProps<Film>;
            expect(rendererProps.filteredItems).to.deep.equal(newItems);
        });
    });

    describe("itemListRenderer", () => {
        const itemListRenderer: ItemListRenderer<Film> = props => (
            <ul className="foo">{props.items.map(props.renderItem)}</ul>
        );

        it("should renderItem calls itemRenderer", () => {
            const { container } = render(<QueryList<Film> {...testProps} itemListRenderer={itemListRenderer} />);
            expect(container.querySelectorAll("ul.foo")).to.have.lengthOf(1);
            expect(testProps.itemRenderer.callCount).to.equal(20);
        });
    });

    describe("filtering", () => {
        it("should itemPredicate filters each item by query", () => {
            const predicate = sinon.spy((query: string, film: Film) => film.year === +query);
            render(<QueryList<Film> {...testProps} itemPredicate={predicate} query="1994" />);

            expect(predicate.callCount).to.equal(testProps.items.length);
            const { filteredItems } = testProps.renderer.args[0][0] as QueryListRendererProps<Film>;
            expect(filteredItems).to.have.lengthOf(3);
        });

        it("should itemListPredicate filters entire list by query", () => {
            const predicate = sinon.spy((query: string, films: Film[]) => films.filter(f => f.year === +query));
            render(<QueryList<Film> {...testProps} itemListPredicate={predicate} query="1994" />);

            expect(predicate.callCount).to.equal(1);
            const { filteredItems } = testProps.renderer.args[0][0] as QueryListRendererProps<Film>;
            expect(filteredItems).to.have.lengthOf(3);
        });

        it("should prefer itemListPredicate if both are defined", () => {
            const predicate = sinon.spy(() => true);
            const listPredicate: ItemListPredicate<any> = (_q, items) => items;
            const listPredicateSpy = sinon.spy(listPredicate);
            render(
                <QueryList<Film>
                    {...testProps}
                    itemPredicate={predicate}
                    itemListPredicate={listPredicateSpy}
                    query="1980"
                />,
            );
            expect(listPredicateSpy.called).to.be.true;
            expect(predicate.called).to.be.false;
        });

        it("should omit both predicate props is supported", () => {
            render(<QueryList<Film> {...testProps} query="1980" />);
            const { filteredItems } = testProps.renderer.args[0][0] as QueryListRendererProps<Film>;
            expect(filteredItems).to.have.lengthOf(testProps.items.length);
        });

        it("should ensure onActiveItemChange is not called with undefined and empty list", () => {
            const myItem = { rank: 1, title: "Toy Story 3", year: 2010 };
            // This test checks that when activeItem is controlled and set to myItem,
            // and the filtered list becomes empty due to query change,
            // onActiveItemChange is called with null (since no items match).
            // The original test used setState directly which is different from prop updates.
            const itemPredicate = sinon.spy((query: string) => query === "");
            const queryListRef = React.createRef<QueryList<Film>>();
            const { rerender } = render(
                <QueryList<Film>
                    ref={queryListRef}
                    {...testProps}
                    items={[myItem]}
                    activeItem={myItem}
                    itemPredicate={itemPredicate}
                    query=""
                />,
            );
            // Reset history after initial render to ignore initialization calls
            testProps.onActiveItemChange.resetHistory();
            // Setting a query that doesn't match anything should filter out all items
            // and call onActiveItemChange once with null since the active item is no longer in the filtered list
            rerender(
                <QueryList<Film>
                    ref={queryListRef}
                    {...testProps}
                    items={[myItem]}
                    activeItem={myItem}
                    itemPredicate={itemPredicate}
                    query="query"
                />,
            );
            // When filtered list is empty, onActiveItemChange should be called with null
            expect(testProps.onActiveItemChange.callCount).to.equal(1);
            expect(testProps.onActiveItemChange.lastCall.args[0]).to.be.null;
        });

        it("should ensure onActiveItemChange is not called updating props and query doesn't change", () => {
            const myItem = { rank: 1, title: "Toy Story 3", year: 2010 };
            const props: QueryListProps<Film> = {
                ...testProps,
                activeItem: myItem,
                items: [myItem],
                query: "",
            };
            const { rerender } = render(<QueryList<Film> {...props} />);
            rerender(<QueryList<Film> {...props} />);
            expect(testProps.onActiveItemChange.callCount).to.equal(0);
        });

        it("should ensure activeItem changes on query change", () => {
            const props: QueryListProps<Film> = {
                ...testProps,
                items: [TOP_100_FILMS[0]],
                query: "abc",
            };
            const queryListRef = React.createRef<QueryList<Film>>();
            const { rerender } = render(<QueryList<Film> ref={queryListRef} {...props} />);
            const rendererProps1 = testProps.renderer.lastCall.args[0] as QueryListRendererProps<Film>;
            expect(rendererProps1.activeItem).to.deep.equal(TOP_100_FILMS[0]);

            rerender(<QueryList<Film> ref={queryListRef} {...props} items={[TOP_100_FILMS[1]]} query="123" />);
            const rendererProps2 = testProps.renderer.lastCall.args[0] as QueryListRendererProps<Film>;
            expect(rendererProps2.activeItem).to.deep.equal(TOP_100_FILMS[1]);
        });

        it("should ensure activeItem changes on when no longer in new items", () => {
            const props: QueryListProps<Film> = {
                ...testProps,
                items: [TOP_100_FILMS[0]],
                query: "abc",
            };
            const queryListRef = React.createRef<QueryList<Film>>();
            const { rerender } = render(<QueryList<Film> ref={queryListRef} {...props} />);
            const rendererProps1 = testProps.renderer.lastCall.args[0] as QueryListRendererProps<Film>;
            expect(rendererProps1.activeItem).to.deep.equal(TOP_100_FILMS[0]);

            rerender(<QueryList<Film> ref={queryListRef} {...props} items={[TOP_100_FILMS[1]]} />);
            const rendererProps2 = testProps.renderer.lastCall.args[0] as QueryListRendererProps<Film>;
            expect(rendererProps2.activeItem).to.deep.equal(TOP_100_FILMS[1]);
        });
    });

    describe("activeItem state initialization", () => {
        it("should initialize to first filtered item when uncontrolled", () => {
            const props: QueryListProps<Film> = {
                ...testProps,
                // Filter down to only item at index 11, so item at index 11 should be
                // chosen as default activeItem
                itemPredicate: (_query, item) => item === TOP_100_FILMS[11],
                query: "123",
            };
            render(<QueryList<Film> {...props} />);
            const rendererProps = testProps.renderer.lastCall.args[0] as QueryListRendererProps<Film>;
            expect(rendererProps.activeItem).to.equal(TOP_100_FILMS[11]);
        });

        it("should initialize to controlled activeItem prop (non-null)", () => {
            const props: QueryListProps<Film> = {
                ...testProps,
                // List is not filtered, and item at index 11 is explicitly chosen as activeItem
                activeItem: TOP_100_FILMS[11],
            };
            render(<QueryList<Film> {...props} />);
            const rendererProps = testProps.renderer.lastCall.args[0] as QueryListRendererProps<Film>;
            expect(rendererProps.activeItem).to.equal(TOP_100_FILMS[11]);
        });

        it("should initialize to controlled activeItem prop (null)", () => {
            const props: QueryListProps<Film> = {
                ...testProps,
                activeItem: null,
            };
            render(<QueryList<Film> {...props} />);
            const rendererProps = testProps.renderer.lastCall.args[0] as QueryListRendererProps<Film>;
            expect(rendererProps.activeItem).to.equal(null);
        });

        it("should createNewItemPosition affects position of create new item", () => {
            const props: QueryListProps<Film> = {
                ...testProps,
                createNewItemFromQuery: sinon.spy(),
                createNewItemRenderer: () => <article />,
                items: TOP_100_FILMS.slice(0, 4),
                query: "the",
            };
            const { container, rerender } = render(<QueryList<Film> {...props} />);
            const menuChildren = container.querySelector("ul")!.children;
            expect(menuChildren[menuChildren.length - 1].tagName.toLowerCase()).to.equal("article");

            rerender(<QueryList<Film> {...props} createNewItemPosition="first" />);
            const menuChildrenAfter = container.querySelector("ul")!.children;
            expect(menuChildrenAfter[0].tagName.toLowerCase()).to.equal("article");
        });
    });

    describe("scrolling", () => {
        it("should bring active item into view");
    });

    describe("pasting", () => {
        const onItemsPaste = sinon.spy();

        const itemPredicate: ItemPredicate<Film> = (query: string, film: Film, _i?: number, exactMatch?: boolean) => {
            return exactMatch === true ? query.toLowerCase() === film.title.toLowerCase() : true;
        };

        function mountForPasteTest(overrideProps: Partial<QueryListProps<Film>> = {}) {
            // Placeholder. This will be overwritten by the mounted component.
            let handlePaste: (queries: string[]) => void;

            const props: QueryListProps<Film> = {
                ...testProps,
                itemPredicate,
                onItemsPaste,
                renderer: sinon.spy((listItemsProps: QueryListRendererProps<Film>) => {
                    handlePaste = listItemsProps.handlePaste;
                    return testProps.renderer(listItemsProps);
                }),
                ...overrideProps,
            };

            const queryListRef = React.createRef<QueryList<Film>>();
            render(<QueryList<Film> ref={queryListRef} {...props} />);
            // `handlePaste` will have been set by now, because `props.renderer`
            // will have been called.
            return { queryListRef, handlePaste: handlePaste! };
        }

        afterEach(() => {
            onItemsPaste.resetHistory();
        });

        it("should convert 1 pasted value into an item", () => {
            const { queryListRef, handlePaste } = mountForPasteTest();

            const pastedValue = TOP_100_FILMS[0].title;
            handlePaste([pastedValue]);

            expect(onItemsPaste.calledOnce).to.be.true;
            expect(onItemsPaste.args[0][0]).to.deep.equal([TOP_100_FILMS[0]]);
            const rendererProps = testProps.renderer.lastCall.args[0] as QueryListRendererProps<Film>;
            expect(rendererProps.activeItem).to.deep.equal(TOP_100_FILMS[0]);
            expect(rendererProps.query).to.equal("");
        });

        it("should convert multiple pasted values into items", () => {
            const { queryListRef, handlePaste } = mountForPasteTest();

            // Paste items in unsorted order for fun.
            const item1 = TOP_100_FILMS[6];
            const item2 = TOP_100_FILMS[0];
            const item3 = TOP_100_FILMS[3];

            const pastedValue1 = item1.title;
            const pastedValue2 = item2.title;
            const pastedValue3 = item3.title;

            act(() => {
                handlePaste([pastedValue1, pastedValue2, pastedValue3]);
            });

            expect(onItemsPaste.calledOnce).to.be.true;
            // Emits all three items.
            expect(onItemsPaste.args[0][0]).to.deep.equal([item1, item2, item3]);
            // Highlight the last item pasted.
            const rendererProps = testProps.renderer.lastCall.args[0] as QueryListRendererProps<Film>;
            expect(rendererProps.activeItem).to.deep.equal(item3);
            expect(rendererProps.query).to.equal("");
        });

        it("should concatenate unrecognized values into the ghost input by default", () => {
            const { queryListRef, handlePaste } = mountForPasteTest();

            const item2 = TOP_100_FILMS[6];
            const item4 = TOP_100_FILMS[3];

            const pastedValue1 = "unrecognized1";
            const pastedValue2 = item2.title;
            const pastedValue3 = "unrecognized2";
            const pastedValue4 = item4.title;

            act(() => {
                handlePaste([pastedValue1, pastedValue2, pastedValue3, pastedValue4]);
            });

            expect(onItemsPaste.calledOnce).to.be.true;
            // Emits just the 2 valid items.
            expect(onItemsPaste.args[0][0]).to.deep.equal([item2, item4]);
            // Highlight the last item pasted.
            const rendererProps = testProps.renderer.lastCall.args[0] as QueryListRendererProps<Film>;
            expect(rendererProps.activeItem).to.deep.equal(item4);
            expect(rendererProps.query).to.equal("unrecognized1, unrecognized2");
        });

        it("should create new items out of unrecognized values if 'Create item' option is enabled", () => {
            const createdRank = 0;
            const createdYear = 2019;

            const { queryListRef, handlePaste } = mountForPasteTest({
                // Must pass these two props to enable the "Create item" option.
                createNewItemFromQuery: query => ({
                    rank: createdRank,
                    title: query,
                    year: createdYear,
                }),
                createNewItemRenderer: () => <div>Create item</div>,
            });

            const item1 = TOP_100_FILMS[6];
            const item2 = TOP_100_FILMS[3];

            const pastedValue1 = item1.title;
            const pastedValue2 = item2.title;
            // Paste this item last.
            const pastedValue3 = "unrecognized";

            act(() => {
                handlePaste([pastedValue1, pastedValue2, pastedValue3]);
            });

            const createdItem = { rank: createdRank, title: "unrecognized", year: createdYear };

            expect(onItemsPaste.calledOnce).to.be.true;
            // Emits 2 existing items and 1 newly created item.
            expect(onItemsPaste.args[0][0]).to.deep.equal([item1, item2, createdItem]);
            // Highlight the last *already existing* item pasted.
            const rendererProps = testProps.renderer.lastCall.args[0] as QueryListRendererProps<Film>;
            expect(rendererProps.activeItem).to.deep.equal(item2);
            expect(rendererProps.query).to.equal("");
        });
    });

    describe("query", () => {
        it("should trim leading and trailing whitespace when creating new items", () => {
            let triggerInputQueryChange: ((e: any) => void) | undefined;
            const createNewItemFromQuerySpy = sinon.spy();
            const createNewItemRendererSpy = sinon.spy(() => <div />);
            // we must supply our own renderer so that we can hook into QueryListRendererProps#handleQueryChange
            const renderer = sinon.spy((props: QueryListRendererProps<Film>) => {
                triggerInputQueryChange = props.handleQueryChange;
                return <div>{props.itemList}</div>;
            });
            const { rerender } = render(
                <QueryList<Film>
                    {...testProps}
                    renderer={renderer}
                    createNewItemFromQuery={createNewItemFromQuerySpy}
                    createNewItemRenderer={createNewItemRendererSpy}
                />,
            );

            const untrimmedQuery = " foo ";
            const trimmedQuery = untrimmedQuery.trim();

            expect(triggerInputQueryChange).to.not.be.undefined;
            // Trigger query change
            act(() => {
                triggerInputQueryChange!({ target: { value: untrimmedQuery } } as any);
            });
            // After triggering the input change, the component should call createNewItemFromQuery and createNewItemRenderer
            // with the trimmed query
            expect(createNewItemFromQuerySpy.calledWith(trimmedQuery)).to.be.true;
            // The renderer should have been called again after state update
            expect(createNewItemRendererSpy.called).to.be.true;
            // Check if createNewItemRendererSpy was called with trimmed query as first argument
            const rendererCalls = createNewItemRendererSpy.getCalls();
            const calledWithTrimmed = rendererCalls.some(call => call.args[0] === trimmedQuery);
            expect(calledWithTrimmed).to.be.true;
        });

        it("should reset the query after creating new item if resetOnSelect=true", () => {
            const onQueryChangeSpy = runResetOnSelectTest(true);
            expect(onQueryChangeSpy.calledWith("")).to.be.true;
        });

        it("should not reset the query after creating new item if resetOnSelect=false", () => {
            const onQueryChangeSpy = runResetOnSelectTest(false);
            expect(onQueryChangeSpy.notCalled).to.be.true;
        });

        function runResetOnSelectTest(resetOnSelect: boolean): sinon.SinonSpy {
            let triggerItemCreate: ((e: any) => void) | undefined;
            const onQueryChangeSpy = sinon.spy();
            // supply a custom renderer so we can hook into handleClick and invoke it ourselves later
            const createNewItemRenderer = sinon.spy(
                (_query: string, _active: boolean, handleClick: React.MouseEventHandler<HTMLElement>) => {
                    triggerItemCreate = handleClick;
                    return <div />;
                },
            );
            const queryListRef = React.createRef<QueryList<Film>>();
            // Need a custom renderer to get the full render
            let rendererProps: QueryListRendererProps<Film> | undefined;
            const renderer = sinon.spy((props: QueryListRendererProps<Film>) => {
                rendererProps = props;
                return testProps.renderer(props);
            });
            render(
                <QueryList<Film>
                    ref={queryListRef}
                    {...testProps}
                    renderer={renderer}
                    // Must return something in order for item creation to work.
                    createNewItemFromQuery={() => ({ rank: 0, title: "irrelevant", year: 0 })}
                    createNewItemRenderer={createNewItemRenderer}
                    onQueryChange={onQueryChangeSpy}
                    resetOnSelect={resetOnSelect}
                />,
            );

            // Change the query to something non-empty so we can ensure it wasn't cleared.
            // Ignore this change in the spy.
            act(() => {
                queryListRef.current!.setQuery("some query");
            });
            onQueryChangeSpy.resetHistory();

            expect(triggerItemCreate).to.not.be.undefined;
            act(() => {
                triggerItemCreate!({});
            });

            return onQueryChangeSpy;
        }
    });
});
