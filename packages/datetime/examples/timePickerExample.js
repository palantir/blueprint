/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var core_1 = require("@blueprintjs/core");
var baseExample_1 = require("@blueprintjs/core/examples/common/baseExample");
var React = require("react");
var src_1 = require("../src");
var TimePickerExample = (function (_super) {
    __extends(TimePickerExample, _super);
    function TimePickerExample() {
        var _this = _super.apply(this, arguments) || this;
        _this.state = {
            precision: src_1.TimePickerPrecision.MINUTE,
            showArrowButtons: false,
        };
        _this.handlePrecisionChange = baseExample_1.handleNumberChange(function (precision) { return _this.setState({ precision: precision }); });
        _this.toggleshowArrowButtons = function () {
            _this.setState({ showArrowButtons: !_this.state.showArrowButtons });
        };
        return _this;
    }
    TimePickerExample.prototype.renderExample = function () {
        return React.createElement(src_1.TimePicker, __assign({}, this.state));
    };
    TimePickerExample.prototype.renderOptions = function () {
        return [
            [
                React.createElement("label", { className: core_1.Classes.LABEL, key: "precision" },
                    "TimePicker precision",
                    React.createElement("div", { className: core_1.Classes.SELECT },
                        React.createElement("select", { value: this.state.precision.toString(), onChange: this.handlePrecisionChange },
                            React.createElement("option", { value: src_1.TimePickerPrecision.MINUTE.toString() }, "Minute"),
                            React.createElement("option", { value: src_1.TimePickerPrecision.SECOND.toString() }, "Second"),
                            React.createElement("option", { value: src_1.TimePickerPrecision.MILLISECOND.toString() }, "Millisecond")))),
                React.createElement(core_1.Switch, { checked: this.state.showArrowButtons, label: "Show arrow buttons", key: "arrows", onChange: this.toggleshowArrowButtons }),
            ],
        ];
    };
    return TimePickerExample;
}(baseExample_1.default));
exports.TimePickerExample = TimePickerExample;
