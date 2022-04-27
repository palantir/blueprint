/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

import "./polyfill";

import Enzyme from "enzyme";
// test against React 15 with REACT=15 env variable.
// this module is swapped out using webpack aliases in webpack.config.karma.js
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

console.info(`Enzyme configured with *${Adapter.name}*`);
