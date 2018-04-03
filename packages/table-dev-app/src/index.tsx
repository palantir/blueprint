/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";
import * as ReactDOM from "react-dom";
import { MutableTable } from "./mutableTable";
import { Nav } from "./nav";

ReactDOM.render(<Nav selected="index" />, document.getElementById("nav"));
ReactDOM.render(<MutableTable />, document.querySelector("#page-content"));
