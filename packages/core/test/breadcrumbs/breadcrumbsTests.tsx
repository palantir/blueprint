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

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

import { Classes } from "../../src/common";
import { Boundary } from "../../src/common/boundary";
import { Breadcrumb, IBreadcrumbProps } from "../../src/components/breadcrumbs/breadcrumb";
import { Breadcrumbs } from "../../src/components/breadcrumbs/breadcrumbs";
import { MenuItem } from "../../src/components/menu/menuItem";
import { IOverflowListProps, OverflowList } from "../../src/components/overflow-list/overflowList";

const ITEMS: IBreadcrumbProps[] = [{ text: "1" }, { text: "2" }, { text: "3" }];

// Note that the `Breadcrumbs` component in these tests is not actually mounted into the document.
// That means the `OverflowList` will always render all items into the overflow (since it detects
// its own size as 0), except for the `minVisibleItems` prop. Due to this detail, we use the
// `minVisibleItems` prop to set the exact number of visible/overflown breadcrumbs.

describe("Breadcrumbs", () => {
    it("passes through props to the OverflowList", () => {
        const overflowListProps = mount(
            <Breadcrumbs
                className="breadcrumbs-class"
                collapseFrom={Boundary.END}
                items={[]}
                minVisibleItems={7}
                overflowListProps={{ className: "overflow-list-class", tagName: "article" }}
            />,
        )
            .find<IOverflowListProps<IBreadcrumbProps>>(OverflowList)
            .props();
        assert.equal(overflowListProps.className, `${Classes.BREADCRUMBS} overflow-list-class breadcrumbs-class`);
        assert.equal(overflowListProps.collapseFrom, Boundary.END);
        assert.equal(overflowListProps.minVisibleItems, 7);
        assert.equal(overflowListProps.tagName, "article");
    });

    it("makes the last breadcrumb current", () => {
        const breadcrumbs = mount(<Breadcrumbs items={ITEMS} minVisibleItems={ITEMS.length} />).find(Breadcrumb);
        assert.lengthOf(breadcrumbs, ITEMS.length);
        assert.isFalse(breadcrumbs.get(0).props.current);
        assert.isTrue(breadcrumbs.get(ITEMS.length - 1).props.current);
    });

    it("renders overflow indicator", () => {
        assert.lengthOf(
            mount(<Breadcrumbs items={ITEMS} minVisibleItems={1} />).find(`.${Classes.BREADCRUMBS_COLLAPSED}`),
            1,
        );
    });

    it("renders the correct overflow menu items", () => {
        const menuItems = mount(
            <Breadcrumbs items={ITEMS} minVisibleItems={1} popoverProps={{ isOpen: true, usePortal: false }} />,
        ).find(MenuItem);
        assert.lengthOf(menuItems, ITEMS.length - 1);
        assert.equal(menuItems.get(0).props.text, "2");
        assert.equal(menuItems.get(1).props.text, "1");
    });

    it("renders the correct overflow menu items when collapsing from END", () => {
        const menuItems = mount(
            <Breadcrumbs
                collapseFrom={Boundary.END}
                items={ITEMS}
                minVisibleItems={1}
                popoverProps={{ isOpen: true, usePortal: false }}
            />,
        ).find(MenuItem);
        assert.lengthOf(menuItems, ITEMS.length - 1);
        assert.equal(menuItems.get(0).props.text, "2");
        assert.equal(menuItems.get(1).props.text, "3");
    });

    it("disables menu item when it is not clickable", () => {
        const menuItems = mount(<Breadcrumbs items={ITEMS} popoverProps={{ isOpen: true, usePortal: false }} />).find(
            MenuItem,
        );
        assert.lengthOf(menuItems, ITEMS.length);
        assert.isTrue(menuItems.get(0).props.disabled);
    });

    it("calls currentBreadcrumbRenderer (only) for the current breadcrumb", () => {
        const spy = sinon.spy();
        mount(<Breadcrumbs currentBreadcrumbRenderer={spy} items={ITEMS} minVisibleItems={ITEMS.length} />);
        assert.isTrue(spy.calledOnce);
        assert.isTrue(spy.calledWith(ITEMS[ITEMS.length - 1]));
    });

    it("does not call breadcrumbRenderer for the current breadcrumb when there is a currentBreadcrumbRenderer", () => {
        const spy = sinon.spy();
        mount(
            <Breadcrumbs
                breadcrumbRenderer={spy}
                // tslint:disable-next-line:jsx-no-lambda
                currentBreadcrumbRenderer={() => undefined}
                items={ITEMS}
                minVisibleItems={ITEMS.length}
            />,
        );
        assert.equal(spy.callCount, ITEMS.length - 1);
        assert.isTrue(spy.neverCalledWith(ITEMS[ITEMS.length - 1]));
    });

    it("calls breadcrumbRenderer", () => {
        const spy = sinon.spy();
        mount(<Breadcrumbs breadcrumbRenderer={spy} items={ITEMS} minVisibleItems={ITEMS.length} />);
        assert.equal(spy.callCount, ITEMS.length);
    });
});
