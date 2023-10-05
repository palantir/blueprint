/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

import { type IconName, IconNames, IconNamesSet } from "./iconNames";
import { type IconPaths, IconSize } from "./iconTypes";
import { wrapWithTimer } from "./loaderUtils";

/** Given an icon name and size, loads the icon paths that define it. */
export type IconPathsLoader = (iconName: IconName, iconSize: IconSize) => Promise<IconPaths>;

export interface IconLoaderOptions {
    /**
     * The id of a built-in loader, or a custom loader function.
     *
     * @see https://blueprintjs.com/docs/versions/5/#icons/loading-icons
     * @default undefined (equivalent to "split-by-size")
     */
    loader?: "split-by-size" | "all" | IconPathsLoader;
}

async function getLoaderFn(options: IconLoaderOptions): Promise<IconPathsLoader> {
    const { loader = singleton.defaultLoader } = options;

    if (typeof loader === "function") {
        return loader;
    } else if (loader === "all") {
        return (
            await import(
                /* webpackChunkName: "blueprint-icons-all-paths-loader" */
                "./paths-loaders/allPathsLoader"
            )
        ).allPathsLoader;
    } else {
        return (
            await import(
                /* webpackChunkName: "blueprint-icons-split-paths-by-size-loader" */
                "./paths-loaders/splitPathsBySizeLoader"
            )
        ).splitPathsBySizeLoader;
    }
}

/**
 * Blueprint icons loader.
 */
export class Icons {
    /** @internal */
    public defaultLoader: IconLoaderOptions["loader"] = "split-by-size";

    /** @internal */
    public loadedIconPaths16: Map<IconName, IconPaths> = new Map();

    /** @internal */
    public loadedIconPaths20: Map<IconName, IconPaths> = new Map();

    /**
     * Set global icon loading options for all subsequent `Icons.load()` calls.
     */
    public static setLoaderOptions(options: IconLoaderOptions) {
        if (options.loader !== undefined) {
            singleton.defaultLoader = options.loader;
        }
    }

    /**
     * Load a single icon for use in Blueprint components.
     */
    public static async load(icon: IconName, size: IconSize, options?: IconLoaderOptions): Promise<void>;
    /**
     * Load a set of icons for use in Blueprint components.
     */
    // buggy rule implementation for TS
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    public static async load(icons: IconName[], size: number, options?: IconLoaderOptions): Promise<void>;
    public static async load(icons: IconName | IconName[], size: number, options?: IconLoaderOptions) {
        if (!Array.isArray(icons)) {
            icons = [icons];
        }

        await Promise.all(icons.map(icon => this.loadImpl(icon, size, options)));
        return;
    }

    /**
     * Load all available icons for use in Blueprint components.
     */
    public static async loadAll(options?: IconLoaderOptions) {
        const allIcons = Object.values(IconNames);
        wrapWithTimer(`[Blueprint] loading all icons`, async () => {
            await Promise.all([
                this.load(allIcons, IconSize.STANDARD, options),
                this.load(allIcons, IconSize.LARGE, options),
            ]);
        });
    }

    /**
     * Get the icon SVG paths. Returns `undefined` if the icon has not been loaded yet.
     */
    public static getPaths(icon: IconName, size: IconSize): IconPaths | undefined {
        if (!this.isValidIconName(icon)) {
            // don't warn, since this.load() will have warned already
            return undefined;
        }

        const loadedIcons = size < IconSize.LARGE ? singleton.loadedIconPaths16 : singleton.loadedIconPaths20;
        return loadedIcons.get(icon);
    }

    private static async loadImpl(icon: IconName, size: number, options: IconLoaderOptions = {}) {
        if (!this.isValidIconName(icon)) {
            console.error(`[Blueprint] Unknown icon '${icon}'`);
            return;
        }

        const loadedIcons = size < IconSize.LARGE ? singleton.loadedIconPaths16 : singleton.loadedIconPaths20;

        if (loadedIcons.has(icon)) {
            // already loaded, no-op
            return;
        }

        const loaderFn = await getLoaderFn(options);

        try {
            const supportedSize = size < IconSize.LARGE ? IconSize.STANDARD : IconSize.LARGE;
            const paths = await loaderFn(icon, supportedSize);
            loadedIcons.set(icon, paths);
        } catch (e) {
            console.error(`[Blueprint] Unable to load ${size}px icon '${icon}'`, e);
        }
    }

    /**
     * @returns true if the given string is a valid {@link IconName}
     */
    public static isValidIconName(iconName: string): iconName is IconName {
        return IconNamesSet.has(iconName as IconName);
    }
}

const singleton = new Icons();
