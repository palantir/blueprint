/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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

import { HotkeysProvider } from "@blueprintjs/core";
import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import * as TableClasses from "../common/classes";

import { EditableCell } from "./editableCell";

describe("<EditableCell> prop updates", () => {
    it("clears the displayed value when value changes to undefined", () => {
        const { container, rerender } = renderEditableCell("populated");
        const contents = container.querySelector(`.${TableClasses.TABLE_TRUNCATED_TEXT}`);
        expect(contents).toHaveTextContent("populated");

        rerender(editableCell(undefined));

        expect(contents).toBeEmptyDOMElement();
    });
});

function renderEditableCell(value: string | undefined) {
    return render(editableCell(value));
}

function editableCell(value: string | undefined) {
    return (
        <HotkeysProvider>
            <EditableCell value={value} />
        </HotkeysProvider>
    );
}
