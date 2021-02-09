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

import React from "react";

import { IconName, IconNames } from "./constants";
import { wrapWithTimer } from "./loaderUtils";
import { SVGIconProps } from "./svgIconProps";

export type IconComponent = React.FC<SVGIconProps>;

/** Given an icon name and size, loads the icon component from the generated source module in this package. */
export type IconComponentLoader = (iconName: IconName) => Promise<IconComponent>;

export interface IconLoaderOptions {
    /*
     * Optional custom loader for icon contents, useful if the default loader which uses a
     * webpack-configured dynamic import() is not suitable for some reason.
     */
    loader?: IconComponentLoader;
}

/**
 * The default icon contents loader implementation, optimized for webpack.
 *
 * @see https://webpack.js.org/api/module-methods/#magic-comments for dynamic import() reference
 */
const defaultIconContentsLoader: IconComponentLoader = async name => {
    return (
        await import(
            /* webpackInclude: /\.js$/ */
            /* webpackMode: "lazy-once" */
            `./generated/components/${name}`
        )
    ).default;
};

/**
 * Blueprint icons loader.
 */
export class Icons {
    /** @internal */
    public loadedIcons: Map<IconName, IconComponent> = new Map();

    /**
     * Load a single icon for use in Blueprint components.
     */
    public static async load(icon: IconName, options?: IconLoaderOptions): Promise<void>;
    /**
     * Load a set of icons for use in Blueprint components.
     */
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

    /**
     * Load all available icons for use in Blueprint components.
     */
    public static async loadAll(options?: IconLoaderOptions) {
        const allIcons = Object.values(IconNames);
        wrapWithTimer(`[Blueprint] loading all icons`, () => this.load(allIcons, options));
    }

    /**
     * Get the icon SVG component.
     */
    public static getComponent(icon: IconName): IconComponent | undefined {
        if (!this.isValidIconName(icon)) {
            // don't warn, since this.load() will have warned already
            return undefined;
        } else if (!singleton.loadedIcons.has(icon)) {
            console.error(`[Blueprint] Icon '${icon}' not loaded yet, did you call Icons.load('${icon}')?`);
            return undefined;
        }

        return singleton.loadedIcons.get(icon);
    }

    private static async loadImpl(icon: IconName, options?: IconLoaderOptions) {
        if (!this.isValidIconName(icon)) {
            console.error(`[Blueprint] Unknown icon '${icon}'`);
            return;
        } else if (singleton.loadedIcons.has(icon)) {
            // already loaded, no-op
            return;
        }

        // use a custom loader if specified, otherwise use the default one
        const load = options?.loader ?? defaultIconContentsLoader;

        try {
            // load both sizes in parallel
            const component = await load(icon);
            singleton.loadedIcons.set(icon, component);
        } catch (e) {
            console.error(`[Blueprint] Unable to load icon '${icon}'`, e);
        }
    }

    private static isValidIconName(icon: IconName): boolean {
        const allIcons: IconName[] = Object.values(IconNames);
        return allIcons.indexOf(icon) >= 0;
    }
}

const singleton = new Icons();
