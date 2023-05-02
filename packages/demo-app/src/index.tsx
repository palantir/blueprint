/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

import * as React from "react";
import * as ReactDOM from "react-dom";

import { FocusStyleManager } from "@blueprintjs/core";

import { Examples } from "./examples/Examples";

FocusStyleManager.onlyShowFocusOnTabs();

(async () => {
    // Wait until CSS is loaded before rendering components because some of them (like Table)
    // rely on those styles to take accurate DOM measurements.
    await import("./index.scss");
    ReactDOM.render(<Examples />, document.querySelector("#blueprint-demo-app"));
})();
