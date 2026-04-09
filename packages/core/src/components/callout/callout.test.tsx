/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

import { IconNames } from "@blueprintjs/icons";
import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import { Classes, Intent } from "../../common";

import { Callout } from "./callout";

describe("<Callout>", () => {
    it("should support className", () => {
        render(<Callout className="foo">Test</Callout>);
        const callout = screen.getByText("Test");

        expect(callout).toHaveClass("foo");
    });

    it("should not render icon by default", () => {
        const { container } = render(<Callout />);

        expect(container.querySelector(`.${Classes.ICON}`)).not.toBeInTheDocument();
    });

    it("should render icon when provided", () => {
        const { container } = render(<Callout icon="graph" />);

        expect(container.querySelector(`.${Classes.ICON}`)).to.exist;
    });

    it("should support intent", () => {
        render(<Callout intent={Intent.DANGER}>Test</Callout>);
        const callout = screen.getByText("Test");

        expect(callout).toHaveClass(Classes.INTENT_DANGER);
    });

    it(`should render the associated default icon when intent="primary"`, () => {
        const { container } = render(<Callout intent={Intent.PRIMARY} />);

        expect(container.querySelector(`[data-icon="${IconNames.INFO_SIGN}"]`)).to.exist;
    });

    it("should remove intent icon when icon=null", () => {
        const { container } = render(<Callout icon={null} intent={Intent.PRIMARY} />);

        expect(container.querySelector(`.${Classes.ICON}`)).not.toBeInTheDocument();
    });

    it("should not render title by default", () => {
        const { container } = render(<Callout>Test</Callout>);

        expect(container.querySelector(`.${Classes.HEADING}`)).not.toBeInTheDocument();
    });

    it("should render title when provided", () => {
        render(<Callout title="title" />);
        const heading = screen.getByText("title");

        expect(heading).toHaveClass(Classes.HEADING);
    });
});
