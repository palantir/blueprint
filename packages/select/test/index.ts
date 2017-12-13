/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

import "es6-shim";

import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

import "./multiSelectTests";
import "./queryListTests";
import "./selectTests";
import "./suggestTests";
