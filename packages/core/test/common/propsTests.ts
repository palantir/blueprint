/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
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
                defaultIndeterminate: true,
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
                defaultIndeterminate: true,
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
