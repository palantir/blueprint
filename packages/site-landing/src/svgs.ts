/**
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

// tslint:disable no-var-requires no-submodule-imports
const HERO_SVGS = {
    alert: require("raw!../resources/inline/alert.svg"),
    buttons: require("raw!../resources/inline/buttons.svg"),
    calendar: require("raw!../resources/inline/calendar.svg"),
    checkboxes: require("raw!../resources/inline/checkboxes.svg"),
    "file-upload": require("raw!../resources/inline/file-upload.svg"),
    "input-groups": require("raw!../resources/inline/input-groups.svg"),
    inputs: require("raw!../resources/inline/inputs.svg"),
    labels: require("raw!../resources/inline/labels.svg"),
    radios: require("raw!../resources/inline/radios.svg"),
    "select-menus": require("raw!../resources/inline/select-menus.svg"),
    sliders: require("raw!../resources/inline/sliders.svg"),
    switches: require("raw!../resources/inline/switches.svg"),
    "time-selections": require("raw!../resources/inline/time-selections.svg"),
    toggles: require("raw!../resources/inline/toggles.svg"),
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
