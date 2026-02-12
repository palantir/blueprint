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

import { render, screen } from "@testing-library/react";
import { describe } from "@blueprintjs/test-commons/vitest";

import { selectComponentSuite } from "../select/selectComponentSuite";

import { Omnibar } from "./omnibar";

describe("<Omnibar>", () => {
    // Omnibar uses role="menu" so items have role="menuitem" instead of "option"
    selectComponentSuite(
        props => {
            const result = render(<Omnibar {...props} isOpen={true} overlayProps={{ usePortal: false }} />, {
                container: document.body.appendChild(document.createElement("div")),
            });
            return {
                rerender: newProps =>
                    result.rerender(<Omnibar {...newProps} isOpen={true} overlayProps={{ usePortal: false }} />),
            };
        },
        // Use placeholder to specifically target the search input, not the create item textarea
        () => screen.getByPlaceholderText("Search..."),
        () => screen.getAllByRole("menuitem"),
    );
});
