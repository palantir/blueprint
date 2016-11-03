/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { FocusStyleManager } from "@blueprint/core";
FocusStyleManager.onlyShowFocusOnTabs();

require("./index.scss");

import * as Logo from "./logo";
Logo.init(
    document.querySelector("header canvas.bp-logo") as HTMLCanvasElement,
    document.querySelector("header canvas.bp-logo-background") as HTMLCanvasElement
);

import * as SVGs from "./svgs";
SVGs.init(document.querySelector(".wireframes") as HTMLElement);

const copyright = ".bp-copyright .bp-container > div:first-child";
document.querySelector(copyright).innerHTML = `© 2014-${new Date().getFullYear()} Palantir Technologies`;
