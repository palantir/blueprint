/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

require("./polyfill");

const Enzyme = require("enzyme");
// REACT env variable should be 15 or 16.
const Adapter = require(`enzyme-adapter-react-${process.env.REACT}`);

Enzyme.configure({ adapter: new Adapter() });
// tslint:disable-next-line:no-console
console.info(`Enzyme configured with ${adapter.name}.`);
