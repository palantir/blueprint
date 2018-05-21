/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

// Note: using CommonJS syntax here so this can be used in the isomorphic tests, which must run in a server environment.
require("./polyfill");

const Enzyme = require("enzyme");
// test against React 15 with REACT=15 env variable.
const Adapter = require(`enzyme-adapter-react-${process.env.REACT || 16}`);

Enzyme.configure({ adapter: new Adapter() });

// tslint:disable-next-line:no-console
console.info(`Enzyme configured with *${Adapter.name}*`);
