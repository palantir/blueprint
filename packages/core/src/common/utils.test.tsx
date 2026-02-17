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

import { Fragment } from "react/jsx-runtime";

import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from "@blueprintjs/test-commons/vitest";

import * as Utils from "./utils";

describe("Utils", () => {
    it("isFunction", () => {
        expect(Utils.isFunction(() => 3)).toBe(true);
        expect(Utils.isFunction(undefined)).toBe(false);
    });

    it("isReactNodeEmpty", () => {
        // empty nodes
        expect(Utils.isReactNodeEmpty(undefined), "undefined").toBe(true);
        expect(Utils.isReactNodeEmpty(null), "null").toBe(true);
        expect(Utils.isReactNodeEmpty(""), '""').toBe(true);
        expect(Utils.isReactNodeEmpty([]), "[]").toBe(true);
        expect(Utils.isReactNodeEmpty([undefined, null, false, ""]), "array").toBe(true);
        // not empty nodes
        expect(Utils.isReactNodeEmpty(0), "0").toBe(false);
        expect(Utils.isReactNodeEmpty("text"), "text").toBe(false);
        expect(Utils.isReactNodeEmpty(<div />), "<div />").toBe(false);
        expect(Utils.isReactNodeEmpty([null, <div key="div" />]), "array").toBe(false);
    });

    it("elementIsOrContains", () => {
        const child = document.createElement("span");
        const parent = document.createElement("div");
        const grandparent = document.createElement("div");

        parent.appendChild(child);
        grandparent.appendChild(parent);

        expect(Utils.elementIsOrContains(child, child)).toBe(true);
        expect(Utils.elementIsOrContains(parent, child)).toBe(true);
        expect(Utils.elementIsOrContains(grandparent, parent)).toBe(true);
        expect(Utils.elementIsOrContains(grandparent, child)).toBe(true);

        expect(Utils.elementIsOrContains(child, parent)).toBe(false);
        expect(Utils.elementIsOrContains(parent, grandparent)).toBe(false);
    });

    it("arrayLengthCompare", () => {
        expect(Utils.arrayLengthCompare([1, 2], [])).toBeGreaterThan(0);
        expect(Utils.arrayLengthCompare([1, 2], [1, 2])).toBe(0);
        expect(Utils.arrayLengthCompare([], [1, 2])).toBeLessThan(0);

        expect(Utils.arrayLengthCompare([1])).toBeGreaterThan(0);
        expect(Utils.arrayLengthCompare()).toBe(0);
        expect(Utils.arrayLengthCompare(undefined, [1])).toBeLessThan(0);
    });

    it("approxEqual", () => {
        const DEFAULT_EPSILON = 0.00001;
        expect(Utils.approxEqual(0, DEFAULT_EPSILON)).toBe(true);
        expect(Utils.approxEqual(-1 * DEFAULT_EPSILON, -2 * DEFAULT_EPSILON)).toBe(true);
        expect(Utils.approxEqual(10, 10 + DEFAULT_EPSILON + DEFAULT_EPSILON / 10)).toBe(false);
        expect(Utils.approxEqual(10, 10 - DEFAULT_EPSILON - DEFAULT_EPSILON / 10)).toBe(false);
    });

    it("clamp", () => {
        expect(Utils.clamp(10, 0, 20), "value between min/max").toBe(10);
        expect(Utils.clamp(0, 10, 20), "value below min").toBe(10);
        expect(Utils.clamp(40, 0, 20), "value above max").toBe(20);
        expect(() => Utils.clamp(0, 20, 10)).toThrow(/less than/);
    });

    it("countDecimalPlaces", () => {
        expect(Utils.countDecimalPlaces(1)).toBe(0);
        expect(Utils.countDecimalPlaces(0.11)).toBe(2);
        expect(Utils.countDecimalPlaces(-1.1111111111)).toBe(10);
        expect(Utils.countDecimalPlaces(1e-10)).toBe(10);
        expect(Utils.countDecimalPlaces(NaN)).toBe(0);
    });

    it("uniqueId", () => {
        const ns = "testNamespace";
        const otherNs = "otherNamespace";
        expect(Utils.uniqueId(ns)).toBe(`${ns}-0`);
        expect(Utils.uniqueId(ns)).toBe(`${ns}-1`);
        expect(Utils.uniqueId(ns)).toBe(`${ns}-2`);
        expect(Utils.uniqueId(otherNs)).toBe(`${otherNs}-0`);
    });

    // TODO: not sure how to test this. perhaps with the help of https://github.com/alexreardon/raf-stub?
    it.skip("throttleEvent");

    describe("ensureElement", () => {
        it("handles undefined/null", () => {
            expect(Utils.ensureElement(undefined)).toBeUndefined();
            expect(Utils.ensureElement(null)).toBeUndefined();
        });

        it("wraps strings & numbers", () => {
            expect(Utils.ensureElement("foo")?.type).toBe("span");
            expect(Utils.ensureElement(1234)?.type).toBe("span");
        });

        it("returns undefined for whitespace strings", () => {
            expect(Utils.ensureElement("   ")).toBeUndefined();
        });

        it("passes through JSX elements", () => {
            const el = <div>my element</div>;
            expect(Utils.ensureElement(el)).toBe(el);
        });

        // React 16 only
        if (Fragment !== undefined) {
            it("wraps JSX fragments in element", () => {
                const el = Utils.ensureElement(
                    <>
                        one <em>two</em> three
                    </>,
                );
                expect(el?.type).toBe("span");
            });
        }
    });

    describe("throttleReactEventCallback", () => {
        let callback: MockInstance;
        let fakeEvent: any; // cast as `any` to avoid having to set every required property on the event
        let throttledCallback: (event2: React.SyntheticEvent<any>, ...otherArgs2: any[]) => void;

        beforeEach(() => {
            callback = vi.fn();
            fakeEvent = { persist: vi.fn(), preventDefault: vi.fn() };
        });

        afterEach(() => {
            fakeEvent = undefined;
        });

        it("invokes event.persist() to prevent React from pooling before we can reference the event in rAF", () => {
            throttledCallback = Utils.throttleReactEventCallback(callback);
            throttledCallback(fakeEvent as any);
            expect(fakeEvent.persist).toHaveBeenCalledOnce();
        });

        it("can preventDefault", () => {
            throttledCallback = Utils.throttleReactEventCallback(callback, {
                preventDefault: true,
            });
            throttledCallback(fakeEvent as any);
            expect(fakeEvent.preventDefault).toHaveBeenCalledOnce();
        });

        // TODO: how to test this properly? perhaps with the help of https://github.com/alexreardon/raf-stub?
        it.skip("properly throttles callback using requestAnimationFrame");
    });
});
