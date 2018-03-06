/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

const baseConfig = require("./webpack.config.base");
const karmaConfig = require("./webpack.config.karma");

module.exports = {
    baseConfig,
    karmaConfig,
    COMMON_EXTERNALS: {
        "@blueprintjs/core": "var Blueprint.Core",
        "@blueprintjs/datetime": "var Blueprint.Datetime",
        "@blueprintjs/icons": "var Blueprint.Icons",
        "@blueprintjs/labs": "var Blueprint.Labs",
        "@blueprintjs/select": "var Blueprint.Select",
        "@blueprintjs/table": "var Blueprint.Table",
        "classnames": "classNames",
        "dom4": "window",
        "fuzzaldrin-plus": "fuzzaldrin-plus",
        "moment": "moment",
        "moment-timezone": "moment",
        "popper": "Popper",
        "prop-types": "PropTypes",
        "react-popper": "ReactPopper",
        "react": "React",
        "react-transition-group": "ReactTransitionGroup",
        "react-day-picker": "DayPicker",
        "react-dom": "ReactDOM",
    },
};
