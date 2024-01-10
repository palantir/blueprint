/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { expect } from "chai";

import {
    comboMatches,
    getKeyCombo,
    getKeyComboString,
    type KeyCombo,
    normalizeKeyCombo,
    parseKeyCombo,
} from "../../src/components/hotkeys/hotkeyParser";

describe("HotkeysParser", () => {
    // N.B. we test these two functions together to match how they are used in useHotkeys()
    describe("getKeyCombo + parseKeyCombo", () => {
        interface ComboTest {
            combo: string;
            stringKeyCombo: string;
            eventKeyCombo: KeyCombo;
            parsedKeyCombo: KeyCombo;
        }

        const makeComboTest = (combo: string, event: Partial<KeyboardEvent>) => {
            return {
                combo,
                eventKeyCombo: getKeyCombo(event as KeyboardEvent),
                parsedKeyCombo: parseKeyCombo(combo),
                stringKeyCombo: getKeyComboString(event as KeyboardEvent),
            };
        };

        const verifyCombos = (tests: ComboTest[], verifyStrings = true) => {
            for (const test of tests) {
                if (verifyStrings) {
                    expect(test.stringKeyCombo).to.equal(test.combo, "getKeyComboString");
                }
                expect(comboMatches(test.parsedKeyCombo, test.eventKeyCombo)).to.be.true;
            }
        };

        it("matches lowercase alphabet chars", () => {
            const alpha = 65;
            verifyCombos(
                Array.apply(null, Array(26)).map((_: any, i: number) => {
                    const charString = String.fromCharCode(alpha + i).toLowerCase();
                    const combo = charString;
                    return makeComboTest(combo, { key: charString, code: `Key${charString.toUpperCase()}` });
                }),
            );
        });

        it("bare alphabet chars ignore case", () => {
            const alpha = 65;
            verifyCombos(
                Array.apply(null, Array(26)).map((_: any, i: number) => {
                    const charString = String.fromCharCode(alpha + i).toLowerCase();
                    const combo = charString.toUpperCase();
                    return makeComboTest(combo, { key: charString, code: `Key${charString.toUpperCase()}` });
                }),
                false,
            ); // don't compare string combos
        });

        it("matches uppercase alphabet chars using shift", () => {
            const alpha = 65;
            verifyCombos(
                Array.apply(null, Array(26)).map((_: any, i: number) => {
                    const charString = String.fromCharCode(alpha + i).toLowerCase();
                    const combo = "shift + " + charString;
                    return makeComboTest(combo, {
                        code: `Key${charString.toUpperCase()}`,
                        key: charString,
                        shiftKey: true,
                    });
                }),
            );
        });

        it("matches modifiers only", () => {
            const tests = [] as ComboTest[];
            tests.push(makeComboTest("shift", { shiftKey: true, code: "ShiftLeft" } as any));
            tests.push(
                makeComboTest("ctrl + alt + shift", {
                    altKey: true,
                    code: "ShiftLeft",
                    ctrlKey: true,
                    shiftKey: true,
                } as any as KeyboardEvent),
            );
            tests.push(
                makeComboTest("ctrl + meta", {
                    code: "MetaLeft",
                    ctrlKey: true,
                    metaKey: true,
                } as any as KeyboardEvent),
            );
            verifyCombos(tests);
        });

        // these tests no longer make sense with the migration from key codes to named keys, they can likely be deleted
        it.skip("adds Shift to keys that imply it", () => {
            const tests = [] as ComboTest[];
            tests.push(makeComboTest("!", { shiftKey: true, key: "!", code: "Digit1" }));
            tests.push(makeComboTest("@", { shiftKey: true, key: "@", code: "Digit2" }));
            tests.push(makeComboTest("{", { shiftKey: true, key: "{", code: "BracketLeft" }));
            // don't verify the strings because these will be converted to
            // `Shift + 1`, etc.
            verifyCombos(tests, false);
        });

        it("handles space key", () => {
            const tests = [] as ComboTest[];
            tests.push(
                makeComboTest("space", { key: " ", code: "Space" }),
                makeComboTest("ctrl + space", { ctrlKey: true, key: " ", code: "Space" }),
            );
            verifyCombos(tests);
        });

        it("handles alt modifier key", () => {
            const tests = [] as ComboTest[];
            tests.push(makeComboTest("alt + a", { altKey: true, key: "a", code: "KeyA" }));
            verifyCombos(tests);
        });
    });

    describe("parseKeyCombo", () => {
        it("handles 'plus' key identifier", () => {
            expect(() => parseKeyCombo("ctrl + +")).to.throw(/failed to parse/i);
            expect(comboMatches(parseKeyCombo("cmd + plus"), parseKeyCombo("meta + plus"))).to.be.true;
        });

        it("applies aliases", () => {
            expect(comboMatches(parseKeyCombo("return"), parseKeyCombo("enter"))).to.be.true;
            expect(comboMatches(parseKeyCombo("win + F"), parseKeyCombo("meta + f"))).to.be.true;
            // regression test for https://github.com/palantir/blueprint/issues/6471
            expect(comboMatches(parseKeyCombo("esc"), parseKeyCombo("escape"))).to.be.true;
        });
    });

    describe("normalizeKeyCombo", () => {
        it("refers to meta key as 'ctrl' on Windows", () => {
            expect(normalizeKeyCombo("meta + s", "Win32")).to.deep.equal(["ctrl", "s"]);
        });

        it("refers to meta key as 'cmd' on Mac", () => {
            expect(normalizeKeyCombo("meta + s", "Mac")).to.deep.equal(["cmd", "s"]);
            expect(normalizeKeyCombo("meta + s", "iPhone")).to.deep.equal(["cmd", "s"]);
            expect(normalizeKeyCombo("meta + s", "iPod")).to.deep.equal(["cmd", "s"]);
            expect(normalizeKeyCombo("meta + s", "iPad")).to.deep.equal(["cmd", "s"]);
        });

        it("refers to meta key as 'ctrl' on Linux and other platforms", () => {
            expect(normalizeKeyCombo("meta + s", "linux")).to.deep.equal(["ctrl", "s"]);
        });
    });
});
