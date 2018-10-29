/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
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
