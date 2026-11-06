/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { H2, Tab, type TabId, Tabs, type TabsProps } from "@blueprintjs/core";

import { getColorNotes, type Scheme, type Version, VERSIONS } from "./comparison";
import { installFrameInteractions } from "./frameInteractions";
import existingCss from "./generated/existing.css?inline";
import originalCss from "./generated/original.css?inline";
import semanticCss from "./generated/semantic.css?inline";
import presentationCss from "./presentation.css?inline";

const STYLES: Record<Version, string> = { existing: existingCss, original: originalCss, semantic: semanticCss };

export interface ComparisonProps {
    animate: boolean;
    onChange: (id: TabId) => void;
    scheme: Scheme;
    selectedTabId: TabId;
    showAnnotations: boolean;
    size: TabsProps["size"];
    tokenOverrides?: Record<string, string | undefined>;
    vertical: boolean;
}

/** Each frame owns its recipe and defaults, with explicit Theme overrides shared across the previews. */
function ImplementationFrame({ version, ...props }: ComparisonProps & { version: Version }) {
    const [frame, setFrame] = useState<HTMLIFrameElement | null>(null);
    const [height, setHeight] = useState(340);
    const doc = frame?.contentDocument;

    useEffect(() => (doc == null ? undefined : installFrameInteractions(doc)), [doc]);

    useEffect(() => {
        const specimen = doc?.querySelector(".tabs-spike-specimen");
        if (specimen == null) {
            return;
        }
        const updateHeight = () => {
            const measuredHeight = Math.ceil(specimen.getBoundingClientRect().height);
            if (measuredHeight > 0) {
                setHeight(measuredHeight);
            }
        };
        updateHeight();
        const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(updateHeight);
        observer?.observe(specimen);
        return () => observer?.disconnect();
    }, [doc]);

    useEffect(() => {
        if (doc == null) {
            return;
        }
        const overrides = Object.entries(props.tokenOverrides ?? {}).filter(
            ([name, value]) => name.startsWith("--bp-") && value != null && value !== "",
        );
        // Root aliases must resolve against overridden palette values; dark roles
        // also live on the body, so explicit role overrides belong on both.
        for (const element of [doc.documentElement, doc.body]) {
            for (const [name, value] of overrides) {
                element.style.setProperty(name, value!);
            }
        }
        return () => {
            for (const element of [doc.documentElement, doc.body]) {
                for (const [name] of overrides) {
                    element.style.removeProperty(name);
                }
            }
        };
    }, [doc, props.tokenOverrides]);

    useEffect(() => {
        if (doc != null) {
            doc.documentElement.dataset.bpColorScheme = props.scheme;
            doc.documentElement.style.colorScheme = props.scheme;
            doc.body.classList.toggle("bp6-dark", props.scheme === "dark");
        }
    }, [doc, props.scheme]);

    return (
        <iframe ref={setFrame} title={VERSIONS[version]} style={{ border: 0, height, width: "100%" }}>
            {doc != null && (
                <>
                    {createPortal(
                        <style>
                            {STYLES[version]}
                            {presentationCss}
                        </style>,
                        doc.head,
                    )}
                    {createPortal(<Specimen {...props} version={version} />, doc.body)}
                </>
            )}
        </iframe>
    );
}

function Specimen({
    animate,
    onChange,
    scheme,
    selectedTabId,
    showAnnotations,
    size,
    tokenOverrides,
    version,
    vertical,
}: ComparisonProps & { version: Version }) {
    return (
        <main className="tabs-spike-specimen">
            <Tabs
                key={`${vertical}-${size}-${animate}`}
                animate={animate}
                id={`comparison-${version}`}
                onChange={onChange}
                selectedTabId={selectedTabId}
                size={size}
                vertical={vertical}
            >
                <Tab icon="document" id="selected" title="First" />
                <Tab icon="folder-close" id="rest" title="Second" />
                <Tab disabled={true} icon="lock" id="disabled" title="Disabled" />
            </Tabs>
            {showAnnotations && Object.values(tokenOverrides ?? {}).some(value => value != null && value !== "") ? (
                <p className="tabs-spike-notes">
                    Theme overrides active. Reset them in Theme to compare default colors.
                </p>
            ) : (
                showAnnotations && (
                    <dl className="tabs-spike-notes">
                        {getColorNotes(scheme, version, vertical, selectedTabId === "disabled").map(note => (
                            <div className={note.changed ? "changed" : "unchanged"} key={note.label}>
                                <dt>{note.label}</dt>
                                <dd>
                                    {note.changed ? (
                                        <>
                                            <span>{note.before}</span>
                                            <span aria-hidden="true"> → </span>
                                            <strong>{note.after}</strong>
                                        </>
                                    ) : (
                                        note.after
                                    )}
                                    <span className="status">
                                        {note.changed ? "Changed" : version === "original" ? "Original" : "Unchanged"}
                                    </span>
                                </dd>
                            </div>
                        ))}
                    </dl>
                )
            )}
        </main>
    );
}

export function TabsComparison(props: ComparisonProps) {
    return (
        <section
            aria-label="Tabs token comparison"
            style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(3, minmax(340px, 1fr))", minWidth: 1052 }}
        >
            {(["original", "existing", "semantic"] as const).map(version => (
                <article key={version}>
                    <H2 style={{ fontSize: 16, margin: "0 0 10px" }}>{VERSIONS[version]}</H2>
                    <ImplementationFrame {...props} version={version} />
                </article>
            ))}
        </section>
    );
}
