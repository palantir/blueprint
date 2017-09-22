/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert, expect } from "chai";
import * as Utils from "../../src/common/utils";
import { IKeyBlacklist, IKeyWhitelist } from "../../src/common/utils";

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

    describe("arraysEqual", () => {
        describe("no compare function provided", () => {
            describe("should return true if the arrays are shallowly equal", () => {
                runTest(true, undefined, undefined);
                runTest(true, undefined, null);
                runTest(true, [3, "1", true], [3, "1", true]);
            });

            describe("should return false if the arrays are not shallowly equal", () => {
                runTest(false, null, [3]);
                runTest(false, [3, 1, 2], [3, 1]);
                runTest(false, [{ x: 1 }], [{ x: 1 }]);
            });
        });

        describe("compare function provided", () => {
            const COMPARE_FN = (a: any, b: any) => a.x === b.x;

            describe("should return true if the arrays are equal using a custom compare function", () => {
                runTest(true, undefined, undefined, COMPARE_FN);
                runTest(true, undefined, null, COMPARE_FN);
                runTest(true, [{ x: 1 }, { x: 2 }], [{ x: 1 }, { x: 2 }], COMPARE_FN);
            });

            describe("should return false if the arrays are not equal using custom compare function", () => {
                runTest(false, null, [], COMPARE_FN);
                runTest(false, [{ x: 1 }, {}], [{ x: 1 }, { x: 2 }], COMPARE_FN);
            });
        });

        function runTest(expectedResult: boolean, a: any, b: any, compareFn?: (a: any, b: any) => boolean) {
            it(getCompareTestDescription(a, b), () => {
                expect(Utils.arraysEqual(a, b, compareFn)).to.equal(expectedResult);
            });
        }
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

    describe("shallowCompareKeys", () => {
        describe("with `keys` defined as whitelist", () => {
            describe("returns true if only the specified values are shallowly equal", () => {
                runTest(true, { a: 1 }, { a: 1 }, wl(["a", "b", "c", "d"]));
                runTest(true, { a: 1, b: [1, 2, 3], c: "3" }, { b: [1, 2, 3], a: 1, c: "3" }, wl(["a", "c"]));
                runTest(true, { a: 1, b: "2", c: { a: 1 } }, { a: 1, b: "2", c: { a: 1 } }, wl(["a", "b"]));
            });

            describe("returns false if any specified values are not shallowly equal", () => {
                runTest(false, { a: [1, "2", true] }, { a: [1, "2", true] }, wl(["a"]));
                runTest(false, { a: 1, b: "2", c: { a: 1 } }, { a: 1, b: "2", c: { a: 1 } }, wl(["a", "b", "c"]));
                runTest(false, { a: 1, c: { a: 1 } }, { a: 1, b: "2" }, wl(["a", "b"]));
            });

            describe("edge cases that return true", () => {
                runTest(true, undefined, null, wl([]));
                runTest(true, undefined, undefined, wl(["a"]));
                runTest(true, null, null, wl(["a"]));
                runTest(true, {}, {}, wl(["a"]));
            });

            describe("edge cases that return false", () => {
                runTest(false, {}, undefined, wl([]));
                runTest(false, {}, [], wl([]));
                runTest(false, [], [], wl([]));
            });

            function runTest(
                expectedResult: boolean,
                a: any,
                b: any,
                keys: IKeyBlacklist<IKeys> | IKeyWhitelist<IKeys>,
            ) {
                it(getCompareTestDescription(a, b), () => {
                    expect(Utils.shallowCompareKeys(a, b, keys)).to.equal(expectedResult);
                });
            }
        });

        describe("with `keys` defined as blacklist", () => {
            describe("returns true if only the specified values are shallowly equal", () => {
                runTest(true, { a: 1 }, { a: 1 }, bl(["b", "c", "d"]));
                runTest(true, { a: 1, b: [1, 2, 3], c: "3" }, { b: [1, 2, 3], a: 1, c: "3" }, bl(["b"]));
                runTest(true, { a: 1, b: "2", c: { a: 1 } }, { a: 1, b: "2", c: { a: 1 } }, bl(["c"]));
            });

            describe("returns false if any specified values are not shallowly equal", () => {
                runTest(false, { a: [1, "2", true] }, { a: [1, "2", true] }, bl(["b, c"]));
                runTest(false, { a: 1, b: "2", c: { a: 1 } }, { a: 1, b: "2", c: { a: 1 } }, bl(["a", "b", "d"]));
                runTest(false, { a: 1, c: { a: 1 } }, { a: 1, b: "2" }, bl(["c"]));
            });

            describe("edge cases that return true", () => {
                runTest(true, undefined, null, bl([]));
                runTest(true, undefined, undefined, bl(["a"]));
                runTest(true, null, null, bl(["a"]));
                runTest(true, {}, {}, bl(["a"]));
            });

            describe("edge cases that return false", () => {
                runTest(false, {}, undefined, bl([]));
                runTest(false, {}, [], bl([]));
                runTest(false, [], [], bl([]));
            });

            function runTest(
                expectedResult: boolean,
                a: any,
                b: any,
                keys: IKeyBlacklist<IKeys> | IKeyWhitelist<IKeys>,
            ) {
                it(getCompareTestDescription(a, b), () => {
                    expect(Utils.shallowCompareKeys(a, b, keys)).to.equal(expectedResult);
                });
            }
        });

        describe("with `keys` not defined", () => {
            describe("returns true if values are shallowly equal", () => {
                runTest(true, { a: 1, b: "2", c: true }, { a: 1, b: "2", c: true });
                runTest(true, undefined, undefined);
                runTest(true, null, undefined);
            });

            describe("returns false if values are not shallowly equal", () => {
                runTest(false, undefined, {});
                runTest(false, null, {});
                runTest(false, {}, []);
                runTest(false, { a: 1, b: "2", c: { a: 1 } }, { a: 1, b: "2", c: { a: 1 } });
            });

            describe("returns false if keys are different", () => {
                runTest(false, {}, { a: 1 });
                runTest(false, { a: 1, b: "2" }, { b: "2" });
                runTest(false, { a: 1, b: "2", c: true }, { b: "2", c: true, d: 3 });
            });

            describe("returns true if same deeply-comparable instance is reused in both objects", () => {
                const deeplyComparableThing1 = { a: 1 };
                const deeplyComparableThing2 = [1, "2", true];
                runTest(true, { a: 1, b: deeplyComparableThing1 }, { a: 1, b: deeplyComparableThing1 });
                runTest(true, { a: 1, b: deeplyComparableThing2 }, { a: 1, b: deeplyComparableThing2 });
            });

            function runTest(expectedResult: boolean, a: any, b: any) {
                it(getCompareTestDescription(a, b), () => {
                    expect(Utils.shallowCompareKeys(a, b)).to.equal(expectedResult);
                });
            }
        });
    });

    describe("deepCompareKeys", () => {
        // tslint:disable:max-classes-per-file
        class DVD {
            public constructor() {
                /* Empty */
            }
        }

        class VHSTape {
            public constructor() {
                /* Empty */
            }
        }
        // tslint:enable:max-classes-per-file

        describe("with `keys` defined", () => {
            describe("returns true if only the specified values are deeply equal", () => {
                const customInstance1 = new DVD();
                const customInstance2 = new DVD();

                runTest(true, { a: 1 }, { a: 1 }, ["a", "b", "c", "d"]);
                runTest(true, { a: customInstance1 }, { a: customInstance2 }, ["a"]);
                runTest(true, { a: 1, b: [1, 2, 3], c: "3" }, { b: [1, 2, 3], a: 1, c: "3" }, ["b", "c"]);
                runTest(true, { a: 1, b: "2", c: { a: 1 } }, { a: 1, b: "2", c: { a: 1 } }, ["b", "c"]);
            });

            describe("returns false if any specified values are not deeply equal", () => {
                const customInstance1 = new DVD();
                const customInstance2 = new VHSTape();

                runTest(false, { a: [1, "2", true] }, { a: [1, "2", false] }, ["a"]);
                runTest(false, { a: customInstance1 }, { a: customInstance2 }, ["a"]);
                runTest(false, { a: 1, b: "2", c: { a: 1 } }, { a: 1, b: "2", c: { a: 2 } }, ["a", "b", "c"]);
            });

            describe("edge cases that return true", () => {
                runTest(true, undefined, null, []);
                runTest(true, undefined, undefined, ["a"]);
                runTest(true, null, null, ["a"]);
                runTest(true, {}, {}, ["a"]);
            });

            describe("edge cases that return false", () => {
                runTest(false, {}, undefined, []);
                runTest(false, {}, [], []);
            });

            function runTest(expectedResult: boolean, a: any, b: any, keys: string[]) {
                it(getCompareTestDescription(a, b), () => {
                    expect(Utils.deepCompareKeys(a, b, keys)).to.equal(expectedResult);
                });
            }
        });

        describe("with `keys` not defined", () => {
            describe("returns true if values are deeply equal", () => {
                const customInstance1 = new DVD();
                const customInstance2 = new DVD();

                runTest(true, { a: 1, b: "2", c: true }, { a: 1, b: "2", c: true });
                runTest(true, { a: 1, b: "2", c: { a: 1, b: "2" } }, { a: 1, b: "2", c: { a: 1, b: "2" } });
                runTest(true, [1, "2", true], [1, "2", true]);
                runTest(true, 1, 1);
                runTest(true, customInstance1, customInstance2);
                runTest(true, "2", "2");
                runTest(true, undefined, undefined);
                runTest(true, null, undefined);
            });

            describe("returns false if values are not deeply equal", () => {
                const customInstance1 = new DVD();
                const customInstance2 = new VHSTape();

                runTest(false, undefined, {});
                runTest(false, null, {});
                runTest(false, {}, []);
                runTest(false, { a: 1, b: "2", c: { a: 1 } }, { a: 1, b: "2", c: { a: "1" } });
                runTest(false, customInstance1, customInstance2);
            });

            describe("returns false if keys are different", () => {
                runTest(false, {}, { a: 1 });
                runTest(false, { a: 1, b: "2" }, { b: "2" });
                runTest(false, { a: 1, b: "2", c: true }, { b: "2", c: true, d: 3 });
            });

            describe("returns true if same deeply-comparable instance is reused in both objects", () => {
                const deeplyComparableThing1 = { a: 1 };
                const deeplyComparableThing2 = [1, "2", true];
                runTest(true, { a: 1, b: deeplyComparableThing1 }, { a: 1, b: deeplyComparableThing1 });
                runTest(true, { a: 1, b: deeplyComparableThing2 }, { a: 1, b: deeplyComparableThing2 });
            });

            function runTest(expectedResult: boolean, a: any, b: any) {
                it(getCompareTestDescription(a, b), () => {
                    expect(Utils.deepCompareKeys(a, b)).to.equal(expectedResult);
                });
            }
        });
    });

    describe("getShallowUnequalKeyValues", () => {
        describe("with `keys` defined as whitelist", () => {
            describe("returns empty array if the specified values are shallowly equal", () => {
                runTest([], { a: 1, b: [1, 2, 3], c: "3" }, { b: [1, 2, 3], a: 1, c: "3" }, wl(["a", "c"]));
            });

            describe("returns unequal key/values if any specified values are not shallowly equal", () => {
                // identical objects, but different instances
                runTest(
                    [{ key: "a", valueA: [1, "2", true], valueB: [1, "2", true] }],
                    { a: [1, "2", true] },
                    { a: [1, "2", true] },
                    wl(["a"]),
                );
                // different primitive-type values
                runTest([{ key: "a", valueA: 1, valueB: 2 }], { a: 1 }, { a: 2 }, wl(["a"]));
            });
        });

        describe("with `keys` defined as blacklist", () => {
            describe("returns empty array if the specified values are shallowly equal", () => {
                runTest([], { a: 1, b: [1, 2, 3], c: "3" }, { b: [1, 2, 3], a: 1, c: "3" }, bl(["b"]));
            });

            describe("returns unequal keys/values if any specified values are not shallowly equal", () => {
                runTest(
                    [{ key: "a", valueA: [1, "2", true], valueB: [1, "2", true] }],
                    { a: [1, "2", true] },
                    { a: [1, "2", true] },
                    bl(["b", "c"]),
                );
                runTest([{ key: "a", valueA: 1, valueB: 2 }], { a: 1 }, { a: 2 }, bl(["b"]));
            });
        });

        describe("with `keys` not defined", () => {
            describe("returns empty array if values are shallowly equal", () => {
                runTest([], { a: 1, b: "2", c: true }, { a: 1, b: "2", c: true });
                runTest([], undefined, undefined);
                runTest([], null, undefined);
            });

            describe("returns unequal key/values if any specified values are not shallowly equal", () => {
                runTest([{ key: "a", valueA: 1, valueB: 2 }], { a: 1 }, { a: 2 });
            });
        });

        function runTest(expectedResult: any[], a: any, b: any, keys?: IKeyBlacklist<IKeys> | IKeyWhitelist<IKeys>) {
            it(getCompareTestDescription(a, b, keys), () => {
                expect(Utils.getShallowUnequalKeyValues(a, b, keys)).to.deep.equal(expectedResult);
            });
        }
    });

    describe("getDeepUnequalKeyValues", () => {
        describe("with `keys` defined", () => {
            describe("returns empty array if only the specified values are deeply equal", () => {
                runTest([], { a: 1, b: [1, 2, 3], c: "3" }, { b: [1, 2, 3], a: 1, c: "3" }, ["b", "c"]);
            });

            describe("returns unequal key/values if any specified values are not deeply equal", () => {
                runTest(
                    [{ key: "a", valueA: 2, valueB: 1 }, { key: "b", valueA: [2, 3, 4], valueB: [1, 2, 3] }],
                    { a: 2, b: [2, 3, 4], c: "3" },
                    { b: [1, 2, 3], a: 1, c: "3" },
                    ["a", "b"],
                );
            });
        });

        describe("with `keys` not defined", () => {
            describe("returns empty arrau if values are deeply equal", () => {
                runTest([], { a: 1, b: "2", c: { a: 1, b: "2" } }, { a: 1, b: "2", c: { a: 1, b: "2" } });
            });

            describe("returns unequal key/values if values are not deeply equal", () => {
                runTest(
                    [{ key: "a", valueA: [1, "2", true], valueB: [1, "2", false] }],
                    { a: [1, "2", true] },
                    { a: [1, "2", false] },
                );
            });
        });

        function runTest(expectedResult: any[], a: any, b: any, keys?: string[]) {
            it(getCompareTestDescription(a, b, keys), () => {
                expect(Utils.getDeepUnequalKeyValues(a, b, keys)).to.deep.equal(expectedResult);
            });
        }
    });
});

function getCompareTestDescription(a?: any, b?: any, keys?: any) {
    const baseResult = `${JSON.stringify(a)} and ${JSON.stringify(b)}`;
    return keys != null ? baseResult + ` (keys: ${JSON.stringify(keys)})` : baseResult;
}

interface IKeys {
    a?: any;
    b?: any;
    c?: any;
    d?: any;
}

/**
 * A compactly named function for converting a string array to a key blacklist.
 */
function bl(keys: string[]) {
    return { exclude: keys } as IKeyBlacklist<IKeys>;
}

/**
 * A compactly named function for converting a string array to a key whitelist.
 */
function wl(keys: string[]) {
    return { include: keys } as IKeyWhitelist<IKeys>;
}
