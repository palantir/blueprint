/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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

/* eslint-disable max-len */

export const skeleton = {
    reference: "skeleton",
    markup: `<div class="bp6-card">
  <h5 class="bp6-heading"><a class="{{.modifier}}" href="#" tabindex="-1">Card heading</a></h5>
  <p class="{{.modifier}}">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eget tortor felis.
    Fusce dapibus metus in dapibus mollis. Quisque eget ex diam.
  </p>
  <button type="button" class="bp6-button bp6-icon-add {{.modifier}}" tabindex="-1">Submit</button>
</div>`,
    modifiers: [
        { name: ".bp6-skeleton", documentation: "Render this element as a skeleton, an outline of its true self." },
    ],
};
