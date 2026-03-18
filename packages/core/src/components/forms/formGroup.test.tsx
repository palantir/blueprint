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

import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import { Classes, Intent } from "../../common";

import { FormGroup } from "./formGroup";

describe("<FormGroup>", () => {
    it("supports className & intent", () => {
        const { container } = render(<FormGroup className="foo" intent={Intent.SUCCESS} />);
        const root = container.querySelector<HTMLElement>(`.${Classes.FORM_GROUP}`);
        expect(root).toBeInTheDocument();
        expect(root).toHaveClass(Classes.FORM_GROUP);
        expect(root).toHaveClass(Classes.INTENT_SUCCESS);
        expect(root).toHaveClass("foo");
    });

    it("renders children in form content", () => {
        render(
            <FormGroup>
                <input id="foo" defaultValue="test" />
            </FormGroup>,
        );
        const input = screen.getByDisplayValue("test");
        expect(input.parentElement).toHaveClass(Classes.FORM_CONTENT);
    });

    it("renders label & labelFor", () => {
        render(
            <FormGroup label="This is the label." labelFor="foo">
                <input id="foo" defaultValue="test" />
            </FormGroup>,
        );
        const input = screen.getByLabelText("This is the label.");
        expect(input).toHaveDisplayValue("test");
    });

    it("hides label when falsy", () => {
        const { container } = render(<FormGroup />);
        expect(container.querySelector("label")).toBeNull();
    });

    it("labelInfo=JSX renders JSX content in label", () => {
        render(<FormGroup label="label" labelInfo={<em>fill me out</em>} />);

        const labelInfo = screen.getByText("fill me out");
        expect(labelInfo).toBeInTheDocument();
        expect(labelInfo.tagName).toBe("EM");

        const label = screen.getByText("label");
        expect(label).toContainElement(labelInfo);
    });

    it("renders helperText", () => {
        render(<FormGroup helperText="Help me out" />);
        const helper = screen.getByText("Help me out");
        expect(helper).toHaveClass(Classes.FORM_HELPER_TEXT);
    });
});
