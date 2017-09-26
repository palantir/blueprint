/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 *
 * Demonstrates sample usage of the table component.
 */

import * as React from "react";
import * as ReactDOM from "react-dom";
import { MutableTable } from "./mutableTable";
import { Nav } from "./nav";

ReactDOM.render(<Nav selected="perf" />, document.getElementById("nav"));
ReactDOM.render(<MutableTable />, document.querySelector("#page-content"));
