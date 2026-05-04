/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { useCallback, useEffect, useMemo, useState } from "react";

import { Code, Pre, Tab, type TabId, Tabs } from "@blueprintjs/core";

export interface CodeToggleTab {
    /** Stable identifier used for the tab and the persisted preference. */
    id: string;
    /** Visible tab label. */
    label: string;
    /** Code snippet rendered inside `<pre><code>`. */
    code: string;
}

export interface CodeToggleProps {
    /**
     * Tabs to render, in display order. The first tab is selected by default
     * when no persisted preference is found.
     */
    tabs: readonly CodeToggleTab[];

    /**
     * Required `id` for the underlying `<Tabs>` element. Must be unique within
     * the rendered page.
     */
    id: string;

    /**
     * If provided, the user's selection is persisted in `localStorage` under
     * this key and shared across all `CodeToggle` instances using the same key.
     * Useful for global preferences like the package manager choice.
     */
    storageKey?: string;
}

function readStoredPreference(storageKey: string | undefined, validIds: readonly string[]): string | undefined {
    if (storageKey === undefined || typeof window === "undefined") {
        return undefined;
    }
    const stored = window.localStorage.getItem(storageKey);
    return stored != null && validIds.includes(stored) ? stored : undefined;
}

/**
 * Generic tabbed code-snippet toggle. Each tab renders a `<pre><code>` with
 * its corresponding snippet. When `storageKey` is provided, the selection is
 * persisted in `localStorage` so the same choice carries across pages.
 */
export const CodeToggle: React.FC<CodeToggleProps> = ({ tabs, id, storageKey }) => {
    const validIds = useMemo(() => tabs.map(t => t.id), [tabs]);
    const defaultId = tabs[0]?.id ?? "";
    const [selected, setSelected] = useState<string>(defaultId);

    // Hydrate from localStorage after mount to avoid SSR / first-render mismatches.
    useEffect(() => {
        const stored = readStoredPreference(storageKey, validIds);
        if (stored !== undefined) {
            setSelected(stored);
        }
    }, [storageKey, validIds]);

    const handleChange = useCallback(
        (newTabId: TabId) => {
            const next = String(newTabId);
            if (!validIds.includes(next)) {
                return;
            }
            setSelected(next);
            if (storageKey !== undefined && typeof window !== "undefined") {
                window.localStorage.setItem(storageKey, next);
            }
        },
        [storageKey, validIds],
    );

    return (
        <Tabs id={id} selectedTabId={selected} onChange={handleChange}>
            {tabs.map(tab => (
                <Tab
                    key={tab.id}
                    id={tab.id}
                    title={tab.label}
                    panel={
                        <Pre>
                            <Code>{tab.code}</Code>
                        </Pre>
                    }
                />
            ))}
        </Tabs>
    );
};
