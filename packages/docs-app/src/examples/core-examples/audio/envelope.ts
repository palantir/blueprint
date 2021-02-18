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

export class Envelope {
    public amplitude: AudioParam;

    public gain: GainNode;

    private attackLevel = 0.4;

    private attackTime = 0.1;

    private sustainLevel = 0.2;

    private sustainTime = 0.1;

    private releaseTime = 0.2;

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
