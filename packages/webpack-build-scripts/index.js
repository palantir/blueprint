/*
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
        "@blueprintjs/icons": "var Blueprint.Icons",
        "@blueprintjs/datetime": "var Blueprint.Datetime",
        "@blueprintjs/labs": "var Blueprint.Labs",
        "@blueprintjs/select": "var Blueprint.Select",
        "@blueprintjs/table": "var Blueprint.Table",
        "@blueprintjs/timezone": "var Blueprint.Timezone",
        "classnames": "classNames",
        "dom4": "window",
        "jquery": "$",
        "moment": "moment",
        "moment-timezone": "moment",
        "react": "React",
        "react-transition-group": "ReactTransitionGroup",
        "react-day-picker": "DayPicker",
        "react-dom": "ReactDOM",
    },
};
