/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

const heroSVGs = require("./svgs.json") as string[];

const injectSVG = (elem: HTMLElement, id: string) => {
  let wrapper = document.createElement("div");
  wrapper.classList.add("wireframe", `logo-wireframe-${id}`);

  const contents = require(`raw!./resources/inline/${id}.svg`) as string;
  wrapper.innerHTML = contents;
  elem.appendChild(wrapper);
};

export const init = (elem: HTMLElement) => {
    for (const id of heroSVGs) {
        injectSVG(elem, id);
    }
};
