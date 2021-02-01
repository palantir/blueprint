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

import { IconName, IconSize, IconNames } from "./constants";

export type IconContentsLoader = (iconName: IconName, size: IconSize) => Promise<string>;

export interface IconLoaderOptions {
    /*
     * Optional custom loader for icon contents, useful if the default loader which uses a
     * webpack-configured dynamic import() is not suitable for some reason.
     */
    loader?: IconContentsLoader;
}

const loadIconContents: IconContentsLoader = async (name, size) => {
    // see https://webpack.js.org/api/module-methods/#magic-comments for dynamic import() reference
    return (
        await import(
            /* webpackInclude: /\.js$/ */
            /* webpackMode: "lazy" */
            `./generated/${size}px/paths/${name}`
        )
    ).default;
};

export class Icons {
    /**
     * Values are tuples containing 16px and 20px icon contents
     *
     * @internal
     */
    public loadedIcons: Map<IconName, [string, string]> = new Map();

    public static async load(icon: IconName, options?: IconLoaderOptions): Promise<void>;
    // buggy rule implementation for TS
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    public static async load(icons: IconName[], options?: IconLoaderOptions): Promise<void>;
    public static async load(icons: IconName | IconName[], options?: IconLoaderOptions) {
        if (!Array.isArray(icons)) {
            icons = [icons];
        }

        await Promise.all(icons.map(icon => this.loadImpl(icon, options)));
        return;
    }

    public static async loadAll(options?: IconLoaderOptions) {
        return this.load(Object.values(IconNames), options);
    }

    public static getContents(icon: IconName): [string, string] | undefined {
        if (!singleton.loadedIcons.has(icon)) {
            console.error(`Icon '${icon}' not loaded yet, did you call Icons.load()?`);
            return undefined;
        }

        return singleton.loadedIcons.get(icon);
    }

    private static async loadImpl(icon: IconName, options?: IconLoaderOptions) {
        if (singleton.loadedIcons.has(icon)) {
            return;
        }

        const load = options?.loader ?? loadIconContents;

        try {
            const icon16 = await load(icon, 16);
            const icon20 = await load(icon, 20);
            singleton.loadedIcons.set(icon, [icon16, icon20]);
        } catch (e) {
            console.error(`Unable to load icon '${icon}'`, e);
        }
    }
}

const singleton = new Icons();
