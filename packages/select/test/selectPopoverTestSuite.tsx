/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
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

import { assert } from "chai";
import { ReactWrapper } from "enzyme";
import * as sinon from "sinon";

import { Classes as Popover2Classes } from "@blueprintjs/popover2";

import { areFilmsEqual, filterFilm, IFilm, renderFilm, TOP_100_FILMS } from "../../docs-app/src/common/films";
import { IListItemsProps, SelectPopoverProps } from "../src";

/**
 * Common tests for popover functionality in select components which use Popover2.
 *
 * render() should ensure the component is attached to a DOM node so that we can get accurate DOM measurements.
 */
export function selectPopoverTestSuite<P extends IListItemsProps<IFilm>, S>(
    render: (props: IListItemsProps<IFilm> & SelectPopoverProps) => ReactWrapper<P, S>,
    findPopover: (wrapper: ReactWrapper<P, S>) => ReactWrapper = wrapper =>
        wrapper.find(`.${Popover2Classes.POPOVER2}`),
    findTarget: (wrapper: ReactWrapper<P, S>) => ReactWrapper = wrapper =>
        wrapper.find(`.${Popover2Classes.POPOVER2_TARGET}`),
) {
    const defaultProps = {
        itemPredicate: filterFilm,
        itemRenderer: sinon.spy(renderFilm),
        items: TOP_100_FILMS.slice(0, 20),
        itemsEqual: areFilmsEqual,
        onActiveItemChange: sinon.spy(),
        onItemSelect: sinon.spy(),
        onQueryChange: sinon.spy(),
        query: "19",
    };
    const defaultPopoverProps = {
        isOpen: true,
        usePortal: false,
    };

    describe("popover", () => {
        it("matchTargetWidth: true makes popover same width as target", () => {
            const wrapper = render({
                ...defaultProps,
                popoverProps: { ...defaultPopoverProps, matchTargetWidth: true },
            });
            const popoverWidth = findPopover(wrapper).hostNodes().getDOMNode().clientWidth;
            const targetWidth = findTarget(wrapper).hostNodes().getDOMNode().clientWidth;
            assert.notEqual(popoverWidth, 0, "popover width should be > 0");
            assert.notEqual(targetWidth, 0, "target width should be > 0");
            assert.closeTo(targetWidth, popoverWidth, 1, "popover width should be close to target width");
            wrapper.detach();
        });
    });
}
