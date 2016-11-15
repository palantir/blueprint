/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { FocusStyleManager } from "@blueprintjs/core";
FocusStyleManager.onlyShowFocusOnTabs();

import * as Logo from "./logo";
Logo.init(
    document.querySelector("header canvas.pt-logo") as HTMLCanvasElement,
    document.querySelector("header canvas.pt-logo-background") as HTMLCanvasElement
);

import * as SVGs from "./svgs";
SVGs.init(document.querySelector(".pt-wireframes") as HTMLElement);

const copyright = ".pt-copyright .pt-container > div:first-child";
document.querySelector(copyright).innerHTML = `© 2014–${new Date().getFullYear()} Palantir Technologies`;
