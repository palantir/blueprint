/**
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
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
        batcher.removeOldAddNew((i: number) => i, 0, 1);
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
        batcher.removeOldAddNew((i: number) => i, 0, 1);
        expect(batcher.isDone()).to.be.false;
        expect(batcher.getList()).to.deep.equal([1]);
        batcher.removeOldAddNew((i: number) => i, 0, 1);
        expect(batcher.isDone()).to.be.false;
        expect(batcher.getList()).to.deep.equal([1, 2]);
        batcher.removeOldAddNew((i: number) => i, 0, 1);
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
        batcher.removeOldAddNew((i: number) => i, 0, 1);
        expect(batcher.isDone()).to.be.false;
        expect(batcher.getList()).to.deep.equal([5]);
    });
});
