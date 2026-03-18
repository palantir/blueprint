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

import { render } from "@testing-library/react";

import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";

import { NonIdealState } from "./nonIdealState";

describe("<NonIdealState>", () => {
    it("renders its contents", () => {
        const { container } = render(
            <NonIdealState
                action={<p>More text!</p>}
                description="An error occurred."
                title="ERROR"
                icon="folder-close"
            />,
        );
        expect(container.querySelector("h4")).toBeInTheDocument();
        for (const className of [Classes.NON_IDEAL_STATE_VISUAL, Classes.ICON_MUTED, Classes.NON_IDEAL_STATE]) {
            expect(container.querySelector(`.${className}`)).toBeInTheDocument();
        }
    });

    it("does not apply icon muted style", () => {
        const { container } = render(<NonIdealState title="ERROR" icon="folder-close" iconMuted={false} />);
        expect(container.querySelector(`.${Classes.ICON_MUTED}`)).not.toBeInTheDocument();
    });

    it("ensures description is wrapped in an element", () => {
        const { container } = render(<NonIdealState action={<strong />} description="foo" />);
        const textContainer = container.querySelector(`.${Classes.NON_IDEAL_STATE_TEXT}`)!;
        const divs = textContainer.querySelectorAll("div");
        expect(divs).toHaveLength(1);
        expect(divs[0].textContent).toBe("foo");
    });
});
