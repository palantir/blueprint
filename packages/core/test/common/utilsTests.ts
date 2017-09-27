/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";
import * as React from "react";
import * as Utils from "../../src/common/utils";

describe("Utils", () => {
    it("isFunction", () => {
        assert.isTrue(Utils.isFunction(() => 3));
        assert.isFalse(Utils.isFunction(undefined));
    });

    it("safeInvoke", () => {
        assert.doesNotThrow(() => Utils.safeInvoke(undefined, 1, "2", true, 4));

        // try the max number of args (4)
        const callback = sinon.spy();
        Utils.safeInvoke(callback, 1, "2", true, 4);
        assert.isTrue(callback.firstCall.calledWith(1, "2", true, 4));
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
    });

    // TODO: not sure how to test this. perhaps with the help of https://github.com/alexreardon/raf-stub?
    it.skip("throttleEvent");

    describe("throttleReactEventCallback", () => {
        let callback: Sinon.SinonSpy;
        let fakeEvent: any; // cast as `any` to avoid having to set every required property on the event
        let throttledCallback: (event2: React.SyntheticEvent<any>, ...otherArgs2: any[]) => void;

        beforeEach(() => {
            callback = sinon.spy();
            fakeEvent = { persist: sinon.spy(), preventDefault: sinon.spy() };
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
