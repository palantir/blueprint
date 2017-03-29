/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

// tslint:disable max-classes-per-file

import * as classNames from "classnames";
import * as React from "react";

import { Hotkey, Hotkeys, HotkeysTarget } from "@blueprintjs/core";
import BaseExample from "@blueprintjs/docs/dist/components/baseExample";

class Oscillator {
    public oscillator: OscillatorNode;

    public constructor(private context: AudioContext, freq: number) {
        this.oscillator = this.context.createOscillator();
        this.oscillator.type = "sine";
        this.oscillator.frequency.value = freq;
        this.oscillator.start(0);
    }
}

class Envelope {
    public amplitude: AudioParam;
    public gain: GainNode;

    private attackLevel = 0.8;
    private attackTime = 0.1;
    private sustainLevel = 0.3;
    private sustainTime = 0.1;
    private releaseTime = 0.4;

    public constructor(private context: AudioContext) {
        this.gain = this.context.createGain();
        this.amplitude = this.gain.gain;
        this.amplitude.value = 0;
    }

    public on() {
        const now = this.context.currentTime;
        this.amplitude.cancelScheduledValues(now);
        this.amplitude.setValueAtTime(this.amplitude.value, now);
        this.amplitude.linearRampToValueAtTime(this.attackLevel, now + this.attackTime);
        this.amplitude.exponentialRampToValueAtTime(this.sustainLevel, now + this.attackTime + this.sustainTime);
    }

    public off() {
        const now = this.context.currentTime;
        // The below code helps remove waveform popping artifacts, but there is
        // a bug in Firefox that breaks the whole example if we use it.
        // this.amplitude.cancelScheduledValues(now);
        // this.amplitude.setValueAtTime(this.amplitude.value, now);
        this.amplitude.exponentialRampToValueAtTime(0.01, now + this.releaseTime);
        this.amplitude.linearRampToValueAtTime(0, now + this.releaseTime + 0.01);
    }
}

// alph sorting does not follow a logical order here
// tslint:disable object-literal-sort-keys
const Scale = {
    "A3": 220.00,
    "A#3": 233.08,
    "B3": 246.94,
    "C4": 261.63,
    "C#4": 277.18,
    "D4": 293.66,
    "D#4": 311.13,
    "E4": 329.63,
    "F4": 349.23,
    "F#4": 369.99,
    "G4": 392.00,
    "G#4": 415.30,
    "A4": 440.00,
    "A#4": 466.16,
    "B4": 493.88,
    "C5": 523.25,
    "C#5": 554.37,
    "D5": 587.33,
    "D#5": 622.25,
    "E5": 659.25,
    "F5": 698.46,
    "F#5": 739.99,
    "G5": 783.99,
    "G#5": 830.61,
    "A5": 880.00,
    "A#5": 932.33,
    "B5": 987.77,
} as {[note: string]: number};
// tslint:enable object-literal-sort-keys

interface IPianoKeyProps {
    note: string;
    hotkey: string;
    pressed: boolean;
    context: AudioContext;
}

class PianoKey extends React.Component<IPianoKeyProps, {}> {
    private oscillator: Oscillator;
    private envelope: Envelope;

    public constructor(props: IPianoKeyProps) {
        super(props);

        const { context, note } = this.props;
        this.oscillator = new Oscillator(context, Scale[note]);
        this.envelope = new Envelope(context);
        this.oscillator.oscillator.connect(this.envelope.gain);
        this.envelope.gain.connect(context.destination);
    }

    public componentWillReceiveProps(nextProps: IPianoKeyProps) {
        if (this.props.pressed === false && nextProps.pressed === true) {
            this.envelope.on();
        } else if (this.props.pressed === true && nextProps.pressed === false) {
            this.envelope.off();
        }
    }

    public render() {
        const { hotkey, note, pressed } = this.props;
        const classes = classNames("piano-key", {
            "piano-key-pressed": pressed,
            "piano-key-sharp": /\#/.test(note),
        });
        const elevation = classNames(pressed ? "pt-elevation-0" : "pt-elevation-2");
        return <div className={classes}>
            <div className={elevation}>
                <div className="piano-key-text">
                    <span className="piano-key-note">{note}</span><br />
                    <kbd className="piano-key-hotkey">{hotkey}</kbd>
               </div>
            </div>
        </div>;
    }
}

