/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import type { MiddlewareConfig } from "../..";
import { PopoverPosition } from "../popover/popoverPosition";
import type { PopperModifierOverrides } from "../popover/popoverSharedProps";

import { popoverPositionToNextPlacement, popperModifiersToNextMiddleware } from "./popoverNextMigrationUtils";

describe("popoverPositionToNextPlacement", () => {
    it("should convert top-left to top-start", () => {
        expect(popoverPositionToNextPlacement(PopoverPosition.TOP_LEFT)).to.equal("top-start");
    });

    it("should convert top to top", () => {
        expect(popoverPositionToNextPlacement(PopoverPosition.TOP)).to.equal("top");
    });

    it("should convert top-right to top-end", () => {
        expect(popoverPositionToNextPlacement(PopoverPosition.TOP_RIGHT)).to.equal("top-end");
    });

    it("should convert right-top to right-start", () => {
        expect(popoverPositionToNextPlacement(PopoverPosition.RIGHT_TOP)).to.equal("right-start");
    });

    it("should convert right to right", () => {
        expect(popoverPositionToNextPlacement(PopoverPosition.RIGHT)).to.equal("right");
    });

    it("should convert right-bottom to right-end", () => {
        expect(popoverPositionToNextPlacement(PopoverPosition.RIGHT_BOTTOM)).to.equal("right-end");
    });

    it("should convert bottom-right to bottom-end", () => {
        expect(popoverPositionToNextPlacement(PopoverPosition.BOTTOM_RIGHT)).to.equal("bottom-end");
    });

    it("should convert bottom to bottom", () => {
        expect(popoverPositionToNextPlacement(PopoverPosition.BOTTOM)).to.equal("bottom");
    });

    it("should convert bottom-left to bottom-start", () => {
        expect(popoverPositionToNextPlacement(PopoverPosition.BOTTOM_LEFT)).to.equal("bottom-start");
    });

    it("should convert left-bottom to left-end", () => {
        expect(popoverPositionToNextPlacement(PopoverPosition.LEFT_BOTTOM)).to.equal("left-end");
    });

    it("should convert left to left", () => {
        expect(popoverPositionToNextPlacement(PopoverPosition.LEFT)).to.equal("left");
    });

    it("should convert left-top to left-start", () => {
        expect(popoverPositionToNextPlacement(PopoverPosition.LEFT_TOP)).to.equal("left-start");
    });

    it("should return undefined for auto", () => {
        expect(popoverPositionToNextPlacement("auto")).to.be.undefined;
    });

    it("should return undefined for auto-start", () => {
        expect(popoverPositionToNextPlacement("auto-start")).to.be.undefined;
    });

    it("should return undefined for auto-end", () => {
        expect(popoverPositionToNextPlacement("auto-end")).to.be.undefined;
    });
});

