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

import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import {
    comboMatches,
    getKeyCombo,
    getKeyComboString,
    type KeyCombo,
    normalizeKeyCombo,
    parseKeyCombo,
} from "./hotkeyParser";

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
                    return makeComboTest(combo, { code: `Key${charString.toUpperCase()}`, key: charString });
                }),
            );
        });

        it("bare alphabet chars ignore case", () => {
            const alpha = 65;
            verifyCombos(
                Array.apply(null, Array(26)).map((_: any, i: number) => {
                    const charString = String.fromCharCode(alpha + i).toLowerCase();
                    const combo = charString.toUpperCase();
                    return makeComboTest(combo, { code: `Key${charString.toUpperCase()}`, key: charString });
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
            tests.push(makeComboTest("shift", { code: "ShiftLeft", shiftKey: true } as any));
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
            tests.push(makeComboTest("!", { code: "Digit1", key: "!", shiftKey: true }));
            tests.push(makeComboTest("@", { code: "Digit2", key: "@", shiftKey: true }));
            tests.push(makeComboTest("{", { code: "BracketLeft", key: "{", shiftKey: true }));
            // don't verify the strings because these will be converted to
            // `Shift + 1`, etc.
            verifyCombos(tests, false);
        });

        it("handles space key", () => {
            const tests = [] as ComboTest[];
            tests.push(
                makeComboTest("space", { code: "Space", key: " " }),
                makeComboTest("ctrl + space", { code: "Space", ctrlKey: true, key: " " }),
            );
            verifyCombos(tests);
        });

        it("handles alt modifier key", () => {
            const tests = [] as ComboTest[];
            tests.push(makeComboTest("alt + a", { altKey: true, code: "KeyA", key: "a" }));
            verifyCombos(tests);
        });

        it("handles alt modifier with special characters (macOS)", () => {
            // On macOS, Alt+C produces "ç" - we should fall back to code-based matching
            const tests = [] as ComboTest[];
            tests.push(makeComboTest("alt + c", { altKey: true, code: "KeyC", key: "ç" }));
            verifyCombos(tests, false); // don't verify string combos since key is "ç" not "c"
        });

        it("uses event.key for regular keys to respect keyboard layout", () => {
            // For non-Alt modifiers, we should use event.key to respect keyboard layout
            const tests = [] as ComboTest[];
            // Regular key with no modifier
            tests.push(makeComboTest("b", { code: "KeyB", key: "b" }));
            // Ctrl modifier - should use event.key
            tests.push(makeComboTest("ctrl + b", { code: "KeyB", ctrlKey: true, key: "b" }));
            // Meta modifier - should use event.key
            tests.push(makeComboTest("meta + b", { code: "KeyB", key: "b", metaKey: true }));
            // Shift modifier - should use event.key
            tests.push(makeComboTest("shift + b", { code: "KeyB", key: "b", shiftKey: true }));
            verifyCombos(tests);
        });

        it("uses event.code for Alt modifier with non-ASCII characters", () => {
            // For Alt with special characters, use code-based matching
            const tests = [] as ComboTest[];
            // Alt+B on macOS might produce "∫" (integral symbol)
            tests.push(makeComboTest("alt + b", { altKey: true, code: "KeyB", key: "∫" }));
            verifyCombos(tests, false); // don't verify string combos since key is "∫" not "b"
        });

        it("uses event.key for Alt modifier when character is normal ASCII", () => {
            // When Alt doesn't produce a special character, use event.key
            const tests = [] as ComboTest[];
            tests.push(makeComboTest("alt + b", { altKey: true, code: "KeyB", key: "b" }));
            verifyCombos(tests);
        });

        it("uses event.code for digit keys to get base digit regardless of shift", () => {
            // Shift+1 produces "!" but we want to detect it as "shift+1"
            const tests = [] as ComboTest[];
            tests.push(makeComboTest("shift + 1", { code: "Digit1", key: "!", shiftKey: true }));
            tests.push(makeComboTest("shift + 2", { code: "Digit2", key: "@", shiftKey: true }));
            tests.push(makeComboTest("shift + 3", { code: "Digit3", key: "#", shiftKey: true }));
            tests.push(makeComboTest("shift + 4", { code: "Digit4", key: "$", shiftKey: true }));
            tests.push(makeComboTest("shift + 5", { code: "Digit5", key: "%", shiftKey: true }));
            tests.push(makeComboTest("shift + 6", { code: "Digit6", key: "^", shiftKey: true }));
            tests.push(makeComboTest("shift + 7", { code: "Digit7", key: "&", shiftKey: true }));
            tests.push(makeComboTest("shift + 8", { code: "Digit8", key: "*", shiftKey: true }));
            tests.push(makeComboTest("shift + 9", { code: "Digit9", key: "(", shiftKey: true }));
            tests.push(makeComboTest("shift + 0", { code: "Digit0", key: ")", shiftKey: true }));
            verifyCombos(tests, false); // don't verify string combos since keys are symbols not digits
        });

        it("uses event.code for digit keys without shift", () => {
            // Plain digits should also use code for consistency
            const tests = [] as ComboTest[];
            tests.push(makeComboTest("1", { code: "Digit1", key: "1" }));
            tests.push(makeComboTest("ctrl + 2", { code: "Digit2", ctrlKey: true, key: "2" }));
            tests.push(makeComboTest("alt + 3", { altKey: true, code: "Digit3", key: "3" }));
            verifyCombos(tests);
        });

        it("uses event.key for shifted letters (case-insensitive)", () => {
            // Shift+B produces "B", we lowercase it to "b" and match "shift+b"
            const tests = [] as ComboTest[];
            tests.push(makeComboTest("shift + b", { code: "KeyB", key: "B", shiftKey: true }));
            tests.push(makeComboTest("shift + z", { code: "KeyZ", key: "Z", shiftKey: true }));
            verifyCombos(tests);
        });

        it("uses SHIFT_KEYS mapping for symbol keys with shift", () => {
            // Shift+[ produces "{", should be detected as "shift+["
            const tests = [] as ComboTest[];
            tests.push(makeComboTest("shift + [", { code: "BracketLeft", key: "{", shiftKey: true }));
            tests.push(makeComboTest("shift + ]", { code: "BracketRight", key: "}", shiftKey: true }));
            tests.push(makeComboTest("shift + \\", { code: "Backslash", key: "|", shiftKey: true }));
            tests.push(makeComboTest("shift + ;", { code: "Semicolon", key: ":", shiftKey: true }));
            tests.push(makeComboTest("shift + '", { code: "Quote", key: '"', shiftKey: true }));
            verifyCombos(tests, false); // don't verify string combos since keys are shifted symbols
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
