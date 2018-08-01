/*
* Copyright 2018 Palantir Technologies, Inc. All rights reserved.
*
* Licensed under the terms of the LICENSE file distributed with this project.
*/

import { mount } from "enzyme";
import * as React from "react";
import { Omnibar } from "../src";
import { selectComponentSuite } from "./selectComponentSuite";

describe("<Omnibar>", () => {
    // must have query to show any items
    selectComponentSuite(props => mount(<Omnibar {...props} isOpen={true} overlayProps={{ usePortal: false }} />));
});
