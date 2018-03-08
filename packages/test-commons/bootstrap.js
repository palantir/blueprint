/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

import "./polyfill";

import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });
