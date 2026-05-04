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

import { CodeToggle, type CodeToggleTab } from "@blueprintjs/docs-theme";

const PACKAGE_MANAGER_PREFERENCE_KEY = "bp-docs-pm-preference";

const INSTALL_TARGET = "@blueprintjs/core react react-dom";

// Append a new entry here to add another package manager (e.g. bun).
const TABS: readonly CodeToggleTab[] = [
    { code: `npm install ${INSTALL_TARGET}`, id: "npm", label: "npm" },
    { code: `yarn add ${INSTALL_TARGET}`, id: "yarn", label: "yarn" },
    { code: `pnpm add ${INSTALL_TARGET}`, id: "pnpm", label: "pnpm" },
];

/**
 * Tabbed install snippet showing the same package across the supported
 * package managers. The user's choice is persisted across pages so the docs
 * remember which client the reader uses.
 */
export const InstallSnippet: React.FC = () => (
    <CodeToggle id="install-snippet" tabs={TABS} storageKey={PACKAGE_MANAGER_PREFERENCE_KEY} />
);
