/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import * as React from "react";

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
    const onFocus = sinon.spy();
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

        onSelection.reset();
        onFocus.reset();

        locateClick.returns(undefined);
        locateDrag.returns(undefined);

        locateClick.reset();
        locateDrag.reset();
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

            it("deselects just that region if CMD key was depressed", () => {
                const component = mountDragSelectable({
                    selectedRegions: [REGION_2, REGION, REGION_3],
                });

                getItem(component).mouse("mousedown", { metaKey: true });

                expectOnSelectionCalledWith([REGION_2, REGION_3]);
                expectOnFocusCalledWith(REGION_3, 1);
            });

            it("deselects all regions if no modifier keys were depressed", () => {
                const component = mountDragSelectable({
                    selectedRegions: [REGION_2, REGION, REGION_3],
                });

                getItem(component).mouse("mousedown");

                expectOnSelectionCalledWith([]);
                expectOnFocusNotCalled(); // leave focused cell where it is
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

            it("does not expand selection if allowMultipleSelection=false", () => {
                const component = mountDragSelectable({
                    allowMultipleSelection: false,
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

            it("does not add disjoint selection if allowMultipleSelection=false", () => {
                const component = mountDragSelectable({
                    allowMultipleSelection: false,
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
            it("using the clicked region by default", () => {
                locateClick.returns(REGION_2);

                const component = mountDragSelectable({
                    selectedRegions: [REGION],
                });

                getItem(component).mouse("mousedown");

                expectOnSelectionCalledWith([REGION_2]);
                expectOnFocusCalledWith(REGION_2, 0);
            });

            it("works with a selectedRegionTransform too", () => {
                locateClick.returns(REGION_2);

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
            getItem(component).mouse("mousedown").mouse("mouseup");

            expect(onSelectionEnd.calledOnce).to.be.true;
            expect(onSelectionEnd.firstCall.args[0] === selectedRegions).to.be.true; // check for same instance
        });
    });

    describe("on drag move", () => {
        beforeEach(() => {
            locateClick.returns(REGION_2);
        });

        describe("if SHIFT depressed", () => {
            let expandFocusedSpy: Sinon.SinonSpy;
            let expandSpy: Sinon.SinonSpy;

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
                expect(onFocus.called, "doesn't call onFocus").to.be.false;
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
                expect(onFocus.called, "doesn't call onFocus").to.be.false;
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
            expect(onFocus.calledTwice, "doesn't call onFocus on mousedown").to.be.false;
        });

        it("has no effect if dragged region is invalid", () => {
            locateDrag.returns(null); // invalid

            const component = mountDragSelectable({ selectedRegions: [REGION] });
            const item = getItem(component);

            item.mouse("mousedown");
            runMouseDownChecks();

            item.mouse("mousemove");
            expect(onSelection.calledTwice, "doesn't call onSelection on mousemove").to.be.false;
            expect(onFocus.calledTwice, "doesn't call onFocus on mousemove").to.be.false;
        });

        it("applies a selectedRegionTransform if provided", () => {
            locateDrag.returns(REGION_3);

            const component = mountDragSelectable({
                selectedRegionTransform: sinon.stub().returns(TRANSFORMED_REGION),
                selectedRegions: [REGION],
            });

            getItem(component).mouse("mousedown").mouse("mousemove");

            expect(onSelection.calledTwice, "calls onSelection on mousemove").to.be.true;
            expect(
                onSelection.secondCall.calledWith([TRANSFORMED_REGION]),
                "calls onSelection on mousemove with proper args",
            ).to.be.true;
        });

        // tslint:disable-next-line:max-line-length
        it("if allowMultipleSelection=false, moves selection (and focused cell) instead of expanding it", () => {
            locateClick.onCall(0).returns(REGION_2);
            locateClick.onCall(1).returns(REGION_3);

            const component = mountDragSelectable({
                allowMultipleSelection: false,
                selectedRegions: [REGION],
            });

            getItem(component)
                .mouse("mousedown")
                .mouse("mousemove");

            expect(locateClick.calledTwice, "calls locateClick on mousemove").to.be.true;
            expect(locateDrag.called, "doesn't call locateDrag on mousemove").to.be.false;
            expect(onSelection.calledTwice, "calls onSelection on mousemove").to.be.true;
            expect(
                onSelection.secondCall.calledWith([REGION_3]),
                "calls onSelection on mousemove with proper args",
            ).to.be.true;
            expect(
                onFocus.secondCall.calledWith(toFocusedCell(REGION_3)),
                "moves focusedCell with the selection",
            );
        });

        // running these checks separately clarifies the subsequent effects of the "mousemove" event.
        function runMouseDownChecks() {
            expect(locateClick.calledOnce, "calls locateClick on mousedown").to.be.true;
            expect(onSelection.calledOnce, "calls onSelection on mousedown").to.be.true;
            expect(onFocus.calledOnce, "calls onFocus on mousedown").to.be.true;
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
                allowMultipleSelection={true}
                onFocus={onFocus}
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
        expect(onFocus.called).to.be.false;
    }

    function expectOnSelectionCalledWith(selectedRegions: IRegion[]) {
        expect(onSelection.called, "should call onSelection").to.be.true;
        expect(onSelection.firstCall.args[0], "should call onSelection with correct arg")
            .to.deep.equal(selectedRegions);
    }

    function expectOnFocusCalledWith(regionOrCoords: IRegion | IFocusedCellCoordinates, focusSelectionIndex: number) {
        expect(onFocus.called, "should call onFocus").to.be.true;

        const region = regionOrCoords as IRegion;
        const expectedCoords = region.rows != null
            ? { col: region.cols[0], row: region.rows[0] }
            : regionOrCoords as IFocusedCellCoordinates;
        expect(onFocus.firstCall.args[0], "should call onFocus with correct arg").to.deep.equal({
            ...expectedCoords,
            focusSelectionIndex,
        });
    }

    /*

    it("does click selection", () => {
        const onSelection = sinon.spy();
        const onFocus = sinon.spy();
        const locateClick = sinon.stub().returns(Regions.column(0));
        const locateDrag = sinon.stub().throws();

        const selectable = harness.mount(
            <DragSelectable
                allowMultipleSelection={true}
                selectedRegions={[]}
                onFocus={onFocus}
                onSelection={onSelection}
                locateClick={locateClick}
                locateDrag={locateDrag}
            >
                {children}
            </DragSelectable>,
        );

        selectable.find(".selectable", 0).mouse("mousedown").mouse("mouseup");
        expect(onSelection.called).to.be.true;
        expect(onSelection.args[0][0]).to.deep.equal([Regions.column(0)]);
        expect(onFocus.called).to.be.true;
        expect(onFocus.args[0][0]).to.deep.equal({col: 0, row: 0, focusSelectionIndex: 0});
    });

    it("restricts to single selection when allowMultipleSelection={false}", () => {
        const onSelection = sinon.spy();
        const onFocus = sinon.spy();
        const locateClick = sinon.stub();
        const locateDrag = sinon.stub().throws();

        const selectable = harness.mount(
            <DragSelectable
                allowMultipleSelection={false}
                selectedRegions={[]}
                onFocus={onFocus}
                onSelection={onSelection}
                locateClick={locateClick}
                locateDrag={locateDrag}
            >
                {children}
            </DragSelectable>,
        );

        locateClick.onCall(0).returns(Regions.column(0));
        locateClick.onCall(1).returns(Regions.column(0));
        selectable.find(".selectable", 0).mouse("mousedown").mouse("mouseup");
        expect(onSelection.called).to.be.true;
        expect(onSelection.lastCall.args[0]).to.deep.equal([Regions.column(0)]);

        locateClick.reset();
        locateClick.onCall(0).returns(Regions.column(1));
        locateClick.onCall(1).returns(Regions.column(2));
        locateClick.onCall(2).returns(Regions.column(2));
        selectable.find(".selectable", 1).mouse("mousedown");
        selectable.find(".selectable", 2).mouse("mousemove").mouse("mouseup");
        expect(onSelection.lastCall.args[0]).to.deep.equal([Regions.column(2)]);
    });

    it("moves focus cell with dragging selection when allowMultipleSelection=false", () => {
        const onFocus = sinon.spy();
        const locateClick = sinon.stub();

        locateClick.onCall(0).returns(Regions.column(0));
        locateClick.onCall(1).returns(Regions.column(1));
        locateClick.onCall(2).returns(Regions.column(2));
        locateClick.onCall(3).returns(Regions.column(2));

        const selectable = harness.mount(
            <DragSelectable
                allowMultipleSelection={false}
                selectedRegions={[]}
                onFocus={onFocus}
                onSelection={sinon.stub()}
                locateClick={locateClick}
                locateDrag={sinon.stub()}
            >
                {children}
            </DragSelectable>,
        );

        selectable.find(".selectable", 0).mouse("mousedown");
        selectable.find(".selectable", 1).mouse("mousemove");
        selectable.find(".selectable", 2).mouse("mousemove").mouse("mouseup");

        expect(onFocus.callCount).to.equal(4);
        expect(onFocus.args[0][0]).to.deep.equal({col: 0, row: 0, focusSelectionIndex: 0});
        expect(onFocus.args[1][0]).to.deep.equal({col: 1, row: 0, focusSelectionIndex: 0});
        expect(onFocus.args[2][0]).to.deep.equal({col: 2, row: 0, focusSelectionIndex: 0});
        expect(onFocus.args[3][0]).to.deep.equal({col: 2, row: 0, focusSelectionIndex: 0});
    });

    it("does drag selection", () => {
        const onSelection = sinon.spy();
        const onFocus = sinon.spy();
        const locateClick = sinon.stub();
        const locateDrag = sinon.stub();

        locateClick.returns(Regions.column(0));
        locateDrag.onCall(0).returns(Regions.column(0, 1));
        locateDrag.onCall(1).returns(Regions.column(0, 2));

        const selectable = harness.mount(
            <DragSelectable
                allowMultipleSelection={true}
                selectedRegions={[]}
                onFocus={onFocus}
                onSelection={onSelection}
                locateClick={locateClick}
                locateDrag={locateDrag}
            >
                {children}
            </DragSelectable>,
        );

        selectable.find(".selectable", 0).mouse("mousedown");
        selectable.find(".selectable", 1).mouse("mousemove");
        selectable.find(".selectable", 2).mouse("mousemove").mouse("mouseup");

        expect(onSelection.callCount).to.equal(3);
        expect(onSelection.args[0][0]).to.deep.equal([Regions.column(0, 0)]);
        expect(onSelection.args[1][0]).to.deep.equal([Regions.column(0, 1)]);
        expect(onSelection.args[2][0]).to.deep.equal([Regions.column(0, 2)]);
        expect(onFocus.callCount).to.equal(1);
        expect(onFocus.args[0][0]).to.deep.equal({col: 0, row: 0, focusSelectionIndex: 0});
    });

    it("expands the selection on shift+click", () => {
        const onSelection = sinon.spy();
        const onFocus = sinon.spy();
        const locateClick = sinon.stub().returns(Regions.column(2));
        const locateDrag = sinon.stub().throws();

        const selectable = harness.mount(
            <DragSelectable
                allowMultipleSelection={true}
                selectedRegions={[Regions.column(0)]}
                onFocus={onFocus}
                onSelection={onSelection}
                locateClick={locateClick}
                locateDrag={locateDrag}
            >
                {children}
            </DragSelectable>,
        );

        const shiftKey = true;
        selectable.find(".selectable", 0).mouse("mousedown", 0, 0, false, shiftKey).mouse("mouseup");
        expect(onSelection.called).to.be.true;
        expect(onSelection.args[0][0]).to.deep.equal([Regions.column(0, 2)]);
        expect(onFocus.called).to.be.true;
        // this isn't proper behavior in the long run, but we'll address focus-cell stuff later
        // (see: https://github.com/palantir/blueprint/issues/823)
        expect(onFocus.args[0][0]).to.deep.equal({col: 2, row: 0, focusSelectionIndex: 0});
    });

    it("does not expand the selection on shift+click if allowMultipleSelection=false", () => {
        const onSelection = sinon.spy();
        const onFocus = sinon.spy();
        const locateClick = sinon.stub().returns(Regions.column(2));
        const locateDrag = sinon.stub().throws();

        const selectable = harness.mount(
            <DragSelectable
                allowMultipleSelection={false}
                selectedRegions={[Regions.column(0)]}
                onFocus={onFocus}
                onSelection={onSelection}
                locateClick={locateClick}
                locateDrag={locateDrag}
            >
                {children}
            </DragSelectable>,
        );

        const shiftKey = true;
        selectable.find(".selectable", 0).mouse("mousedown", 0, 0, false, shiftKey).mouse("mouseup");
        expect(onSelection.called).to.be.true;
        expect(onSelection.args[0][0]).to.deep.equal([Regions.column(2, 2)]);
    });

    it("re-select clears region", () => {
        const onSelection = sinon.spy();
        const onFocus = sinon.spy();
        const locateClick = sinon.stub().returns(Regions.column(0));
        const locateDrag = sinon.stub().throws();

        const selectable = harness.mount(
            <DragSelectable
                allowMultipleSelection={true}
                selectedRegions={[Regions.column(0), Regions.column(2)]}
                onFocus={onFocus}
                onSelection={onSelection}
                locateClick={locateClick}
                locateDrag={locateDrag}
            >
                {children}
            </DragSelectable>,
        );

        selectable.find(".selectable", 0).mouse("mousedown").mouse("mouseup");
        expect(onSelection.lastCall.args[0]).to.deep.equal([], "no meta clears everything");

        selectable.find(".selectable", 0).mouse("mousedown", 0, 0, true).mouse("mouseup", 0, 0, true);
        expect(onSelection.lastCall.args[0]).to.deep.equal([Regions.column(2)], "meta only clears exact region");
    });

    describe("ignores invalid interactions", () => {
        it("ignores invalid mousedown", () => {
            const onSelection = sinon.spy();
            const onFocus = sinon.spy();
            const locateClick = sinon.stub().returns(Regions.column(-1));
            const locateDrag = sinon.stub().throws();

            const selectable = harness.mount(
                <DragSelectable
                    allowMultipleSelection={true}
                    selectedRegions={[]}
                    onFocus={onFocus}
                    onSelection={onSelection}
                    locateClick={locateClick}
                    locateDrag={locateDrag}
                >
                    {children}
                </DragSelectable>,
            );

            selectable.find(".selectable", 0).mouse("mousedown").mouse("mouseup");
            expect(onSelection.called).to.be.false;
            expect(onFocus.called).to.be.false;
        });

        it("ignores invalid mouseup", () => {
            const onSelection = sinon.spy();
            const onFocus = sinon.spy();
            const locateClick = sinon.stub();
            const locateDrag = sinon.stub().throws();

            locateClick.onCall(0).returns(Regions.column(0));
            locateClick.onCall(1).returns(Regions.column(-1));

            const selectable = harness.mount(
                <DragSelectable
                    allowMultipleSelection={true}
                    selectedRegions={[]}
                    onFocus={onFocus}
                    onSelection={onSelection}
                    locateClick={locateClick}
                    locateDrag={locateDrag}
                >
                    {children}
                </DragSelectable>,
            );

            selectable.find(".selectable", 0).mouse("mousedown").mouse("mouseup");
            expect(onSelection.callCount).to.equal(1);
            expect(onSelection.args[0][0]).to.deep.equal([Regions.column(0)]);
        });

        it("ignores invalid drag", () => {
            const onSelection = sinon.spy();
            const onFocus = sinon.spy();
            const locateClick = sinon.stub();
            const locateDrag = sinon.stub();

            locateClick.returns(Regions.column(0));
            locateDrag.returns(Regions.column(-1));

            const selectable = harness.mount(
                <DragSelectable
                    allowMultipleSelection={true}
                    selectedRegions={[]}
                    onFocus={onFocus}
                    onSelection={onSelection}
                    locateClick={locateClick}
                    locateDrag={locateDrag}
                >
                    {children}
                </DragSelectable>,
            );

            selectable.find(".selectable", 0).mouse("mousedown");
            selectable.find(".selectable", 1).mouse("mousemove").mouse("mouseup");

            expect(onSelection.callCount).to.equal(1);
            expect(onSelection.args[0][0]).to.deep.equal([Regions.column(0)]);
        });
    });
    */
});
