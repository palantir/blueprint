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

import React, { useCallback, useMemo, useRef, useState } from "react";

import { useHotkeys } from "@blueprintjs/core";
import { Example, ExampleProps } from "@blueprintjs/docs-theme";

import { PianoKey } from "./audio";

export const UseHotkeysExample: React.FC<ExampleProps> = props => {
    const [audioContext, setAudioContext] = useState<AudioContext>();

    const pianoRef = useRef<HTMLDivElement>();
    const focusPiano = useCallback(() => {
        pianoRef?.current.focus();
        if (typeof window.AudioContext !== "undefined" && audioContext === undefined) {
            setAudioContext(new AudioContext());
        }
    }, [pianoRef]);

    // create a dictionary of key states and updater functions
    const keys = Array.apply(null, Array(24))
        .map(() => useState(() => false), [])
        .map(([pressed, setPressed]) => ({
            pressed,
            setPressed,
        }));

    const hotkeys = useMemo(
        () => [
            {
                combo: "shift + P",
                global: true,
                label: "Focus the piano",
                onKeyDown: focusPiano,
            },
            {
                combo: "Q",
                group: "useHotkeys Example",
                label: "Play a C5",
                onKeyDown: () => keys[0].setPressed(true),
                onKeyUp: () => keys[0].setPressed(false),
            },
            {
                combo: "2",
                group: "useHotkeys Example",
                label: "Play a C#5",
                onKeyDown: () => keys[1].setPressed(true),
                onKeyUp: () => keys[1].setPressed(false),
            },
            {
                combo: "W",
                group: "useHotkeys Example",
                label: "Play a D5",
                onKeyDown: () => keys[2].setPressed(true),
                onKeyUp: () => keys[2].setPressed(false),
            },
            {
                combo: "3",
                group: "useHotkeys Example",
                label: "Play a D#5",
                onKeyDown: () => keys[3].setPressed(true),
                onKeyUp: () => keys[3].setPressed(false),
            },
            {
                combo: "E",
                group: "useHotkeys Example",
                label: "Play a E5",
                onKeyDown: () => keys[4].setPressed(true),
                onKeyUp: () => keys[4].setPressed(false),
            },
            {
                combo: "R",
                group: "useHotkeys Example",
                label: "Play a F5",
                onKeyDown: () => keys[5].setPressed(true),
                onKeyUp: () => keys[5].setPressed(false),
            },
            {
                combo: "5",
                group: "useHotkeys Example",
                label: "Play a F#5",
                onKeyDown: () => keys[6].setPressed(true),
                onKeyUp: () => keys[6].setPressed(false),
            },
            {
                combo: "T",
                group: "useHotkeys Example",
                label: "Play a G5",
                onKeyDown: () => keys[7].setPressed(true),
                onKeyUp: () => keys[7].setPressed(false),
            },
            {
                combo: "6",
                group: "useHotkeys Example",
                label: "Play a G#5",
                onKeyDown: () => keys[8].setPressed(true),
                onKeyUp: () => keys[8].setPressed(false),
            },
            {
                combo: "Y",
                group: "useHotkeys Example",
                label: "Play a A5",
                onKeyDown: () => keys[9].setPressed(true),
                onKeyUp: () => keys[9].setPressed(false),
            },
            {
                combo: "7",
                group: "useHotkeys Example",
                label: "Play a A#5",
                onKeyDown: () => keys[10].setPressed(true),
                onKeyUp: () => keys[10].setPressed(false),
            },
            {
                combo: "U",
                group: "useHotkeys Example",
                label: "Play a B5",
                onKeyDown: () => keys[11].setPressed(true),
                onKeyUp: () => keys[11].setPressed(false),
            },
            {
                combo: "Z",
                group: "useHotkeys Example",
                label: "Play a C4",
                onKeyDown: () => keys[12].setPressed(true),
                onKeyUp: () => keys[12].setPressed(false),
            },
            {
                combo: "S",
                group: "useHotkeys Example",
                label: "Play a C#4",
                onKeyDown: () => keys[13].setPressed(true),
                onKeyUp: () => keys[13].setPressed(false),
            },
            {
                combo: "X",
                group: "useHotkeys Example",
                label: "Play a D4",
                onKeyDown: () => keys[14].setPressed(true),
                onKeyUp: () => keys[14].setPressed(false),
            },
            {
                combo: "D",
                group: "useHotkeys Example",
                label: "Play a D#4",
                onKeyDown: () => keys[15].setPressed(true),
                onKeyUp: () => keys[15].setPressed(false),
            },
            {
                combo: "C",
                group: "useHotkeys Example",
                label: "Play a E4",
                onKeyDown: () => keys[16].setPressed(true),
                onKeyUp: () => keys[16].setPressed(false),
            },
            {
                combo: "V",
                group: "useHotkeys Example",
                label: "Play a F4",
                onKeyDown: () => keys[17].setPressed(true),
                onKeyUp: () => keys[17].setPressed(false),
            },
            {
                combo: "G",
                group: "useHotkeys Example",
                label: "Play a F#4",
                onKeyDown: () => keys[18].setPressed(true),
                onKeyUp: () => keys[18].setPressed(false),
            },
            {
                combo: "B",
                group: "useHotkeys Example",
                label: "Play a G4",
                onKeyDown: () => keys[19].setPressed(true),
                onKeyUp: () => keys[19].setPressed(false),
            },
            {
                combo: "H",
                group: "useHotkeys Example",
                label: "Play a G#4",
                onKeyDown: () => keys[20].setPressed(true),
                onKeyUp: () => keys[20].setPressed(false),
            },
            {
                combo: "N",
                group: "useHotkeys Example",
                label: "Play a A4",
                onKeyDown: () => keys[21].setPressed(true),
                onKeyUp: () => keys[21].setPressed(false),
            },
            {
                combo: "J",
                group: "useHotkeys Example",
                label: "Play a A#4",
                onKeyDown: () => keys[22].setPressed(true),
                onKeyUp: () => keys[22].setPressed(false),
            },
            {
                combo: "M",
                group: "useHotkeys Example",
                label: "Play a B4",
                onKeyDown: () => keys[23].setPressed(true),
                onKeyUp: () => keys[23].setPressed(false),
            },
        ],
        [],
    );
    const { handleKeyDown, handleKeyUp } = useHotkeys(hotkeys);

    return (
        <Example className="docs-use-hotkeys-example" options={false} {...props}>
            <div
                tabIndex={0}
                className="docs-hotkey-piano-example"
                ref={pianoRef}
                onClick={focusPiano}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
            >
                <div>
                    <PianoKey note="C5" hotkey="Q" pressed={keys[0].pressed} context={audioContext} />
                    <PianoKey note="C#5" hotkey="2" pressed={keys[1].pressed} context={audioContext} />
                    <PianoKey note="D5" hotkey="W" pressed={keys[2].pressed} context={audioContext} />
                    <PianoKey note="D#5" hotkey="3" pressed={keys[3].pressed} context={audioContext} />
                    <PianoKey note="E5" hotkey="E" pressed={keys[4].pressed} context={audioContext} />
                    <PianoKey note="F5" hotkey="R" pressed={keys[5].pressed} context={audioContext} />
                    <PianoKey note="F#5" hotkey="5" pressed={keys[6].pressed} context={audioContext} />
                    <PianoKey note="G5" hotkey="T" pressed={keys[7].pressed} context={audioContext} />
                    <PianoKey note="G#5" hotkey="6" pressed={keys[8].pressed} context={audioContext} />
                    <PianoKey note="A5" hotkey="Y" pressed={keys[9].pressed} context={audioContext} />
                    <PianoKey note="A#5" hotkey="7" pressed={keys[10].pressed} context={audioContext} />
                    <PianoKey note="B5" hotkey="U" pressed={keys[11].pressed} context={audioContext} />
                </div>
                <div>
                    <PianoKey note="C4" hotkey="Z" pressed={keys[12].pressed} context={audioContext} />
                    <PianoKey note="C#4" hotkey="S" pressed={keys[13].pressed} context={audioContext} />
                    <PianoKey note="D4" hotkey="X" pressed={keys[14].pressed} context={audioContext} />
                    <PianoKey note="D#4" hotkey="D" pressed={keys[15].pressed} context={audioContext} />
                    <PianoKey note="E4" hotkey="C" pressed={keys[16].pressed} context={audioContext} />
                    <PianoKey note="F4" hotkey="V" pressed={keys[17].pressed} context={audioContext} />
                    <PianoKey note="F#4" hotkey="G" pressed={keys[18].pressed} context={audioContext} />
                    <PianoKey note="G4" hotkey="B" pressed={keys[19].pressed} context={audioContext} />
                    <PianoKey note="G#4" hotkey="H" pressed={keys[20].pressed} context={audioContext} />
                    <PianoKey note="A4" hotkey="N" pressed={keys[21].pressed} context={audioContext} />
                    <PianoKey note="A#4" hotkey="J" pressed={keys[22].pressed} context={audioContext} />
                    <PianoKey note="B4" hotkey="M" pressed={keys[23].pressed} context={audioContext} />
                </div>
            </div>
        </Example>
    );
};
