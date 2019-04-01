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

import { FocusStyleManager } from "@blueprintjs/core";
import { initializeLogo } from "./logo";
import { initializeSVGs } from "./svgs";

FocusStyleManager.onlyShowFocusOnTabs();

// tslint:disable:blueprint-classes-constants
initializeLogo(
    document.getElementById("pt-logo") as HTMLCanvasElement,
    document.getElementById("pt-logo-background") as HTMLCanvasElement,
);

initializeSVGs(document.querySelector(".landing-wireframes") as HTMLElement);

document.getElementById("copyright").innerHTML = `© 2014–${new Date().getFullYear()} Palantir Technologies`;
