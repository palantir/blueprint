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

/* eslint-disable deprecation/deprecation */

export * from "./hotkeysTypes";
export * from "./hotkeys";
export { Hotkey, IHotkeyProps } from "./hotkey";
export { KeyCombo, KeyComboTagProps, IKeyComboProps } from "./keyCombo";
// eslint-disable-next-line import/no-cycle
export { HotkeysTarget, IHotkeysTargetComponent } from "./hotkeysTarget";
export { IKeyCombo, comboMatches, getKeyCombo, getKeyComboString, parseKeyCombo } from "./hotkeyParser";
// eslint-disable-next-line import/no-cycle
export { IHotkeysDialogProps, hideHotkeysDialog, setHotkeysDialogProps } from "./hotkeysDialog";

export { HotkeysDialog2 } from "./hotkeysDialog2";
export { HotkeysTarget2, HotkeysTarget2Props } from "./hotkeysTarget2";
