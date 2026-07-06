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

import { useCallback, useMemo, useRef, useState } from "react";

import { type HotkeyProps, HotkeysTarget, NonIdealState } from "@blueprintjs/core";
import { Example, type ExampleProps } from "@blueprintjs/docs-theme";

import { PianoKey } from "./audio";

/**
 * Similar to UseHotkeysExample, but using a HotkeysTarget component API pattern.
 */
export const HotkeysTargetExample: React.FC<ExampleProps> = props => {
    const [keys, setKeys] = useState<boolean[]>(() => Array(24).fill(false));
    const [audioContext, setAudioContext] = useState<AudioContext | undefined>(undefined);

    const pianoRef = useRef<HTMLDivElement>(null);

    const focusPiano = useCallback(() => {
        pianoRef.current?.focus();
        if (typeof window.AudioContext !== "undefined") {
            setAudioContext(prev => prev ?? new AudioContext());
        }
    }, []);

    const getKeySetter = useCallback((index: number, keyState: boolean) => {
        return () => {
            setKeys(prev => {
                const next = prev.slice();
                next[index] = keyState;
                return next;
            });
        };
    }, []);

    const hotkeys: HotkeyProps[] = useMemo(
        () => [
            {
                combo: "shift + P",
                global: true,
                label: "Focus the piano",
                onKeyDown: focusPiano,
            },
            {
                combo: "Q",
                group: "HotkeysTarget Example",
                label: "Play a C5",
                onKeyDown: getKeySetter(0, true),
                onKeyUp: getKeySetter(0, false),
            },
            {
                combo: "2",
                group: "HotkeysTarget Example",
                label: "Play a C#5",
                onKeyDown: getKeySetter(1, true),
                onKeyUp: getKeySetter(1, false),
            },
            {
                combo: "W",
                group: "HotkeysTarget Example",
                label: "Play a D5",
                onKeyDown: getKeySetter(2, true),
                onKeyUp: getKeySetter(2, false),
            },
            {
                combo: "3",
                group: "HotkeysTarget Example",
                label: "Play a D#5",
                onKeyDown: getKeySetter(3, true),
                onKeyUp: getKeySetter(3, false),
            },
            {
                combo: "E",
                group: "HotkeysTarget Example",
                label: "Play a E5",
                onKeyDown: getKeySetter(4, true),
                onKeyUp: getKeySetter(4, false),
            },
            {
                combo: "R",
                group: "HotkeysTarget Example",
                label: "Play a F5",
                onKeyDown: getKeySetter(5, true),
                onKeyUp: getKeySetter(5, false),
            },
            {
                combo: "5",
                group: "HotkeysTarget Example",
                label: "Play a F#5",
                onKeyDown: getKeySetter(6, true),
                onKeyUp: getKeySetter(6, false),
            },
            {
                combo: "T",
                group: "HotkeysTarget Example",
                label: "Play a G5",
                onKeyDown: getKeySetter(7, true),
                onKeyUp: getKeySetter(7, false),
            },
            {
                combo: "6",
                group: "HotkeysTarget Example",
                label: "Play a G#5",
                onKeyDown: getKeySetter(8, true),
                onKeyUp: getKeySetter(8, false),
            },
            {
                combo: "Y",
                group: "HotkeysTarget Example",
                label: "Play a A5",
                onKeyDown: getKeySetter(9, true),
                onKeyUp: getKeySetter(9, false),
            },
            {
                combo: "7",
                group: "HotkeysTarget Example",
                label: "Play a A#5",
                onKeyDown: getKeySetter(10, true),
                onKeyUp: getKeySetter(10, false),
            },
            {
                combo: "U",
                group: "HotkeysTarget Example",
                label: "Play a B5",
                onKeyDown: getKeySetter(11, true),
                onKeyUp: getKeySetter(11, false),
            },
            {
                combo: "Z",
                group: "HotkeysTarget Example",
                label: "Play a C4",
                onKeyDown: getKeySetter(12, true),
                onKeyUp: getKeySetter(12, false),
            },
            {
                combo: "S",
                group: "HotkeysTarget Example",
                label: "Play a C#4",
                onKeyDown: getKeySetter(13, true),
                onKeyUp: getKeySetter(13, false),
            },
            {
                combo: "X",
                group: "HotkeysTarget Example",
                label: "Play a D4",
                onKeyDown: getKeySetter(14, true),
                onKeyUp: getKeySetter(14, false),
            },
            {
                combo: "D",
                group: "HotkeysTarget Example",
                label: "Play a D#4",
                onKeyDown: getKeySetter(15, true),
                onKeyUp: getKeySetter(15, false),
            },
            {
                combo: "C",
                group: "HotkeysTarget Example",
                label: "Play a E4",
                onKeyDown: getKeySetter(16, true),
                onKeyUp: getKeySetter(16, false),
            },
            {
                combo: "V",
                group: "HotkeysTarget Example",
                label: "Play a F4",
                onKeyDown: getKeySetter(17, true),
                onKeyUp: getKeySetter(17, false),
            },
            {
                combo: "G",
                group: "HotkeysTarget Example",
                label: "Play a F#4",
                onKeyDown: getKeySetter(18, true),
                onKeyUp: getKeySetter(18, false),
            },
            {
                combo: "B",
                group: "HotkeysTarget Example",
                label: "Play a G4",
                onKeyDown: getKeySetter(19, true),
                onKeyUp: getKeySetter(19, false),
            },
            {
                combo: "H",
                group: "HotkeysTarget Example",
                label: "Play a G#4",
                onKeyDown: getKeySetter(20, true),
                onKeyUp: getKeySetter(20, false),
            },
            {
                combo: "N",
                group: "HotkeysTarget Example",
                label: "Play a A4",
                onKeyDown: getKeySetter(21, true),
                onKeyUp: getKeySetter(21, false),
            },
            {
                combo: "J",
                group: "HotkeysTarget Example",
                label: "Play a A#4",
                onKeyDown: getKeySetter(22, true),
                onKeyUp: getKeySetter(22, false),
            },
            {
                combo: "M",
                group: "HotkeysTarget Example",
                label: "Play a B4",
                onKeyDown: getKeySetter(23, true),
                onKeyUp: getKeySetter(23, false),
            },
        ],
        [focusPiano, getKeySetter],
    );

    const renderPianoWithAudioContext = (context: AudioContext) => (
        <>
            <div>
                <PianoKey note="C5" hotkey="Q" pressed={keys[0]} context={context} />
                <PianoKey note="C#5" hotkey="2" pressed={keys[1]} context={context} />
                <PianoKey note="D5" hotkey="W" pressed={keys[2]} context={context} />
                <PianoKey note="D#5" hotkey="3" pressed={keys[3]} context={context} />
                <PianoKey note="E5" hotkey="E" pressed={keys[4]} context={context} />
                <PianoKey note="F5" hotkey="R" pressed={keys[5]} context={context} />
                <PianoKey note="F#5" hotkey="5" pressed={keys[6]} context={context} />
                <PianoKey note="G5" hotkey="T" pressed={keys[7]} context={context} />
                <PianoKey note="G#5" hotkey="6" pressed={keys[8]} context={context} />
                <PianoKey note="A5" hotkey="Y" pressed={keys[9]} context={context} />
                <PianoKey note="A#5" hotkey="7" pressed={keys[10]} context={context} />
                <PianoKey note="B5" hotkey="U" pressed={keys[11]} context={context} />
            </div>
            <div>
                <PianoKey note="C4" hotkey="Z" pressed={keys[12]} context={context} />
                <PianoKey note="C#4" hotkey="S" pressed={keys[13]} context={context} />
                <PianoKey note="D4" hotkey="X" pressed={keys[14]} context={context} />
                <PianoKey note="D#4" hotkey="D" pressed={keys[15]} context={context} />
                <PianoKey note="E4" hotkey="C" pressed={keys[16]} context={context} />
                <PianoKey note="F4" hotkey="V" pressed={keys[17]} context={context} />
                <PianoKey note="F#4" hotkey="G" pressed={keys[18]} context={context} />
                <PianoKey note="G4" hotkey="B" pressed={keys[19]} context={context} />
                <PianoKey note="G#4" hotkey="H" pressed={keys[20]} context={context} />
                <PianoKey note="A4" hotkey="N" pressed={keys[21]} context={context} />
                <PianoKey note="A#4" hotkey="J" pressed={keys[22]} context={context} />
                <PianoKey note="B4" hotkey="M" pressed={keys[23]} context={context} />
            </div>
        </>
    );

    return (
        <Example className="docs-hotkeys-target-2-example" options={false} {...props}>
            <HotkeysTarget hotkeys={hotkeys}>
                {({ handleKeyDown, handleKeyUp }) => (
                    <div
                        tabIndex={0}
                        className="docs-hotkey-piano-example"
                        ref={pianoRef}
                        onClick={focusPiano}
                        onKeyDown={handleKeyDown}
                        onKeyUp={handleKeyUp}
                    >
                        {audioContext == null ? (
                            <NonIdealState
                                icon="select"
                                title="Click here to start this WebAudio-based interactive example"
                            />
                        ) : (
                            renderPianoWithAudioContext(audioContext)
                        )}
                    </div>
                )}
            </HotkeysTarget>
        </Example>
    );
};
