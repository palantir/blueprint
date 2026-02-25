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
import { createRef } from "react";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";
import { H4 } from "../html/html";

import { Card } from "./card";

describe("<Card>", () => {
    it("should support elevation, interactive, and className props", () => {
        render(
            <Card elevation={3} interactive={true} className={Classes.TEXT_MUTED}>
                Test
            </Card>,
        );
        const card = screen.getByText("Test");

        expect(card).toHaveClass(Classes.CARD);
        expect(card).toHaveClass(Classes.ELEVATION_3);
        expect(card).toHaveClass(Classes.INTERACTIVE);
        expect(card).toHaveClass(Classes.TEXT_MUTED);
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
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(<Card onClick={onClick}>Test</Card>);
        const card = screen.getByText("Test");

        await user.click(card);

        expect(onClick).toHaveBeenCalledOnce();
    });

    it("should support HTML props", () => {
        const onChange = vi.fn();
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
