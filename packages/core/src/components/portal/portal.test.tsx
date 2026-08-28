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

import { render } from "@testing-library/react";
import { mount, type ReactWrapper } from "enzyme";

import { afterEach, assert, beforeEach, describe, it } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";
import { PortalProvider } from "../../context/portal/portalProvider";
import { type BlueprintThemeColorScheme, BlueprintThemeProvider } from "../../theme/blueprintThemeProvider";

import { Portal, type PortalProps } from "./portal";

interface ThemedPortalProps {
    colorScheme: BlueprintThemeColorScheme;
}

const ThemedPortal = ({ colorScheme }: ThemedPortalProps) => (
    <BlueprintThemeProvider colorScheme={colorScheme}>
        <Portal>
            <p>themed portal</p>
        </Portal>
    </BlueprintThemeProvider>
);

describe("<Portal>", () => {
    let rootElement: HTMLElement | undefined;
    let portal: ReactWrapper<PortalProps> | undefined;
    let unmountThemedPortal: (() => void) | undefined;

    beforeEach(() => {
        rootElement = document.createElement("div");
        document.body.appendChild(rootElement);
    });
    afterEach(() => {
        portal?.unmount();
        portal = undefined;
        unmountThemedPortal?.();
        unmountThemedPortal = undefined;
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

    it("preserves the nearest Blueprint theme scope and updates its scheme without replacing the portal root", () => {
        document.body.classList.add(Classes.DARK);
        try {
            const { rerender, unmount } = render(<ThemedPortal colorScheme="dark" />, { container: rootElement });
            unmountThemedPortal = unmount;

            const providerElement = rootElement?.querySelector<HTMLElement>("[data-bp-theme]");
            const portalElement = document.body.querySelector<HTMLElement>(`.${Classes.PORTAL}[data-bp-theme]`);
            const scopeId = providerElement?.dataset.bpTheme;

            assert.isDefined(scopeId);
            assert.equal(portalElement?.dataset.bpTheme, scopeId);
            assert.equal(portalElement?.dataset.bpColorScheme, "dark");
            assert.isFalse(portalElement?.classList.contains("bp-next"));
            assert.isTrue(portalElement?.classList.contains(Classes.DARK));

            rerender(<ThemedPortal colorScheme="light" />);

            const updatedProviderElement = rootElement?.querySelector<HTMLElement>("[data-bp-theme]");
            const updatedPortalElement = document.body.querySelector<HTMLElement>(`.${Classes.PORTAL}[data-bp-theme]`);
            assert.strictEqual(updatedPortalElement, portalElement);
            assert.equal(updatedProviderElement?.dataset.bpColorScheme, "light");
            assert.isFalse(updatedProviderElement?.classList.contains(Classes.DARK));
            assert.equal(updatedPortalElement?.dataset.bpTheme, scopeId);
            assert.equal(updatedPortalElement?.dataset.bpColorScheme, "light");
            assert.isFalse(updatedPortalElement?.classList.contains(Classes.DARK));
        } finally {
            document.body.classList.remove(Classes.DARK);
        }
    });

    it("preserves caller-owned bp-next classes while the provider scheme changes", () => {
        const { rerender, unmount } = render(
            <BlueprintThemeProvider colorScheme="dark">
                <Portal className="bp-next portal-class-source">
                    <p>portal class source</p>
                </Portal>
                <PortalProvider portalClassName="bp-next provider-class-source">
                    <Portal>
                        <p>provider class source</p>
                    </Portal>
                </PortalProvider>
            </BlueprintThemeProvider>,
            { container: rootElement },
        );
        unmountThemedPortal = unmount;

        rerender(
            <BlueprintThemeProvider colorScheme="light">
                <Portal className="bp-next portal-class-source">
                    <p>portal class source</p>
                </Portal>
                <PortalProvider portalClassName="bp-next provider-class-source">
                    <Portal>
                        <p>provider class source</p>
                    </Portal>
                </PortalProvider>
            </BlueprintThemeProvider>,
        );

        assert.isTrue(document.body.querySelector(".portal-class-source")?.classList.contains("bp-next"));
        assert.isTrue(document.body.querySelector(".provider-class-source")?.classList.contains("bp-next"));
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

    it("children mount before onChildrenMount invoked", () =>
        new Promise<void>(done => {
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
        }));
});
