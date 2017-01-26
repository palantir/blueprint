/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";

import { Classes } from "@blueprintjs/core";

export function expectCellLoading(cell: Element, loading = true) {
    if (loading) {
        expect(cell.textContent).to.equal("");
        expect(cell.classList.contains(Classes.LOADING)).to.be.true;
        expect(cell.children.length).to.equal(1);
        expect(cell.querySelector(`.${Classes.SKELETON}`)).to.not.be.null;
    } else {
        expect(cell.classList.contains(Classes.LOADING)).to.be.false;
        expect(cell.querySelector(`.${Classes.SKELETON}`)).to.be.null;
    }
}

export type HeaderType = "column-header" | "row-header";
export const HeaderType = {
    COLUMN: "column-header" as HeaderType,
    ROW: "row-header" as HeaderType,
};

export function expectHeaderCellLoading(cell: Element, headerType: HeaderType, loading = true) {
    const headerNameText = headerType === HeaderType.COLUMN
        ? cell.querySelector(".bp-table-column-name-text")
        : cell.querySelector(".bp-table-row-name");
    expect(headerNameText).to.not.be.null;
    if (loading) {
        expect(cell.classList.contains(Classes.LOADING)).to.be.true;
        expect(headerNameText.textContent).to.equal("");
        expect(headerNameText.children.length).to.equal(1);
        expect(cell.querySelector(`.${Classes.SKELETON}`)).to.not.be.null;
    } else {
        expect(cell.classList.contains(Classes.LOADING)).to.be.false;
        expect(cell.querySelector(`.${Classes.SKELETON}`)).to.be.null;
    }
}
