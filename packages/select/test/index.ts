/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

// Enzyme is configured via vitest.setup (Vitest); do not import bootstrap here.

import "normalize.css/normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "../lib/css/blueprint-select.css";

import "./itemRendererTests";
import "./listItemsPropsTests";
import "./multiSelectTests";
import "./omnibarTests";
import "./queryListTests";
import "./renderFilteredItemsTests";
import "./selectTests";
import "./suggestTests";
