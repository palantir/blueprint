/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

// tslint:disable max-classes-per-file

import { expect } from "chai";
import { mount } from "enzyme";
import * as Enzyme from "enzyme";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { HOTKEYS_HOTKEY_CHILDREN } from "../../src/common/errors";
import { normalizeKeyCombo } from "../../src/components/hotkeys/hotkeyParser";
import {
    comboMatches,
    getKeyCombo,
    getKeyComboString,
    hideHotkeysDialog,
    Hotkey,
    Hotkeys,
    HotkeysTarget,
    IKeyCombo,
    parseKeyCombo,
} from "../../src/index";
import { dispatchTestKeyboardEvent } from "../common/utils";

describe("Hotkeys", () => {
    it("throws error if given non-Hotkey child", () => {
        expect(() =>
            mount(
                <Hotkeys>
                    <div />
                </Hotkeys>,
            ),
        ).to.throw(HOTKEYS_HOTKEY_CHILDREN, "element");
        expect(() => mount(<Hotkeys>string contents</Hotkeys>)).to.throw(HOTKEYS_HOTKEY_CHILDREN, "string");
        expect(() =>
            mount(
                <Hotkeys>
                    {undefined}
                    {null}
                </Hotkeys>,
            ),
        ).to.throw(HOTKEYS_HOTKEY_CHILDREN, "undefined");
    });

    describe("Local/Global @HotkeysTarget", () => {
        let localKeyDownSpy: Sinon.SinonSpy = null;
        let localKeyUpSpy: Sinon.SinonSpy = null;

        let globalKeyDownSpy: Sinon.SinonSpy = null;
        let globalKeyUpSpy: Sinon.SinonSpy = null;

        let attachTo: HTMLElement = null;
        let comp: Enzyme.ReactWrapper<any, any> = null;

        interface ITestComponentProps {
            allowInInput?: boolean;
            disabled?: boolean;
            preventDefault?: boolean;
            stopPropagation?: boolean;
        }

        @HotkeysTarget
        class TestComponent extends React.Component<ITestComponentProps, {}> {
            public static defaultProps: ITestComponentProps = {
                allowInInput: false,
            };

            public renderHotkeys() {
                return (
                    <Hotkeys>
                        <Hotkey
                            {...this.props}
                            combo="1"
                            group="test"
                            label="local hotkey"
                            onKeyDown={localKeyDownSpy}
                            onKeyUp={localKeyUpSpy}
                        />
                        <Hotkey
                            {...this.props}
                            combo="2"
                            global={true}
                            label="global hotkey"
                            onKeyDown={globalKeyDownSpy}
                            onKeyUp={globalKeyUpSpy}
                        />
                    </Hotkeys>
                );
            }

            public render() {
                return (
                    <div>
                        <input type="text" />
                        <input type="number" />
                        <input type="password" />
                        <input type="checkbox" />
                        <input type="radio" />
                        <div>Other stuff</div>
                    </div>
                );
            }
        }

        beforeEach(() => {
            localKeyDownSpy = sinon.spy();
            localKeyUpSpy = sinon.spy();

            globalKeyDownSpy = sinon.spy();
            globalKeyUpSpy = sinon.spy();

            attachTo = document.createElement("div");
            document.documentElement.appendChild(attachTo);
        });

        afterEach(() => {
            comp.detach();
            attachTo.remove();
        });

        describe("on keydown", () => {
            runHotkeySuiteForKeyEvent("keydown");
        });

        describe("on keyup", () => {
            runHotkeySuiteForKeyEvent("keyup");
        });

        // this works only on keydown, so don't put it in the test suite
        it('triggers non-inline hotkey dialog with "?"', done => {
            const TEST_TIMEOUT_DURATION = 30;

            comp = mount(<TestComponent />, { attachTo });
            const node = ReactDOM.findDOMNode(comp.instance());

            dispatchTestKeyboardEvent(node, "keydown", "/", true);

            // wait for the dialog to animate in
            setTimeout(() => {
                expect(document.querySelector(".pt-hotkey-column")).to.exist;
                expect(document.querySelector(".pt-overlay-open").classList.contains("pt-overlay-inline")).to.be.false;
                hideHotkeysDialog();
                comp.detach();
                attachTo.remove();
                done();
            }, TEST_TIMEOUT_DURATION);
        });

        it("can generate hotkey combo string from keyboard input", () => {
            const combo = "shift + x";
            const handleKeyDown = sinon.spy();

            @HotkeysTarget
            class ComboComponent extends React.Component<{}, {}> {
                public renderHotkeys() {
                    return (
                        <Hotkeys>
                            <Hotkey label="global hotkey" global={true} combo={combo} onKeyDown={handleKeyDown} />
                        </Hotkeys>
                    );
                }

                public render() {
                    return <div>Some content</div>;
                }
            }

            comp = mount(<ComboComponent />, { attachTo });
            const node = ReactDOM.findDOMNode(comp.instance());

            // We have to use capital X here to make the charCode == keyCode.
            // Implementors won't have to worry about this detail.
            dispatchTestKeyboardEvent(node, "keydown", "X", true);
            expect(handleKeyDown.called).to.be.true;
            const testCombo = getKeyComboString(handleKeyDown.firstCall.args[0]);
            expect(testCombo).to.equal(combo);
        });

        function runHotkeySuiteForKeyEvent(eventName: "keydown" | "keyup") {
            it(`triggers local and global hotkeys on ${eventName}`, () => {
                comp = mount(<TestComponent />, { attachTo });
                const node = ReactDOM.findDOMNode(comp.instance());

                dispatchTestKeyboardEvent(node, eventName, "1");
                expect(getLocalSpy(eventName).called).to.be.true;

                dispatchTestKeyboardEvent(node, eventName, "2");
                expect(getGlobalSpy(eventName).called).to.be.true;
            });

            it("triggers only global hotkey when not focused", () => {
                comp = mount(
                    <div>
                        <TestComponent />
                        <div className="unhotkeyed" tabIndex={2} />
                    </div>,
                    { attachTo },
                );
                const unhotkeyed = ReactDOM.findDOMNode(comp.instance()).querySelector(".unhotkeyed");
                (unhotkeyed as HTMLElement).focus();

                dispatchTestKeyboardEvent(unhotkeyed, eventName, "1");
                expect(getLocalSpy(eventName).called).to.be.false;

                dispatchTestKeyboardEvent(unhotkeyed, eventName, "2");
                expect(getGlobalSpy(eventName).called).to.be.true;
            });

            it("ignores hotkeys when disabled={true}", () => {
                comp = mount(<TestComponent disabled={true} />, { attachTo });
                const node = ReactDOM.findDOMNode(comp.instance());

                dispatchTestKeyboardEvent(node, eventName, "1");
                expect(getLocalSpy(eventName).called).to.be.false;

                dispatchTestKeyboardEvent(node, eventName, "2");
                expect(getGlobalSpy(eventName).called).to.be.false;
            });

            it("prevents default if preventDefault={true}", () => {
                comp = mount(<TestComponent preventDefault={true} />, { attachTo });
                const node = ReactDOM.findDOMNode(comp.instance());

                dispatchTestKeyboardEvent(node, eventName, "1");
                const localEvent = getLocalSpy(eventName).lastCall.args[0] as KeyboardEvent;
                expect(localEvent.defaultPrevented).to.be.true;

                dispatchTestKeyboardEvent(node, eventName, "2");
                const globalEvent = getGlobalSpy(eventName).lastCall.args[0] as KeyboardEvent;
                expect(globalEvent.defaultPrevented).to.be.true;
            });

            it("stops propagation if stopPropagation={true}", () => {
                comp = mount(<TestComponent stopPropagation={true} />, { attachTo });
                const node = ReactDOM.findDOMNode(comp.instance());

                // this unit test relies on a custom flag we set on the event object.
                // the flag exists solely to make this unit test possible.
                dispatchTestKeyboardEvent(node, eventName, "1");
                const localEvent = getLocalSpy(eventName).lastCall.args[0] as KeyboardEvent;
                expect((localEvent as any).isPropagationStopped).to.be.true;

                dispatchTestKeyboardEvent(node, eventName, "2");
                const globalEvent = getGlobalSpy(eventName).lastCall.args[0] as KeyboardEvent;
                expect((globalEvent as any).isPropagationStopped).to.be.true;
            });

            describe("if allowInInput={false}", () => {
                it("ignores hotkeys when inside text input", () => {
                    assertInputAllowsKeys("text", false);
                });

                it("ignores hotkeys when inside number input", () => {
                    assertInputAllowsKeys("number", false);
                });

                it("ignores hotkeys when inside password input", () => {
                    assertInputAllowsKeys("password", false);
                });

                it("triggers hotkeys when inside checkbox input", () => {
                    assertInputAllowsKeys("checkbox", true);
                });

                it("triggers hotkeys when inside radio input", () => {
                    assertInputAllowsKeys("radio", true);
                });
            });

            describe("if allowInInput={true}", () => {
                it("triggers hotkeys when inside text input", () => {
                    assertInputAllowsKeys("text", true, true);
                });

                it("triggers hotkeys when inside number input", () => {
                    assertInputAllowsKeys("number", true, true);
                });

                it("triggers hotkeys when inside password input", () => {
                    assertInputAllowsKeys("password", true, true);
                });

                it("triggers hotkeys when inside checkbox input", () => {
                    assertInputAllowsKeys("checkbox", true, true);
                });

                it("triggers hotkeys when inside radio input", () => {
                    assertInputAllowsKeys("radio", true, true);
                });
            });

            function assertInputAllowsKeys(type: string, allowsKeys: boolean, allowInInput: boolean = false) {
                comp = mount(<TestComponent allowInInput={allowInInput} />, { attachTo });

                const selector = "input[type='" + type + "']";
                const input = ReactDOM.findDOMNode(comp.instance()).querySelector(selector);

                (input as HTMLElement).focus();

                dispatchTestKeyboardEvent(input, eventName, "1");
                expect(getLocalSpy(eventName).called).to.equal(allowsKeys);

                dispatchTestKeyboardEvent(input, eventName, "2");
                expect(getGlobalSpy(eventName).called).to.equal(allowsKeys);
            }
        }

        function getLocalSpy(eventName: "keydown" | "keyup") {
            return eventName === "keydown" ? localKeyDownSpy : localKeyUpSpy;
        }

        function getGlobalSpy(eventName: "keydown" | "keyup") {
            return eventName === "keydown" ? globalKeyDownSpy : globalKeyUpSpy;
        }
    });

    describe("KeyCombo parser", () => {
        interface IComboTest {
            combo: string;
            stringKeyCombo: string;
            eventKeyCombo: IKeyCombo;
            parsedKeyCombo: IKeyCombo;
        }

        const makeComboTest = (combo: string, event: KeyboardEvent) => {
            return {
                combo,
                eventKeyCombo: getKeyCombo(event),
                parsedKeyCombo: parseKeyCombo(combo),
                stringKeyCombo: getKeyComboString(event),
            };
        };

        const verifyCombos = (tests: IComboTest[], verifyStrings = true) => {
            for (const test of tests) {
                if (verifyStrings) {
                    expect(test.stringKeyCombo).to.equal(test.combo);
                }
                expect(comboMatches(test.parsedKeyCombo, test.eventKeyCombo)).to.be.true;
            }
        };

        it("matches lowercase alphabet chars", () => {
            const alpha = 65;
            verifyCombos(
                Array.apply(null, Array(26)).map((_: any, i: number) => {
                    const combo = String.fromCharCode(alpha + i).toLowerCase();
                    const event = { which: alpha + i } as KeyboardEvent;
                    return makeComboTest(combo, event);
                }),
            );
        });

        it("bare alphabet chars ignore case", () => {
            const alpha = 65;
            verifyCombos(
                Array.apply(null, Array(26)).map((_: any, i: number) => {
                    const combo = String.fromCharCode(alpha + i).toUpperCase();
                    const event = { which: alpha + i } as KeyboardEvent;
                    return makeComboTest(combo, event);
                }),
                false,
            ); // don't compare string combos
        });

        it("matches uppercase alphabet chars using shift", () => {
            const alpha = 65;
            verifyCombos(
                Array.apply(null, Array(26)).map((_: any, i: number) => {
                    const combo = "shift + " + String.fromCharCode(alpha + i).toLowerCase();
                    const event = { shiftKey: true, which: alpha + i } as KeyboardEvent;
                    return makeComboTest(combo, event);
                }),
            );
        });

        it("matches modifiers only", () => {
            const tests = [] as IComboTest[];
            const ignored = 16;
            tests.push(makeComboTest("shift", { shiftKey: true, which: ignored } as KeyboardEvent));
            tests.push(
                makeComboTest("ctrl + alt + shift", {
                    altKey: true,
                    ctrlKey: true,
                    shiftKey: true,
                    which: ignored,
                } as KeyboardEvent),
            );
            tests.push(makeComboTest("ctrl + meta", { ctrlKey: true, metaKey: true, which: ignored } as KeyboardEvent));
            verifyCombos(tests);
        });

        it("adds shift to keys that imply it", () => {
            const tests = [] as IComboTest[];
            tests.push(makeComboTest("!", { shiftKey: true, which: 49 } as KeyboardEvent));
            tests.push(makeComboTest("@", { shiftKey: true, which: 50 } as KeyboardEvent));
            tests.push(makeComboTest("{", { shiftKey: true, which: 219 } as KeyboardEvent));
            // don't verify the strings because these will be converted to
            // `shift + 1`, etc.
            verifyCombos(tests, false);
        });

        it("handles plus", () => {
            expect(() => parseKeyCombo("ctrl + +")).to.throw(/failed to parse/i);

            expect(comboMatches(parseKeyCombo("cmd + plus"), parseKeyCombo("meta + plus"))).to.be.true;
        });

        it("applies aliases", () => {
            expect(comboMatches(parseKeyCombo("return"), parseKeyCombo("enter"))).to.be.true;

            expect(comboMatches(parseKeyCombo("win + F"), parseKeyCombo("meta + f"))).to.be.true;
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
