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

/** Component map accepted by MDXProvider. Non-component values are ignored at runtime. */
type MDXComponents = Record<string, unknown>;

import {
    BlackWhitePalette,
    CoreColorsPalette,
    ExtendedColorsPalette,
    GrayscalePalette,
} from "./components/colorPalettes";
import { DivergingSchemePalette, QualitativeSchemePalette, SequentialSchemePalette } from "./components/colorSchemes";
import { Icons } from "./components/icons";
import { Welcome } from "./components/welcome";
import * as coreExamples from "./examples/core-examples";
import * as datetimeExamples from "./examples/datetime-examples";
import * as labsExamples from "./examples/labs-examples";
import * as selectExamples from "./examples/select-examples";
import * as tableExamples from "./examples/table-examples";

/**
 * Placeholder for InterfaceTable — API docs have been removed for now.
 * These will render nothing until a replacement TypeScript API renderer is built.
 */
const InterfaceTable: React.FC<{ name: string }> = () => null;

/** Placeholder for MethodTable. */
const MethodTable: React.FC<{ name: string }> = () => null;

/** Placeholder for CssExample. */
const CssExample: React.FC<{ reference: string }> = () => null;

/**
 * MDX component map provided to MDXProvider.
 * All components referenced as JSX in .mdx files must be present here.
 */
export const mdxComponents: MDXComponents = {
    // Example components from each package
    ...coreExamples,
    ...datetimeExamples,
    ...selectExamples,
    ...tableExamples,
    ...labsExamples,

    // Color palette & scheme components
    BlackWhitePalette,
    CoreColorsPalette,
    DivergingSchemePalette,
    ExtendedColorsPalette,
    GrayscalePalette,
    QualitativeSchemePalette,
    SequentialSchemePalette,

    // Placeholder no-ops (API docs removed)
    CssExample,
    Icons,
    InterfaceTable,
    MethodTable,
    Welcome,
};
