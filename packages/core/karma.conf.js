/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

module.exports = async function (config) {
    const { createKarmaConfig } = await import("@blueprintjs/karma-build-scripts");
    config.set(
        createKarmaConfig({
            dirname: __dirname,
            coverageExcludes: [
                // not worth full coverage
                "src/accessibility/*",
                "src/common/abstractComponent*",
                "src/common/abstractPureComponent*",
                "src/compatibility/*",

                // HACKHACK: for karma upgrade only
                "src/common/refs.ts",

                // HACKHACK: need to add hotkeys tests
                "src/components/hotkeys/hotkey.tsx",
                "src/components/hotkeys/hotkeys.tsx",
                "src/components/hotkeys/hotkeysDialog.tsx",
                "src/components/hotkeys/hotkeysTarget.tsx",
                "src/context/hotkeys/hotkeysProvider.tsx",

                // HACKHACK: see https://github.com/palantir/blueprint/issues/5511
                "src/context/portal/portalProvider.tsx",
            ],
        }),
    );
};
