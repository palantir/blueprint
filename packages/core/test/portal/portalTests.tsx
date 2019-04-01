/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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
        assert.lengthOf(document.getElementsByClassName(CLASS_TO_TEST), 1);
    });

    it("attaches contents to specified container", () => {
        const CLASS_TO_TEST = "bp-test-content";
        const container = document.createElement("div");
        document.body.appendChild(container);
        portal = mount(
            <Portal container={container}>
                <p className={CLASS_TO_TEST}>test</p>
            </Portal>,
        );
        assert.lengthOf(container.getElementsByClassName(CLASS_TO_TEST), 1);
        document.body.removeChild(container);
    });

    it("propagates className to portal element", () => {
        const CLASS_TO_TEST = "bp-test-klass";
        portal = mount(
            <Portal className={CLASS_TO_TEST}>
                <p>test</p>
            </Portal>,
        );

        const portalChild = document.querySelector(`.${Classes.PORTAL}.${CLASS_TO_TEST}`);
        assert.exists(portalChild);
    });

    it("updates className on portal element", () => {
        portal = mount(
            <Portal className="class-one">
                <p>test</p>
            </Portal>,
        );
        assert.exists(portal.find(".class-one"));
        portal.setProps({ className: "class-two" });
        assert.exists(portal.find(".class-two"));
    });

    it("respects blueprintPortalClassName on context", () => {
        const CLASS_TO_TEST = "bp-test-klass bp-other-class";
        portal = mount(
            <Portal>
                <p>test</p>
            </Portal>,
            { context: { blueprintPortalClassName: CLASS_TO_TEST } },
        );

        const portalElement = document.querySelector(`.${CLASS_TO_TEST.replace(" ", ".")}`);
        assert.isTrue(portalElement.classList.contains(Classes.PORTAL));
    });

    it("children mount before onChildrenMount invoked", done => {
        function spy() {
            // can't use `portal` in here as `mount()` has not finished, so query DOM directly
            assert.exists(document.querySelector("p"));
            done();
        }
        portal = mount(
            <Portal onChildrenMount={spy}>
                <p>test</p>
            </Portal>,
        );
    });
});
