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

import classNames from "classnames";
import * as React from "react";

import { Classes } from "@blueprintjs/core";

import { Envelope } from "./envelope";
import { Oscillator } from "./oscillator";
import { Scale } from "./scale";

interface PianoKeyProps {
    note: string;
    hotkey: string;
    pressed: boolean;
    context: AudioContext;
}

export const PianoKey: React.FC<PianoKeyProps> = ({ context, hotkey, note, pressed }) => {
    const [envelope, setEnvelope] = React.useState<Envelope | undefined>();
    // use this flag to defer connecting to main audio output until we actually press a note, which prevents
    // a bug where all keys were being played on component mount
    const [isOutputEnabled, setIsOutputEnabeld] = React.useState<boolean>(false);

    // only create oscillator and envelope once on mount
    React.useEffect(() => {
        const oscillator = new Oscillator(context, Scale[note]);
        const newEnvelope = new Envelope(context);
        oscillator.oscillator.connect(newEnvelope.gain);
        setEnvelope(newEnvelope);

        return () => {
            oscillator.oscillator.disconnect();
            newEnvelope.gain.disconnect();
            setEnvelope(undefined);
        };
    }, [context, note]);

    // start/stop envelope when this key is pressed down/up
    React.useEffect(() => {
        if (pressed) {
            if (!isOutputEnabled) {
                // connect to audio output if we haven't already
                envelope.gain.connect(context.destination);
                setIsOutputEnabeld(true);
            }

            envelope?.on();
        } else {
            envelope?.off();
        }

        return () => envelope?.off();
    }, [context.destination, envelope, isOutputEnabled, pressed]);

    const classes = classNames("piano-key", {
        "piano-key-pressed": pressed,
        "piano-key-sharp": /\#/.test(note),
    });
    const elevation = classNames(pressed ? Classes.ELEVATION_0 : Classes.ELEVATION_2);
    return (
        <div className={classes}>
            <div className={elevation}>
                <div className="piano-key-text">
                    <span className="piano-key-note">{note}</span>
                    <br />
                    <kbd className="piano-key-hotkey">{hotkey}</kbd>
                </div>
            </div>
        </div>
    );
};
