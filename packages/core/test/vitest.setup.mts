/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import Adapter from "@cfaester/enzyme-adapter-react-18";
import { cleanup } from "@testing-library/react";
import Enzyme from "enzyme";
import { afterEach } from "vitest";

Enzyme.configure({ adapter: new Adapter() });

afterEach(() => {
    cleanup();
});
