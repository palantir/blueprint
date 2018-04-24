/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

require("./polyfill");

// REACT env variable should be 15 or 16.
const { REACT = 16 } = process.env;

const Enzyme = require("enzyme");
const Adapter = require(`enzyme-adapter-react-${REACT}`);

Enzyme.configure({ adapter: new Adapter() });

// tslint:disable-next-line:no-console
console.info(`Enzyme configured with \x1b[35m${Adapter.name}\x1b[0m`);
