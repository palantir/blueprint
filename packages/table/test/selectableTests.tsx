/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import * as React from "react";
import { Regions } from "../src/";
import { DragSelectable } from "../src/interactions/selectable";
import { ReactHarness } from "./harness";

describe("DragSelectable", () => {
    const harness = new ReactHarness();
    const children = (
        <div className="single-child">
            <div className="selectable">Zero</div>
            <div className="selectable">One</div>
            <div className="selectable">Two</div>
        </div>
    );

    afterEach(() => {
        harness.unmount();
    });

    after(() => {
        harness.destroy();
    });

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
        expect(onFocus.args[0][0]).to.deep.equal({col: 0, row: 0});
    });

    it("restricts to single selection", () => {
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
        expect(onFocus.called).to.be.true;
        expect(onFocus.lastCall.args[0]).to.deep.equal({col: 0, row: 0});

        locateClick.reset();
        locateClick.onCall(0).returns(Regions.column(1));
        locateClick.onCall(1).returns(Regions.column(2));
        locateClick.onCall(2).returns(Regions.column(2));
        selectable.find(".selectable", 1).mouse("mousedown");
        selectable.find(".selectable", 2).mouse("mousemove").mouse("mouseup");
        expect(onSelection.lastCall.args[0]).to.deep.equal([Regions.column(2)]);
        expect(onFocus.lastCall.args[0]).to.deep.equal({col: 1, row: 0});
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
        expect(onFocus.args[0][0]).to.deep.equal({col: 0, row: 0});
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
        expect(onFocus.args[0][0]).to.deep.equal({col: 2, row: 0});
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
        expect(onFocus.args[0][0]).to.deep.equal({col: 0, row: 0});
        expect(onFocus.args[1][0]).to.deep.equal({col: 1, row: 0});
        expect(onFocus.args[2][0]).to.deep.equal({col: 2, row: 0});
        expect(onFocus.args[3][0]).to.deep.equal({col: 2, row: 0});
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
            expect(onSelection.callCount).to.equal(2);
            expect(onSelection.args[0][0]).to.deep.equal([Regions.column(0)]);
            expect(onSelection.args[1][0]).to.deep.equal([]);
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
});
