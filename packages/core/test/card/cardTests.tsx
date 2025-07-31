/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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
import userEvent from "@testing-library/user-event";
import { expect } from "chai";
import { createRef } from "react";
import sinon from "sinon";

import { Card, Classes, H4 } from "../../src";
import { hasClass } from "../utils";

describe("<Card>", () => {
    it("should support elevation, interactive, and className props", () => {
        render(
            <Card elevation={3} interactive={true} className={Classes.TEXT_MUTED}>
                Test
            </Card>,
        );
        const card = screen.getByText("Test");

        expect(hasClass(card, Classes.CARD)).to.be.true;
        expect(hasClass(card, Classes.ELEVATION_3)).to.be.true;
        expect(hasClass(card, Classes.INTERACTIVE)).to.be.true;
        expect(hasClass(card, Classes.TEXT_MUTED)).to.be.true;
    });

    it("should render children", () => {
        render(
            <Card>
                <H4>Card content</H4>
            </Card>,
        );

        expect(screen.getByText("Card content")).to.exist;
    });

    it("should call onClick when card is clicked", async () => {
        const onClick = sinon.spy();
        render(<Card onClick={onClick}>Test</Card>);
        const card = screen.getByText("Test");

        await userEvent.click(card);

        expect(onClick.calledOnce).to.be.true;
    });

    it("should support HTML props", () => {
        const onChange = sinon.spy();
        render(
            <Card onChange={onChange} title="foo" tabIndex={4000}>
                Test
            </Card>,
        );
        const card = screen.getByText("Test");

        expect(card.getAttribute("title")).to.equal("foo");
        expect(card.tabIndex).to.equal(4000);
    });

    it("should support ref prop", () => {
        const elementRef = createRef<HTMLDivElement>();
        render(<Card ref={elementRef}>Test</Card>);

        expect(elementRef.current).to.exist;
    });
});
