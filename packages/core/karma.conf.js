/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

module.exports = async function (config) {
    const { createKarmaConfig } = await import("@blueprintjs/karma-build-scripts");
    config.set(
        createKarmaConfig({
            dirname: __dirname,
            coverageExcludes: [
                // no need to test legacy APIs
                "src/legacy/*",

                // not worth full coverage
                "src/accessibility/*",
                "src/common/abstractComponent*",
                "src/common/abstractPureComponent*",

                // HACKHACK: for karma upgrade only
                "src/common/refs.ts",

                // HACKHACK: need to add hotkeys tests
                "src/components/hotkeys/*",
                "src/context/hotkeys/hotkeysProvider.tsx",

                // HACKHACK: see https://github.com/palantir/blueprint/issues/5511
                "src/context/portal/portalProvider.tsx",
            ],
            coverageOverrides: {
                "src/components/editable-text/editableText.tsx": {
                    lines: 75,
                    statements: 75,
                },
                "src/components/popover/customModifiers.ts": {
                    lines: 66,
                    statements: 66,
                },
                "src/components/tag-input/tagInput.tsx": {
                    lines: 75,
                    statements: 75,
                },
            },
        }),
    );
};
