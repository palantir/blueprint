/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";

import { Button, ButtonGroup, Card, Code } from "@blueprintjs/core";
import { CopyToClipboardButton } from "@blueprintjs/docs-theme";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

export type BlueprintPackage = "core" | "colors" | "datetime" | "icons" | "labs" | "select" | "table";

const BLUEPRINT_PACKAGES: ReadonlySet<string> = new Set<BlueprintPackage>([
    "core",
    "colors",
    "datetime",
    "icons",
    "labs",
    "select",
    "table",
]);

const PACKAGE_MANAGERS: readonly PackageManager[] = ["npm", "pnpm", "yarn", "bun"];

// ---------------------------------------------------------------------------
// parseBlueprintPackage
// ---------------------------------------------------------------------------

/**
 * Extract a valid {@link BlueprintPackage} name from an install command string
 * such as `npm install --save @blueprintjs/core`. Returns `undefined` when no
 * recognised package is found.
 */
export function parseBlueprintPackage(text: string): BlueprintPackage | undefined {
    const match = text.match(/@blueprintjs\/([\w-]+)/);
    if (match != null && BLUEPRINT_PACKAGES.has(match[1])) {
        return match[1] as BlueprintPackage;
    }
    return undefined;
}

// ---------------------------------------------------------------------------
// Install-command generation
// ---------------------------------------------------------------------------

function getInstallCommand(pm: PackageManager, pkg: BlueprintPackage): string {
    const fullName = `@blueprintjs/${pkg}`;
    switch (pm) {
        case "npm":
            return `npm install --save ${fullName}`;
        case "pnpm":
            return `pnpm add ${fullName}`;
        case "yarn":
            return `yarn add ${fullName}`;
        case "bun":
            return `bun add ${fullName}`;
    }
}

// ---------------------------------------------------------------------------
// External store (shared across independent React roots)
// ---------------------------------------------------------------------------

type Listener = () => void;

let currentPackageManager: PackageManager = "npm";
const listeners = new Set<Listener>();

function subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function getSnapshot(): PackageManager {
    return currentPackageManager;
}

function setPackageManagerExternal(pm: PackageManager) {
    if (pm !== currentPackageManager) {
        currentPackageManager = pm;
        for (const listener of listeners) {
            listener();
        }
    }
}

/**
 * Hook that returns the shared package-manager selection and a setter.
 * Works across independent React roots via `useSyncExternalStore`.
 */
export function useSharedPackageManager(): [PackageManager, (pm: PackageManager) => void] {
    const pm = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
    return [pm, setPackageManagerExternal];
}

// ---------------------------------------------------------------------------
// React context (for future single-tree rendering)
// ---------------------------------------------------------------------------

export interface PackageManagerContextValue {
    packageManager: PackageManager;
    setPackageManager: (pm: PackageManager) => void;
}

const PackageManagerContext = createContext<PackageManagerContextValue | null>(null);

export const PackageManagerProvider = PackageManagerContext.Provider;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface PackageDownloadOptionsProps {
    package: BlueprintPackage;
}

export function PackageDownloadOptions({ package: pkg }: PackageDownloadOptionsProps) {
    const ctxValue = useContext(PackageManagerContext);

    // Prefer context if available; otherwise fall back to the external store.
    const [storePm, setStorePm] = useSharedPackageManager();
    const pm = ctxValue?.packageManager ?? storePm;
    const setPm = ctxValue?.setPackageManager ?? setStorePm;

    const command = getInstallCommand(pm, pkg);

    const handleClick = useCallback(
        (selected: PackageManager) => () => {
            setPm(selected);
        },
        [setPm],
    );

    return (
        <Card compact={true} className="docs-package-download-options">
            <ButtonGroup variant="minimal">
                {PACKAGE_MANAGERS.map(name => (
                    <Button key={name} active={pm === name} text={name} onClick={handleClick(name)} />
                ))}
            </ButtonGroup>
            <CopyToClipboardButton text={command} variant="outlined" />
            <Code className="docs-package-download-command">{command}</Code>
        </Card>
    );
}
