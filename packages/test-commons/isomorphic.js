/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * This module has its own root so it is not included when tests import this package,
 * as this module only uses React 16 -- no support for React 15 isotests.
 */

module.exports = require("./lib/cjs/generateIsomorphicTests");
