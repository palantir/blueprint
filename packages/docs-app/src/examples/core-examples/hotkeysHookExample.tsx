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

import { useHotkeys } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";

import { PianoKey } from "./audio";

export const UseHotkeysExample: React.FC<IExampleProps> = props => {
    const [audioContext, setAudioContext] = React.useState<AudioContext>();

    const pianoRef = React.useRef<HTMLDivElement>();
    const focusPiano = React.useCallback(() => {
        pianoRef?.current.focus();
        if (typeof window.AudioContext !== "undefined" && audioContext === undefined) {
            setAudioContext(new AudioContext());
        }
    }, [pianoRef]);

    const keys = Array.apply(null, Array(24))
        .map(() => React.useState(() => false), [])
        .map(([pressed, setPressed]) => ({
            pressed,
            setPressed,
        }));

    const { handleKeyDown, handleKeyUp } = useHotkeys([
        {
            combo: "shift + P",
            global: true,
            label: "Focus the piano",
            onKeyDown: focusPiano,
        },
        {
            combo: "Q",
            label: "Play a C5",
            onKeyDown: () => keys[0].setPressed(true),
            onKeyUp: () => keys[0].setPressed(true),
        },
        {
            combo: "2",
            label: "Play a C#5",
            onKeyDown: () => keys[1].setPressed(true),
            onKeyUp: () => keys[1].setPressed(true),
        },
        {
            combo: "W",
            label: "Play a D5",
            onKeyDown: () => keys[2].setPressed(true),
            onKeyUp: () => keys[2].setPressed(true),
        },
        {
            combo: "3",
            label: "Play a D#5",
            onKeyDown: () => keys[3].setPressed(true),
            onKeyUp: () => keys[3].setPressed(true),
        },
    ]);

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
