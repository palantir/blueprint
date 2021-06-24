/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

import React from "react";

import { HotkeysTarget, HotkeyProps } from "@blueprintjs/core";
import { Example, ExampleProps } from "@blueprintjs/docs-theme";

import { PianoKey } from "./audio";

export interface HotkeysTargetExampleState {
    audioContext?: AudioContext;
    // pressed state of each key
    keys: boolean[];
}

/**
 * Similar to UseHotkeysExample, but using a component class API pattern.
 * We may deprecate and remove this in the future if we encourage everyone to switch to hooks.
 */
export class HotkeysTargetExample extends React.PureComponent<ExampleProps, HotkeysTargetExampleState> {
    public state: HotkeysTargetExampleState = {
        keys: Array.apply(null, Array(24)).map(() => false),
    };

    private pianoRef: HTMLDivElement | null = null;

    private handlePianoRef = (ref: HTMLDivElement | null) => (this.pianoRef = ref);

    private focusPiano = () => {
        if (this.pianoRef !== null) {
            this.pianoRef.focus();
            if (typeof window.AudioContext !== "undefined" && this.state.audioContext === undefined) {
                this.setState({ audioContext: new AudioContext() });
            }
        }
    };

    private getKeySetter = (index: number, keyState: boolean) => {
        return () => {
            const keys = this.state.keys.slice();
            keys[index] = keyState;
            this.setState({ keys });
        };
    };

    private hotkeys: HotkeyProps[] = [
        {
            combo: "shift + P",
            global: true,
            label: "Focus the piano",
            onKeyDown: this.focusPiano,
        },
        {
            combo: "Q",
            group: "HotkeysTarget Example",
            label: "Play a C5",
            onKeyDown: this.getKeySetter(0, true),
            onKeyUp: this.getKeySetter(0, false),
        },
        {
            combo: "2",
            group: "HotkeysTarget Example",
            label: "Play a C#5",
            onKeyDown: this.getKeySetter(1, true),
            onKeyUp: this.getKeySetter(1, false),
        },
        {
            combo: "W",
            group: "HotkeysTarget Example",
            label: "Play a D5",
            onKeyDown: this.getKeySetter(2, true),
            onKeyUp: this.getKeySetter(2, false),
        },
        {
            combo: "3",
            group: "HotkeysTarget Example",
            label: "Play a D#5",
            onKeyDown: this.getKeySetter(3, true),
            onKeyUp: this.getKeySetter(3, false),
        },
        {
            combo: "E",
            group: "HotkeysTarget Example",
            label: "Play a E5",
            onKeyDown: this.getKeySetter(4, true),
            onKeyUp: this.getKeySetter(4, false),
        },
        {
            combo: "R",
            group: "HotkeysTarget Example",
            label: "Play a F5",
            onKeyDown: this.getKeySetter(5, true),
            onKeyUp: this.getKeySetter(5, false),
        },
        {
            combo: "5",
            group: "HotkeysTarget Example",
            label: "Play a F#5",
            onKeyDown: this.getKeySetter(6, true),
            onKeyUp: this.getKeySetter(6, false),
        },
        {
            combo: "T",
            group: "HotkeysTarget Example",
            label: "Play a G5",
            onKeyDown: this.getKeySetter(7, true),
            onKeyUp: this.getKeySetter(7, false),
        },
        {
            combo: "6",
            group: "HotkeysTarget Example",
            label: "Play a G#5",
            onKeyDown: this.getKeySetter(8, true),
            onKeyUp: this.getKeySetter(8, false),
        },
        {
            combo: "Y",
            group: "HotkeysTarget Example",
            label: "Play a A5",
            onKeyDown: this.getKeySetter(9, true),
            onKeyUp: this.getKeySetter(9, false),
        },
        {
            combo: "7",
            group: "HotkeysTarget Example",
            label: "Play a A#5",
            onKeyDown: this.getKeySetter(10, true),
            onKeyUp: this.getKeySetter(10, false),
        },
        {
            combo: "U",
            group: "HotkeysTarget Example",
            label: "Play a B5",
            onKeyDown: this.getKeySetter(11, true),
            onKeyUp: this.getKeySetter(11, false),
        },
        {
            combo: "Z",
            group: "HotkeysTarget Example",
            label: "Play a C4",
            onKeyDown: this.getKeySetter(12, true),
            onKeyUp: this.getKeySetter(12, false),
        },
        {
            combo: "S",
            group: "HotkeysTarget Example",
            label: "Play a C#4",
            onKeyDown: this.getKeySetter(13, true),
            onKeyUp: this.getKeySetter(13, false),
        },
        {
            combo: "X",
            group: "HotkeysTarget Example",
            label: "Play a D4",
            onKeyDown: this.getKeySetter(14, true),
            onKeyUp: this.getKeySetter(14, false),
        },
        {
            combo: "D",
            group: "HotkeysTarget Example",
            label: "Play a D#4",
            onKeyDown: this.getKeySetter(15, true),
            onKeyUp: this.getKeySetter(15, false),
        },
        {
            combo: "C",
            group: "HotkeysTarget Example",
            label: "Play a E4",
            onKeyDown: this.getKeySetter(16, true),
            onKeyUp: this.getKeySetter(16, false),
        },
        {
            combo: "V",
            group: "HotkeysTarget Example",
            label: "Play a F4",
            onKeyDown: this.getKeySetter(17, true),
            onKeyUp: this.getKeySetter(17, false),
        },
        {
            combo: "G",
            group: "HotkeysTarget Example",
            label: "Play a F#4",
            onKeyDown: this.getKeySetter(18, true),
            onKeyUp: this.getKeySetter(18, false),
        },
        {
            combo: "B",
            group: "HotkeysTarget Example",
            label: "Play a G4",
            onKeyDown: this.getKeySetter(19, true),
            onKeyUp: this.getKeySetter(19, false),
        },
        {
            combo: "H",
            group: "HotkeysTarget Example",
            label: "Play a G#4",
            onKeyDown: this.getKeySetter(20, true),
            onKeyUp: this.getKeySetter(20, false),
        },
        {
            combo: "N",
            group: "HotkeysTarget Example",
            label: "Play a A4",
            onKeyDown: this.getKeySetter(21, true),
            onKeyUp: this.getKeySetter(21, false),
        },
        {
            combo: "J",
            group: "HotkeysTarget Example",
            label: "Play a A#4",
            onKeyDown: this.getKeySetter(22, true),
            onKeyUp: this.getKeySetter(22, false),
        },
        {
            combo: "M",
            group: "HotkeysTarget Example",
            label: "Play a B4",
            onKeyDown: this.getKeySetter(23, true),
            onKeyUp: this.getKeySetter(23, false),
        },
    ];

