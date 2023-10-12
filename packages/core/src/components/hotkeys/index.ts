/*
 * Copyright 2020 Palantir Technologies, Inc. All rights reserved.
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

export { Hotkey, type HotkeyProps } from "./hotkey";
export { Hotkeys, type HotkeysProps } from "./hotkeys";
export { KeyComboTag, type KeyComboTagProps } from "./keyComboTag";
export { type KeyCombo, comboMatches, getKeyCombo, getKeyComboString, parseKeyCombo } from "./hotkeyParser";

// N.B. "V1" variants of these APIs are exported from src/legacy/
export { HotkeysDialog2 } from "./hotkeysDialog2";
export { HotkeysTarget2, type HotkeysTarget2Props, type HotkeysTarget2RenderProps } from "./hotkeysTarget2";
