/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License atx
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Classes } from "@blueprintjs/core";

/**
 * Returns whether the focused target of an Enter/Space key event will fire its own click on keyup.
 *
 * Such targets activate the popover themselves, so a Select/MultiSelect wrapper must NOT also open on
 * keydown — doing so opens the popover early and then the target's synthesized keyup click toggles it
 * back closed. Targets that do not self-activate (a plain `role="button"` element, a bare anchor) get no
 * such click, so the wrapper is responsible for opening the popover itself.
 *
 * Self-activating targets:
 * - native `<button>` (fires click on Enter and on Space keyup)
 * - Blueprint `<Button>`/`<AnchorButton>`, detected via {@link Classes.BUTTON}, which synthesize a click
 *   on keyup for both keys regardless of tag or `href`
 * - native `<a href>` (fires click on Enter only)
 *
 * The search is scoped to the handler's own element (`currentTarget`) so a clickable ancestor rendered
 * outside the target cannot suppress activation, and a disabled activator is treated as non-activating
 * because it never fires its own click.
 */
export function targetSelfActivatesOnKeyUp(event: React.KeyboardEvent<HTMLElement>): boolean {
    const target = event.target;
    if (!(target instanceof Element)) {
        return false;
    }

    const selector = event.key === " " ? `button, .${Classes.BUTTON}` : `button, a[href], .${Classes.BUTTON}`;
    const match = target.closest(selector);
    if (match == null || !event.currentTarget.contains(match)) {
        return false;
    }

    return !match.matches(`:disabled, .${Classes.DISABLED}`);
}
