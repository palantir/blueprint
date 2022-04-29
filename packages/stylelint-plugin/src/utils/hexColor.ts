/*
 * Copyright 2020 Palantir Technologies, Inc. All rights reserved.
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

const HEX_COLOR_REGEX = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

export function isHexColor(maybeHex: string): boolean {
    return HEX_COLOR_REGEX.test(maybeHex);
}

export function normalizeHexColor(hex: string): string {
    if (!isHexColor(hex)) {
        return hex;
    }
    let normalized = hex.toLocaleUpperCase();
    const isThreeLetterHex = normalized.length === 4; // Three letters plus "#"
    if (isThreeLetterHex) {
        const [, r, g, b] = normalized;
        normalized = `#${r}${r}${g}${g}${b}${b}`;
    }
    return normalized;
}
