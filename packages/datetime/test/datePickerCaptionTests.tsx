/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import { DatePickerCaption } from "../src/datePickerCaption";
import { Classes, IDatePickerLocaleUtils } from "../src/index";

describe("<DatePickerCaption>", () => {
    const LOCALE_UTILS: IDatePickerLocaleUtils = {
        getMonths: () => ["January", "February", "March", "April", "May", "June", "July",
                          "August", "September", "October", "November", "December"],
    } as any;

    it("renders month and year choosers", () => {
        const { month, year } = renderDatePickerCaption();
        assert.lengthOf(month, 1);
        assert.lengthOf(year, 1);
    });

    it("fires on*Change events as expected", () => {
        const onMonthChange = sinon.spy();
        const onYearChange = sinon.spy();
        const { month, year } = renderDatePickerCaption({ onMonthChange, onYearChange });

        assert.isTrue(onMonthChange.notCalled);
        month.simulate("change", { target: { value: 11 } });
        assert.isTrue(onMonthChange.calledOnce);
        assert.strictEqual(onMonthChange.args[0][0], 11);

        assert.isTrue(onYearChange.notCalled);
        year.simulate("change", { target: { value: 2014 } });
        assert.isTrue(onYearChange.calledOnce);
        assert.strictEqual(onYearChange.args[0][0], 2014);
    });

    it("caption options are only displayed for possible months and years", () => {
        const minDate = new Date(2014, 11, 20);
        const maxDate = new Date(2015, 0, 12);
        const { month, year } = renderDatePickerCaption({ maxDate, minDate });
        assert.deepEqual(month.find("option").map((mo) => mo.text()), ["January"]);
        assert.deepEqual(year.find("option").map((yr) => yr.text()), ["2014", "2015"]);
    });

    function renderDatePickerCaption(props?: any) {
        const wrapper = mount(
            <DatePickerCaption
                date={new Date(2015, 0)}
                locale="en"
                localeUtils={LOCALE_UTILS}
                maxDate={new Date(2020, 0)}
                minDate={new Date(2010, 0)}
                {...props}
            />,
        );

        return {
            month: wrapper.find(`.${Classes.DATEPICKER_MONTH_SELECT}`),
            root: wrapper,
            year: wrapper.find(`.${Classes.DATEPICKER_YEAR_SELECT}`),
        };
    }

});
