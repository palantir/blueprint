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
import sinon from "sinon";

import { Classes } from "../../src/common";
import { Boundary } from "../../src/common/boundary";
import { Breadcrumb, type BreadcrumbProps } from "../../src/components/breadcrumbs/breadcrumb";
import { Breadcrumbs } from "../../src/components/breadcrumbs/breadcrumbs";
import { MenuItem } from "../../src/components/menu/menuItem";
import { OverflowList, type OverflowListProps } from "../../src/components/overflow-list/overflowList";

const ITEMS: BreadcrumbProps[] = [{ text: "1" }, { text: "2" }, { text: "3" }];

describe("Breadcrumbs", () => {
    let containerElement: HTMLElement | undefined;

    beforeEach(() => {
        containerElement = document.createElement("div");
        document.body.appendChild(containerElement);
    });
    afterEach(() => {
        containerElement?.remove();
    });

    it("passes through props to the OverflowList", () => {
        const wrapper = mount(
            <Breadcrumbs
                className="breadcrumbs-class"
                collapseFrom={Boundary.END}
                items={[]}
                minVisibleItems={7}
                overflowListProps={{ className: "overflow-list-class", tagName: "article" }}
            />,
            { attachTo: containerElement },
        );
        const overflowListProps = wrapper.find<OverflowListProps<BreadcrumbProps>>(OverflowList).props();
        assert.equal(overflowListProps.className, `${Classes.BREADCRUMBS} overflow-list-class breadcrumbs-class`);
        assert.equal(overflowListProps.collapseFrom, Boundary.END);
        assert.equal(overflowListProps.minVisibleItems, 7);
        assert.equal(overflowListProps.tagName, "article");
    });

    it("makes the last breadcrumb current", () => {
        const wrapper = mount(<Breadcrumbs items={ITEMS} minVisibleItems={ITEMS.length} />, {
            attachTo: containerElement,
        });
        const breadcrumbs = wrapper.find(Breadcrumb);
        assert.lengthOf(breadcrumbs, ITEMS.length);
        assert.isFalse(breadcrumbs.get(0).props.current);
        assert.isTrue(breadcrumbs.get(ITEMS.length - 1).props.current);
    });

    it("renders overflow/collapsed indicator when items don't fit", () => {
        const wrapper = mount(
            // 70px is just enough to show one item
            <div style={{ width: 70 }}>
                <Breadcrumbs items={ITEMS} />
            </div>,
            { attachTo: containerElement },
        );
        assert.lengthOf(wrapper.find(`.${Classes.BREADCRUMBS_COLLAPSED}`), 1);
    });

    it("renders the correct overflow menu items", () => {
        const wrapper = mount(
            // 70px is just enough to show one item
            <div style={{ width: 70 }}>
                <Breadcrumbs items={ITEMS} popoverProps={{ isOpen: true, usePortal: false }} />
            </div>,
            { attachTo: containerElement },
        );
        const menuItems = wrapper.find(MenuItem);
        assert.lengthOf(menuItems, ITEMS.length - 1);
        assert.equal(menuItems.get(0).props.text, "2");
        assert.equal(menuItems.get(1).props.text, "1");
    });

    it("renders the correct overflow menu items when collapsing from END", () => {
        const wrapper = mount(
            // 70px is just enough to show one item
            <div style={{ width: 70 }}>
                <Breadcrumbs
                    collapseFrom={Boundary.END}
                    items={ITEMS}
                    popoverProps={{ isOpen: true, usePortal: false }}
                />
            </div>,
            { attachTo: containerElement },
        );
        const menuItems = wrapper.find(MenuItem);
        assert.lengthOf(menuItems, ITEMS.length - 1);
        assert.equal(menuItems.get(0).props.text, "2");
        assert.equal(menuItems.get(1).props.text, "3");
    });

    it("disables menu item when it is not clickable", () => {
        const wrapper = mount(
            // 10px is too small to show any items
            <div style={{ width: 10 }}>
                <Breadcrumbs items={ITEMS} popoverProps={{ isOpen: true, usePortal: false }} />
            </div>,
            { attachTo: containerElement },
        );
        const menuItems = wrapper.find(MenuItem);
        assert.lengthOf(menuItems, ITEMS.length);
        assert.isTrue(menuItems.get(0).props.disabled);
    });

    it("calls currentBreadcrumbRenderer (only) for the current breadcrumb", () => {
        const spy = sinon.spy();
        mount(<Breadcrumbs currentBreadcrumbRenderer={spy} items={ITEMS} minVisibleItems={ITEMS.length} />, {
            attachTo: containerElement,
        });
        assert.isTrue(spy.calledOnce);
        assert.isTrue(spy.calledWith(ITEMS[ITEMS.length - 1]));
    });

    it("does not call breadcrumbRenderer for the current breadcrumb when there is a currentBreadcrumbRenderer", () => {
        const spy = sinon.spy();
        mount(
            <Breadcrumbs
                breadcrumbRenderer={spy}
                currentBreadcrumbRenderer={() => <div />}
                items={ITEMS}
                minVisibleItems={ITEMS.length}
            />,
            { attachTo: containerElement },
        );
        assert.equal(spy.callCount, ITEMS.length - 1);
        assert.isTrue(spy.neverCalledWith(ITEMS[ITEMS.length - 1]));
    });

    it("calls breadcrumbRenderer", () => {
        const spy = sinon.spy();
        mount(<Breadcrumbs breadcrumbRenderer={spy} items={ITEMS} minVisibleItems={ITEMS.length} />, {
            attachTo: containerElement,
        });
        assert.equal(spy.callCount, ITEMS.length);
    });
});
