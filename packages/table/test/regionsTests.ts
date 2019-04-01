/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { expect } from "chai";
import { ICellCoordinate, IRegion, RegionCardinality, Regions } from "../src/regions";

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

        it("updates regions at last index", () => {
            const regions = [Regions.row(1, 37)];
            const updated = Regions.update(regions, Regions.column(3, 14));

            expect(updated).to.not.equal(regions);
            expect(updated.length).to.equal(regions.length);
            expect(Regions.lastRegionIsEqual(updated, Regions.column(14, 3)));
        });

        it("updates regions at specified index", () => {
            const INDEX = 1;
            const regions = [Regions.row(1), Regions.column(1), Regions.cell(1, 1)];
            const updated = Regions.update(regions, Regions.column(2), INDEX);

            expect(updated).to.not.equal(regions);
            expect(updated.length).to.equal(regions.length);
            expect(updated[INDEX]).to.deep.equal(Regions.column(2));
        });
    });

    describe("isRegionValidForTable", () => {
        const N = 3;

        const VALID_INDEX_LOW = 0;
        const VALID_INDEX_HIGH = N - 1;

        const INVALID_INDEX_LOW = -1;
        const INVALID_INDEX_HIGH = N;

        const isValid = Regions.isRegionValidForTable;

        describe("in an NxN table", () => {
            const expectTrue = (region: IRegion, msg?: string) => expect(isValid(region, N, N), msg).to.be.true;
            const expectFalse = (region: IRegion, msg?: string) => expect(isValid(region, N, N), msg).to.be.false;

            describe("cell regions", () => {
                it("returns false if row index out-of-bounds", () => {
                    expectFalse(Regions.cell(INVALID_INDEX_LOW, VALID_INDEX_LOW), "invalid low");
                    expectFalse(Regions.cell(INVALID_INDEX_HIGH, VALID_INDEX_LOW), "invalid high");
                });

                it("returns false if column index out-of-bounds", () => {
                    expectFalse(Regions.cell(VALID_INDEX_LOW, INVALID_INDEX_LOW), "invalid low");
                    expectFalse(Regions.cell(VALID_INDEX_LOW, INVALID_INDEX_HIGH), "invalid high");
                });

                it("returns true if both row and column indices in bounds", () => {
                    expectTrue(Regions.cell(VALID_INDEX_LOW, VALID_INDEX_LOW), "valid low");
                    expectTrue(Regions.cell(VALID_INDEX_HIGH, VALID_INDEX_HIGH), "valid high");
                });
            });

            describe("column regions", () => {
                it("returns false if column index out-of-bounds", () => {
                    expectFalse(Regions.column(INVALID_INDEX_LOW), "invalid low");
                    expectFalse(Regions.column(INVALID_INDEX_HIGH), "invalid high");
                });

                it("returns true if both row and column indices in bounds", () => {
                    expectTrue(Regions.column(VALID_INDEX_LOW), "valid low");
                    expectTrue(Regions.column(VALID_INDEX_HIGH), "valid high");
                });
            });

            describe("row regions", () => {
                it("returns false if row index out-of-bounds", () => {
                    expectFalse(Regions.row(INVALID_INDEX_LOW), "invalid low");
                    expectFalse(Regions.row(INVALID_INDEX_HIGH), "invalid high");
                });

                it("returns true if both row and column indices in bounds", () => {
                    expectTrue(Regions.row(VALID_INDEX_LOW), "valid low");
                    expectTrue(Regions.row(VALID_INDEX_HIGH), "valid high");
                });
            });

            describe("table regions", () => {
                it("always returns true", () => {
                    expectTrue(Regions.table());
                });
            });
        });

        describe("in an N-row, 0-column table", () => {
            const expectFalse = (region: IRegion, msg?: string) =>
                expect(isValid(region, N, VALID_INDEX_LOW), msg).to.be.false;

            it("always returns false", () => {
                expectFalse(Regions.cell(VALID_INDEX_LOW, VALID_INDEX_LOW));
                expectFalse(Regions.column(INVALID_INDEX_LOW));
                expectFalse(Regions.column(VALID_INDEX_LOW));
                expectFalse(Regions.row(INVALID_INDEX_LOW));
                expectFalse(Regions.row(VALID_INDEX_LOW));
                expectFalse(Regions.table());
            });
        });

        describe("in an N-column, 0-row table", () => {
            const expectFalse = (region: IRegion, msg?: string) =>
                expect(isValid(region, VALID_INDEX_LOW, N), msg).to.be.false;

            it("always returns false", () => {
                expectFalse(Regions.cell(INVALID_INDEX_LOW, INVALID_INDEX_LOW));
                expectFalse(Regions.column(INVALID_INDEX_LOW));
                expectFalse(Regions.column(VALID_INDEX_LOW));
                expectFalse(Regions.row(INVALID_INDEX_LOW));
                expectFalse(Regions.row(VALID_INDEX_LOW));
                expectFalse(Regions.table());
            });
        });

        describe("in a 0-column, 0-row table", () => {
            const expectFalse = (region: IRegion, msg?: string) =>
                expect(isValid(region, VALID_INDEX_LOW, VALID_INDEX_LOW), msg).to.be.false;

            it("always returns false", () => {
                expectFalse(Regions.cell(INVALID_INDEX_LOW, INVALID_INDEX_LOW));
                expectFalse(Regions.cell(VALID_INDEX_LOW, VALID_INDEX_LOW));
                expectFalse(Regions.column(INVALID_INDEX_LOW));
                expectFalse(Regions.column(VALID_INDEX_LOW));
                expectFalse(Regions.row(INVALID_INDEX_LOW));
                expectFalse(Regions.row(VALID_INDEX_LOW));
                expectFalse(Regions.table());
            });
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

    describe("clampRegion", () => {
        const fn = Regions.clampRegion;

        it("returns a deep copy of the region", () => {
            const validRegion = Regions.table();
            const clampedRegion = fn(validRegion, 1, 1);
            expect(clampedRegion === validRegion).to.be.false;
        });

        it("clamps regions whose start indices are < 0", () => {
            const cellRegion = Regions.cell(-1, 1);
            expect(fn(cellRegion, 1, 1)).to.deep.equal(Regions.cell(0, 1));

            const columnRegion = Regions.column(-1, 1);
            expect(fn(columnRegion, 1, 1)).to.deep.equal(Regions.column(0, 1));

            const rowRegion = Regions.row(-1, 1);
            expect(fn(rowRegion, 1, 1)).to.deep.equal(Regions.row(0, 1));
        });

        it("clamps regions whose end indices are > max", () => {
            const cellRegion = Regions.cell(0, 2);
            expect(fn(cellRegion, 1, 1)).to.deep.equal(Regions.cell(0, 1));

            const columnRegion = Regions.column(0, 2);
            expect(fn(columnRegion, 1, 1)).to.deep.equal(Regions.column(0, 1));

            const rowRegion = Regions.row(0, 2);
            expect(fn(rowRegion, 1, 1)).to.deep.equal(Regions.row(0, 1));
        });

        it("returns a new FULL_TABLE region if provided", () => {
            const tableRegion = Regions.table();
            expect(fn(tableRegion, 1, 1)).to.deep.equal(Regions.table());
        });
    });

    describe("copy", () => {
        it("copies CELLS regions", () => {
            const region = Regions.cell(0, 1, 2, 3);
            const regionCopy = Regions.cell(0, 1, 2, 3);
            expect(Regions.copy(region)).to.deep.equal(regionCopy);
        });

        it("copies FULL_COLUMNS regions", () => {
            const region = Regions.column(0, 1);
            const regionCopy = Regions.column(0, 1);
            expect(Regions.copy(region)).to.deep.equal(regionCopy);
        });

        it("copies FULL_ROWS regions", () => {
            const region = Regions.row(0, 1);
            const regionCopy = Regions.row(0, 1);
            expect(Regions.copy(region)).to.deep.equal(regionCopy);
        });

        it("copies FULL_TABLE regions", () => {
            const region = Regions.table();
            const regionCopy = Regions.table();
            expect(Regions.copy(region)).to.deep.equal(regionCopy);
        });
    });

    describe("expandRegion", () => {
        it("returns new region if cardinalities are different", () => {
            const oldRegion = Regions.cell(0, 0);
            const newRegion = Regions.table();
            const result = Regions.expandRegion(oldRegion, newRegion);
            // should have returned the newRegion instance
            expect(result).to.equal(newRegion);
        });

        it("expands a FULL_ROWS region", () => {
            const oldRegion = Regions.row(1, 2);
            const newRegion = Regions.row(9, 10);
            const result = Regions.expandRegion(oldRegion, newRegion);
            expect(result).to.deep.equal(Regions.row(1, 10));
        });

        it("expands a FULL_COLUMNS region", () => {
            const oldRegion = Regions.column(9, 10);
            const newRegion = Regions.column(1, 2);
            const result = Regions.expandRegion(oldRegion, newRegion);
            expect(result).to.deep.equal(Regions.column(1, 10));
        });

        it("expands a CELLS region", () => {
            const oldRegion = Regions.cell(1, 2);
            const newRegion = Regions.cell(9, 10);
            const result = Regions.expandRegion(oldRegion, newRegion);
            expect(result).to.deep.equal(Regions.cell(1, 2, 9, 10));
        });

        it("expands a FULL_TABLE region", () => {
            const oldRegion = Regions.table();
            const newRegion = Regions.table();
            const result = Regions.expandRegion(oldRegion, newRegion);
            expect(result).to.deep.equal(Regions.table());
        });
    });
});
