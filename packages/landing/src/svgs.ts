/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

// tslint:disable no-var-requires
const HERO_SVGS = {
  "alert": require("raw!../resources/inline/alert.svg"),
  "buttons": require("raw!../resources/inline/buttons.svg"),
  "calendar": require("raw!../resources/inline/calendar.svg"),
  "checkboxes": require("raw!../resources/inline/checkboxes.svg"),
  "file-upload": require("raw!../resources/inline/file-upload.svg"),
  "input-groups": require("raw!../resources/inline/input-groups.svg"),
  "inputs": require("raw!../resources/inline/inputs.svg"),
  "labels": require("raw!../resources/inline/labels.svg"),
  "radios": require("raw!../resources/inline/radios.svg"),
  "select-menus": require("raw!../resources/inline/select-menus.svg"),
  "sliders": require("raw!../resources/inline/sliders.svg"),
  "switches": require("raw!../resources/inline/switches.svg"),
  "time-selections": require("raw!../resources/inline/time-selections.svg"),
  "toggles": require("raw!../resources/inline/toggles.svg"),
};

const injectSVG = (elem: HTMLElement, id: string) => {
  let wrapper = document.createElement("div");
  wrapper.classList.add("pt-wireframe", `pt-logo-wireframe-${id}`);
  wrapper.innerHTML = HERO_SVGS[id];
  elem.appendChild(wrapper);
};

export const init = (elem: HTMLElement) => {
    for (const id of Object.keys(HERO_SVGS)) {
        injectSVG(elem, id);
    }
};
