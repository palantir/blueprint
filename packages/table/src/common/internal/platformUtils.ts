/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

/**
 * Returns `true` if `navigator.platform` matches a known Mac platform, or
 * `false` otherwise.
 */
export function isMac(platformOverride?: string) {
    const platformActual = typeof navigator !== "undefined" ? navigator.platform : undefined;
    const platform = platformOverride != null ? platformOverride : platformActual;
    return platform == null ? false : /Mac|iPod|iPhone|iPad/.test(platform);
}

/**
 * Returns `true` if (1) the platform is Mac and the keypress includes the `cmd`
 * key, or (2) the platform is non-Mac and the keypress includes the `ctrl` key.
 */
export const isModKeyPressed = (event: KeyboardEvent, platformOverride?: string) => {
    const isMacPlatform = isMac(platformOverride);
    return (isMacPlatform && event.metaKey) || (!isMacPlatform && event.ctrlKey);
};
