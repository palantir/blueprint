/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

const { createKarmaConfig } = require("@blueprintjs/karma-build-scripts");

const REACT = process.env.REACT || "16";

module.exports = function (config) {
    const coverageExcludes = [
        // not worth full coverage
        "src/accessibility/*",
        "src/common/abstractComponent*",
        "src/common/abstractPureComponent*",
        "src/compatibility/*",
        // deprecations
        "src/common/utils/functionUtils.ts",
        "src/common/utils/safeInvokeMember.ts",
        // HACKHACK: for karma upgrade only
        "src/common/refs.ts",
        // HACKHACK: need to add hotkeys v2 tests
        "src/components/hotkeys/hotkeysDialog2.tsx",
        "src/components/hotkeys/hotkeysTarget2.tsx",
        "src/context/hotkeys/hotkeysProvider.tsx",
    ];

    if (REACT === "15") {
        console.info("Excluding features which require React 16 from coverage requiremenst...");
        // features require React 16.8+
        coverageExcludes.push("src/context/**/*.ts*", "src/hooks/**/*.ts*", "src/components/panel-stack2/*");
    }

    const baseConfig = createKarmaConfig({
        dirname: __dirname,
        coverageExcludes,
    });
    config.set(baseConfig);
    config.set({
        // overrides here
    });
};
