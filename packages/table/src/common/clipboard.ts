/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

/* istanbul ignore next */

export const Clipboard = {
    /**
     * Overrides the inherited CSS of the element to make sure it is
     * selectable. This method also makes the element pseudo-invisible.
     */
    applySelectableStyles(elem: HTMLElement) {
        elem.style.overflow = "hidden";
        elem.style.height = "0px";
        elem.style.setProperty("-webkit-user-select", "all");
        elem.style.setProperty("-moz-user-select", "all");
        elem.style.setProperty("-ms-user-select", "all");
        elem.style.setProperty("user-select", "all");
        return elem;
    },

    /**
     * Copies table cells to the clipboard. The parameter is a row-major
     * 2-dimensional `Array` of strings and can contain nulls. We assume all
     * rows are the same length. If not, the cells will still be copied, but
     * the columns may not align. Returns a boolean indicating whether the
     * copy succeeded.
     *
     * See `Clipboard.copy`
     */
    copyCells(cells: string[][]) {
        const table = document.createElement("tbody");
        Clipboard.applySelectableStyles(table);
        for (const row of cells) {
            const tr = table.appendChild(document.createElement("tr"));
            for (const cell of row) {
                const td = tr.appendChild(document.createElement("td"));
                td.textContent = cell;
            }
        }

        return Clipboard.copyElement(table);
    },

    /**
     * Copies the text to the clipboard. Returns a boolean
     * indicating whether the copy succeeded.
     *
     * See `Clipboard.copy`
     */
    copyString(value: string) {
        const text = document.createElement("textarea");
        Clipboard.applySelectableStyles(text);
        text.value = value;

        return Clipboard.copyElement(text);
    },

    /**
     * Copies the element and its children to the clipboard. Returns a boolean
     * indicating whether the copy succeeded.
     *
     * Verified on Firefox 47, Chrome 51.
     *
     * Note: Sometimes the copy does not succeed. Presumably, in order to
     * prevent memory issues, browsers will limit the total amount of data you
     * can copy to the clipboard. Based on ad hoc testing, we found an
     * inconsistent limit at about 300KB or 40,000 cells. Depending on the on
     * the content of cells, your limits may vary.
     */
    copyElement(elem: HTMLElement) {
        if (!Clipboard.isCopySupported()) {
            return false;
        }

        // must be document.body instead of document.documentElement for firefox
        document.body.appendChild(elem);
        try {
            window.getSelection().selectAllChildren(elem);
            return document.execCommand("copy");
        } catch (err) {
            return false;
        } finally {
            document.body.removeChild(elem);
        }
    },

    /**
     * Returns a boolean indicating whether the current browser nominally
     * supports the `copy` operation using the `execCommand` API.
     */
    isCopySupported() {
        return document.queryCommandSupported != null && document.queryCommandSupported("copy");
    },
};
