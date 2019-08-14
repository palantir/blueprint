/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

// Note: using CommonJS syntax here so this can be used in the isomorphic tests, which must run in a server environment.
require("./polyfill");

const Enzyme = require("enzyme");
const Adapter = require("enzyme-adapter-react-16");

Enzyme.configure({ adapter: new Adapter() });

// tslint:disable-next-line:no-console
console.info(`Enzyme configured with *${Adapter.name}*`);
