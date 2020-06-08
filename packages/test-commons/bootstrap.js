/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

// Note: using CommonJS syntax here so this can be used in the isomorphic tests, which must run in a server environment.
require("./polyfill");

const Enzyme = require("enzyme");
// test against React 15 with REACT=15 env variable.
// this module is swapped out using webpack aliases in webpack.config.karma.js
const Adapter = require("enzyme-adapter-react-16");

Enzyme.configure({ adapter: new Adapter() });

console.info(`Enzyme configured with *${Adapter.name}*`);