describe("popperModifiersToNextMiddleware", () => {
    it("should return empty config when given empty modifiers", () => {
        expect(popperModifiersToNextMiddleware({})).to.deep.equal({});
    });

    describe("flip", () => {
        it("should omit flip middleware when enabled is false", () => {
            const value: PopperModifierOverrides = { flip: { enabled: false } };
            const expected: MiddlewareConfig = {};
            expect(popperModifiersToNextMiddleware(value)).to.deep.equal(expected);
        });

        it("should map flip modifier to flip middleware", () => {
            const value: PopperModifierOverrides = { flip: {} };
            const expected: MiddlewareConfig = { flip: {} };
            expect(popperModifiersToNextMiddleware(value)).to.deep.equal(expected);
        });

        it("should map flip padding option", () => {
            const value: PopperModifierOverrides = { flip: { options: { padding: 8 } } };
            const expected: MiddlewareConfig = { flip: { padding: 8 } };
            expect(popperModifiersToNextMiddleware(value)).to.deep.equal(expected);
        });

        it("should map flip fallbackPlacements option", () => {
            const value: PopperModifierOverrides = { flip: { options: { fallbackPlacements: ["top", "bottom"] } } };
            const expected: MiddlewareConfig = { flip: { fallbackPlacements: ["top", "bottom"] } };
            expect(popperModifiersToNextMiddleware(value)).to.deep.equal(expected);
        });

        it("should map flip flipVariations to flipAlignment", () => {
            const value: PopperModifierOverrides = { flip: { options: { flipVariations: false } } };
            const expected: MiddlewareConfig = { flip: { flipAlignment: false } };
            expect(popperModifiersToNextMiddleware(value)).to.deep.equal(expected);
        });

        it("should map flip mainAxis option", () => {
            const value: PopperModifierOverrides = { flip: { options: { mainAxis: false } } };
            const expected: MiddlewareConfig = { flip: { mainAxis: false } };
            expect(popperModifiersToNextMiddleware(value)).to.deep.equal(expected);
        });

        it("should map flip altAxis to crossAxis", () => {
            const value: PopperModifierOverrides = { flip: { options: { altAxis: false } } };
            const expected: MiddlewareConfig = { flip: { crossAxis: false } };
            expect(popperModifiersToNextMiddleware(value)).to.deep.equal(expected);
        });
    });

    describe("preventOverflow", () => {
        it("should omit shift middleware when enabled is false", () => {
            const value: PopperModifierOverrides = { preventOverflow: { enabled: false } };
            const expected: MiddlewareConfig = {};
            expect(popperModifiersToNextMiddleware(value)).to.deep.equal(expected);
        });

        it("should map preventOverflow modifier to shift middleware", () => {
            const value: PopperModifierOverrides = { preventOverflow: {} };
            const expected: MiddlewareConfig = { shift: {} };
            expect(popperModifiersToNextMiddleware(value)).to.deep.equal(expected);
        });

        it("should map preventOverflow padding option", () => {
            const value: PopperModifierOverrides = { preventOverflow: { options: { padding: 4 } } };
            const expected: MiddlewareConfig = { shift: { padding: 4 } };
            expect(popperModifiersToNextMiddleware(value)).to.deep.equal(expected);
        });

        it("should map preventOverflow mainAxis option", () => {
            const value: PopperModifierOverrides = { preventOverflow: { options: { mainAxis: false } } };
            const expected: MiddlewareConfig = { shift: { mainAxis: false } };
            expect(popperModifiersToNextMiddleware(value)).to.deep.equal(expected);
        });

        it("should map preventOverflow altAxis to crossAxis", () => {
            const value: PopperModifierOverrides = { preventOverflow: { options: { altAxis: true } } };
            const expected: MiddlewareConfig = { shift: { crossAxis: true } };
            expect(popperModifiersToNextMiddleware(value)).to.deep.equal(expected);
        });
    });

    describe("offset", () => {
        it("should omit offset middleware when enabled is false", () => {
            const value: PopperModifierOverrides = { offset: { enabled: false, options: { offset: [0, 10] } } };
            const expected: MiddlewareConfig = {};
            expect(popperModifiersToNextMiddleware(value)).to.deep.equal(expected);
        });

        it("should map offset [skidding, distance] tuple to { crossAxis, mainAxis }", () => {
            const value: PopperModifierOverrides = { offset: { options: { offset: [5, 10] } } };
            const expected: MiddlewareConfig = { offset: { crossAxis: 5, mainAxis: 10 } };
            expect(popperModifiersToNextMiddleware(value)).to.deep.equal(expected);
        });

        it("should map offset [0, distance] tuple with zero skidding", () => {
            const value: PopperModifierOverrides = { offset: { options: { offset: [0, 15] } } };
            const expected: MiddlewareConfig = { offset: { crossAxis: 0, mainAxis: 15 } };
            expect(popperModifiersToNextMiddleware(value)).to.deep.equal(expected);
        });

        it("should warn and omit offset when offset is a function", () => {
            const warnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());
            const value: PopperModifierOverrides = { offset: { options: { offset: () => [0, 0] } } };
            const expected: MiddlewareConfig = {};
            expect(popperModifiersToNextMiddleware(value)).to.deep.equal(expected);
            expect(warnSpy).toHaveBeenCalledOnce();
            warnSpy.mockRestore();
        });

        it("should omit offset from result when no offset options provided", () => {
            const value: PopperModifierOverrides = { offset: {} };
            const expected: MiddlewareConfig = {};
            expect(popperModifiersToNextMiddleware(value)).to.deep.equal(expected);
        });
    });

    describe("arrow", () => {
        it("should omit arrow middleware when enabled is false", () => {
            const element = document.createElement("div");
            const value: PopperModifierOverrides = { arrow: { enabled: false, options: { element } } };
            const expected: MiddlewareConfig = {};
            expect(popperModifiersToNextMiddleware(value)).to.deep.equal(expected);
        });

        it("should map arrow modifier with element to arrow middleware", () => {
            const element = document.createElement("div");
            const value: PopperModifierOverrides = { arrow: { options: { element } } };
            const expected: MiddlewareConfig = { arrow: { element } };
            expect(popperModifiersToNextMiddleware(value)).to.deep.equal(expected);
        });

        it("should map arrow padding option", () => {
            const element = document.createElement("div");
            const value: PopperModifierOverrides = { arrow: { options: { element, padding: 5 } } };
            const expected: MiddlewareConfig = { arrow: { element, padding: 5 } };
            expect(popperModifiersToNextMiddleware(value)).to.deep.equal(expected);
        });

        it("should omit arrow from result when no element provided", () => {
            const value: PopperModifierOverrides = { arrow: {} };
            const expected: MiddlewareConfig = {};
            expect(popperModifiersToNextMiddleware(value)).to.deep.equal(expected);
        });
    });

    describe("hide", () => {
        it("should omit hide middleware when enabled is false", () => {
            const value: PopperModifierOverrides = { hide: { enabled: false } };
            const expected: MiddlewareConfig = {};
            expect(popperModifiersToNextMiddleware(value)).to.deep.equal(expected);
        });

        it("should map hide modifier to hide middleware", () => {
            const value: PopperModifierOverrides = { hide: {} };
            const expected: MiddlewareConfig = { hide: {} };
            expect(popperModifiersToNextMiddleware(value)).to.deep.equal(expected);
        });
    });

    describe("ignored modifiers", () => {
        it("should not map computeStyles", () => {
            const value: PopperModifierOverrides = { computeStyles: {} };
            const expected: MiddlewareConfig = {};
            expect(popperModifiersToNextMiddleware(value)).to.deep.equal(expected);
        });

        it("should not map eventListeners", () => {
            const value: PopperModifierOverrides = { eventListeners: {} };
            const expected: MiddlewareConfig = {};
            expect(popperModifiersToNextMiddleware(value)).to.deep.equal(expected);
        });

        it("should not map popperOffsets", () => {
            const value: PopperModifierOverrides = { popperOffsets: {} };
            const expected: MiddlewareConfig = {};
            expect(popperModifiersToNextMiddleware(value)).to.deep.equal(expected);
        });
    });

    it("should handle multiple modifiers together", () => {
        const value: PopperModifierOverrides = {
            flip: { options: { padding: 8 } },
            hide: { enabled: false },
            offset: { options: { offset: [0, 10] } },
            preventOverflow: { options: { padding: 4 } },
        };
        const expected: MiddlewareConfig = {
            flip: { padding: 8 },
            offset: { crossAxis: 0, mainAxis: 10 },
            shift: { padding: 4 },
        };
        expect(popperModifiersToNextMiddleware(value)).to.deep.equal(expected);
    });
});
