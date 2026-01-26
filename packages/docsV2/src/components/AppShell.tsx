'use client';

/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import type { PageTree } from "fumadocs-core/server";

import { BlueprintProvider } from "@blueprintjs/core";

import { Banner } from "@/components/nav";
import { Sidebar } from "@/components/sidebar";
import { ThemeProvider } from "@/context/theme";

interface AppShellProps {
    children: React.ReactNode;
    pageTree: PageTree.Root;
}

export function AppShell({ children, pageTree }: AppShellProps) {
    return (
        <BlueprintProvider>
            <ThemeProvider>
                <div className="docs-root">
                    <Banner href="https://blueprintjs.com/docs/versions/5">
                        Blueprint v6.x is now in stable release. Still using v5.x? Click here to view the legacy docs &rarr;
                    </Banner>
                    <div className="docs-app">
                        <Sidebar tree={pageTree} />
                        <div className="docs-content-wrapper">
                            <main className="docs-page">
                                {children}
                            </main>
                        </div>
                    </div>
                </div>
            </ThemeProvider>
        </BlueprintProvider>
    );
}
