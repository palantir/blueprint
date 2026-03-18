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

import type { ReactNode } from "react";

/**
 * Local copies of fumadocs-core PageTree types.
 *
 * docs-theme's tsconfig uses `moduleResolution: "node"` which cannot resolve
 * fumadocs-core's package.json `exports` field. These types mirror the subset
 * we need from `fumadocs-core/page-tree`.
 */

interface ID {
    $id?: string;
}

export interface Item extends ID {
    type: "page";
    name: ReactNode;
    url: string;
    external?: boolean;
    description?: ReactNode;
    icon?: ReactNode;
}

export interface Separator extends ID {
    type: "separator";
    name?: ReactNode;
    icon?: ReactNode;
}

export interface Folder extends ID {
    type: "folder";
    name: ReactNode;
    description?: ReactNode;
    root?: boolean;
    defaultOpen?: boolean;
    collapsible?: boolean;
    index?: Item;
    icon?: ReactNode;
    children: Node[];
}

export type Node = Item | Separator | Folder;

export interface Root extends ID {
    name: ReactNode;
    children: Node[];
}