export interface IHotkeyPianoState {
    keys: boolean[];
}

/* tslint:disable-next-line:no-string-literal */
const AUDIO_CONTEXT = ((window as any)["AudioContext"] != null) ? new AudioContext() : null;

@HotkeysTarget
export class HotkeyPiano extends BaseExample<IHotkeyPianoState> {
    public state: IHotkeyPianoState = {
        // Use feature detection to disable example if we have to
        keys: Array.apply(null, Array(24)).map(() => false),
    };

    private pianoRef: HTMLElement;

    /* tslint:disable:max-line-length */
    public renderHotkeys() {
        return <Hotkeys tabIndex={null}>
            <Hotkey global label="Focus the piano" combo="shift + P" onKeyDown={this.focusPiano} />

            <Hotkey group="Piano" label="Play a C5"  combo="Q" onKeyDown={this.setKey(0, true)} onKeyUp={this.setKey(0, false)} />
            <Hotkey group="Piano" label="Play a C#5" combo="2" onKeyDown={this.setKey(1, true)} onKeyUp={this.setKey(1, false)} />
            <Hotkey group="Piano" label="Play a D5"  combo="W" onKeyDown={this.setKey(2, true)} onKeyUp={this.setKey(2, false)} />
            <Hotkey group="Piano" label="Play a D#5" combo="3" onKeyDown={this.setKey(3, true)} onKeyUp={this.setKey(3, false)} />
            <Hotkey group="Piano" label="Play a E5"  combo="E" onKeyDown={this.setKey(4, true)} onKeyUp={this.setKey(4, false)} />
            <Hotkey group="Piano" label="Play a F5"  combo="R" onKeyDown={this.setKey(5, true)} onKeyUp={this.setKey(5, false)} />
            <Hotkey group="Piano" label="Play a F#5" combo="5" onKeyDown={this.setKey(6, true)} onKeyUp={this.setKey(6, false)} />
            <Hotkey group="Piano" label="Play a G5"  combo="T" onKeyDown={this.setKey(7, true)} onKeyUp={this.setKey(7, false)} />
            <Hotkey group="Piano" label="Play a G#5" combo="6" onKeyDown={this.setKey(8, true)} onKeyUp={this.setKey(8, false)} />
            <Hotkey group="Piano" label="Play a A5"  combo="Y" onKeyDown={this.setKey(9, true)} onKeyUp={this.setKey(9, false)} />
            <Hotkey group="Piano" label="Play a A#5" combo="7" onKeyDown={this.setKey(10, true)} onKeyUp={this.setKey(10, false)} />
            <Hotkey group="Piano" label="Play a B5"  combo="U" onKeyDown={this.setKey(11, true)} onKeyUp={this.setKey(11, false)} />

            <Hotkey group="Piano" label="Play a C4"  combo="Z" onKeyDown={this.setKey(12, true)} onKeyUp={this.setKey(12, false)} />
            <Hotkey group="Piano" label="Play a C#4" combo="S" onKeyDown={this.setKey(13, true)} onKeyUp={this.setKey(13, false)} />
            <Hotkey group="Piano" label="Play a D4"  combo="X" onKeyDown={this.setKey(14, true)} onKeyUp={this.setKey(14, false)} />
            <Hotkey group="Piano" label="Play a D#4" combo="D" onKeyDown={this.setKey(15, true)} onKeyUp={this.setKey(15, false)} />
            <Hotkey group="Piano" label="Play a E4"  combo="C" onKeyDown={this.setKey(16, true)} onKeyUp={this.setKey(16, false)} />
            <Hotkey group="Piano" label="Play a F4"  combo="V" onKeyDown={this.setKey(17, true)} onKeyUp={this.setKey(17, false)} />
            <Hotkey group="Piano" label="Play a F#4" combo="G" onKeyDown={this.setKey(18, true)} onKeyUp={this.setKey(18, false)} />
            <Hotkey group="Piano" label="Play a G4"  combo="B" onKeyDown={this.setKey(19, true)} onKeyUp={this.setKey(19, false)} />
            <Hotkey group="Piano" label="Play a G#4" combo="H" onKeyDown={this.setKey(20, true)} onKeyUp={this.setKey(20, false)} />
            <Hotkey group="Piano" label="Play a A4"  combo="N" onKeyDown={this.setKey(21, true)} onKeyUp={this.setKey(21, false)} />
            <Hotkey group="Piano" label="Play a A#4" combo="J" onKeyDown={this.setKey(22, true)} onKeyUp={this.setKey(22, false)} />
            <Hotkey group="Piano" label="Play a B4"  combo="M" onKeyDown={this.setKey(23, true)} onKeyUp={this.setKey(23, false)} />
        </Hotkeys>;
    }
    /* tslint:enable:max-line-length */

