/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { expect } from "chai";

import * as PlatformUtils from "../../../src/common/internal/platformUtils";

describe("platformUtils", () => {
    describe("isMac", () => {
        it("returns false for non-Mac platforms", () => {
            expect(PlatformUtils.isMac("Win32")).to.be.false;
            expect(PlatformUtils.isMac("linux")).to.be.false;
        });

        it("returns true for Mac platforms", () => {
            expect(PlatformUtils.isMac("Mac")).to.be.true;
            expect(PlatformUtils.isMac("iPhone")).to.be.true;
            expect(PlatformUtils.isMac("iPod")).to.be.true;
            expect(PlatformUtils.isMac("iPad")).to.be.true;
        });
    });

    describe("isModKeyPressed", () => {
        describe("on non-Mac platform", () => {
            const PLATFORM = "Win32";

            it("returns true if CTRL key pressed", () => {
                const fakeEvent: any = { metaKey: false, ctrlKey: true };
                expect(PlatformUtils.isModKeyPressed(fakeEvent, PLATFORM)).to.be.true;
            });

            it("returns false if META key pressed", () => {
                const fakeEvent: any = { metaKey: true, ctrlKey: false };
                expect(PlatformUtils.isModKeyPressed(fakeEvent, PLATFORM)).to.be.false;
            });

            it("returns true if both CTRL and META keys pressed", () => {
                const fakeEvent: any = { metaKey: true, ctrlKey: true };
                expect(PlatformUtils.isModKeyPressed(fakeEvent, PLATFORM)).to.be.true;
            });
        });

        describe("on Mac platform", () => {
            const PLATFORM = "Mac";

            it("returns true if META key pressed", () => {
                const fakeEvent: any = { metaKey: true, ctrlKey: false };
                expect(PlatformUtils.isModKeyPressed(fakeEvent, PLATFORM)).to.be.true;
            });

            it("returns false if CTRL key pressed", () => {
                const fakeEvent: any = { metaKey: false, ctrlKey: true };
                expect(PlatformUtils.isModKeyPressed(fakeEvent, PLATFORM)).to.be.false;
            });

            it("returns true if both CTRL and META keys pressed", () => {
                const fakeEvent: any = { metaKey: true, ctrlKey: true };
                expect(PlatformUtils.isModKeyPressed(fakeEvent, PLATFORM)).to.be.true;
            });
        });
    });
});
