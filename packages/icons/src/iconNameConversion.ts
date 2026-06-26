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

import { LegacyToIconNextNameMap } from "./generated/iconNameMap";
import type { IconName } from "./iconNames";
import type { IconNextName } from "./next/generated/manifest";

export { LegacyToIconNextNameMap };

/**
 * Returns the next-generation (`@blueprintjs/icons/next`) icon name corresponding to a legacy icon name.
 */
export function getIconNextName(name: IconName): IconNextName {
    const nextName = LegacyToIconNextNameMap[name];
    if (nextName === undefined) {
        throw new Error(`No next-generation icon mapping for legacy icon "${name}"`);
    }
    return nextName;
}
