/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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

import type { editor } from "monaco-editor";

import { Colors } from "@blueprintjs/colors";

// tslint:disable object-literal-sort-keys

export const MonacoThemeDark: editor.IStandaloneThemeData = {
    base: "vs-dark",
    colors: {
        focusBorder: Colors.BLUE2,
        foreground: Colors.GRAY5,
        "selection.background": Colors.BLUE4,
        descriptionForeground: Colors.GRAY5,
        "editor.background": Colors.BLACK,
        "editor.foreground": Colors.GRAY5,
        "editorLink.activeForeground": Colors.BLUE4,
    },
    inherit: true,
    rules: [],
};

export const MonacoThemeLight: editor.IStandaloneThemeData = {
    base: "vs",
    colors: {
        // TODO(adahiya)
        foreground: Colors.DARK_GRAY1,
        "editor.foreground": Colors.DARK_GRAY1,
    },
    inherit: true,
    rules: [],
};
