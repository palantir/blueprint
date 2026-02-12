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

import { screen } from "@testing-library/react";
import { spy } from "sinon";
import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import { Classes } from "@blueprintjs/core";

import type { ListItemsProps, SelectPopoverProps } from "../../common";
import { areFilmsEqual, type Film, filterFilm, renderFilm, TOP_100_FILMS } from "../../__examples__";

type RenderFn = (props: ListItemsProps<Film> & SelectPopoverProps) => void;

/**
 * Common tests for popover functionality in select components.
 */
export function selectPopoverTestSuite(
    renderFn: RenderFn,
    findPopover: () => HTMLElement = () => document.querySelector(`.${Classes.POPOVER}`)!,
    findTarget: () => HTMLElement = () => document.querySelector(`.${Classes.POPOVER_TARGET}`)!,
) {
    const defaultProps = {
        itemPredicate: filterFilm,
        itemRenderer: spy(renderFilm),
        items: TOP_100_FILMS.slice(0, 20),
        itemsEqual: areFilmsEqual,
        onActiveItemChange: spy(),
        onItemSelect: spy(),
        onQueryChange: spy(),
        query: "19",
    };
    const defaultPopoverProps = {
        isOpen: true,
        usePortal: false,
    };

    describe("popoverProps functionality", () => {
        it.skip("should make popover same width as target with matchTargetWidth: true", () => {
            // TODO: This test is skipped because jsdom doesn't support clientWidth measurements.
            // In jsdom, clientWidth is always 0, so we can't test actual width matching.
            // This functionality is tested in the browser and should be manually verified.
            renderFn({
                ...defaultProps,
                popoverProps: { ...defaultPopoverProps, matchTargetWidth: true },
            });
            const popoverWidth = findPopover().clientWidth;
            const targetWidth = findTarget().clientWidth;
            expect(popoverWidth).to.be.greaterThan(0);
            expect(targetWidth).to.be.greaterThan(0);
            expect(Math.abs(targetWidth - popoverWidth)).to.be.lessThan(2);
        });

        it("should allow customizing the target element with targetTagName", () => {
            const targetTagName = "a";
            renderFn({
                ...defaultProps,
                popoverProps: { ...defaultPopoverProps, targetTagName },
            });
            const anchorElement = document.querySelector(`${targetTagName}.${Classes.POPOVER_TARGET}`);
            expect(anchorElement).to.exist;
        });
    });
}
