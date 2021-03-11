/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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
 * Removes leading indents from a template string without removing all leading whitespace.
 * Trims resulting string to remove blank first/last lines caused by ` location.
 */
export function dedent(strings: TemplateStringsArray, ...values: Array<{ toString(): string }>) {
    let fullString = strings.reduce((accumulator, str, i) => {
        return accumulator + values[i - 1].toString() + str;
    });

    // match all leading spaces/tabs at the start of each line
    const match = fullString.match(/^[ \t]*(?=\S)/gm)!;
    // find the smallest indent, we don't want to remove all leading whitespace
    const indent = Math.min(...match.map(el => el.length));
    const regexp = new RegExp("^[ \\t]{" + indent + "}", "gm");
    fullString = indent > 0 ? fullString.replace(regexp, "") : fullString;
    return fullString.trim();
}

export function smartSearch(query: string, ...content: string[]) {
    const terms = query.toLowerCase().split(" ");
    const dataToSearch = content.map(s => s.toLowerCase());
    return terms.every(term => dataToSearch.some(d => d.indexOf(term) >= 0));
}
