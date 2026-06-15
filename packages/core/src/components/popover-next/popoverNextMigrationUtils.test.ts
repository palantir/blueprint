/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import type { MiddlewareConfig } from "../..";
import { PopoverPosition } from "../popover/popoverPosition";
import type { PopoverProps } from "../popover/popoverProps";
import type { PopperModifierOverrides } from "../popover/popoverSharedProps";

import {
    popoverPlacementToNextPlacement,
    popoverPositionToNextPlacement,
    popoverPropsToNextProps,
    popperModifiersToNextMiddleware,
} from "./popoverNextMigrationUtils";

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

describe("popoverPlacementToNextPlacement", () => {
    it("should pass through non-auto placements unchanged", () => {
        expect(popoverPlacementToNextPlacement("top")).to.equal("top");
        expect(popoverPlacementToNextPlacement("top-start")).to.equal("top-start");
        expect(popoverPlacementToNextPlacement("bottom-end")).to.equal("bottom-end");
        expect(popoverPlacementToNextPlacement("left-start")).to.equal("left-start");
    });

    it("should return undefined for auto", () => {
        expect(popoverPlacementToNextPlacement("auto")).to.be.undefined;
    });

    it("should return undefined for auto-start", () => {
        expect(popoverPlacementToNextPlacement("auto-start")).to.be.undefined;
    });

    it("should return undefined for auto-end", () => {
        expect(popoverPlacementToNextPlacement("auto-end")).to.be.undefined;
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

        it("should fall back to Blueprint's legacy default offset (15px main-axis) when modifier is enabled with no explicit options", () => {
            const expected: MiddlewareConfig = { offset: { mainAxis: 15 } };
            expect(popperModifiersToNextMiddleware({ offset: {} })).to.deep.equal(expected);
            expect(popperModifiersToNextMiddleware({ offset: { enabled: true } })).to.deep.equal(expected);
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

describe("popoverPropsToNextProps", () => {
    it("should pin shouldReturnFocusOnClose to false when not supplied (legacy default)", () => {
        expect(popoverPropsToNextProps({})).to.deep.equal({ shouldReturnFocusOnClose: false });
    });

    it("should treat undefined input the same as an empty object", () => {
        expect(popoverPropsToNextProps()).to.deep.equal({ shouldReturnFocusOnClose: false });
        expect(popoverPropsToNextProps(undefined)).to.deep.equal({ shouldReturnFocusOnClose: false });
    });

    it("should pass through shouldReturnFocusOnClose when supplied", () => {
        const result = popoverPropsToNextProps({ shouldReturnFocusOnClose: true });
        expect(result.shouldReturnFocusOnClose).to.equal(true);
    });

    it("should pass through 1:1 props as-is", () => {
        const result = popoverPropsToNextProps({
            content: "hello",
            hasBackdrop: true,
            isOpen: true,
            matchTargetWidth: true,
            positioningStrategy: "fixed",
            rootBoundary: "viewport",
            usePortal: false,
        });
        expect(result.content).to.equal("hello");
        expect(result.hasBackdrop).to.equal(true);
        expect(result.isOpen).to.equal(true);
        expect(result.matchTargetWidth).to.equal(true);
        expect(result.positioningStrategy).to.equal("fixed");
        expect(result.rootBoundary).to.equal("viewport");
        expect(result.usePortal).to.equal(false);
    });

    describe("onClose", () => {
        it("should wrap onClose so legacy callbacks are only invoked with a defined event", () => {
            const onClose = vi.fn();
            const result = popoverPropsToNextProps({ onClose });
            // Wrapper exists, and it's not the original.
            expect(result.onClose).to.be.a("function");
            expect(result.onClose).to.not.equal(onClose);
            const wrapped = result.onClose!;
            // Forwards real events.
            const event = { type: "click" } as React.SyntheticEvent<HTMLElement>;
            wrapped(event);
            expect(onClose).toHaveBeenCalledOnce();
            expect(onClose).toHaveBeenCalledWith(event);
            // Drops undefined events to honor legacy `(event: SyntheticEvent) => void` signature.
            wrapped(undefined);
            expect(onClose).toHaveBeenCalledOnce();
        });

        it("should leave onClose undefined when not supplied", () => {
            const result = popoverPropsToNextProps({});
            expect(result.onClose).to.be.undefined;
        });
    });

    describe("placement / position", () => {
        it("should convert position to placement", () => {
            const result = popoverPropsToNextProps({ position: PopoverPosition.TOP_LEFT });
            expect(result.placement).to.equal("top-start");
        });

        it("should leave placement undefined when position is auto", () => {
            const result = popoverPropsToNextProps({ position: "auto" });
            expect(result.placement).to.be.undefined;
        });

        it("should leave placement undefined when placement is auto", () => {
            const result = popoverPropsToNextProps({ placement: "auto" });
            expect(result.placement).to.be.undefined;
        });

        it("should prefer placement over position when both are supplied (placement ?? position)", () => {
            const warnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());
            const result = popoverPropsToNextProps({
                placement: "right",
                position: PopoverPosition.TOP_LEFT,
            });
            expect(result.placement).to.equal("right");
            warnSpy.mockRestore();
        });

        it("should prefer explicit placement: 'auto' over position (legacy placement ?? position rule)", () => {
            const warnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());
            const result = popoverPropsToNextProps({
                placement: "auto",
                position: PopoverPosition.TOP_LEFT,
            });
            // Explicit `placement: "auto"` wins, mapping to undefined (autoPlacement default).
            expect(result.placement).to.be.undefined;
            warnSpy.mockRestore();
        });

        it("should warn when both placement and position are supplied (mutex)", () => {
            const warnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());
            popoverPropsToNextProps({ placement: "right", position: PopoverPosition.TOP_LEFT });
            expect(warnSpy).toHaveBeenCalledOnce();
            warnSpy.mockRestore();
        });
    });

    describe("modifiers → middleware", () => {
        it("should convert modifiers to middleware", () => {
            const result = popoverPropsToNextProps({
                modifiers: { flip: { options: { padding: 8 } } },
            });
            expect(result.middleware).to.deep.equal({ flip: { padding: 8 } });
        });

        it("should leave middleware undefined when modifiers is not supplied", () => {
            const result = popoverPropsToNextProps({});
            expect(result.middleware).to.be.undefined;
        });
    });

    describe("minimal", () => {
        it("should map minimal: true to animation: 'minimal' and arrow: false", () => {
            const result = popoverPropsToNextProps({ minimal: true });
            expect(result.animation).to.equal("minimal");
            expect(result.arrow).to.equal(false);
        });

        it("should not set animation or arrow when minimal is false", () => {
            const result = popoverPropsToNextProps({ minimal: false });
            expect(result.animation).to.be.undefined;
            expect(result.arrow).to.be.undefined;
        });
    });

    describe("boundary", () => {
        it("should remap 'clippingParents' to 'clippingAncestors'", () => {
            const result = popoverPropsToNextProps({ boundary: "clippingParents" });
            expect(result.boundary).to.equal("clippingAncestors");
        });

        it("should pass through Element boundary", () => {
            const element = document.createElement("div");
            const result = popoverPropsToNextProps({ boundary: element });
            expect(result.boundary).to.equal(element);
        });

        it("should leave boundary undefined when not supplied (PopoverNext default = clippingAncestors)", () => {
            const result = popoverPropsToNextProps({});
            expect(result.boundary).to.be.undefined;
        });
    });

    describe("popoverRef", () => {
        it("should pass through popoverRef to PopoverNext", () => {
            const ref: React.RefObject<HTMLElement> = { current: null };
            const result = popoverPropsToNextProps({ popoverRef: ref });
            expect(result.popoverRef).to.equal(ref);
        });

        it("should leave popoverRef undefined when not supplied", () => {
            const result = popoverPropsToNextProps({});
            expect(result.popoverRef).to.be.undefined;
        });
    });

    describe("dropped props", () => {
        it("should drop modifiersCustom with a dev warning", () => {
            const warnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());
            const props: Partial<PopoverProps> = { modifiersCustom: [{ name: "custom" }] };
            const result = popoverPropsToNextProps(props);
            expect(result).not.to.have.property("modifiersCustom");
            expect(warnSpy).toHaveBeenCalledOnce();
            warnSpy.mockRestore();
        });

        it("should drop portalStopPropagationEvents with a dev warning", () => {
            const warnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());

            const result = popoverPropsToNextProps({ portalStopPropagationEvents: ["click"] });
            expect(result).not.to.have.property("portalStopPropagationEvents");
            expect(warnSpy).toHaveBeenCalledOnce();
            warnSpy.mockRestore();
        });
    });
});
