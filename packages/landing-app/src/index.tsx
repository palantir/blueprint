/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { FocusStyleManager } from "@blueprintjs/core";
import * as Logo from "./logo";
import * as SVGs from "./svgs";

FocusStyleManager.onlyShowFocusOnTabs();

Logo.init(
    document.querySelector("header canvas.pt-logo") as HTMLCanvasElement,
    document.querySelector("header canvas.pt-logo-background") as HTMLCanvasElement,
);

SVGs.init(document.querySelector(".pt-wireframes") as HTMLElement);

const copyright = ".pt-copyright .pt-container > div:first-child";
document.querySelector(copyright).innerHTML = `© 2014–${new Date().getFullYear()} Palantir Technologies`;
