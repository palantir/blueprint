/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";

import { removeNonHTMLProps } from "../../src/common/props";

describe("Props", () => {
    describe("removeNonHTMLProps", () => {
        let props: { [key: string]: boolean };

        beforeEach(() => {
            props = {
                apple: true,
                banana: true,
                cat: true,
                containerRef: true,
                elementRef: true,
                iconName: true,
                intent: true,
                text: true,
            };
        });

        it("removes only from curated blacklist when supplied 1 argument", () => {
            assert.deepEqual(removeNonHTMLProps(props), {
                apple: true,
                banana: true,
                cat: true,
            });
        });

        it("removes only from the supplied array when supplied 2 arguments", () => {
            assert.deepEqual(removeNonHTMLProps(props, ["apple", "banana"]), {
                cat: true,
                containerRef: true,
                elementRef: true,
                iconName: true,
                intent: true,
                text: true,
            });
        });

        it("removes from the curated blacklist and the supplied array when shouldMerge=true", () => {
            assert.deepEqual(removeNonHTMLProps(props, ["apple", "banana"], true), { cat: true });
        });
    });
});
