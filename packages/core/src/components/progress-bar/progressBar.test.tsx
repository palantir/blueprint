/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { Classes } from "../../common";

import { ProgressBar } from "./progressBar";

describe("ProgressBar", () => {
    it("renders a PROGRESS_BAR", () => {
        render(<ProgressBar />);
        const progressBar = screen.getByRole("progressbar");
        expect(progressBar).toHaveClass(Classes.PROGRESS_BAR);
    });

    it("does not set width by default", () => {
        render(<ProgressBar />);
        const progressBar = screen.getByRole("progressbar");
        const meter = progressBar.querySelector(`.${Classes.PROGRESS_METER}`);
        expect(meter).toBeInTheDocument();
        expect(meter).not.toHaveAttribute("style");
    });

    it("value sets width percentage", () => {
        render(<ProgressBar value={0.35} />);
        const progressBar = screen.getByRole("progressbar");
        const meter = progressBar.querySelector(`.${Classes.PROGRESS_METER}`);
        expect(meter).toBeInTheDocument();
        expect(meter).toHaveStyle({ width: "35%" });
    });
});
