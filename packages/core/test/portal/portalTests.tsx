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
import { mount, type ReactWrapper } from "enzyme";
import * as React from "react";

import { Classes, Portal, type PortalProps, PortalProvider } from "../../src";

describe("<Portal>", () => {
    let rootElement: HTMLElement | undefined;
    let portal: ReactWrapper<PortalProps>;

    beforeEach(() => {
        rootElement = document.createElement("div");
        document.body.appendChild(rootElement);
    });
    afterEach(() => {
        portal?.unmount();
        rootElement?.remove();
    });

    it("attaches contents to document.body", () => {
        const CLASS_TO_TEST = "bp-test-content";
        portal = mount(
            <Portal>
                <p className={CLASS_TO_TEST}>test</p>
            </Portal>,
            { attachTo: rootElement },
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
            { attachTo: rootElement },
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
            { attachTo: rootElement },
        );

        const portalChild = document.querySelector(`.${Classes.PORTAL}.${CLASS_TO_TEST}`);
        assert.exists(portalChild);
    });

    it("updates className on portal element", () => {
        portal = mount(
            <Portal className="class-one">
                <p>test</p>
            </Portal>,
            { attachTo: rootElement },
        );
        assert.exists(portal.find(".class-one"));
        portal.setProps({ className: "class-two" });
        assert.exists(portal.find(".class-two"));
    });

    it("respects portalClassName on <PortalProvider> context", () => {
        const CLASS_TO_TEST = "bp-test-klass bp-other-class";
        portal = mount(
            <PortalProvider portalClassName={CLASS_TO_TEST}>
                <Portal>
                    <p>test</p>
                </Portal>
            </PortalProvider>,
            { attachTo: rootElement },
        );

        const portalElement = document.querySelector(`.${CLASS_TO_TEST.replace(" ", ".")}`);
        assert.isTrue(portalElement?.classList.contains(Classes.PORTAL));
    });

    it("does not crash when removing multiple classes from className", () => {
        portal = mount(
            <Portal className="class-one class-two">
                <p>test</p>
            </Portal>,
            { attachTo: rootElement },
        );
        portal.setProps({ className: undefined });
        // no assertion necessary - will crash on incorrect code
    });

    it("does not crash when an empty string is provided for className", () => {
        portal = mount(
            <Portal className="">
                <p>test</p>
            </Portal>,
            { attachTo: rootElement },
        );
        portal.setProps({ className: "class-one" });
        // no assertion necessary - will crash on incorrect code
    });

    it("children mount before onChildrenMount invoked", done => {
        function handleChildrenMount() {
            // can't use `portal` in here as `mount()` has not finished, so we query DOM directly instead
            assert.exists(document.querySelector("p"));
            done();
        }
        portal = mount(
            <Portal onChildrenMount={handleChildrenMount}>
                <p>test</p>
            </Portal>,
            { attachTo: rootElement },
        );
    });

    // TODO: remove legacy context support in Blueprint v6.0
    it("respects blueprintPortalClassName on legacy context", () => {
        const CLASS_TO_TEST = "bp-test-klass bp-other-class";
        portal = mount(
            <Portal>
                <p>test</p>
            </Portal>,
            { attachTo: rootElement, context: { blueprintPortalClassName: CLASS_TO_TEST } },
        );

        const portalElement = document.querySelector(`.${CLASS_TO_TEST.replace(" ", ".")}`);
        assert.isTrue(portalElement?.classList.contains(Classes.PORTAL));
    });
});
