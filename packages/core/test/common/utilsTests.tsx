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
import * as React from "react";
import { SinonSpy, spy } from "sinon";

import * as Utils from "../../src/common/utils";

describe("Utils", () => {
    it("isFunction", () => {
        assert.isTrue(Utils.isFunction(() => 3));
        assert.isFalse(Utils.isFunction(undefined));
    });

    it("isReactNodeEmpty", () => {
        // empty nodes
        assert.isTrue(Utils.isReactNodeEmpty(undefined), "undefined");
        assert.isTrue(Utils.isReactNodeEmpty(null), "null");
        assert.isTrue(Utils.isReactNodeEmpty(""), '""');
        assert.isTrue(Utils.isReactNodeEmpty([]), "[]");
        assert.isTrue(Utils.isReactNodeEmpty([undefined, null, false, ""]), "array");
        // not empty nodes
        assert.isFalse(Utils.isReactNodeEmpty(0), "0");
        assert.isFalse(Utils.isReactNodeEmpty("text"), "text");
        assert.isFalse(Utils.isReactNodeEmpty(<div />), "<div />");
        assert.isFalse(Utils.isReactNodeEmpty([null, <div key="div" />]), "array");
    });

    it("safeInvoke", () => {
        assert.doesNotThrow(() => Utils.safeInvoke(undefined, 1, "2", true, 4));

        // try the max number of args (4)
        const callback = spy();
        Utils.safeInvoke(callback, 1, "2", true, 4);
        assert.isTrue(callback.firstCall.calledWith(1, "2", true, 4));
    });

    it("safeInvokeOrValue", () => {
        assert.doesNotThrow(() => Utils.safeInvokeOrValue(undefined, 1, "2", true, 4));

        // try the max number of args (4)
        const callback = spy();
        Utils.safeInvokeOrValue(callback, 1, "2", true, 4);
        assert.isTrue(callback.firstCall.calledWith(1, "2", true, 4));

        // try passing a value
        const value = "3";
        const result = Utils.safeInvokeOrValue(value);
        assert.strictEqual(result, value);
    });

    it("elementIsOrContains", () => {
        const child = document.createElement("span");
        const parent = document.createElement("div");
        const grandparent = document.createElement("div");

        parent.appendChild(child);
        grandparent.appendChild(parent);

        assert.isTrue(Utils.elementIsOrContains(child, child));
        assert.isTrue(Utils.elementIsOrContains(parent, child));
        assert.isTrue(Utils.elementIsOrContains(grandparent, parent));
        assert.isTrue(Utils.elementIsOrContains(grandparent, child));

        assert.isFalse(Utils.elementIsOrContains(child, parent));
        assert.isFalse(Utils.elementIsOrContains(parent, grandparent));
    });

    it("arrayLengthCompare", () => {
        assert.isAbove(Utils.arrayLengthCompare([1, 2], []), 0);
        assert.strictEqual(Utils.arrayLengthCompare([1, 2], [1, 2]), 0);
        assert.isBelow(Utils.arrayLengthCompare([], [1, 2]), 0);

        assert.isAbove(Utils.arrayLengthCompare([1]), 0);
        assert.strictEqual(Utils.arrayLengthCompare(), 0);
        assert.isBelow(Utils.arrayLengthCompare(undefined, [1]), 0);
    });

    it("approxEqual", () => {
        const DEFAULT_EPSILON = 0.00001;
        assert.isTrue(Utils.approxEqual(0, DEFAULT_EPSILON));
        assert.isTrue(Utils.approxEqual(-1 * DEFAULT_EPSILON, -2 * DEFAULT_EPSILON));
        assert.isFalse(Utils.approxEqual(10, 10 + DEFAULT_EPSILON + DEFAULT_EPSILON / 10));
        assert.isFalse(Utils.approxEqual(10, 10 - DEFAULT_EPSILON - DEFAULT_EPSILON / 10));
    });

    it("clamp", () => {
        assert.strictEqual(Utils.clamp(undefined, 0, 20), undefined, "value undefined");
        assert.strictEqual(Utils.clamp(null, 0, 20), null, "value null");
        assert.strictEqual(Utils.clamp(10, 0, 20), 10, "value between min/max");
        assert.strictEqual(Utils.clamp(0, 10, 20), 10, "value below min");
        assert.strictEqual(Utils.clamp(40, 0, 20), 20, "value above max");
        assert.throws(() => Utils.clamp(0, 20, 10), /less than/);
    });

    it("countDecimalPlaces", () => {
        assert.equal(Utils.countDecimalPlaces(1), 0);
        assert.equal(Utils.countDecimalPlaces(0.11), 2);
        assert.equal(Utils.countDecimalPlaces(-1.1111111111), 10);
        assert.equal(Utils.countDecimalPlaces(1e-10), 10);
        assert.equal(Utils.countDecimalPlaces(NaN), 0);
    });

    // TODO: not sure how to test this. perhaps with the help of https://github.com/alexreardon/raf-stub?
    it.skip("throttleEvent");

    describe("ensureElement", () => {
        it("handles undefined/null", () => {
            assert.isUndefined(Utils.ensureElement(undefined));
            assert.isUndefined(Utils.ensureElement(null));
        });

        it("wraps strings & numbers", () => {
            assert.strictEqual(Utils.ensureElement("foo").type, "span");
            assert.strictEqual(Utils.ensureElement(1234).type, "span");
        });

        it("returns undefined for whitespace strings", () => {
            assert.isUndefined(Utils.ensureElement("   "));
        });

        it("passes through JSX elements", () => {
            const el = <div>my element</div>;
            assert.strictEqual(Utils.ensureElement(el), el);
        });

        // React 16 only
        if (React.Fragment !== undefined) {
            it("wraps JSX fragments in element", () => {
                const el = Utils.ensureElement(
                    <>
                        one <em>two</em> three
                    </>,
                );
                assert.strictEqual(el.type, "span");
            });
        }
    });

    describe("throttleReactEventCallback", () => {
        let callback: SinonSpy;
        let fakeEvent: any; // cast as `any` to avoid having to set every required property on the event
        let throttledCallback: (event2: React.SyntheticEvent<any>, ...otherArgs2: any[]) => void;

        beforeEach(() => {
            callback = spy();
            fakeEvent = { persist: spy(), preventDefault: spy() };
        });

        afterEach(() => {
            callback = undefined;
            fakeEvent = undefined;
        });

        it("invokes event.persist() to prevent React from pooling before we can reference the event in rAF", () => {
            throttledCallback = Utils.throttleReactEventCallback(callback);
            throttledCallback(fakeEvent as any);
            assert.isTrue(fakeEvent.persist.calledOnce);
        });

        it("can preventDefault", () => {
            throttledCallback = Utils.throttleReactEventCallback(callback, { preventDefault: true });
            throttledCallback(fakeEvent as any);
            assert.isTrue(fakeEvent.preventDefault.calledOnce);
        });

        // TODO: how to test this properly? perhaps with the help of https://github.com/alexreardon/raf-stub?
        it.skip("properly throttles callback using requestAnimationFrame");
    });
});
