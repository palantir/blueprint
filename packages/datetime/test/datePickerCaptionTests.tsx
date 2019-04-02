/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

import { HTMLSelect } from "@blueprintjs/core";
import { ClassNames } from "react-day-picker/types/common";
import { DatePickerCaption, IDatePickerCaptionProps } from "../src/datePickerCaption";
import { Classes, IDatePickerLocaleUtils } from "../src/index";

describe("<DatePickerCaption>", () => {
    const LOCALE_UTILS: IDatePickerLocaleUtils = {
        getMonths: () => [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ],
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

        assert.isTrue(onMonthChange.notCalled, "onMonthChange before");
        month.simulate("change", { target: { value: 11 } });
        assert.isTrue(onMonthChange.calledOnce, "onMonthChange after");
        assert.strictEqual(onMonthChange.args[0][0], 11);

        assert.isTrue(onYearChange.notCalled, "onYearChange before");
        year.simulate("change", { target: { value: 2014 } });
        assert.isTrue(onYearChange.calledOnce, "onYearChange after");
        assert.strictEqual(onYearChange.args[0][0], 2014);
    });

    it("caption options are only displayed for possible months and years", () => {
        const minDate = new Date(2014, 11, 20);
        const maxDate = new Date(2015, 0, 12);
        const { month, year } = renderDatePickerCaption({ maxDate, minDate });
        assert.deepEqual(month.find("option").map(mo => mo.text()), ["January"]);
        assert.deepEqual(year.find("option").map(yr => yr.text()), ["2014", "2015"]);
    });

    it("renders localized month labels when supplied", () => {
        const months = [
            "Janvier",
            "Février",
            "Mars",
            "Avril",
            "Mai",
            "Juin",
            "Juillet",
            "Août",
            "Septembre",
            "Octobre",
            "Novembre",
            "Décembre",
        ] as any;
        const { month } = renderDatePickerCaption({ months });
        const options = month.find("option");
        assert.deepEqual(options.map(mo => mo.text()), months);
    });

    it("out-of-bounds year adds disabled year option", () => {
        const date = new Date(2017, 0, 6);
        const minDate = new Date(2015, 0, 1);
        const maxDate = new Date(2016, 11, 31);
        const { year } = renderDatePickerCaption({ date, maxDate, minDate });
        const options = year.find("option");
        assert.deepEqual(options.map(yr => yr.text()), ["2015", "2016", "2017"]);
        assert.isTrue(options.last().prop("disabled"), "2017 is not disabled");
    });

    function renderDatePickerCaption(props?: Partial<IDatePickerCaptionProps>) {
        const wrapper = mount(
            <DatePickerCaption
                // tslint:disable-next-line:no-object-literal-type-assertion
                classNames={{} as ClassNames}
                date={new Date(2015, 0)}
                locale="en"
                localeUtils={LOCALE_UTILS}
                maxDate={new Date(2020, 0)}
                minDate={new Date(2010, 0)}
                months={undefined}
                {...props}
            />,
        );

        return {
            month: wrapper
                .find(HTMLSelect)
                .filter({ className: Classes.DATEPICKER_MONTH_SELECT })
                .find("select"),
            root: wrapper,
            year: wrapper
                .find(HTMLSelect)
                .filter({ className: Classes.DATEPICKER_YEAR_SELECT })
                .find("select"),
        };
    }
});
