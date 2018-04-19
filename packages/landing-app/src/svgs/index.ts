/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// tslint:disable no-var-requires no-submodule-imports
const HERO_SVGS: Record<string, string> = {
    alert: require("raw-loader!./alert.svg"),
    buttons: require("raw-loader!./buttons.svg"),
    calendar: require("raw-loader!./calendar.svg"),
    checkboxes: require("raw-loader!./checkboxes.svg"),
    "file-upload": require("raw-loader!./file-upload.svg"),
    "input-groups": require("raw-loader!./input-groups.svg"),
    inputs: require("raw-loader!./inputs.svg"),
    labels: require("raw-loader!./labels.svg"),
    radios: require("raw-loader!./radios.svg"),
    "select-menus": require("raw-loader!./select-menus.svg"),
    sliders: require("raw-loader!./sliders.svg"),
    switches: require("raw-loader!./switches.svg"),
    "time-selections": require("raw-loader!./time-selections.svg"),
    toggles: require("raw-loader!./toggles.svg"),
};

function injectSVG(elem: HTMLElement, id: string) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("landing-wireframe", `landing-logo-wireframe-${id}`);
    wrapper.innerHTML = HERO_SVGS[id];
    elem.appendChild(wrapper);
}

export function initializeSVGs(elem: HTMLElement) {
    for (const id of Object.keys(HERO_SVGS)) {
        injectSVG(elem, id);
    }
}
