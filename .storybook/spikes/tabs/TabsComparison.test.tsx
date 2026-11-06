/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { act, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { TabId } from "@blueprintjs/core";

import { type ComparisonProps, TabsComparison } from "./TabsComparison";

describe("Tabs token comparison", () => {
    let container: HTMLDivElement;
    let root: Root;
    const defaults: ComparisonProps = {
        animate: true,
        onChange: () => undefined,
        scheme: "light",
        selectedTabId: "selected",
        showAnnotations: true,
        size: "medium",
        vertical: false,
    };
    const documents = () => Array.from(container.querySelectorAll("iframe"), frame => frame.contentDocument!);

    beforeEach(() => {
        Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
        container = document.createElement("div");
        document.body.append(container);
        root = createRoot(container);
    });

    afterEach(async () => {
        await act(async () => root.unmount());
        container.remove();
    });

    it("isolates styles and annotations from the parent and updates all frames when the theme changes", async () => {
        document.body.style.setProperty("--bp-primary-text-strong", "red");
        await act(async () => root.render(<TabsComparison {...defaults} />));
        const docs = documents();
        expect(docs).toHaveLength(3);
        expect(docs.every(doc => doc !== document && doc.querySelectorAll('[role="tab"]').length === 3)).toBe(true);
        expect(docs[0].querySelectorAll(".changed")).toHaveLength(0);
        expect(docs[1].querySelectorAll(".changed")).toHaveLength(0);
        expect(docs[2].querySelectorAll(".changed")).toHaveLength(2);
        expect(docs[1].head.textContent).toContain("--bp-typography-color-link");
        expect(docs[2].head.textContent).toContain("--bp-primary-text-strong");
        expect(docs.every(doc => doc.body.style.getPropertyValue("--bp-primary-text-strong") === "")).toBe(true);

        await act(async () => root.render(<TabsComparison {...defaults} scheme="dark" />));
        expect(
            documents().every(
                doc => doc.body.classList.contains("bp6-dark") && doc.documentElement.dataset.bpColorScheme === "dark",
            ),
        ).toBe(true);
        expect(documents()[2].querySelectorAll(".changed")).toHaveLength(1);
        document.body.style.removeProperty("--bp-primary-text-strong");

        await act(async () =>
            root.render(<TabsComparison {...defaults} tokenOverrides={{ "--bp-primary-text-strong": "red" }} />),
        );
        expect(documents().every(doc => doc.body.style.getPropertyValue("--bp-primary-text-strong") === "red")).toBe(
            true,
        );
        expect(documents()[2].querySelectorAll(".changed")).toHaveLength(0);
        expect(documents()[2].body.textContent).toContain("Theme overrides active");
        await act(async () => root.render(<TabsComparison {...defaults} />));
        expect(documents().every(doc => doc.body.style.getPropertyValue("--bp-primary-text-strong") === "")).toBe(true);
        expect(documents()[2].querySelectorAll(".changed")).toHaveLength(2);
    });

    it("synchronizes clicks and keyboard selection while skipping disabled tabs", async () => {
        function Synchronized() {
            const [selectedTabId, onChange] = useState<TabId>("selected");
            return <TabsComparison {...defaults} onChange={onChange} selectedTabId={selectedTabId} />;
        }
        await act(async () => root.render(<Synchronized />));
        await act(async () => documents()[1].querySelector<HTMLElement>('[data-tab-id="rest"]')!.click());
        expect(
            documents().map(frameDoc => frameDoc.querySelector('[aria-selected="true"]')?.getAttribute("data-tab-id")),
        ).toEqual(["rest", "rest", "rest"]);
        const doc = documents()[1];
        doc.querySelector<HTMLElement>('[data-tab-id="rest"]')!.focus();
        await act(async () => {
            doc.activeElement!.dispatchEvent(
                new doc.defaultView!.KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight" }),
            );
        });
        expect(doc.activeElement?.getAttribute("data-tab-id")).toBe("selected");
        await act(async () => {
            doc.activeElement!.dispatchEvent(
                new doc.defaultView!.KeyboardEvent("keypress", { bubbles: true, charCode: 13, key: "Enter" }),
            );
        });
        expect(
            documents().map(frameDoc => frameDoc.querySelector('[aria-selected="true"]')?.getAttribute("data-tab-id")),
        ).toEqual(["selected", "selected", "selected"]);
    });

    it("keeps disabled selection visible while changing orientation, size, and indicator mode", async () => {
        await act(async () =>
            root.render(
                <TabsComparison {...defaults} animate={false} selectedTabId="disabled" size="large" vertical={true} />,
            ),
        );
        for (const doc of documents()) {
            expect(doc.querySelector(".bp6-tabs.bp6-vertical > .bp6-tab-list.bp6-large")).not.toBeNull();
            expect(
                doc.querySelector('[data-tab-id="disabled"][aria-selected="true"][aria-disabled="true"]'),
            ).not.toBeNull();
            expect(doc.querySelector(".bp6-tab-indicator-wrapper")).toBeNull();
        }
        expect(documents()[2].querySelector(".changed")?.textContent).toContain("Blue2 · 100%");
        expect(documents()[2].querySelector(".changed")?.textContent).toContain("Blue1 · 50%");
        // Supply layout dimensions absent from jsdom, then enable animation. The
        // real Tabs component must calculate its newly mounted indicator.
        for (const doc of documents()) {
            const prototype = Object.getPrototypeOf(doc.createElement("div"));
            Object.defineProperty(prototype, "clientWidth", { configurable: true, get: () => 100 });
            Object.defineProperty(prototype, "clientHeight", { configurable: true, get: () => 30 });
        }
        await act(async () => root.render(<TabsComparison {...defaults} selectedTabId="disabled" />));
        for (const doc of documents()) {
            expect(doc.querySelector<HTMLElement>(".bp6-tab-indicator-wrapper")?.style.width).toBe("100px");
        }
    });
});
