/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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

import { render, screen } from "@testing-library/react";
import { expect } from "chai";
import * as React from "react";

import { Card, CardList, Classes } from "../../src";
import { hasClass } from "../utils";

describe("<CardList>", () => {
    it("should support className prop", () => {
        const TEST_CLASS = "test-class";
        render(
            <CardList className={TEST_CLASS}>
                <Card>first</Card>
                <Card>second</Card>
            </CardList>,
        );
        const cardList = screen.getByRole("list");

        expect(hasClass(cardList, Classes.CARD_LIST)).to.be.true;
        expect(hasClass(cardList, TEST_CLASS)).to.be.true;
    });

    it("should support HTML props", () => {
        render(<CardList title="foo" />);
        const cardList = screen.getByRole("list");

        expect(cardList.getAttribute("title")).to.equal("foo");
    });

    it("should support ref prop", () => {
        const elementRef = React.createRef<HTMLDivElement>();
        render(<CardList ref={elementRef}>Test</CardList>);

        expect(elementRef.current).to.exist;
    });
});
