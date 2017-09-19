/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import { ICellCoordinate, RegionCardinality, Regions } from "../src/regions";

describe("Regions", () => {
    describe("factories", () => {
        it("creates cell regions", () => {
            const region = Regions.cell(0, 1, 2, 3);

            expect(Regions.isValid(region)).to.be.true;
            expect(Regions.getRegionCardinality(region)).to.equal(RegionCardinality.CELLS);
            expect(region).to.deep.equal({
                cols: [1, 3],
                rows: [0, 2],
            });

            expect(Regions.cell(0, 1)).to.deep.equal(Regions.cell(0, 1, 0, 1));
        });

        it("creates column regions", () => {
            const region = Regions.column(7, 11);

            expect(Regions.isValid(region)).to.be.true;
            expect(Regions.getRegionCardinality(region)).to.equal(RegionCardinality.FULL_COLUMNS);
            expect(region).to.deep.equal({
                cols: [7, 11],
            });

            expect(Regions.column(1)).to.deep.equal(Regions.column(1, 1));
        });

        it("creates row regions", () => {
            const region = Regions.row(3, 14);

            expect(Regions.isValid(region)).to.be.true;
            expect(Regions.getRegionCardinality(region)).to.equal(RegionCardinality.FULL_ROWS);
            expect(region).to.deep.equal({
                rows: [3, 14],
            });

            expect(Regions.row(1)).to.deep.equal(Regions.row(1, 1));
        });
    });

    describe("array manipulation", () => {
        it("adds regions", () => {
            const regions = [Regions.row(1, 37)];
            const added = Regions.add(regions, Regions.column(3, 14));

            expect(added).to.not.equal(regions);
            expect(added.length).to.equal(regions.length + 1);
            expect(Regions.lastRegionIsEqual(added, Regions.column(14, 3)));
        });

        it("updates regions", () => {
            const regions = [Regions.row(1, 37)];
            const updated = Regions.update(regions, Regions.column(3, 14));

            expect(updated).to.not.equal(regions);
            expect(updated.length).to.equal(regions.length);
            expect(Regions.lastRegionIsEqual(updated, Regions.column(14, 3)));
        });
    });

    it("searches", () => {
        const regions = [Regions.row(1, 37), Regions.column(3, 14), Regions.cell(1, 2, 3, 4)];

        expect(Regions.findMatchingRegion(null, Regions.column(14, 3))).to.equal(-1);
        expect(Regions.findMatchingRegion([], Regions.column(14, 3))).to.equal(-1);
        expect(Regions.findMatchingRegion(regions, Regions.column(4, 14))).to.equal(-1);
        expect(Regions.findMatchingRegion(regions, Regions.column(3, 14))).to.equal(1);
        expect(Regions.findMatchingRegion(regions, Regions.column(14, 3))).to.equal(1);
    });

    it("containment", () => {
        expect(Regions.hasFullColumn(null, 5)).to.be.false;
        expect(Regions.hasFullColumn([Regions.row(0, 10)], 5)).to.be.false;
        expect(Regions.hasFullColumn([Regions.column(0, 10)], 15)).to.be.false;
        expect(Regions.hasFullColumn([Regions.column(0, 10)], 5)).to.be.true;

        expect(Regions.hasFullRow(null, 5)).to.be.false;
        expect(Regions.hasFullRow([Regions.column(0, 10)], 5)).to.be.false;
        expect(Regions.hasFullRow([Regions.row(0, 10)], 15)).to.be.false;
        expect(Regions.hasFullRow([Regions.row(0, 10)], 5)).to.be.true;
    });

    it("validates", () => {
        expect(Regions.isValid(null)).to.be.false;

        expect(Regions.isValid(Regions.column(3, 14))).to.be.true;
        expect(Regions.isValid(Regions.column(14, 3))).to.be.true;
        expect(Regions.isValid(Regions.column(-14, 3))).to.be.false;

        expect(Regions.isValid(Regions.row(3, 14))).to.be.true;
        expect(Regions.isValid(Regions.row(14, 3))).to.be.true;
        expect(Regions.isValid(Regions.row(-14, 3))).to.be.false;
    });

    it("combines styled region groups", () => {
        const myGroups = [
            {
                className: "my-region",
                regions: [Regions.column(1)],
            },
        ];

        const joinedGroups = Regions.joinStyledRegionGroups([Regions.row(2)], myGroups, null);
        expect(joinedGroups).to.have.lengthOf(2);
        expect(joinedGroups[1].regions[0]).to.deep.equal(Regions.row(2));
    });

    it("iterates", () => {
        const hits: string[] = [];
        const append = () => {
            hits.push("X");
        };
        Regions.eachUniqueFullColumn([], append);
        expect(hits).to.have.lengthOf(0);

        Regions.eachUniqueFullColumn([Regions.row(2)], append);
        expect(hits).to.have.lengthOf(0);

        Regions.eachUniqueFullColumn([Regions.row(2), Regions.column(2, 5)], append);
        expect(hits).to.have.lengthOf(4);
    });

    it("enumerates cells", () => {
        const invalid = Regions.enumerateUniqueCells(null, 3, 2);
        expect(invalid).to.have.lengthOf(0);

        const cells = Regions.enumerateUniqueCells([Regions.column(0), Regions.row(0)], 3, 2);
        expect(cells).to.deep.equal([[0, 0], [0, 1], [1, 0], [2, 0]]);
    });

    it("sparsely maps cells", () => {
        const cells = [[0, 0], [0, 1], [1, 0], [2, 0]] as ICellCoordinate[];
        const sparse = Regions.sparseMapCells(cells, () => "X");
        // normal deep equals doesn't work here so we use JSON.stringify
        expect(JSON.stringify(sparse)).to.equal(JSON.stringify([["X", "X"], ["X", null], ["X", null]]));
    });
});
