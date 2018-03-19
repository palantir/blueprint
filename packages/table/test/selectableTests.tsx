/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { expect } from "chai";
import * as React from "react";
import * as sinon from "sinon";

import { IFocusedCellCoordinates } from "../src/common/cell";
import * as FocusedCellUtils from "../src/common/internal/focusedCellUtils";
import { DragSelectable, IDragSelectableProps } from "../src/interactions/selectable";
import { IRegion, Regions } from "../src/regions";
import { ElementHarness, ReactHarness } from "./harness";

const REGION = Regions.cell(0, 0);
const REGION_2 = Regions.cell(1, 1);
const REGION_3 = Regions.cell(2, 2);
const TRANSFORMED_REGION = Regions.row(0);
const TRANSFORMED_REGION_2 = Regions.row(1);

describe("DragSelectable", () => {
    const harness = new ReactHarness();

    const onSelection = sinon.spy();
    const onFocusedCell = sinon.spy();
    const locateClick = sinon.stub();
    const locateDrag = sinon.stub();

    const children = (
        <div className="single-child">
            <div className="selectable">Zero</div>
            <div className="selectable">One</div>
            <div className="selectable">Two</div>
        </div>
    );

    afterEach(() => {
        harness.unmount();

        onSelection.resetHistory();
        onFocusedCell.resetHistory();

        locateClick.returns(undefined);
        locateDrag.returns(undefined);

        locateClick.resetHistory();
        locateDrag.resetHistory();
    });

    after(() => {
        harness.destroy();
    });

    describe("on mousedown", () => {
        describe("has no effect", () => {
            beforeEach(() => {
                locateClick.returns(Regions.cell(0, 0));
            });

            it("if event happened within any ignoredSelectors", () => {
                const component = mountDragSelectable({ ignoredSelectors: [".single-child"] });

                getItem(component).mouse("mousedown");

                expectOnSelectionNotCalled();
                expectOnFocusNotCalled();
            });

            it("if props.disabled=true", () => {
                const component = mountDragSelectable({ disabled: true });

                getItem(component).mouse("mousedown");

                expectOnSelectionNotCalled();
                expectOnFocusNotCalled();
            });

            it("if was triggered by a right- or middle-click", () => {
                const component = mountDragSelectable();

                const RIGHT_BUTTON = 1;
                const MIDDLE_BUTTON = 2;

                getItem(component).mouse("mousedown", { button: RIGHT_BUTTON });
                getItem(component).mouse("mousedown", { button: MIDDLE_BUTTON });

                expectOnSelectionNotCalled();
                expectOnFocusNotCalled();
            });

            it("if clicked region is invalid", () => {
                locateClick.returns(null);
                const component = mountDragSelectable();

                getItem(component).mouse("mousedown");

                expectOnSelectionNotCalled();
                expectOnFocusNotCalled();
            });
        });

        describe("if region matches one already selected", () => {
            beforeEach(() => {
                locateClick.returns(REGION);
            });

            it("deselects just that region if CMD key was depressed (one region)", () => {
                const component = mountDragSelectable({
                    selectedRegions: [REGION],
                });

                getItem(component).mouse("mousedown", { metaKey: true });

                expectOnSelectionCalledWith([]);
                expectOnFocusNotCalled();
            });

            it("deselects just that region if CMD key was depressed (many regions)", () => {
                const component = mountDragSelectable({
                    selectedRegions: [REGION_2, REGION, REGION_3],
                });

                getItem(component).mouse("mousedown", { metaKey: true });

                expectOnSelectionCalledWith([REGION_2, REGION_3]);
                expectOnFocusCalledWith(REGION_3, 1);
            });

            it("leaves just the clicked region selected if CMD key not depressed", () => {
                const component = mountDragSelectable({
                    selectedRegions: [REGION_2, REGION, REGION_3],
                });

                getItem(component).mouse("mousedown");

                expectOnSelectionCalledWith([REGION]);
                expectOnFocusCalledWith(REGION, 0);
            });

            it("works with a selectedRegionTransform too", () => {
                const component = mountDragSelectable({
                    selectedRegionTransform: sinon.stub().returns(TRANSFORMED_REGION),
                    selectedRegions: [REGION_2, TRANSFORMED_REGION, REGION_3],
                });

                getItem(component).mouse("mousedown", { metaKey: true });

                expectOnSelectionCalledWith([REGION_2, REGION_3]);
                expectOnFocusCalledWith(REGION_3, 1);
            });
        });

        describe("if SHIFT key was depressed", () => {
            beforeEach(() => {
                locateClick.returns(REGION_2);
            });

            it("does not expand selection if enableMultipleSelection=false", () => {
                const component = mountDragSelectable({
                    enableMultipleSelection: false,
                    selectedRegions: [REGION],
                });

                getItem(component).mouse("mousedown", { shiftKey: true });

                expectOnSelectionCalledWith([REGION_2]);
                expectOnFocusCalledWith(REGION_2, 0);
            });

            it("if no active selections, selects just the clicked region", () => {
                const component = mountDragSelectable({
                    selectedRegions: [],
                });

                getItem(component).mouse("mousedown", { shiftKey: true });

                expectOnSelectionCalledWith([REGION_2]);
                expectOnFocusCalledWith(REGION_2, 0);
            });

            it("if focusedCell exists, expands the most recent selection using focusedCell and clicked region", () => {
                // meta assertions (just need to do this in one place)
                expectSingleCellRegion(REGION);
                expectSingleCellRegion(REGION_2);

                const expandFocusedSpy = sinon.spy(FocusedCellUtils, "expandFocusedRegion");
                const expandSpy = sinon.spy(Regions, "expandRegion");
                const component = mountDragSelectable({
                    focusedCell: toFocusedCell(REGION),
                    selectedRegions: [REGION],
                });

                getItem(component).mouse("mousedown", { shiftKey: true });

                expect(expandFocusedSpy.calledOnce).to.be.true;
                expect(expandSpy.called).to.be.false;
                expectOnSelectionCalledWith([expandFocusedSpy.firstCall.returnValue]);

                // unwrap the sinon spies
                (FocusedCellUtils.expandFocusedRegion as any).restore();
                (Regions.expandRegion as any).restore();
            });

            it("otherwise, expands the most recent one to the clicked region", () => {
                const expandFocusedSpy = sinon.spy(FocusedCellUtils, "expandFocusedRegion");
                const expandSpy = sinon.spy(Regions, "expandRegion");
                const component = mountDragSelectable({
                    selectedRegions: [REGION],
                });

                getItem(component).mouse("mousedown", { shiftKey: true });

                expect(expandFocusedSpy.calledOnce).to.be.false;
                expect(expandSpy.called).to.be.true;
                expectOnSelectionCalledWith([expandSpy.firstCall.returnValue]);

                (FocusedCellUtils.expandFocusedRegion as any).restore();
                (Regions.expandRegion as any).restore();
            });

            it("expands selection even if CMD key was pressed", () => {
                const expandFocusedSpy = sinon.spy(FocusedCellUtils, "expandFocusedRegion");
                const component = mountDragSelectable({
                    focusedCell: toFocusedCell(REGION),
                    selectedRegions: [REGION],
                });

                getItem(component).mouse("mousedown", { shiftKey: true, metaKey: true });

                expect(expandFocusedSpy.calledOnce).to.be.true;
                expectOnSelectionCalledWith([expandFocusedSpy.firstCall.returnValue]);

                (FocusedCellUtils.expandFocusedRegion as any).restore();
            });

            it("works with a selectedRegionTransform too", () => {
                const expandFocusedSpy = sinon.spy(FocusedCellUtils, "expandFocusedRegion");
                const focusedCell = toFocusedCell(REGION);
                const component = mountDragSelectable({
                    focusedCell,
                    selectedRegionTransform: sinon.stub().returns(TRANSFORMED_REGION_2),
                    selectedRegions: [REGION],
                });

                getItem(component).mouse("mousedown", { shiftKey: true, metaKey: true });

                expect(expandFocusedSpy.calledOnce).to.be.true;
                expect(expandFocusedSpy.firstCall.calledWith(focusedCell, TRANSFORMED_REGION_2)).to.be.true;

                (FocusedCellUtils.expandFocusedRegion as any).restore();
            });
        });

        describe("if CMD key was pressed", () => {
            beforeEach(() => {
                locateClick.returns(REGION_2);
            });

            it("does not add disjoint selection if enableMultipleSelection=false", () => {
                const component = mountDragSelectable({
                    enableMultipleSelection: false,
                    selectedRegions: [REGION],
                });

                getItem(component).mouse("mousedown", { metaKey: true });

                expectOnSelectionCalledWith([REGION_2]);
                expectOnFocusCalledWith(REGION_2, 0);
            });

            it("adds clicked region as a new disjoint selection", () => {
                const component = mountDragSelectable({
                    selectedRegions: [REGION],
                });

                getItem(component).mouse("mousedown", { metaKey: true });

                expectOnSelectionCalledWith([REGION, REGION_2]);
                expectOnFocusCalledWith(REGION_2, 1);
            });

            it("works with a selectedRegionTransform too", () => {
                const component = mountDragSelectable({
                    selectedRegionTransform: sinon.stub().returns(TRANSFORMED_REGION_2),
                    selectedRegions: [REGION],
                });

                getItem(component).mouse("mousedown", { metaKey: true });

                const expectedFocusedCell = Regions.getFocusCellCoordinatesFromRegion(TRANSFORMED_REGION_2);
                expectOnSelectionCalledWith([REGION, TRANSFORMED_REGION_2]);
                expectOnFocusCalledWith(FocusedCellUtils.toFullCoordinates(expectedFocusedCell), 1);
            });
        });

        // wrap in a `describe` to preserve the output order
        describe("replaces the selection otherwise", () => {
            beforeEach(() => {
                locateClick.returns(REGION_2);
            });

            it("using the clicked region by default", () => {
                const component = mountDragSelectable({
                    selectedRegions: [REGION],
                });

                getItem(component).mouse("mousedown");

                expectOnSelectionCalledWith([REGION_2]);
                expectOnFocusCalledWith(REGION_2, 0);
            });

            it("works with a selectedRegionTransform too", () => {
                const component = mountDragSelectable({
                    selectedRegionTransform: sinon.stub().returns(TRANSFORMED_REGION_2),
                    selectedRegions: [REGION],
                });

                getItem(component).mouse("mousedown");

                const expectedFocusedCell = Regions.getFocusCellCoordinatesFromRegion(TRANSFORMED_REGION_2);
                expectOnSelectionCalledWith([TRANSFORMED_REGION_2]);
                expectOnFocusCalledWith(FocusedCellUtils.toFullCoordinates(expectedFocusedCell), 0);
            });
        });
    });

    describe("on click (i.e. on immediate mouseup with no mousemove)", () => {
        it("invokes onSelectionEnd", () => {
            locateClick.returns(REGION_2);

            const onSelectionEnd = sinon.spy();
            const selectedRegions = [REGION]; // create a new array instance

            const component = mountDragSelectable({ onSelectionEnd, selectedRegions });

            // be sure to test "click"s as sequentional "mousedown"-"mouseup"s, because those
            // are the events we actually listen for deep in DragEvents.
            getItem(component)
                .mouse("mousedown")
                .mouse("mouseup");

            expect(onSelectionEnd.calledOnce).to.be.true;
            expect(onSelectionEnd.firstCall.args[0] === selectedRegions).to.be.true; // check for same instance
        });
    });

    describe("on drag move", () => {
        beforeEach(() => {
            locateClick.returns(REGION_2);
        });

        describe("if SHIFT depressed", () => {
            let expandFocusedSpy: sinon.SinonSpy;
            let expandSpy: sinon.SinonSpy;

            beforeEach(() => {
                expandFocusedSpy = sinon.spy(FocusedCellUtils, "expandFocusedRegion");
                expandSpy = sinon.spy(Regions, "expandRegion");
                locateDrag.returns(REGION_3);
            });

            afterEach(() => {
                (FocusedCellUtils.expandFocusedRegion as any).restore();
                (Regions.expandRegion as any).restore();
            });

            it("expands selection from focused cell (if provided)", () => {
                const component = mountDragSelectable({
                    focusedCell: toFocusedCell(REGION),
                    selectedRegions: [REGION],
                });
                const item = getItem(component);

                item.mouse("mousedown", { shiftKey: true });
                expect(expandFocusedSpy.calledOnce, "calls FCU.expandFocusedRegion on mousedown").to.be.true;
                expect(onSelection.calledOnce, "calls onSelection on mousedown").to.be.true;

                item.mouse("mousemove", { shiftKey: true });
                expect(expandFocusedSpy.calledTwice, "calls FCU.expandFocusedRegion on mousemove").to.be.true;
                expect(onSelection.calledTwice, "calls onSelection on mousemove").to.be.true;
                expect(
                    onSelection.secondCall.calledWith([expandFocusedSpy.secondCall.returnValue]),
                    "calls onSelection on mousemove with proper args",
                ).to.be.true;

                expect(expandSpy.called, "doesn't call Regions.expandRegion").to.be.false;
                expect(onFocusedCell.called, "doesn't call onFocusedCell").to.be.false;
            });

            it("expands selection using Regions.expandRegion if focusedCell not provided", () => {
                const component = mountDragSelectable({ selectedRegions: [REGION] });
                const item = getItem(component);

                item.mouse("mousedown", { shiftKey: true });
                expect(expandSpy.calledOnce, "calls Regions.expandRegion on mousedown").to.be.true;

                item.mouse("mousemove", { shiftKey: true });
                expect(expandSpy.calledTwice, "calls Regions.expandRegion on mousemove").to.be.true;
                expect(onSelection.calledTwice, "calls onSelection on mousemove").to.be.true;
                expect(
                    onSelection.secondCall.calledWith([expandSpy.secondCall.returnValue]),
                    "calls onSelection on mousemove with proper args",
                ).to.be.true;

                expect(expandFocusedSpy.called, "calls FocusedCellUtils.expandFocusedRegion").to.be.false;
                expect(onFocusedCell.called, "doesn't call onFocusedCell").to.be.false;
            });
        });

        it("if SHIFT not depressed, replaces last region with the result of locateDrag", () => {
            const boundingRegion = Regions.cell(
                // the bounding region of the two subregions
                REGION_2.rows[0],
                REGION_2.cols[0],
                REGION_3.rows[0],
                REGION_3.cols[0],
            );
            locateDrag.returns(boundingRegion);

            const component = mountDragSelectable({ selectedRegions: [REGION, REGION_3] });
            const item = getItem(component);

            item.mouse("mousedown");
            runMouseDownChecks();

            item.mouse("mousemove");
            expect(locateDrag.calledOnce, "calls locateDrag on mousemove").to.be.true;
            expect(onSelection.calledTwice, "calls onSelection on mousemove").to.be.true;
            expect(
                onSelection.secondCall.calledWith([REGION, boundingRegion]),
                "calls onSelection on mousemove with proper args",
            ).to.be.true;
            expect(onFocusedCell.calledTwice, "doesn't call onFocusedCell on mousedown").to.be.false;
        });

        it("has no effect if dragged region is invalid", () => {
            locateDrag.returns(null); // invalid

            const component = mountDragSelectable({ selectedRegions: [REGION] });
            const item = getItem(component);

            item.mouse("mousedown");
            runMouseDownChecks();

            item.mouse("mousemove");
            expect(onSelection.calledTwice, "doesn't call onSelection on mousemove").to.be.false;
            expect(onFocusedCell.calledTwice, "doesn't call onFocusedCell on mousemove").to.be.false;
        });

        it("applies a selectedRegionTransform if provided", () => {
            locateDrag.returns(REGION);

            // return different values on activation and on drag to ensure
            // onSelection is called twice
            const selectedRegionTransform = sinon.stub();
            selectedRegionTransform.onFirstCall().returns(TRANSFORMED_REGION);
            selectedRegionTransform.onSecondCall().returns(TRANSFORMED_REGION_2);

            const component = mountDragSelectable({
                selectedRegionTransform,
                selectedRegions: [REGION],
            });

            getItem(component)
                .mouse("mousedown")
                .mouse("mousemove");

            expect(onSelection.calledTwice, "calls onSelection on mousemove").to.be.true;
            expect(
                onSelection.secondCall.calledWith([TRANSFORMED_REGION_2]),
                "calls onSelection on mousemove with proper args",
            ).to.be.true;
        });

        // tslint:disable-next-line:max-line-length
        it("if enableMultipleSelection=false, moves selection (and focused cell) instead of expanding it", () => {
            locateClick.onCall(0).returns(REGION_2);
            locateClick.onCall(1).returns(REGION_3);

            const component = mountDragSelectable({
                enableMultipleSelection: false,
                selectedRegions: [REGION],
            });

            getItem(component)
                .mouse("mousedown")
                .mouse("mousemove");

            expect(locateClick.calledTwice, "calls locateClick on mousemove").to.be.true;
            expect(locateDrag.called, "doesn't call locateDrag on mousemove").to.be.false;
            expect(onSelection.calledTwice, "calls onSelection on mousemove").to.be.true;
            expect(onSelection.secondCall.calledWith([REGION_3]), "calls onSelection on mousemove with proper args").to
                .be.true;
            expect(
                onFocusedCell.secondCall.calledWith(toFocusedCell(REGION_3)),
                "moves focusedCell with the selection",
            );
        });

        it("invokes onSelection even if the selection changed, even if controlled selectedRegions are the same", () => {
            const CONTROLLED_REGION = REGION_3; // different from the locateClick region
            locateDrag.returns(CONTROLLED_REGION);

            const component = mountDragSelectable({ selectedRegions: [CONTROLLED_REGION] });
            const item = getItem(component);

            item.mouse("mousedown");
            expect(onSelection.callCount, "calls onSelection on mousedown").to.equal(1);
            item.mouse("mousemove");
            expect(onSelection.callCount, "calls onSelection again on mousemove").to.equal(2);
        });

        it("doesn't invoke onSelection if the selection didn't change", () => {
            locateDrag.returns(REGION_2); // same as the value returned from locateClick

            const component = mountDragSelectable({ selectedRegions: [REGION_3] });
            const item = getItem(component);

            item.mouse("mousedown");
            expect(onSelection.callCount, "calls onSelection on mousedown").to.equal(1);
            item.mouse("mousemove");
            expect(onSelection.callCount, "does not call onSelection again on mousemove").to.equal(1);
        });

        it("triggered when a region receives mousedown with requireMetaKeyToDeselect=true", () => {
            locateDrag.returns(REGION); // different from the locateClick region

            const component = mountDragSelectable({ selectedRegions: [REGION_2, REGION, REGION_3] });
            const item = getItem(component);

            item.mouse("mousedown");
            expect(onSelection.callCount, "calls onSelection on mousedown").to.equal(1);
            item.mouse("mousemove");
            expect(onSelection.callCount, "calls onSelection again on mousemove").to.equal(2);
        });

        it("isn't triggered when one of multiple selected regions received mousedown", () => {
            locateDrag.returns(REGION); // different from the locateClick region

            const component = mountDragSelectable({ selectedRegions: [REGION_2, REGION, REGION_3] });
            const item = getItem(component);

            item.mouse("mousedown");
            expect(onSelection.callCount, "calls onSelection on mousedown").to.equal(1);
            item.mouse("mousemove");
            expect(onSelection.callCount, "calls onSelection again on mousemove").to.equal(2);
        });

        // running these checks separately clarifies the subsequent effects of the "mousemove" event.
        function runMouseDownChecks() {
            expect(locateClick.calledOnce, "calls locateClick on mousedown").to.be.true;
            expect(onSelection.calledOnce, "calls onSelection on mousedown").to.be.true;
            expect(onFocusedCell.calledOnce, "calls onFocusedCell on mousedown").to.be.true;
        }
    });

    describe("on drag end", () => {
        it("invokes onSelectionEnd", () => {
            locateClick.returns(REGION_2);

            const onSelectionEnd = sinon.spy();
            const selectedRegions = [REGION]; // create a new array instance

            const component = mountDragSelectable({ onSelectionEnd, selectedRegions });

            getItem(component)
                .mouse("mousedown")
                .mouse("mousemove")
                .mouse("mouseup");

            expect(onSelectionEnd.calledOnce).to.be.true;
            expect(onSelectionEnd.firstCall.args[0] === selectedRegions).to.be.true;
        });
    });

    function mountDragSelectable(props: Partial<IDragSelectableProps> & object = {}) {
        return harness.mount(
            <DragSelectable
                enableMultipleSelection={true}
                onFocusedCell={onFocusedCell}
                onSelection={onSelection}
                locateClick={locateClick}
                locateDrag={locateDrag}
                {...props}
            >
                {children}
            </DragSelectable>,
        );
    }

    function getItem(component: ElementHarness, index: number = 0) {
        return component.find(".selectable", index);
    }

    function toCell(region: IRegion) {
        // assumes a 1-cell region
        return { row: region.rows[0], col: region.cols[0] };
    }

    function toFocusedCell(singleCellRegion: IRegion) {
        return FocusedCellUtils.toFullCoordinates(toCell(singleCellRegion));
    }

    function expectSingleCellRegion(region: IRegion) {
        // helper function to assert the test regions are all single cells
        const [startRow, endRow] = region.rows;
        const [startCol, endCol] = region.cols;
        expect(startRow, "single-cell region should not span multiple rows").to.equal(endRow);
        expect(startCol, "single-cell region should not span multiple columns").to.equal(endCol);
    }

    function expectOnSelectionNotCalled() {
        expect(onSelection.called).to.be.false;
    }

    function expectOnFocusNotCalled() {
        expect(onFocusedCell.called).to.be.false;
    }

    function expectOnSelectionCalledWith(selectedRegions: IRegion[]) {
        expect(onSelection.called, "should call onSelection").to.be.true;
        expect(onSelection.firstCall.args[0], "should call onSelection with correct arg").to.deep.equal(
            selectedRegions,
        );
    }

    function expectOnFocusCalledWith(regionOrCoords: IRegion | IFocusedCellCoordinates, focusSelectionIndex: number) {
        expect(onFocusedCell.called, "should call onFocusedCell").to.be.true;

        const region = regionOrCoords as IRegion;
        const expectedCoords =
            region.rows != null
                ? { col: region.cols[0], row: region.rows[0] }
                : (regionOrCoords as IFocusedCellCoordinates);
        expect(onFocusedCell.firstCall.args[0], "should call onFocusedCell with correct arg").to.deep.equal({
            ...expectedCoords,
            focusSelectionIndex,
        });
    }
});
