/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import { Classes, Portal } from "../../src";

describe("<Portal>", () => {
    it("attaches contents to document.body", () => {
        const CLASS_TO_TEST = "bp-test-content";
        const portal = mount(
            <Portal>
                <p className={CLASS_TO_TEST}>test</p>
            </Portal>,
        );

        assert.lengthOf(portal.find(`.${CLASS_TO_TEST}`), 0);
        assert.lengthOf(document.getElementsByClassName(CLASS_TO_TEST), 1);
    });

    it("propagates class names", () => {
        const CLASS_TO_TEST = "bp-test-klass";
        mount(
            <Portal className={CLASS_TO_TEST}>
                <p>test</p>
            </Portal>,
        );

        const portalChild = document.querySelector(`.${CLASS_TO_TEST}`);
        assert.strictEqual(portalChild.parentElement.className, Classes.PORTAL);
    });
});
