/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import "es6-shim";

import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

import "./alert/alertTests";
import "./breadcrumbs/breadcrumbTests";
import "./buttons/buttonTests";
import "./callout/calloutTests";
import "./card/cardTests";
import "./collapse/collapseTests";
import "./collapsible-list/collapsibleListTests";
import "./common/propsTests.ts";
import "./common/tetherUtilsTests.ts";
import "./common/utils/compareUtilsTests.ts";
import "./common/utilsTests.ts";
import "./context-menu/contextMenuTests";
import "./controls/controlsTests";
import "./controls/inputGroupTests";
import "./controls/numericInputTests";
import "./controls/radioGroupTests";
import "./dialog/dialogTests";
import "./editable-text/editableTextTests";
import "./forms/fileInputTests";
import "./forms/formGroupTests";
import "./hotkeys/hotkeysTests";
import "./icon/iconTests";
import "./menu/menuTests";
import "./non-ideal-state/nonIdealStateTests";
import "./overlay/overlayTests";
import "./popover/arrowsTests";
// import "./popover/popoverTests";
import "./popover2/popover2Tests";
import "./portal/portalTests";
import "./progress/progressBarTests";
import "./slider/rangeSliderTests";
import "./slider/sliderTests";
import "./spinner/spinnerTests";
// import "./tabs/tabsTests";
import "./tabs2/tabs2Tests";
import "./tag/tagTests";
import "./text/textTests";
import "./toast/toasterTests";
import "./toast/toastTests";
import "./tooltip/tooltipTests";
import "./tree/treeTests";