    protected renderExample() {
        const { keys } = this.state;

        if (AUDIO_CONTEXT == null) {
            return <div tabIndex={0} className="piano-example" ref={this.handleSetPianoRef}>
                Oops! This browser does not support the WebAudio API needed for this example.
            </div>;
        }

        return <div tabIndex={0} className="piano-example" ref={this.handleSetPianoRef}>
            <div>
                <PianoKey note="C5"  hotkey="Q" pressed={keys[0]} context={AUDIO_CONTEXT} />
                <PianoKey note="C#5" hotkey="2" pressed={keys[1]} context={AUDIO_CONTEXT} />
                <PianoKey note="D5"  hotkey="W" pressed={keys[2]} context={AUDIO_CONTEXT} />
                <PianoKey note="D#5" hotkey="3" pressed={keys[3]} context={AUDIO_CONTEXT} />
                <PianoKey note="E5"  hotkey="E" pressed={keys[4]} context={AUDIO_CONTEXT} />
                <PianoKey note="F5"  hotkey="R" pressed={keys[5]} context={AUDIO_CONTEXT} />
                <PianoKey note="F#5" hotkey="5" pressed={keys[6]} context={AUDIO_CONTEXT} />
                <PianoKey note="G5"  hotkey="T" pressed={keys[7]} context={AUDIO_CONTEXT} />
                <PianoKey note="G#5" hotkey="6" pressed={keys[8]} context={AUDIO_CONTEXT} />
                <PianoKey note="A5"  hotkey="Y" pressed={keys[9]} context={AUDIO_CONTEXT} />
                <PianoKey note="A#5" hotkey="7" pressed={keys[10]} context={AUDIO_CONTEXT} />
                <PianoKey note="B5"  hotkey="U" pressed={keys[11]} context={AUDIO_CONTEXT} />
            </div>
            <div>
                <PianoKey note="C4"  hotkey="Z" pressed={keys[12]} context={AUDIO_CONTEXT} />
                <PianoKey note="C#4" hotkey="S" pressed={keys[13]} context={AUDIO_CONTEXT} />
                <PianoKey note="D4"  hotkey="X" pressed={keys[14]} context={AUDIO_CONTEXT} />
                <PianoKey note="D#4" hotkey="D" pressed={keys[15]} context={AUDIO_CONTEXT} />
                <PianoKey note="E4"  hotkey="C" pressed={keys[16]} context={AUDIO_CONTEXT} />
                <PianoKey note="F4"  hotkey="V" pressed={keys[17]} context={AUDIO_CONTEXT} />
                <PianoKey note="F#4" hotkey="G" pressed={keys[18]} context={AUDIO_CONTEXT} />
                <PianoKey note="G4"  hotkey="B" pressed={keys[19]} context={AUDIO_CONTEXT} />
                <PianoKey note="G#4" hotkey="H" pressed={keys[20]} context={AUDIO_CONTEXT} />
                <PianoKey note="A4"  hotkey="N" pressed={keys[21]} context={AUDIO_CONTEXT} />
                <PianoKey note="A#4" hotkey="J" pressed={keys[22]} context={AUDIO_CONTEXT} />
                <PianoKey note="B4"  hotkey="M" pressed={keys[23]} context={AUDIO_CONTEXT} />
            </div>
        </div>;
    }

    private handleSetPianoRef = (ref: Element) => {
        this.pianoRef = ref as HTMLElement;
    }

    private focusPiano = () => {
        if (this.pianoRef != null) {
            this.pianoRef.focus();
        }
    }

    private setKey = (index: number, keyState: boolean) => {
        return () => {
            const keys = this.state.keys.slice();
            keys[index] = keyState;
            this.setState({ keys });
        };
    }
}
