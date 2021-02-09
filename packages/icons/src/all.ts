/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

// icon sets should be identical aside from SVG paths, so we just import the info for the 16px set
import {
    BlueprintIcons_16 as IconNames,
    BlueprintIcons_16Id as IconName,
    BLUEPRINT_ICONS_16_CODEPOINTS as IconCodepoints,
} from "./generated/16px/blueprint-icons-16";

export { IconCodepoints, IconName, IconNames };
export * from "./generated/components";
