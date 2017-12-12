/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */

import "es6-shim";

import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

import "../src";

import "./common/dateUtilsTests";
import "./dateInputTests";
import "./datePickerCaptionTests";
import "./datePickerTests";
import "./dateRangeInputTests";
import "./dateRangePickerTests";
import "./dateTimePickerTests";
import "./timePickerTests";
