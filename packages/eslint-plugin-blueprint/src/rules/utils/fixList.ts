/*!
 * Copyright 2019 Palantir Technologies, Inc. All rights reserved.
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

import { RuleFix } from "@typescript-eslint/experimental-utils/dist/ts-eslint";

export class FixList {
    private fixes: RuleFix[] = [];

    public getFixes() {
        return this.fixes;
    }

    public addFixes(fixes: null | RuleFix | RuleFix[] | IterableIterator<RuleFix>) {
        if (fixes == null) {
            return;
        } else if (isRuleFix(fixes)) {
            this.fixes.push(fixes);
        } else {
            this.fixes = this.fixes.concat(Array.from(fixes));
        }
    }
}

function isRuleFix(fix: RuleFix | RuleFix[] | IterableIterator<RuleFix>): fix is RuleFix {
    return (fix as RuleFix).range !== undefined && (fix as RuleFix).text !== undefined;
}
