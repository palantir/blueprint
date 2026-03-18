/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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

import { render, screen } from "@testing-library/react";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";
import { Boundary } from "../../common/boundary";

import { type BreadcrumbProps } from "./breadcrumb";
import { Breadcrumbs } from "./breadcrumbs";

const ITEMS: BreadcrumbProps[] = [{ text: "1" }, { text: "2" }, { text: "3" }];

describe("<Breadcrumbs>", () => {
    it("should pass through props to OverflowList", () => {
        render(
            <Breadcrumbs
                className="breadcrumbs-class"
                items={[]}
                overflowListProps={{ className: "overflow-list-class" }}
            />,
        );
        const overflowList = screen.getByRole("list");

        expect(overflowList).toHaveClass(Classes.BREADCRUMBS);
        expect(overflowList).toHaveClass("breadcrumbs-class");
        expect(overflowList).toHaveClass("overflow-list-class");
    });

    it("should make the last breadcrumb current", () => {
        render(<Breadcrumbs items={ITEMS} minVisibleItems={ITEMS.length} />);

        expect(screen.getAllByRole("listitem")).to.have.length(3);
        expect(screen.getByText("1")).not.toHaveClass(Classes.BREADCRUMB_CURRENT);
        expect(screen.getByText("2")).not.toHaveClass(Classes.BREADCRUMB_CURRENT);
        expect(screen.getByText("3")).toHaveClass(Classes.BREADCRUMB_CURRENT);
    });

    it("should render overflow/collapsed indicator when items don't fit", () => {
        render(
            // 70px is just enough to show one item
            <div style={{ width: 70 }}>
                <Breadcrumbs items={ITEMS} />
            </div>,
        );
        const button = screen.getByRole("button", { name: /collapsed breadcrumbs/i });

        expect(button).toHaveClass(Classes.BREADCRUMBS_COLLAPSED);
    });

    it.skip("should render the correct overflow menu items", () => {
        render(
            // 70px is just enough to show one item
            <div style={{ width: 70 }}>
                <Breadcrumbs items={ITEMS} popoverProps={{ isOpen: true, usePortal: false }} />
            </div>,
        );

        expect(screen.getAllByRole("menuitem")).to.have.lengthOf(ITEMS.length - 1);
        expect(screen.getByRole("menuitem", { name: "2" })).to.exist;
        expect(screen.getByRole("menuitem", { name: "1" })).to.exist;
    });

    it.skip("should render the correct overflow menu items when collapsing from END", () => {
        render(
            // 70px is just enough to show one item
            <div style={{ width: 70 }}>
                <Breadcrumbs
                    collapseFrom={Boundary.END}
                    items={ITEMS}
                    popoverProps={{ isOpen: true, usePortal: false }}
                />
            </div>,
        );

        expect(screen.getAllByRole("menuitem")).to.have.lengthOf(ITEMS.length - 1);
        expect(screen.getByRole("menuitem", { name: "2" })).to.exist;
        expect(screen.getByRole("menuitem", { name: "3" })).to.exist;
    });

    it("should disable menu item when it is not clickable", () => {
        render(
            // 10px is too small to show any items
            <div style={{ width: 10 }}>
                <Breadcrumbs items={ITEMS} popoverProps={{ isOpen: true, usePortal: false }} />
            </div>,
        );

        expect(screen.getAllByRole("menuitem")).to.have.lengthOf(ITEMS.length);
        expect(screen.getByRole("menuitem", { name: "1" })).toHaveClass(Classes.DISABLED);
    });

    it("should call currentBreadcrumbRenderer (only) for the current breadcrumb", () => {
        const breadcrumbRenderer = vi.fn();
        render(
            <Breadcrumbs currentBreadcrumbRenderer={breadcrumbRenderer} items={ITEMS} minVisibleItems={ITEMS.length} />,
        );

        expect(breadcrumbRenderer).toHaveBeenCalledOnce();
        expect(breadcrumbRenderer).toHaveBeenCalledWith(ITEMS[ITEMS.length - 1]);
    });

    it("should not call breadcrumbRenderer for the current breadcrumb when there is a currentBreadcrumbRenderer", () => {
        const breadcrumbRenderer = vi.fn();
        render(
            <Breadcrumbs
                breadcrumbRenderer={breadcrumbRenderer}
                currentBreadcrumbRenderer={() => <div />}
                items={ITEMS}
                minVisibleItems={ITEMS.length}
            />,
        );

        expect(breadcrumbRenderer).toHaveBeenCalledTimes(ITEMS.length - 1);
        expect(breadcrumbRenderer).not.toHaveBeenCalledWith(ITEMS[ITEMS.length - 1]);
    });

    it("should call breadcrumbRenderer", () => {
        const breadcrumbRenderer = vi.fn();
        render(<Breadcrumbs breadcrumbRenderer={breadcrumbRenderer} items={ITEMS} minVisibleItems={ITEMS.length} />);

        expect(breadcrumbRenderer).toHaveBeenCalledTimes(ITEMS.length);
    });
});
