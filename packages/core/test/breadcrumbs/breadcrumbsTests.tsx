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
import { expect } from "chai";
import * as React from "react";
import { spy } from "sinon";

import { Classes } from "../../src/common";
import { Boundary } from "../../src/common/boundary";
import { type BreadcrumbProps } from "../../src/components/breadcrumbs/breadcrumb";
import { Breadcrumbs } from "../../src/components/breadcrumbs/breadcrumbs";
import { hasClass } from "../utils";

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

        expect(hasClass(overflowList, Classes.BREADCRUMBS)).to.be.true;
        expect(hasClass(overflowList, "breadcrumbs-class")).to.be.true;
        expect(hasClass(overflowList, "overflow-list-class")).to.be.true;
    });

    it("should make the last breadcrumb current", () => {
        render(<Breadcrumbs items={ITEMS} minVisibleItems={ITEMS.length} />);

        expect(screen.getAllByRole("listitem")).to.have.length(3);
        expect(hasClass(screen.getByText("1"), Classes.BREADCRUMB_CURRENT)).to.be.false;
        expect(hasClass(screen.getByText("2"), Classes.BREADCRUMB_CURRENT)).to.be.false;
        expect(hasClass(screen.getByText("3"), Classes.BREADCRUMB_CURRENT)).to.be.true;
    });

    it("should render overflow/collapsed indicator when items don't fit", () => {
        render(
            // 70px is just enough to show one item
            <div style={{ width: 70 }}>
                <Breadcrumbs items={ITEMS} />
            </div>,
        );
        const button = screen.getByRole("button", { name: /collapsed breadcrumbs/i });

        expect(hasClass(button, Classes.BREADCRUMBS_COLLAPSED)).to.be.true;
    });

    it("should render the correct overflow menu items", () => {
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

    it("should render the correct overflow menu items when collapsing from END", () => {
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
        expect(hasClass(screen.getByRole("menuitem", { name: "1" }), Classes.DISABLED)).to.be.true;
    });

    it("should call currentBreadcrumbRenderer (only) for the current breadcrumb", () => {
        const breadcrumbRenderer = spy();
        render(
            <Breadcrumbs currentBreadcrumbRenderer={breadcrumbRenderer} items={ITEMS} minVisibleItems={ITEMS.length} />,
        );

        expect(breadcrumbRenderer.calledOnce).to.be.true;
        expect(breadcrumbRenderer.calledWith(ITEMS[ITEMS.length - 1])).to.be.true;
    });

    it("should not call breadcrumbRenderer for the current breadcrumb when there is a currentBreadcrumbRenderer", () => {
        const breadcrumbRenderer = spy();
        render(
            <Breadcrumbs
                breadcrumbRenderer={breadcrumbRenderer}
                currentBreadcrumbRenderer={() => <div />}
                items={ITEMS}
                minVisibleItems={ITEMS.length}
            />,
        );

        expect(breadcrumbRenderer.callCount).to.equal(ITEMS.length - 1);
        expect(breadcrumbRenderer.neverCalledWith(ITEMS[ITEMS.length - 1])).to.be.true;
    });

    it("should call breadcrumbRenderer", () => {
        const breadcrumbRenderer = spy();
        render(<Breadcrumbs breadcrumbRenderer={breadcrumbRenderer} items={ITEMS} minVisibleItems={ITEMS.length} />);

        expect(breadcrumbRenderer.callCount).to.equal(ITEMS.length);
    });
});
