/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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

/**
 * Registry of page IDs to their compiled MDX components.
 *
 * To migrate a page from the old Documentalist pipeline to MDX:
 * 1. Convert @tag lines in the .mdx file to JSX imports
 * 2. Import the .mdx file here
 * 3. Add an entry mapping the page's route ID to the default export
 *
 * Example:
 *   import ColorsContent from "@blueprintjs/core/src/docs/colors.mdx";
 *   export const mdxPages: Record<string, React.ComponentType> = {
 *       colors: ColorsContent,
 *   };
 */
export const mdxPages: Record<string, React.ComponentType> = {
    // Add migrated MDX pages here as they are converted.
};
