/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import { Batcher } from "../src/common/batcher";

describe("Batcher", () => {
    it("creates objects from batch args", () => {
        const batcher = new Batcher<any>();
        batcher.startNewBatch();
        batcher.addArgsToBatch(1);
        batcher.addArgsToBatch(2);
        batcher.addArgsToBatch(3);
        batcher.removeOldAddNew((i: number) => i, 100, 100);
        expect(batcher.isDone()).to.be.true;
        const list = batcher.getList();
        expect(list).to.deep.equal([1, 2, 3]);
    });

    it("knows if it's done", () => {
        const batcher = new Batcher<any>();
        batcher.startNewBatch();
        batcher.addArgsToBatch(1);
        batcher.addArgsToBatch(2);
        batcher.addArgsToBatch(3);
        batcher.removeOldAddNew((i: number) => i, 1, 0);
        expect(batcher.isDone()).to.be.false;
        const list = batcher.getList();
        expect(list).to.deep.equal([1]);
    });

    it("works in batches", () => {
        const batcher = new Batcher<any>();
        batcher.startNewBatch();
        batcher.addArgsToBatch(1);
        batcher.addArgsToBatch(2);
        batcher.addArgsToBatch(3);
        batcher.removeOldAddNew((i: number) => i, 1, 0);
        expect(batcher.isDone()).to.be.false;
        expect(batcher.getList()).to.deep.equal([1]);
        batcher.removeOldAddNew((i: number) => i, 1, 0);
        expect(batcher.isDone()).to.be.false;
        expect(batcher.getList()).to.deep.equal([1, 2]);
        batcher.removeOldAddNew((i: number) => i, 1, 0);
        expect(batcher.isDone()).to.be.true;
        expect(batcher.getList()).to.deep.equal([1, 2, 3]);
    });

    it("accepts new batch of args", () => {
        const batcher = new Batcher<any>();
        batcher.startNewBatch();
        batcher.addArgsToBatch(1);
        batcher.addArgsToBatch(2);
        batcher.addArgsToBatch(3);
        batcher.removeOldAddNew((i: number) => i, 1, 1);
        expect(batcher.isDone()).to.be.false;
        expect(batcher.getList()).to.deep.equal([1]);

        batcher.startNewBatch();
        batcher.addArgsToBatch(5);
        batcher.addArgsToBatch(6);
        batcher.addArgsToBatch(7);
        batcher.removeOldAddNew((i: number) => i, 1, 1);
        expect(batcher.isDone()).to.be.false;
        expect(batcher.getList()).to.deep.equal([5]);
    });

    it("can reset", () => {
        const batcher = new Batcher<any>();
        batcher.startNewBatch();
        batcher.addArgsToBatch(1);
        batcher.addArgsToBatch(2);
        batcher.addArgsToBatch(3);
        batcher.removeOldAddNew((i: number) => i, 1, 1);
        expect(batcher.isDone()).to.be.false;
        expect(batcher.getList()).to.deep.equal([1]);

        batcher.reset();
        batcher.startNewBatch();
        batcher.addArgsToBatch(5);
        batcher.addArgsToBatch(6);
        batcher.addArgsToBatch(7);
        batcher.removeOldAddNew((i: number) => i, 1, 0);
        expect(batcher.isDone()).to.be.false;
        expect(batcher.getList()).to.deep.equal([5]);
    });

    it("will incrementally update old values after reset", () => {
        const batcher = new Batcher<any>();

        batcher.startNewBatch();
        batcher.addArgsToBatch(1);
        batcher.addArgsToBatch(2);
        batcher.addArgsToBatch(3);
        batcher.addArgsToBatch(4);
        batcher.removeOldAddNew((i: number) => `A${i}`, 1, 1, 1);
        expect(batcher.getList()).to.deep.equal(["A1"]);
        expect(batcher.isDone()).to.be.false;
        batcher.removeOldAddNew((i: number) => `A${i}`, 1, 1, 1);
        expect(batcher.getList()).to.deep.equal(["A1", "A2"]);
        expect(batcher.isDone()).to.be.false;
        batcher.removeOldAddNew((i: number) => `A${i}`, 1, 1, 1);
        expect(batcher.getList()).to.deep.equal(["A1", "A2", "A3"]);
        expect(batcher.isDone()).to.be.false;
        batcher.removeOldAddNew((i: number) => `A${i}`, 1, 1, 1);
        expect(batcher.getList()).to.deep.equal(["A1", "A2", "A3", "A4"]);
        expect(batcher.isDone()).to.be.true;

        batcher.reset();
        batcher.startNewBatch();
        batcher.addArgsToBatch(2);
        batcher.addArgsToBatch(3);
        batcher.addArgsToBatch(4);
        batcher.addArgsToBatch(5);
        batcher.removeOldAddNew((i: number) => `B${i}`, 1, 1, 1);
        // A1 removed
        // A2 -> B2 updated
        // B5 added
        expect(batcher.getList()).to.deep.equal(["B2", "A3", "A4", "B5"]);
        expect(batcher.isDone()).to.be.false;
        batcher.removeOldAddNew((i: number) => `B${i}`, 1, 1, 1);
        // B3 updated
        expect(batcher.getList()).to.deep.equal(["B2", "B3", "A4", "B5"]);
        expect(batcher.isDone()).to.be.false;
        // B4 updated
        batcher.removeOldAddNew((i: number) => `B${i}`, 1, 1, 1);
        expect(batcher.getList()).to.deep.equal(["B2", "B3", "B4", "B5"]);
        expect(batcher.isDone()).to.be.true;
    });
});
