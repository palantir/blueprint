/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";
import { mount, ReactWrapper } from "enzyme";
import * as React from "react";

import { Classes, IPortalProps, Portal } from "../../src";

describe("<Portal>", () => {

    let portal: ReactWrapper<IPortalProps, {}>;

    afterEach(() => {
        if (portal != null) {
            portal.unmount();
            portal = null;
        }
    });

    it("attaches contents to document.body", () => {
        const CLASS_TO_TEST = "bp-test-content";
        portal = mount(
            <Portal>
                <p className={CLASS_TO_TEST}>test</p>
            </Portal>,
        );

        assert.lengthOf(portal.find(`.${CLASS_TO_TEST}`), 0);
        assert.lengthOf(document.getElementsByClassName(CLASS_TO_TEST), 1);
    });

    it("propagates class names", () => {
        const CLASS_TO_TEST = "bp-test-klass";
        portal = mount(
            <Portal className={CLASS_TO_TEST}>
                <p>test</p>
            </Portal>,
        );

        const portalChild = document.querySelector(`.${CLASS_TO_TEST}`);
        assert.strictEqual(portalChild.parentElement.className, Classes.PORTAL);
    });

    it("respects blueprintPortalClass on context", () => {
        const CLASS_TO_TEST = "bp-test-klass";
        const CLASS_TO_TEST_2 = "bp-test-klass-2";
        portal = mount(
            <Portal>
                <p>test</p>
            </Portal>,
            {context: {blueprintPortalClass: CLASS_TO_TEST}},
        );

        const portalElement = document.querySelector(Classes.PORTAL);
        assert.include(portalElement.className, CLASS_TO_TEST);

        portal.setContext({blueprintPortalClass: CLASS_TO_TEST_2});

        const portalElement2 = document.querySelector(Classes.PORTAL);
        assert.include(portalElement2.className, CLASS_TO_TEST_2);
    });
});
