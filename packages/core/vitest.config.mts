/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        exclude: ["lib/**", "node_modules/**"],
        include: [
            "test/alert/alertTests.tsx",
            "test/breadcrumbs/breadcrumbTests.tsx",
            "test/breadcrumbs/breadcrumbsTests.tsx",
            "test/buttons/buttonTests.tsx",
            "test/card/cardTests.tsx",
            "test/common/utilsTests.tsx",
            "test/context-menu/contextMenuTests.tsx",
            "test/control-card/controlCardTests.tsx",
            "test/controls/inputGroupTests.tsx",
            "test/controls/numericInputTests.tsx",
            "test/controls/radioGroupTests.tsx",
            "test/dialog/dialogTests.tsx",
            "test/drawer/drawerTests.tsx",
            "test/editable-text/editableTextTests.tsx",
            "test/forms/asyncControllableInputTests.tsx",
            "test/forms/fileInputTests.tsx",
            "test/hooks/useHotkeysTests.tsx",
            "test/hooks/useOverlayStackTests.tsx",
            "test/hooks/useValidatePropsTests.tsx",
            "test/hotkeys/hotkeyTests.tsx",
            "test/icon/iconTests.tsx",
        ],
        setupFiles: "./test/vitest.setup.mts",
    },
});
