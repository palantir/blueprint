/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import Adapter from "@cfaester/enzyme-adapter-react-18";
import { cleanup } from "@testing-library/react";
import Enzyme from "enzyme";
import { afterEach } from "vitest";

Enzyme.configure({ adapter: new Adapter() });

afterEach(() => {
    cleanup();
});
