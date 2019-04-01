/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

declare function require(moduleName: string): any; // declare node.js "require" so that we can conditionally import
if (typeof window !== "undefined" && typeof document !== "undefined") {
    // we're in browser
    // tslint:disable-next-line:no-var-requires
    require("dom4"); // only import actual dom4 if we're in the browser (not server-compatible)
    // we'll still need dom4 types for the TypeScript to compile, these are included in package.json
}

import * as contextMenu from "./context-menu/contextMenu";
export const ContextMenu = contextMenu;

export * from "./alert/alert";
export * from "./breadcrumbs/breadcrumb";
export * from "./breadcrumbs/breadcrumbs";
export * from "./button/buttons";
export * from "./button/buttonGroup";
export * from "./callout/callout";
export * from "./card/card";
export * from "./collapse/collapse";
export * from "./collapsible-list/collapsibleList";
export * from "./context-menu/contextMenuTarget";
export * from "./dialog/dialog";
export * from "./divider/divider";
export * from "./drawer/drawer";
export * from "./editable-text/editableText";
export * from "./forms/controlGroup";
export * from "./forms/controls";
export * from "./forms/fileInput";
export * from "./forms/formGroup";
export * from "./forms/inputGroup";
export * from "./forms/numericInput";
export * from "./forms/radioGroup";
export * from "./forms/textArea";
export * from "./html/html";
export * from "./html-select/htmlSelect";
export * from "./html-table/htmlTable";
export * from "./hotkeys/hotkeys";
export * from "./icon/icon";
export * from "./menu/menu";
export * from "./menu/menuDivider";
export * from "./menu/menuItem";
export * from "./navbar/navbar";
export * from "./navbar/navbarDivider";
export * from "./navbar/navbarGroup";
export * from "./navbar/navbarHeading";
export * from "./non-ideal-state/nonIdealState";
export * from "./overflow-list/overflowList";
export * from "./overlay/overlay";
export * from "./text/text";
export * from "./panel-stack/panelProps";
export * from "./panel-stack/panelStack";
export * from "./popover/popover";
export * from "./popover/popoverSharedProps";
export * from "./portal/portal";
export * from "./progress-bar/progressBar";
export * from "./resize-sensor/resizeSensor";
export * from "./slider/handleProps";
export * from "./slider/multiSlider";
export * from "./slider/rangeSlider";
export * from "./slider/slider";
export * from "./spinner/spinner";
export * from "./tabs/tab";
export * from "./tabs/tabs";
export * from "./tag/tag";
export * from "./tag-input/tagInput";
export * from "./toast/toast";
export * from "./toast/toaster";
export * from "./tooltip/tooltip";
export * from "./tree/tree";
export * from "./tree/treeNode";
