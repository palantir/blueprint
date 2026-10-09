/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { useCallback, useEffect, useRef, useState } from "react";

import { Button, Callout, Card, Classes, Code, H5, Menu, MenuItem, type MenuItemProps, Tag } from "@blueprintjs/core";

type Variant = "A" | "B";

interface LogEntry {
    id: number;
    isMidTraversalClose: boolean;
    text: string;
    variant: Variant;
}

interface Point {
    x: number;
    y: number;
}

const SUBMENU_ITEMS = ["Copy link", "Invite people", "Email", "Slack", "Export as PDF"];
const SIBLING_ITEMS = ["Duplicate", "Rename", "Move to trash", "Archive", "Download"];

/**
 * Repro for PR #8271: with `requireIntent` enabled (the default for `safePolygon: true`), the
 * memoized safe polygon keeps its last cursor sample across hover cycles. The first diagonal
 * traversal works; later ones compute a near-zero "speed" from that stale sample and close.
 */
export function SafePolygonRepro() {
    const [log, setLog] = useState<LogEntry[]>([]);
    const [generation, setGeneration] = useState(0);
    const lastPointer = useRef<Point | undefined>(undefined);
    const nextId = useRef(0);

    useEffect(() => {
        const handlePointerMove = (event: PointerEvent) => {
            lastPointer.current = { x: event.clientX, y: event.clientY };
        };
        document.addEventListener("pointermove", handlePointerMove);
        return () => document.removeEventListener("pointermove", handlePointerMove);
    }, []);

    const addEntry = useCallback((variant: Variant, text: string, isMidTraversalClose = false) => {
        const id = nextId.current++;
        setLog(entries => [{ id, isMidTraversalClose, text, variant }, ...entries].slice(0, 40));
    }, []);

    const handleClose = useCallback(
        (variant: Variant, openMs: number) => {
            const { isMidTraversal, label } = describePointer(lastPointer.current);
            addEntry(variant, `closed after ${openMs} ms, pointer ${label}`, isMidTraversal);
        },
        [addEntry],
    );

    const remountA = useCallback(() => {
        setGeneration(value => value + 1);
        addEntry("A", "remounted (fresh safe polygon)");
    }, [addEntry]);

    const clearLog = useCallback(() => setLog([]), []);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: 30 }}>
            <Callout intent="primary" title="Safe polygon fails after the first use">
                Start with the pointer on the left half of <strong>Share</strong>, then move at a normal speed
                diagonally down-right toward <strong>Export as PDF</strong>. The path crosses the sibling items below
                Share. Repeat a few times, waiting a second or two between passes. Do not click.
            </Callout>

            <div style={{ alignItems: "flex-start", display: "flex", gap: 280 }}>
                <ReproColumn
                    description={
                        <>
                            <Code>safePolygon: true</Code> (requireIntent on). Pass 1 works; later passes close
                            mid-traversal.
                        </>
                    }
                    key={generation}
                    onClose={handleClose}
                    onOpen={addEntry}
                    safePolygon={true}
                    title="A: bug"
                    variant="A"
                />
                <ReproColumn
                    description={
                        <>
                            <Code>{"safePolygon: { requireIntent: false }"}</Code>. Same memoized polygon, but the speed
                            check is skipped, so every pass works.
                        </>
                    }
                    onClose={handleClose}
                    onOpen={addEntry}
                    safePolygon={{ requireIntent: false }}
                    title="B: control"
                    variant="B"
                />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
                <Button onClick={remountA} text="Remount menu A (pass 1 works again)" />
                <Button onClick={clearLog} text="Clear log" variant="outlined" />
            </div>

            <Card style={{ maxWidth: 760 }}>
                <H5>Event log (newest first)</H5>
                {log.length === 0 ? (
                    <div className={Classes.TEXT_MUTED}>Hover a Share item to start.</div>
                ) : (
                    <ol reversed={true} style={{ fontFamily: "monospace", margin: 0, paddingLeft: 30 }}>
                        {log.map(entry => (
                            <li key={entry.id} style={{ marginBottom: 4 }}>
                                <Tag minimal={true}>{entry.variant}</Tag> {entry.text}{" "}
                                {entry.isMidTraversalClose && (
                                    <Tag intent="danger" minimal={true}>
                                        closed mid-traversal
                                    </Tag>
                                )}
                            </li>
                        ))}
                    </ol>
                )}
            </Card>
        </div>
    );
}

interface ReproColumnProps {
    description: React.ReactNode;
    onClose: (variant: Variant, openMs: number) => void;
    onOpen: (variant: Variant, text: string) => void;
    safePolygon: NonNullable<MenuItemProps["popoverProps"]>["safePolygon"];
    title: string;
    variant: Variant;
}

function ReproColumn({ description, onClose, onOpen, safePolygon, title, variant }: ReproColumnProps) {
    const openCount = useRef(0);
    const openedAt = useRef(0);
    const closedAt = useRef<number | undefined>(undefined);

    const popoverProps: MenuItemProps["popoverProps"] = {
        onClosing: () => {
            closedAt.current = performance.now();
            onClose(variant, Math.round(closedAt.current - openedAt.current));
        },
        onOpening: () => {
            openedAt.current = performance.now();
            openCount.current += 1;
            const sinceLastClose =
                closedAt.current === undefined
                    ? "first open"
                    : `${((openedAt.current - closedAt.current) / 1000).toFixed(1)} s since last close`;
            onOpen(variant, `pass ${openCount.current}: opened (${sinceLastClose})`);
        },
        safePolygon,
    };

    return (
        <div style={{ width: 200 }}>
            <H5>{title}</H5>
            <p className={Classes.TEXT_MUTED} style={{ minHeight: 60 }}>
                {description}
            </p>
            <Menu className={Classes.ELEVATION_1}>
                <MenuItem popoverProps={popoverProps} text="Share">
                    {SUBMENU_ITEMS.map(text => (
                        <MenuItem key={text} text={text} />
                    ))}
                </MenuItem>
                {SIBLING_ITEMS.map(text => (
                    <MenuItem key={text} text={text} />
                ))}
            </Menu>
        </div>
    );
}

/** Reports what the pointer was over when a submenu closed. */
function describePointer(point: Point | undefined): { isMidTraversal: boolean; label: string } {
    const element = point === undefined ? null : document.elementFromPoint(point.x, point.y);
    if (element == null) {
        return { isMidTraversal: false, label: "outside the window" };
    }
    if (element.closest(`.${Classes.POPOVER_CONTENT}`) != null) {
        return { isMidTraversal: false, label: "inside the submenu" };
    }
    const item = element.closest(`.${Classes.MENU_ITEM}`);
    if (item == null) {
        return { isMidTraversal: false, label: "outside the menu" };
    }
    const text = item.textContent ?? "";
    return { isMidTraversal: SIBLING_ITEMS.includes(text), label: `over "${text}"` };
}
