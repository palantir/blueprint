/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

const baseConfig = require("./webpack.config.base");

module.exports = {
    baseConfig,

    COMMON_EXTERNALS: {
        "@blueprintjs/core": "var Blueprint.Core",		
        "@blueprintjs/datetime": "var Blueprint.Datetime",		
        "@blueprintjs/table": "var Blueprint.Table",		
        "classnames": "classNames",		
        "dom4": "window",		
        "es6-shim": "window",		
        "jquery": "$",		
        "moment": "moment",		
        "moment-timezone": "moment",		
        "react": "React",		
        "react-addons-css-transition-group": "React.addons.CSSTransitionGroup",		
        "react-day-picker": "DayPicker",		
        "react-dom": "ReactDOM",		
        "tether": "Tether",		
    },
};
