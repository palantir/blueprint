/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

import "./multiSelectTests";
import "./popover2Tests";
import "./queryListTests";
import "./selectTests";
import "./suggestTests";
import "./tagInputTests";
import "./timezonePickerTests";
