/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
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

/**
 * @fileoverview custom Popper.js modifiers
 * @see https://popper.js.org/docs/v2/modifiers/#custom-modifiers
 */

import type { Modifier } from "@popperjs/core";

// tslint:disable object-literal-sort-keys

// adapted from https://popper.js.org/docs/v2/modifiers/community-modifiers/
export const matchReferenceWidthModifier: Modifier<"matchReferenceWidth", any> = {
    enabled: true,
    name: "matchReferenceWidth",
    phase: "beforeWrite",
    requires: ["computeStyles"],
    fn: ({ state }) => {
        state.styles.popper.width = `${state.rects.reference.width}px`;
    },
    effect: ({ state }) => {
        const referenceWidth = state.elements.reference.getBoundingClientRect().width;
        state.elements.popper.style.width = `${referenceWidth}px`;
    },
};