    public render() {
        const { audioContext, keys } = this.state;

        return (
            <Example className="docs-hotkeys-target-2-example" options={false} {...this.props}>
                <HotkeysTarget hotkeys={this.hotkeys}>
                    {({ handleKeyDown, handleKeyUp }) => (
                        <div
                            tabIndex={0}
                            className="docs-hotkey-piano-example"
                            ref={this.handlePianoRef}
                            onClick={this.focusPiano}
                            onKeyDown={handleKeyDown}
                            onKeyUp={handleKeyUp}
                        >
                            <div>
                                <PianoKey note="C5" hotkey="Q" pressed={keys[0]} context={audioContext} />
                                <PianoKey note="C#5" hotkey="2" pressed={keys[1]} context={audioContext} />
                                <PianoKey note="D5" hotkey="W" pressed={keys[2]} context={audioContext} />
                                <PianoKey note="D#5" hotkey="3" pressed={keys[3]} context={audioContext} />
                                <PianoKey note="E5" hotkey="E" pressed={keys[4]} context={audioContext} />
                                <PianoKey note="F5" hotkey="R" pressed={keys[5]} context={audioContext} />
                                <PianoKey note="F#5" hotkey="5" pressed={keys[6]} context={audioContext} />
                                <PianoKey note="G5" hotkey="T" pressed={keys[7]} context={audioContext} />
                                <PianoKey note="G#5" hotkey="6" pressed={keys[8]} context={audioContext} />
                                <PianoKey note="A5" hotkey="Y" pressed={keys[9]} context={audioContext} />
                                <PianoKey note="A#5" hotkey="7" pressed={keys[10]} context={audioContext} />
                                <PianoKey note="B5" hotkey="U" pressed={keys[11]} context={audioContext} />
                            </div>
                            <div>
                                <PianoKey note="C4" hotkey="Z" pressed={keys[12]} context={audioContext} />
                                <PianoKey note="C#4" hotkey="S" pressed={keys[13]} context={audioContext} />
                                <PianoKey note="D4" hotkey="X" pressed={keys[14]} context={audioContext} />
                                <PianoKey note="D#4" hotkey="D" pressed={keys[15]} context={audioContext} />
                                <PianoKey note="E4" hotkey="C" pressed={keys[16]} context={audioContext} />
                                <PianoKey note="F4" hotkey="V" pressed={keys[17]} context={audioContext} />
                                <PianoKey note="F#4" hotkey="G" pressed={keys[18]} context={audioContext} />
                                <PianoKey note="G4" hotkey="B" pressed={keys[19]} context={audioContext} />
                                <PianoKey note="G#4" hotkey="H" pressed={keys[20]} context={audioContext} />
                                <PianoKey note="A4" hotkey="N" pressed={keys[21]} context={audioContext} />
                                <PianoKey note="A#4" hotkey="J" pressed={keys[22]} context={audioContext} />
                                <PianoKey note="B4" hotkey="M" pressed={keys[23]} context={audioContext} />
                            </div>
                        </div>
                    )}
                </HotkeysTarget>
            </Example>
        );
    }
}
