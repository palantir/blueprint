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

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";

import { FileInput } from "./fileInput";

describe("<FileInput>", () => {
    it(`supports className, fill, & size="large"`, () => {
        const CUSTOM_CLASS = "foo";
        render(<FileInput className={CUSTOM_CLASS} fill={true} size="large" />);
        const input = screen.getByLabelText<HTMLInputElement>("Choose file...");
        const label = input.closest("label");
        expect(label).toBeInTheDocument();
        expect(label).toHaveClass(Classes.FILE_INPUT);
        expect(label).toHaveClass(CUSTOM_CLASS);
        expect(label).toHaveClass(Classes.FILL);
        expect(label).toHaveClass(Classes.LARGE);
    });

    it("supports custom input props", () => {
        render(
            <FileInput
                inputProps={{
                    className: "bar",
                    required: true,
                    type: "text", // overridden by type="file"
                }}
            />,
        );
        const input = screen.getByLabelText<HTMLInputElement>("Choose file...");
        expect(input).toHaveClass("bar");
        expect(input).toBeRequired();
        expect(input).toHaveAttribute("type", "file");
    });

    describe("applies top-level disabled prop to the root and input (overriding inputProps.disabled)", () => {
        it("disabled=true overrides inputProps.disabled=false", () => {
            render(<FileInput disabled={true} inputProps={{ disabled: false }} />);
            const input = screen.getByLabelText<HTMLInputElement>("Choose file...");
            const label = input.closest("label");
            expect(label).toBeInTheDocument();
            expect(label).toHaveClass(Classes.DISABLED);
            expect(input).toBeDisabled();
        });

        it("disabled=false does not override inputProps.disabled=true", () => {
            render(<FileInput disabled={false} inputProps={{ disabled: true }} />);
            const input = screen.getByLabelText<HTMLInputElement>("Choose file...");
            const label = input.closest("label");
            expect(label).toBeInTheDocument();
            expect(label).not.toHaveClass(Classes.DISABLED);
            expect(input).not.toBeDisabled();
        });
    });

    it("renders custom text", () => {
        render(<FileInput text="Input file..." />);
        expect(screen.getByLabelText<HTMLInputElement>("Input file...")).toBeInTheDocument();
    });

    it("invokes change callbacks", async () => {
        const user = userEvent.setup();
        const inputPropsOnChange = vi.fn();
        const onInputChange = vi.fn();

        render(<FileInput inputProps={{ onChange: inputPropsOnChange }} onInputChange={onInputChange} />);
        const input = screen.getByLabelText<HTMLInputElement>("Choose file...");

        const file = new File(["test"], "test.png", { type: "image/png" });
        await user.upload(input, file);

        expect(onInputChange).toHaveBeenCalledOnce();
        expect(inputPropsOnChange).toHaveBeenCalledOnce();
    });
});
