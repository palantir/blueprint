/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { JSONFormat } from "../src/cell/formats/jsonFormat";
import { TruncatedFormat } from "../src/cell/formats/truncatedFormat";
import { ReactHarness } from "./harness";
import { expect } from "chai";
import * as React from "react";

describe("Formats", () => {
    const harness = new ReactHarness();

    afterEach(() => {
        harness.unmount();
    });

    after(() => {
        harness.destroy();
    });

    describe("Truncated Format", () => {
        it("truncates by default", () => {
            const str = `
                We are going to die, and that makes us the lucky ones. Most
                people are never going to die because they are never going to
                be born. The potential people who could have been here in my
                place but who will in fact never see the light of day
                outnumber the sand grains of Arabia. Certainly those unborn
                ghosts include greater poets than Keats, scientists greater
                than Newton. We know this because the set of possible people
                allowed by our DNA so massively outnumbers the set of actual
                people. In the teeth of these stupefying odds it is you and I,
                in our ordinariness, that are here. We privileged few, who won
                the lottery of birth against all odds, how dare we whine at
                our inevitable return to that prior state from which the vast
                majority have never stirred?
            `;

            const comp = harness.mount(<TruncatedFormat>{str}</TruncatedFormat>);
            expect(comp.find(".bp-table-truncated-value").text()).to.have.lengthOf(83);
        });

        it("doesn't truncate if text is short enough", () => {
            const str = `quote from Unweaving the Rainbow by Richard Dawkins`;
            const comp = harness.mount(<TruncatedFormat>{str}</TruncatedFormat>);
            expect(comp.find(".bp-table-truncated-text").text()).to.have.lengthOf(str.length);
        });

        it("doesn't truncate if truncation length is 0", () => {
            const str = `
                To be, or not to be--that is the question:
                Whether 'tis nobler in the mind to suffer
                The slings and arrows of outrageous fortune
                Or to take arms against a sea of troubles
                And by opposing end them. To die, to sleep--
                No more--and by a sleep to say we end
                The heartache, and the thousand natural shocks
                That flesh is heir to. 'Tis a consummation
                Devoutly to be wished. To die, to sleep--
                To sleep--perchance to dream: ay, there's the rub,
                For in that sleep of death what dreams may come
                When we have shuffled off this mortal coil,
                Must give us pause. There's the respect
                That makes calamity of so long life.
                For who would bear the whips and scorns of time,
                Th' oppressor's wrong, the proud man's contumely
                The pangs of despised love, the law's delay,
                The insolence of office, and the spurns
                That patient merit of th' unworthy takes,
                When he himself might his quietus make
                With a bare bodkin? Who would fardels bear,
                To grunt and sweat under a weary life,
                But that the dread of something after death,
                The undiscovered country, from whose bourn
                No traveller returns, puzzles the will,
                And makes us rather bear those ills we have
                Than fly to others that we know not of?
                Thus conscience does make cowards of us all,
                And thus the native hue of resolution
                Is sicklied o'er with the pale cast of thought,
                And enterprise of great pitch and moment
                With this regard their currents turn awry
                And lose the name of action. -- Soft you now,
                The fair Ophelia! -- Nymph, in thy orisons
                Be all my sins remembered.
            `;
            const comp = harness.mount(<TruncatedFormat truncateLength={0}>{str}</TruncatedFormat>);
            expect(comp.find(".bp-table-truncated-text").text()).to.have.lengthOf(str.length);
        });
    });

    describe("JSON Format", () => {
        it("stringifies JSON", () => {
            const obj = {help: "me", "i'm" : 1234};
            const str = JSON.stringify(obj, null, 2);
            const comp = harness.mount(<JSONFormat>{obj}</JSONFormat>);
            expect(comp.find(".bp-table-truncated-text").text()).to.equal(str);
        });

        it("omits quotes on strings and null-likes", () => {
            let comp = harness.mount(<JSONFormat>{"a string"}</JSONFormat>);
            expect(comp.find(".bp-table-truncated-text").text()).to.equal("a string");

            comp = harness.mount(<JSONFormat>{null}</JSONFormat>);
            expect(comp.find(".bp-table-truncated-text").text()).to.equal("null");

            comp = harness.mount(<JSONFormat>{undefined}</JSONFormat>);
            expect(comp.find(".bp-table-truncated-text").text()).to.equal("undefined");
        });
    });

});
