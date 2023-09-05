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

import * as React from "react";

import { NonIdealState, useHotkeys } from "@blueprintjs/core";
import { Example, ExampleProps } from "@blueprintjs/docs-theme";

import { PianoKey } from "./audio";

export const UseHotkeysExample: React.FC<ExampleProps> = props => {
    const [audioContext, setAudioContext] = React.useState<AudioContext>();

    const pianoRef = React.useRef<HTMLDivElement>();
    const focusPiano = React.useCallback(() => {
        pianoRef?.current.focus();
        if (typeof window.AudioContext !== "undefined" && audioContext === undefined) {
            setAudioContext(new AudioContext());
        }
    }, [audioContext, pianoRef]);

    const [keyPressed, setKeyPressed] = React.useState<readonly boolean[]>(new Array(25).fill(false));

    const setKeyState = React.useCallback((targetIndex: number, newValue: boolean) => {
        setKeyPressed(previouslySelected =>
            previouslySelected.map((value, index) => (index === targetIndex ? newValue : value)),
        );
    }, []);

    const hotkeys = React.useMemo(
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
                onKeyDown: () => setKeyState(0, true),
                onKeyUp: () => setKeyState(0, false),
            },
            {
                combo: "2",
                group: "useHotkeys Example",
                label: "Play a C#5",
                onKeyDown: () => setKeyState(1, true),
                onKeyUp: () => setKeyState(1, false),
            },
            {
                combo: "W",
                group: "useHotkeys Example",
                label: "Play a D5",
                onKeyDown: () => setKeyState(2, true),
                onKeyUp: () => setKeyState(2, false),
            },
            {
                combo: "3",
                group: "useHotkeys Example",
                label: "Play a D#5",
                onKeyDown: () => setKeyState(3, true),
                onKeyUp: () => setKeyState(3, false),
            },
            {
                combo: "E",
                group: "useHotkeys Example",
                label: "Play a E5",
                onKeyDown: () => setKeyState(4, true),
                onKeyUp: () => setKeyState(4, false),
            },
            {
                combo: "R",
                group: "useHotkeys Example",
                label: "Play a F5",
                onKeyDown: () => setKeyState(5, true),
                onKeyUp: () => setKeyState(5, false),
            },
            {
                combo: "5",
                group: "useHotkeys Example",
                label: "Play a F#5",
                onKeyDown: () => setKeyState(6, true),
                onKeyUp: () => setKeyState(6, false),
            },
            {
                combo: "T",
                group: "useHotkeys Example",
                label: "Play a G5",
                onKeyDown: () => setKeyState(7, true),
                onKeyUp: () => setKeyState(7, false),
            },
            {
                combo: "6",
                group: "useHotkeys Example",
                label: "Play a G#5",
                onKeyDown: () => setKeyState(8, true),
                onKeyUp: () => setKeyState(8, false),
            },
            {
                combo: "Y",
                group: "useHotkeys Example",
                label: "Play a A5",
                onKeyDown: () => setKeyState(9, true),
                onKeyUp: () => setKeyState(9, false),
            },
            {
                combo: "7",
                group: "useHotkeys Example",
                label: "Play a A#5",
                onKeyDown: () => setKeyState(10, true),
                onKeyUp: () => setKeyState(10, false),
            },
            {
                combo: "U",
                group: "useHotkeys Example",
                label: "Play a B5",
                onKeyDown: () => setKeyState(11, true),
                onKeyUp: () => setKeyState(11, false),
            },
            {
                combo: "Z",
                group: "useHotkeys Example",
                label: "Play a C4",
                onKeyDown: () => setKeyState(12, true),
                onKeyUp: () => setKeyState(12, false),
            },
            {
                combo: "S",
                group: "useHotkeys Example",
                label: "Play a C#4",
                onKeyDown: () => setKeyState(13, true),
                onKeyUp: () => setKeyState(13, false),
            },
            {
                combo: "X",
                group: "useHotkeys Example",
                label: "Play a D4",
                onKeyDown: () => setKeyState(14, true),
                onKeyUp: () => setKeyState(14, false),
            },
            {
                combo: "D",
                group: "useHotkeys Example",
                label: "Play a D#4",
                onKeyDown: () => setKeyState(15, true),
                onKeyUp: () => setKeyState(15, false),
            },
            {
                combo: "C",
                group: "useHotkeys Example",
                label: "Play a E4",
                onKeyDown: () => setKeyState(16, true),
                onKeyUp: () => setKeyState(16, false),
            },
            {
                combo: "V",
                group: "useHotkeys Example",
                label: "Play a F4",
                onKeyDown: () => setKeyState(17, true),
                onKeyUp: () => setKeyState(17, false),
            },
            {
                combo: "G",
                group: "useHotkeys Example",
                label: "Play a F#4",
                onKeyDown: () => setKeyState(18, true),
                onKeyUp: () => setKeyState(18, false),
            },
            {
                combo: "B",
                group: "useHotkeys Example",
                label: "Play a G4",
                onKeyDown: () => setKeyState(19, true),
                onKeyUp: () => setKeyState(19, false),
            },
            {
                combo: "H",
                group: "useHotkeys Example",
                label: "Play a G#4",
                onKeyDown: () => setKeyState(20, true),
                onKeyUp: () => setKeyState(20, false),
            },
            {
                combo: "N",
                group: "useHotkeys Example",
                label: "Play a A4",
                onKeyDown: () => setKeyState(21, true),
                onKeyUp: () => setKeyState(21, false),
            },
            {
                combo: "J",
                group: "useHotkeys Example",
                label: "Play a A#4",
                onKeyDown: () => setKeyState(22, true),
                onKeyUp: () => setKeyState(22, false),
            },
            {
                combo: "M",
                group: "useHotkeys Example",
                label: "Play a B4",
                onKeyDown: () => setKeyState(23, true),
                onKeyUp: () => setKeyState(23, false),
            },
        ],
        [focusPiano, setKeyState],
    );
    const { handleKeyDown, handleKeyUp } = useHotkeys(hotkeys);

    const pianoWithAudioContext = React.useMemo(
        () => (
            <>
                <div>
                    <PianoKey note="C5" hotkey="Q" pressed={keyPressed[0]} context={audioContext} />
                    <PianoKey note="C#5" hotkey="2" pressed={keyPressed[1]} context={audioContext} />
                    <PianoKey note="D5" hotkey="W" pressed={keyPressed[2]} context={audioContext} />
                    <PianoKey note="D#5" hotkey="3" pressed={keyPressed[3]} context={audioContext} />
                    <PianoKey note="E5" hotkey="E" pressed={keyPressed[4]} context={audioContext} />
                    <PianoKey note="F5" hotkey="R" pressed={keyPressed[5]} context={audioContext} />
                    <PianoKey note="F#5" hotkey="5" pressed={keyPressed[6]} context={audioContext} />
                    <PianoKey note="G5" hotkey="T" pressed={keyPressed[7]} context={audioContext} />
                    <PianoKey note="G#5" hotkey="6" pressed={keyPressed[8]} context={audioContext} />
                    <PianoKey note="A5" hotkey="Y" pressed={keyPressed[9]} context={audioContext} />
                    <PianoKey note="A#5" hotkey="7" pressed={keyPressed[10]} context={audioContext} />
                    <PianoKey note="B5" hotkey="U" pressed={keyPressed[11]} context={audioContext} />
                </div>
                <div>
                    <PianoKey note="C4" hotkey="Z" pressed={keyPressed[12]} context={audioContext} />
                    <PianoKey note="C#4" hotkey="S" pressed={keyPressed[13]} context={audioContext} />
                    <PianoKey note="D4" hotkey="X" pressed={keyPressed[14]} context={audioContext} />
                    <PianoKey note="D#4" hotkey="D" pressed={keyPressed[15]} context={audioContext} />
                    <PianoKey note="E4" hotkey="C" pressed={keyPressed[16]} context={audioContext} />
                    <PianoKey note="F4" hotkey="V" pressed={keyPressed[17]} context={audioContext} />
                    <PianoKey note="F#4" hotkey="G" pressed={keyPressed[18]} context={audioContext} />
                    <PianoKey note="G4" hotkey="B" pressed={keyPressed[19]} context={audioContext} />
                    <PianoKey note="G#4" hotkey="H" pressed={keyPressed[20]} context={audioContext} />
                    <PianoKey note="A4" hotkey="N" pressed={keyPressed[21]} context={audioContext} />
                    <PianoKey note="A#4" hotkey="J" pressed={keyPressed[22]} context={audioContext} />
                    <PianoKey note="B4" hotkey="M" pressed={keyPressed[23]} context={audioContext} />
                </div>
            </>
        ),
        [audioContext, keyPressed],
    );

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
                {audioContext == null ? (
                    <NonIdealState icon="select" title="Click here to start this WebAudio-based interactive example" />
                ) : (
                    pianoWithAudioContext
                )}
            </div>
        </Example>
    );
};
