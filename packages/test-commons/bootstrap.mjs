/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

import ReactEighteenAdapter from "@cfaester/enzyme-adapter-react-18";
import Enzyme from "enzyme";

const Adapter = ReactEighteenAdapter.default;

Enzyme.configure({ adapter: new Adapter() });

console.info(`Enzyme configured with *${Adapter.name}*`);
