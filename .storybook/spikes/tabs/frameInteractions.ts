/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { Classes } from "@blueprintjs/core";

import { InteractionModeEngine } from "../../../packages/core/src/common/interactionMode";

/** Keep fixture interactions consistent when React renders into another window. */
export function installFrameInteractions(doc: Document) {
    const focusMode = new InteractionModeEngine(doc.documentElement, Classes.FOCUS_DISABLED);
    focusMode.start();

    // Tabs' getActiveElement checks instanceof HTMLElement in React's window,
    // which rejects elements in this frame. Bridge only its arrow-focus behavior.
    const onKeyDown = (event: KeyboardEvent) => {
        const direction = ["ArrowLeft", "ArrowUp"].includes(event.key)
            ? -1
            : ["ArrowRight", "ArrowDown"].includes(event.key)
              ? 1
              : undefined;
        const tab = doc.activeElement?.closest<HTMLElement>(`.${Classes.TAB}`);
        if (direction === undefined || tab == null) {
            return;
        }
        const list = tab.closest(`.${Classes.TAB_LIST}`);
        const enabled = Array.from(list?.querySelectorAll<HTMLElement>('[role="tab"][aria-disabled="false"]') ?? []);
        const index = enabled.indexOf(tab);
        if (index < 0) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        enabled[(index + direction + enabled.length) % enabled.length].focus();
    };
    doc.addEventListener("keydown", onKeyDown, true);
    return () => {
        doc.removeEventListener("keydown", onKeyDown, true);
        focusMode.stop();
    };
}
