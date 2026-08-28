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

import type { IconPaths } from "../iconTypes";

import { nextIconManifest } from "./generated/manifest";
import type { IconNextName } from "./iconNextNames";
import { defaultNextIconPathsLoader, type NextIconPathsLoader } from "./pathsLoader";

export type NextIconVariant = "outlined" | "filled";

export interface NextIconLoaderOptions {
    /**
     * Custom loader function, or use the default dynamic import loader.
     *
     * @default defaultNextIconPathsLoader
     */
    loader?: NextIconPathsLoader;
}

/**
 * Next-generation icon loader. Simplified from `Icons` — no size branching, single cache,
 * with outlined/filled variant support.
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class IconsNext {
    /** Set of icon names that have filled variants, derived from the manifest. */
    private static filledSet: Set<string> = new Set(nextIconManifest.filter(e => e.hasFilled).map(e => e.name));

    /** Set of all valid next icon names, derived from the manifest. */
    private static validSet: Set<string> = new Set(nextIconManifest.map(e => e.name));

    /** Cache keyed by "iconName:variant". */
    private static cache: Map<string, IconPaths> = new Map();

    /** Icons for which the missing-filled-variant warning has already been emitted. */
    private static warnedAboutMissingFilledVariant: Set<string> = new Set();

    /** Configurable loader function. */
    private static loader: NextIconPathsLoader = defaultNextIconPathsLoader;

    /**
     * Set global loader options for all subsequent `IconsNext.load()` calls.
     */
    public static setLoaderOptions(options: NextIconLoaderOptions) {
        if (options.loader !== undefined) {
            this.loader = options.loader;
        }
    }

    /**
     * Load one or more next icons for use in Blueprint components.
     */
    public static async load(icons: IconNextName | IconNextName[], variant: NextIconVariant = "outlined") {
        const iconNames = Array.isArray(icons) ? icons : [icons];

        // Validate the whole request before starting any loads so a malformed runtime value cannot
        // leave a partially populated cache.
        for (const icon of iconNames) {
            if (!this.isValidIconName(icon)) {
                throw new Error(`[Blueprint] Unknown next icon '${icon}'`);
            }
        }

        await Promise.all(iconNames.map(icon => this.loadImpl(icon, variant)));
    }

    /**
     * Load all next icons (outlined variant). Optionally also load filled variants.
     */
    public static async loadAll(options?: { includeFilled?: boolean }) {
        const allNames = nextIconManifest.map(e => e.name);
        await this.load(allNames, "outlined");
        if (options?.includeFilled) {
            const filledNames = nextIconManifest.filter(e => e.hasFilled).map(e => e.name);
            await this.load(filledNames, "filled");
        }
    }

    /**
     * Get the icon SVG paths. Returns `undefined` if the icon has not been loaded yet.
     * If `variant="filled"` is requested but unavailable, falls back to outlined.
     */
    public static getPaths(icon: IconNextName, variant: NextIconVariant = "outlined"): IconPaths | undefined {
        const resolvedVariant = this.resolveVariant(icon, variant);
        return this.cache.get(this.cacheKey(icon, resolvedVariant));
    }

    /**
     * Returns `true` if the given icon has a filled variant available.
     */
    public static hasFilled(icon: IconNextName): boolean {
        return this.filledSet.has(icon);
    }

    /**
     * Returns `true` if the given string is a valid next icon name.
     */
    public static isValidIconName(name: string): name is IconNextName {
        return this.validSet.has(name);
    }

    private static async loadImpl(icon: IconNextName, variant: NextIconVariant) {
        const resolvedVariant = this.resolveVariant(icon, variant);
        const key = this.cacheKey(icon, resolvedVariant);

        if (this.cache.has(key)) {
            return;
        }

        const paths = await this.loader(icon, resolvedVariant);
        this.cache.set(key, paths);
    }

    private static resolveVariant(icon: IconNextName, variant: NextIconVariant): NextIconVariant {
        if (variant !== "filled") {
            return "outlined";
        }
        if (this.filledSet.has(icon)) {
            return "filled";
        }

        if (
            process.env.NODE_ENV !== "production" &&
            this.validSet.has(icon) &&
            !this.warnedAboutMissingFilledVariant.has(icon)
        ) {
            this.warnedAboutMissingFilledVariant.add(icon);
            console.warn(`[Blueprint] Icon "${icon}" does not have a filled variant. Falling back to outlined.`);
        }

        return "outlined";
    }

    private static cacheKey(icon: IconNextName, variant: NextIconVariant): string {
        return `${icon}:${variant}`;
    }
}
