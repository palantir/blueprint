/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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
 * Measure width in pixels of a string displayed with styles provided by `className`.
 * Should only be used if measuring can't be done with existing DOM elements.
 */
export function measureTextWidth(text: string, className = "", containerElement = document.body) {
    if (containerElement == null) {
        return 0;
    }
    const span = document.createElement("span");
    span.classList.add(className);
    span.textContent = text;

    containerElement.appendChild(span);
    const spanWidth = span.offsetWidth;
    span.remove();

    return spanWidth;
}

export function padWithZeroes(str: string, minLength: number) {
    if (str.length < minLength) {
        return `${stringRepeat("0", minLength - str.length)}${str}`;
    } else {
        return str;
    }
}

function stringRepeat(str: string, numTimes: number) {
    return new Array(numTimes + 1).join(str);
}
