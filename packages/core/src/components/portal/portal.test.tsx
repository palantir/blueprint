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

import { render, waitFor } from "@testing-library/react";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";
import { PortalProvider } from "../../context/portal/portalProvider";

import { Portal } from "./portal";

describe("<Portal>", () => {
    it("attaches contents to document.body", () => {
        const CLASS_TO_TEST = "bp-test-content";
        render(
            <Portal>
                <p className={CLASS_TO_TEST}>test</p>
            </Portal>,
        );
        expect(document.getElementsByClassName(CLASS_TO_TEST)).toHaveLength(1);
    });

    it("attaches contents to specified container", () => {
        const CLASS_TO_TEST = "bp-test-content";
        const container = document.createElement("div");
        document.body.appendChild(container);
        render(
            <Portal container={container}>
                <p className={CLASS_TO_TEST}>test</p>
            </Portal>,
        );
        expect(container.getElementsByClassName(CLASS_TO_TEST)).toHaveLength(1);
        document.body.removeChild(container);
    });

    it("propagates className to portal element", () => {
        const CLASS_TO_TEST = "bp-test-klass";
        render(
            <Portal className={CLASS_TO_TEST}>
                <p>test</p>
            </Portal>,
        );

        const portalChild = document.querySelector(`.${Classes.PORTAL}.${CLASS_TO_TEST}`);
        expect(portalChild).toBeInTheDocument();
    });

    it("updates className on portal element", () => {
        const { rerender } = render(
            <Portal className="class-one">
                <p>test</p>
            </Portal>,
        );
        expect(document.querySelector(`.${Classes.PORTAL}.class-one`)).toBeInTheDocument();
        rerender(
            <Portal className="class-two">
                <p>test</p>
            </Portal>,
        );
        expect(document.querySelector(`.${Classes.PORTAL}.class-two`)).toBeInTheDocument();
    });

    it("respects portalClassName on <PortalProvider> context", () => {
        const CLASS_TO_TEST = "bp-test-klass bp-other-class";
        render(
            <PortalProvider portalClassName={CLASS_TO_TEST}>
                <Portal>
                    <p>test</p>
                </Portal>
            </PortalProvider>,
        );

        const portalElement = document.querySelector(`.${CLASS_TO_TEST.replace(" ", ".")}`);
        expect(portalElement).not.toBeNull();
        expect(portalElement).toHaveClass(Classes.PORTAL);
    });

    it("does not crash when removing multiple classes from className", () => {
        const { rerender } = render(
            <Portal className="class-one class-two">
                <p>test</p>
            </Portal>,
        );
        rerender(
            <Portal className={undefined}>
                <p>test</p>
            </Portal>,
        );
        // no assertion necessary - will crash on incorrect code
    });

    it("does not crash when an empty string is provided for className", () => {
        const { rerender } = render(
            <Portal className="">
                <p>test</p>
            </Portal>,
        );
        rerender(
            <Portal className="class-one">
                <p>test</p>
            </Portal>,
        );
        // no assertion necessary - will crash on incorrect code
    });

    it("children mount before onChildrenMount invoked", async () => {
        const onChildrenMount = vi.fn(() => {
            expect(document.querySelector("p")).toBeInTheDocument();
        });
        render(
            <Portal onChildrenMount={onChildrenMount}>
                <p>test</p>
            </Portal>,
        );
        await waitFor(() => expect(onChildrenMount).toHaveBeenCalledOnce());
    });
});
