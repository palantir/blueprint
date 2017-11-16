/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// tslint:disable no-var-requires no-submodule-imports
const HERO_SVGS = {
    alert: require("raw-loader!./assets/inline/alert.svg"),
    buttons: require("raw-loader!./assets/inline/buttons.svg"),
    calendar: require("raw-loader!./assets/inline/calendar.svg"),
    checkboxes: require("raw-loader!./assets/inline/checkboxes.svg"),
    "file-upload": require("raw-loader!./assets/inline/file-upload.svg"),
    "input-groups": require("raw-loader!./assets/inline/input-groups.svg"),
    inputs: require("raw-loader!./assets/inline/inputs.svg"),
    labels: require("raw-loader!./assets/inline/labels.svg"),
    radios: require("raw-loader!./assets/inline/radios.svg"),
    "select-menus": require("raw-loader!./assets/inline/select-menus.svg"),
    sliders: require("raw-loader!./assets/inline/sliders.svg"),
    switches: require("raw-loader!./assets/inline/switches.svg"),
    "time-selections": require("raw-loader!./assets/inline/time-selections.svg"),
    toggles: require("raw-loader!./assets/inline/toggles.svg"),
};

const injectSVG = (elem: HTMLElement, id: string) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("pt-wireframe", `pt-logo-wireframe-${id}`);
    wrapper.innerHTML = HERO_SVGS[id];
    elem.appendChild(wrapper);
};

export const init = (elem: HTMLElement) => {
    for (const id of Object.keys(HERO_SVGS)) {
        injectSVG(elem, id);
    }
};
