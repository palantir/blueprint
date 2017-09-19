/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
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
        const table = document.createElement("table");
        Clipboard.applySelectableStyles(table);
        for (const row of cells) {
            const tr = table.appendChild(document.createElement("tr"));
            for (const cell of row) {
                const td = tr.appendChild(document.createElement("td"));
                td.textContent = cell;
            }
        }

        const tsv = cells.map(row => row.join("\t")).join("\n");
        return Clipboard.copyElement(table, tsv);
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

        return Clipboard.copyElement(text, value);
    },

    /**
     * Copies the element and its children to the clipboard. Returns a boolean
     * indicating whether the copy succeeded.
     *
     * If a plaintext argument is supplied, we add both the text/html and
     * text/plain mime types to the clipboard. This preserves the built in
     * semantics of copying elements to the clipboard while allowing custom
     * plaintext output for programs that can't cope with HTML data in the
     * clipboard.
     *
     * Verified on Firefox 47, Chrome 51.
     *
     * Note: Sometimes the copy does not succeed. Presumably, in order to
     * prevent memory issues, browsers will limit the total amount of data you
     * can copy to the clipboard. Based on ad hoc testing, we found an
     * inconsistent limit at about 300KB or 40,000 cells. Depending on the on
     * the content of cells, your limits may vary.
     */
    copyElement(elem: HTMLElement, plaintext?: string) {
        if (!Clipboard.isCopySupported()) {
            return false;
        }

        // must be document.body instead of document.documentElement for firefox
        document.body.appendChild(elem);
        try {
            window.getSelection().selectAllChildren(elem);

            if (plaintext != null) {
                // add plaintext fallback
                // http://stackoverflow.com/questions/23211018/copy-to-clipboard-with-jquery-js-in-chrome
                elem.addEventListener("copy", (e: UIEvent) => {
                    e.preventDefault();
                    const clipboardData = (e as any).clipboardData || (window as any).clipboardData;
                    if (clipboardData != null) {
                        clipboardData.setData("text/html", elem.outerHTML);
                        clipboardData.setData("text/plain", plaintext);
                    }
                });
            }

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
