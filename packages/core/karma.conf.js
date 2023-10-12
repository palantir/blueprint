/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

module.exports = async function (config) {
    const { createKarmaConfig } = await import("@blueprintjs/karma-build-scripts");
    config.set(
        createKarmaConfig({
            dirname: __dirname,
            coverageExcludes: [
                // don't check barrel files
                "src/**/index.ts",

                // no need to test legacy APIs
                "src/legacy/*",
                "src/common/keyCodes.ts",
                "src/deprecatedTypeAliases.ts",

                // not worth full coverage
                "src/accessibility/*",
                "src/common/abstractComponent*",
                "src/common/abstractPureComponent*",
                "src/components/html/html.tsx",

                // HACKHACK: for karma upgrade only
                "src/common/refs.ts",

                // HACKHACK: need to add hotkeys tests
                "src/components/hotkeys/*",
                "src/context/hotkeys/hotkeysProvider.tsx",

                // HACKHACK: need to add section tests
                "src/components/section/*",
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
