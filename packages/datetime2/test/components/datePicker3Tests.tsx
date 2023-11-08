/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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
import enUSLocale from "date-fns/locale/en-US";
import { mount, type ReactWrapper } from "enzyme";
import * as React from "react";
import { Day } from "react-day-picker";
import sinon from "sinon";

import { Button, Classes as CoreClasses, HTMLSelect, Menu, MenuItem } from "@blueprintjs/core";
import {
    type DatePickerShortcut,
    DatePickerShortcutMenu,
    DateUtils,
    Errors,
    Months,
    TimePicker,
    TimePrecision,
} from "@blueprintjs/datetime";
import { assertDatesEqual } from "@blueprintjs/test-commons";

import { Classes } from "../../src/classes";
import { DatePicker3, type DatePicker3Props } from "../../src/components/date-picker3/datePicker3";
import type { DatePicker3State } from "../../src/components/date-picker3/datePicker3State";
import { assertDayDisabled, assertDayHidden } from "../common/dayPickerTestUtils";
import { loadDateFnsLocaleFake } from "../common/loadDateFnsLocaleFake";

const DEFAULT_PROPS: DatePicker3Props = {
    dateFnsLocaleLoader: loadDateFnsLocaleFake,
};

describe("<DatePicker3>", () => {
    let testsContainerElement: HTMLElement;
    let datePicker3Wrapper: ReactWrapper<DatePicker3Props, DatePicker3State>;

    beforeEach(() => {
        testsContainerElement = document.createElement("div");
        document.body.appendChild(testsContainerElement);
    });

    afterEach(() => {
        datePicker3Wrapper?.unmount();
        datePicker3Wrapper?.detach();
        testsContainerElement.remove();
    });

    it(`renders .${Classes.DATEPICKER}`, () => {
        assert.lengthOf(wrap(<DatePicker3 {...DEFAULT_PROPS} />).root.find(`.${Classes.DATEPICKER}`), 1);
    });

    it("no day is selected by default", () => {
        const { assertSelectedDays, root } = wrap(<DatePicker3 {...DEFAULT_PROPS} />);
        assertSelectedDays();
        assert.isNull(root.state("selectedDay"));
    });

    it("current day is not highlighted by default", () => {
        const { root } = wrap(<DatePicker3 {...DEFAULT_PROPS} />);
        assert.lengthOf(root.find(`.${Classes.DATEPICKER3_HIGHLIGHT_CURRENT_DAY}`), 0);
    });

    it("current day should be highlighted when highlightCurrentDay={true}", () => {
        const { root } = wrap(<DatePicker3 {...DEFAULT_PROPS} highlightCurrentDay={true} />);
        assert.lengthOf(root.find(`.${Classes.DATEPICKER3_HIGHLIGHT_CURRENT_DAY}`), 1);
    });

    describe("reconciliates dayPickerProps", () => {
        it("shows outside days by default", () => {
            const defaultValue = new Date(2017, Months.SEPTEMBER, 1);
            const firstDayInView = new Date(2017, Months.AUGUST, 27, 12, 0);
            const { root } = wrap(<DatePicker3 {...DEFAULT_PROPS} defaultValue={defaultValue} />);
            // TODO: refactor this to avoid knowing about react-day-picker's internal component names
            const firstDay = root.find(Day).first();
            assertDatesEqual(new Date(firstDay.prop("date")), firstDayInView);
        });

        it("doesn't show outside days if enableOutsideDays=false", () => {
            const defaultValue = new Date(2017, Months.SEPTEMBER, 1, 12);
            const { root } = wrap(
                <DatePicker3
                    {...DEFAULT_PROPS}
                    defaultValue={defaultValue}
                    dayPickerProps={{ showOutsideDays: false }}
                />,
            );
            const days = root.find(Day);

            assertDayHidden(days.at(0));
            assertDayHidden(days.at(1));
            assertDayHidden(days.at(2));
            assertDayHidden(days.at(3));
            assertDayHidden(days.at(4));
            assertDayHidden(days.at(5), false);
        });

        it("disables days according to custom modifiers in addition to default modifiers", () => {
            const defaultValue = new Date(2017, Months.SEPTEMBER, 1);
            const disableFridays = { dayOfWeek: [5] };
            const { getDay } = wrap(
                <DatePicker3
                    defaultValue={defaultValue}
                    maxDate={new Date(2017, Months.SEPTEMBER, 20)}
                    dayPickerProps={{ disabled: disableFridays }}
                />,
            );
            assertDayDisabled(getDay(15));
            assertDayDisabled(getDay(21));
            assertDayDisabled(getDay(10), false);
        });

        it("disables out-of-range max dates", () => {
            const defaultValue = new Date(2017, Months.SEPTEMBER, 1);
            const { getDay } = wrap(
                <DatePicker3
                    {...DEFAULT_PROPS}
                    defaultValue={defaultValue}
                    maxDate={new Date(2017, Months.SEPTEMBER, 20)}
                />,
            );
            assertDayDisabled(getDay(21));
            assertDayDisabled(getDay(10), false);
        });

        it("disables out-of-range min dates", () => {
            const defaultValue = new Date(2017, Months.SEPTEMBER, 1);
            const { getDay, clickPreviousMonth } = wrap(
                <DatePicker3
                    {...DEFAULT_PROPS}
                    defaultValue={defaultValue}
                    minDate={new Date(2017, Months.AUGUST, 20)}
                />,
            );
            clickPreviousMonth();
            assertDayDisabled(getDay(10));
            assertDayDisabled(getDay(21), false);
        });

        describe("event handlers", () => {
            // use a date that lets us navigate forward and backward in the same year
            const defaultValue = new Date(2017, Months.SEPTEMBER, 1);

            it("calls onMonthChange on button next click", () => {
                const onMonthChange = sinon.spy();
                const { root } = wrap(
                    <DatePicker3 {...DEFAULT_PROPS} defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />,
                );
                root.find(`.${Classes.DATEPICKER3_NAV_BUTTON_NEXT}`).first().simulate("click");
                assert.isTrue(onMonthChange.called);
            });

            it("calls onMonthChange on button prev click", () => {
                const onMonthChange = sinon.spy();
                const { root } = wrap(
                    <DatePicker3 {...DEFAULT_PROPS} defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />,
                );
                root.find(`.${Classes.DATEPICKER3_NAV_BUTTON_PREVIOUS}`).first().simulate("click");
                assert.isTrue(onMonthChange.called);
            });

            it("calls onMonthChange on month select change", () => {
                const onMonthChange = sinon.spy();
                const { root } = wrap(
                    <DatePicker3 {...DEFAULT_PROPS} defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />,
                );
                root.find(`.${Classes.DATEPICKER_MONTH_SELECT}`).first().find("select").simulate("change");
                assert.isTrue(onMonthChange.called);
            });

            it("calls onMonthChange on year select change", () => {
                const onMonthChange = sinon.spy();
                const { root } = wrap(
                    <DatePicker3 {...DEFAULT_PROPS} defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />,
                );
                root.find(`.${Classes.DATEPICKER_YEAR_SELECT}`).first().find("select").simulate("change");
                assert.isTrue(onMonthChange.called);
            });

            it("calls onDayClick", () => {
                const onDayClick = sinon.spy();
                const { getDay } = wrap(
                    <DatePicker3 {...DEFAULT_PROPS} defaultValue={defaultValue} dayPickerProps={{ onDayClick }} />,
                );
                getDay().simulate("click");
                assert.isTrue(onDayClick.called);
            });
        });
    });

    it("user-provided modifiers are applied", () => {
        const ODD_CLASS = "test-odd";
        const oddifier = (d: Date) => d.getDate() % 2 === 1;
        const { getDay } = wrap(
            <DatePicker3
                {...DEFAULT_PROPS}
                dayPickerProps={{ modifiers: { odd: oddifier }, modifiersClassNames: { odd: ODD_CLASS } }}
            />,
        );

        assert.isFalse(getDay(4).hasClass(ODD_CLASS));
        assert.isTrue(getDay(5).hasClass(ODD_CLASS));
    });

    it("renders the actions bar when showActionsBar=true", () => {
        const { root } = wrap(<DatePicker3 {...DEFAULT_PROPS} showActionsBar={true} />);
        assert.lengthOf(root.find({ className: Classes.DATEPICKER_FOOTER }), 1);
    });

    describe("initially displayed month", () => {
        it("is defaultValue", () => {
            const defaultValue = new Date(2007, Months.APRIL, 4);
            const { root } = wrap(<DatePicker3 {...DEFAULT_PROPS} defaultValue={defaultValue} />);
            assert.equal(root.state("displayYear"), 2007);
            assert.equal(root.state("displayMonth"), Months.APRIL);
        });

        it("is initialMonth if set (overrides defaultValue)", () => {
            const defaultValue = new Date(2007, Months.APRIL, 4);
            const initialMonth = new Date(2002, Months.MARCH, 1);
            const { root } = wrap(
                <DatePicker3 {...DEFAULT_PROPS} defaultValue={defaultValue} initialMonth={initialMonth} />,
            );
            assert.equal(root.state("displayYear"), 2002);
            assert.equal(root.state("displayMonth"), Months.MARCH);
        });

        it("is value if set and initialMonth not set", () => {
            const value = new Date(2007, Months.APRIL, 4);
            const { root } = wrap(<DatePicker3 {...DEFAULT_PROPS} value={value} />);
            assert.equal(root.state("displayYear"), 2007);
            assert.equal(root.state("displayMonth"), Months.APRIL);
        });

        it("is today if today is within date range", () => {
            const today = new Date();
            const { root } = wrap(<DatePicker3 {...DEFAULT_PROPS} />);
            assert.equal(root.state("displayYear"), today.getFullYear());
            assert.equal(root.state("displayMonth"), today.getMonth());
        });

        it("is a day between minDate and maxDate if today is not in range", () => {
            const maxDate = new Date(2005, Months.JANUARY);
            const minDate = new Date(2000, Months.JANUARY);
            const { root } = wrap(<DatePicker3 {...DEFAULT_PROPS} maxDate={maxDate} minDate={minDate} />);
            assert.isTrue(
                DateUtils.isDayInRange(new Date(root.state("displayYear"), root.state("displayMonth")), [
                    minDate,
                    maxDate,
                ]),
            );
        });

        it("selectedDay is set to the day of the value", () => {
            const value = new Date(2007, Months.APRIL, 4);
            const { root } = wrap(<DatePicker3 {...DEFAULT_PROPS} value={value} />);
            assert.strictEqual(root.state("selectedDay"), value.getDate());
        });

        it("selectedDay is set to the day of the defaultValue", () => {
            const defaultValue = new Date(2007, Months.APRIL, 4);
            const { root } = wrap(<DatePicker3 {...DEFAULT_PROPS} defaultValue={defaultValue} />);
            assert.strictEqual(root.state("selectedDay"), defaultValue.getDate());
        });
    });

    describe("minDate/maxDate bounds", () => {
        const MIN_DATE = new Date(2015, Months.JANUARY, 7);
        const MAX_DATE = new Date(2015, Months.JANUARY, 12);

        describe("validation", () => {
            let consoleError: sinon.SinonStub;

            before(() => (consoleError = sinon.stub(console, "error")));
            afterEach(() => consoleError.resetHistory());
            after(() => consoleError.restore());

            it("maxDate must be later than minDate", () => {
                wrap(<DatePicker3 {...DEFAULT_PROPS} maxDate={MIN_DATE} minDate={MAX_DATE} />);
                assert.isTrue(consoleError.calledWith(Errors.DATEPICKER_MAX_DATE_INVALID));
            });

            it("an error is logged if defaultValue is outside bounds", () => {
                wrap(
                    <DatePicker3
                        defaultValue={new Date(2015, Months.JANUARY, 5)}
                        maxDate={MAX_DATE}
                        minDate={MIN_DATE}
                    />,
                );
                assert.isTrue(consoleError.calledWith(Errors.DATEPICKER_DEFAULT_VALUE_INVALID));
            });

            it("an error is logged if value is outside bounds", () => {
                wrap(
                    <DatePicker3
                        {...DEFAULT_PROPS}
                        value={new Date(2015, Months.JANUARY, 20)}
                        maxDate={MAX_DATE}
                        minDate={MIN_DATE}
                    />,
                );
                assert.isTrue(consoleError.calledWith(Errors.DATEPICKER_VALUE_INVALID));
            });

            it("an error is logged if initialMonth is outside month bounds", () => {
                wrap(
                    <DatePicker3
                        initialMonth={new Date(2015, Months.FEBRUARY, 12)}
                        maxDate={MAX_DATE}
                        minDate={MIN_DATE}
                    />,
                );
                assert.isTrue(consoleError.calledWith(Errors.DATEPICKER_INITIAL_MONTH_INVALID));
            });

            it("an error is not logged if initialMonth is outside day bounds but inside month bounds", () => {
                wrap(
                    <DatePicker3
                        initialMonth={new Date(2015, Months.JANUARY, 12)}
                        minDate={MIN_DATE}
                        maxDate={MAX_DATE}
                    />,
                );
                assert.isTrue(consoleError.notCalled);
            });
        });

        describe("today button validation", () => {
            const today = new Date();
            const MIN_DATE_BEFORE_TODAY = MIN_DATE;
            const MAX_DATE_BEFORE_TODAY = MAX_DATE;

            const MIN_DATE_AFTER_TODAY = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
            const MAX_DATE_AFTER_TODAY = new Date(today.getFullYear() + 2, today.getMonth(), today.getDate());

            it("min/max before today has disabled button", () => {
                const { getTodayButton } = wrap(
                    <DatePicker3
                        minDate={MIN_DATE_BEFORE_TODAY}
                        maxDate={MAX_DATE_BEFORE_TODAY}
                        showActionsBar={true}
                    />,
                );

                assert.isTrue(getTodayButton().props().disabled);
            });

            it("min/max after today has disabled button", () => {
                const { getTodayButton } = wrap(
                    <DatePicker3
                        {...DEFAULT_PROPS}
                        minDate={MIN_DATE_AFTER_TODAY}
                        maxDate={MAX_DATE_AFTER_TODAY}
                        showActionsBar={true}
                    />,
                );

                assert.isTrue(getTodayButton().props().disabled);
            });

            it("valid min/max today has enabled button", () => {
                const { getTodayButton } = wrap(
                    <DatePicker3
                        minDate={MIN_DATE_BEFORE_TODAY}
                        maxDate={MAX_DATE_AFTER_TODAY}
                        showActionsBar={true}
                    />,
                );

                assert.isFalse(getTodayButton().props().disabled);
            });
        });

        it("only days outside bounds have disabled class", () => {
            const minDate = new Date(2000, Months.JANUARY, 10);
            const { getDay } = wrap(<DatePicker3 {...DEFAULT_PROPS} initialMonth={minDate} minDate={minDate} />);
            // 8 is before min date, 12 is after
            assert.isTrue(getDay(8).hasClass(Classes.DATEPICKER3_DAY_DISABLED));
            assert.isFalse(getDay(12).hasClass(Classes.DATEPICKER3_DAY_DISABLED));
        });

        it("onChange not fired when a day outside of bounds is clicked", () => {
            const onChange = sinon.spy();
            const { getDay } = wrap(
                <DatePicker3 {...DEFAULT_PROPS} maxDate={MAX_DATE} minDate={MIN_DATE} onChange={onChange} />,
            );
            assert.isTrue(onChange.notCalled);
            getDay(4).simulate("click");
            getDay(16).simulate("click");
            assert.isTrue(onChange.notCalled);
            getDay(8).simulate("click");
            assert.isTrue(onChange.calledOnce);
        });

        it("constrains time picker when minDate is selected", () => {
            const { root } = wrap(
                <DatePicker3
                    maxDate={MAX_DATE}
                    minDate={MIN_DATE}
                    timePrecision={TimePrecision.MINUTE}
                    value={MIN_DATE}
                />,
            );
            const timePicker = root.find(TimePicker).first();
            assert.strictEqual(timePicker.props().minTime, MIN_DATE);
        });

        it("constrains time picker when max date is selected", () => {
            const { root } = wrap(
                <DatePicker3
                    maxDate={MAX_DATE}
                    minDate={MIN_DATE}
                    timePrecision={TimePrecision.MINUTE}
                    value={MAX_DATE}
                />,
            );
            const timePicker = root.find(TimePicker).first();
            assert.strictEqual(timePicker.props().maxTime, MAX_DATE);
        });
    });

    describe("when controlled", () => {
        it("value initially selects a day", () => {
            const value = new Date(2010, Months.JANUARY, 1);
            const { assertSelectedDays } = wrap(
                <DatePicker3 {...DEFAULT_PROPS} defaultValue={new Date(2010, Months.FEBRUARY, 2)} value={value} />,
            );
            assertSelectedDays(value.getDate());
        });

        it("selection does not update automatically", () => {
            const { getDay, assertSelectedDays } = wrap(<DatePicker3 {...DEFAULT_PROPS} value={null} />);
            assertSelectedDays();
            getDay().simulate("click");
            assertSelectedDays();
        });

        it("selected day doesn't update on current month view change", () => {
            const value = new Date(2010, Months.JANUARY, 2);
            const { assertSelectedDays, clickPreviousMonth, months, years } = wrap(
                <DatePicker3 {...DEFAULT_PROPS} value={value} />,
            );
            clickPreviousMonth();

            assertSelectedDays(2);

            months.simulate("change", { target: { value: Months.JUNE } });
            assertSelectedDays();

            years.simulate("change", { target: { value: 2014 } });
            assertSelectedDays();
        });

        it("onChange fired when a day is clicked", () => {
            const onChange = sinon.spy();
            const { getDay } = wrap(<DatePicker3 {...DEFAULT_PROPS} onChange={onChange} value={null} />);
            getDay().simulate("click");
            assert.isTrue(onChange.calledOnce);
            assert.isTrue(onChange.args[0][1]);
        });

        it("onChange fired when month is changed", () => {
            const value = new Date(2010, Months.JANUARY, 2);
            const onChange = sinon.spy();
            const { months, clickPreviousMonth } = wrap(
                <DatePicker3 {...DEFAULT_PROPS} onChange={onChange} value={value} />,
            );

            clickPreviousMonth();
            assert.isTrue(onChange.calledOnce, "expected onChange called");
            assert.isFalse(onChange.firstCall.args[1], "expected isUserChange to be false");

            months.simulate("change", { target: { value: Months.JUNE } });
            assert.isTrue(onChange.calledTwice, "expected onChange called again");
            assert.isFalse(onChange.secondCall.args[1], "expected isUserChange to be false again");
        });

        it("can change displayed date with the dropdowns in the caption", () => {
            const { months, root, years } = wrap(
                <DatePicker3 {...DEFAULT_PROPS} initialMonth={new Date(2015, Months.MARCH, 2)} value={null} />,
            );
            assert.equal(root.state("displayMonth"), Months.MARCH);
            assert.equal(root.state("displayYear"), 2015);

            months.simulate("change", { target: { value: Months.JANUARY } });
            years.simulate("change", { target: { value: 2014 } });
            assert.equal(root.state("displayMonth"), Months.JANUARY);
            assert.equal(root.state("displayYear"), 2014);
        });

        it("shortcuts fire onChange with correct values", () => {
            const today = new Date();
            const aWeekAgo = DateUtils.clone(today);
            aWeekAgo.setDate(today.getDate() - 6);
            const onChange = sinon.spy();
            const { clickShortcut } = wrap(
                <DatePicker3 {...DEFAULT_PROPS} onChange={onChange} value={today} shortcuts={true} />,
            );
            clickShortcut(2);

            assert.isTrue(onChange.calledOnce, "called");
            const value = onChange.args[0][0];
            assert.isTrue(DateUtils.isSameDay(aWeekAgo, value));
        });

        it("all shortcuts are displayed as inactive when none are selected", () => {
            const { root } = wrap(<DatePicker3 {...DEFAULT_PROPS} shortcuts={true} />);

            assert.isFalse(
                root.find(DatePickerShortcutMenu).find(Menu).find(MenuItem).find(`.${CoreClasses.ACTIVE}`).exists(),
            );
        });

        it("corresponding shortcut is displayed as active when selected", () => {
            const selectedShortcut = 0;
            const { root } = wrap(
                <DatePicker3 {...DEFAULT_PROPS} shortcuts={true} selectedShortcutIndex={selectedShortcut} />,
            );

            assert.isTrue(
                root.find(DatePickerShortcutMenu).find(Menu).find(MenuItem).find(`.${CoreClasses.ACTIVE}`).exists(),
            );

            assert.lengthOf(
                root.find(DatePickerShortcutMenu).find(Menu).find(MenuItem).find(`.${CoreClasses.ACTIVE}`),
                1,
            );

            assert.isTrue(root.state("selectedShortcutIndex") === selectedShortcut);
        });

        it("should call onShortcutChangeSpy on selecting a shortcut ", () => {
            const selectedShortcut = 0;
            const onShortcutChangeSpy = sinon.spy();
            const onChangeSpy = sinon.spy();
            const { clickShortcut } = wrap(
                <DatePicker3
                    {...DEFAULT_PROPS}
                    onChange={onChangeSpy}
                    shortcuts={true}
                    onShortcutChange={onShortcutChangeSpy}
                />,
            );

            clickShortcut(selectedShortcut);

            assert.isTrue(onChangeSpy.calledOnce);
            assert.isTrue(onShortcutChangeSpy.calledOnce);
            assert.isTrue(onShortcutChangeSpy.lastCall.args[0].label === "Today");
            assert.isTrue(onShortcutChangeSpy.lastCall.args[1] === selectedShortcut);
        });

        it("custom shortcuts select the correct values", () => {
            const date = new Date(2015, Months.JANUARY, 1);
            const onChangeSpy = sinon.spy();
            const { clickShortcut, assertSelectedDays } = wrap(
                <DatePicker3
                    {...DEFAULT_PROPS}
                    onChange={onChangeSpy}
                    shortcuts={[{ label: "custom shortcut", date }]}
                />,
            );
            clickShortcut();
            assert.isTrue(onChangeSpy.calledOnce);
            const value = onChangeSpy.args[0][0];
            assert.isTrue(DateUtils.isSameDay(date, value));
            assertSelectedDays(date.getDate());
        });
    });

    describe("when uncontrolled", () => {
        it("defaultValue initially selects a day", () => {
            const today = new Date();
            const { assertSelectedDays } = wrap(<DatePicker3 {...DEFAULT_PROPS} defaultValue={today} />);
            assertSelectedDays(today.getDate());
        });

        it("onChange fired when a day is clicked", () => {
            const onChange = sinon.spy();
            const { getDay } = wrap(<DatePicker3 {...DEFAULT_PROPS} onChange={onChange} />);
            assert.isTrue(onChange.notCalled);
            getDay().simulate("click");
            assert.isTrue(onChange.calledOnce);
        });

        it("onChange fired when month is changed", () => {
            const onChange = sinon.spy();
            // must use an initial month otherwise clicking next month in december will fail
            const { getDay, clickNextMonth } = wrap(
                <DatePicker3
                    {...DEFAULT_PROPS}
                    initialMonth={new Date(2015, Months.JANUARY, 12)}
                    onChange={onChange}
                />,
            );
            assert.isTrue(onChange.notCalled);
            getDay().simulate("click");
            assert.isTrue(onChange.calledOnce, "expected onChange called");
            clickNextMonth();
            assert.isTrue(onChange.calledTwice, "expected onChange called again");
        });

        it("selected day updates are automatic", () => {
            const { assertSelectedDays, getDay } = wrap(<DatePicker3 {...DEFAULT_PROPS} />);
            assertSelectedDays();
            getDay(3).simulate("click");
            assertSelectedDays(3);
        });

        it("selected day is preserved when selections are changed", () => {
            const initialMonth = new Date(2015, Months.JULY, 1);
            const { assertSelectedDays, getDay, months } = wrap(
                <DatePicker3 {...DEFAULT_PROPS} initialMonth={initialMonth} />,
            );
            getDay(31).simulate("click");
            months.simulate("change", { target: { value: Months.AUGUST } });
            assertSelectedDays(31);
        });

        it("selected day is changed if necessary when selections are changed", () => {
            const initialMonth = new Date(2015, Months.JULY, 1);
            const { assertSelectedDays, getDay, clickPreviousMonth } = wrap(
                <DatePicker3 {...DEFAULT_PROPS} initialMonth={initialMonth} />,
            );
            getDay(31).simulate("click");
            clickPreviousMonth();
            assertSelectedDays(30);
            // remembers actual date that was clicked and restores if possible
            clickPreviousMonth();
            assertSelectedDays(31);
        });

        it("selected day is changed to minDate or maxDate if selections are changed outside bounds", () => {
            const initialMonth = new Date(2015, Months.JULY, 1);
            const minDate = new Date(2015, Months.MARCH, 13);
            const maxDate = new Date(2015, Months.NOVEMBER, 21);
            const { assertSelectedDays, getDay, months } = wrap(
                <DatePicker3 {...DEFAULT_PROPS} initialMonth={initialMonth} minDate={minDate} maxDate={maxDate} />,
            );

            getDay(1).simulate("click");
            months.simulate("change", { target: { value: Months.MARCH } });
            assertSelectedDays(minDate.getDate());

            getDay(25).simulate("click");
            months.simulate("change", { target: { value: Months.NOVEMBER } });
            assertSelectedDays(maxDate.getDate());
        });

        it("can change displayed date with the dropdowns in the caption", () => {
            const { months, root, years } = wrap(
                <DatePicker3 {...DEFAULT_PROPS} initialMonth={new Date(2015, Months.MARCH, 2)} />,
            );
            assert.equal(root.state("displayMonth"), Months.MARCH);
            assert.equal(root.state("displayYear"), 2015);

            months.simulate("change", { target: { value: Months.JANUARY } });
            years.simulate("change", { target: { value: 2014 } });
            assert.equal(root.state("displayMonth"), Months.JANUARY);
            assert.equal(root.state("displayYear"), 2014);
        });

        it("shortcuts select values", () => {
            const { root, clickShortcut } = wrap(<DatePicker3 {...DEFAULT_PROPS} shortcuts={true} />);
            clickShortcut(2);

            const today = new Date();
            const aWeekAgo = DateUtils.clone(today);
            aWeekAgo.setDate(today.getDate() - 6);

            const value = root.state("value");
            assert.isTrue(DateUtils.isSameDay(aWeekAgo, value!));
        });

        it("custom shortcuts select the correct values", () => {
            const date = new Date(2010, Months.JANUARY, 10);
            const { clickShortcut, assertSelectedDays } = wrap(
                <DatePicker3 {...DEFAULT_PROPS} shortcuts={[{ label: "custom shortcut", date }]} />,
            );
            clickShortcut();
            assertSelectedDays(date.getDate());
        });
    });

    describe("time selection", () => {
        const defaultValue = new Date(2012, 2, 5, 6, 5, 40);

        it("setting timePrecision shows a TimePicker", () => {
            const { root } = wrap(<DatePicker3 {...DEFAULT_PROPS} />);
            assert.isFalse(root.find(TimePicker).exists());
            root.setProps({ timePrecision: "minute" });
            assert.isTrue(root.find(TimePicker).exists());
        });

        it("setting timePickerProps shows a TimePicker", () => {
            const { root } = wrap(<DatePicker3 {...DEFAULT_PROPS} timePickerProps={{}} />);
            assert.isTrue(root.find(TimePicker).exists());
        });

        it("onChange fired when the time is changed", () => {
            const onChangeSpy = sinon.spy();
            const { root } = wrap(
                <DatePicker3
                    defaultValue={defaultValue}
                    onChange={onChangeSpy}
                    timePickerProps={{ showArrowButtons: true }}
                />,
            );
            assert.isTrue(onChangeSpy.notCalled);
            root.find(`.${Classes.TIMEPICKER_ARROW_BUTTON}.${Classes.TIMEPICKER_HOUR}`).first().simulate("click");
            assert.isTrue(onChangeSpy.calledOnce);
            const cbHour = onChangeSpy.firstCall.args[0].getHours();
            assert.strictEqual(cbHour, defaultValue.getHours() + 1);
        });

        it("changing date does not change time", () => {
            const onChangeSpy = sinon.spy();
            wrap(
                <DatePicker3
                    {...DEFAULT_PROPS}
                    defaultValue={defaultValue}
                    onChange={onChangeSpy}
                    timePrecision="minute"
                />,
            )
                .getDay(16)
                .simulate("click");
            assert.isTrue(DateUtils.isSameTime(onChangeSpy.firstCall.args[0] as Date, defaultValue));
        });

        it("changing time does not change date", () => {
            const onChangeSpy = sinon.spy();
            const { setTimeInput } = wrap(
                <DatePicker3
                    {...DEFAULT_PROPS}
                    defaultValue={defaultValue}
                    onChange={onChangeSpy}
                    timePrecision="minute"
                />,
            );
            setTimeInput("minute", 45);
            assert.isTrue(DateUtils.isSameDay(onChangeSpy.firstCall.args[0] as Date, defaultValue));
        });

        it("changing time without date uses today", () => {
            const onChangeSpy = sinon.spy();
            // no date set via props
            const { setTimeInput } = wrap(
                <DatePicker3 {...DEFAULT_PROPS} onChange={onChangeSpy} timePrecision="minute" />,
            );
            setTimeInput("minute", 45);
            assert.isTrue(DateUtils.isSameDay(onChangeSpy.firstCall.args[0] as Date, new Date()));
        });

        it("clicking a shortcut with includeTime=true changes time", () => {
            const onChangeSpy = sinon.spy();
            const date = DateUtils.clone(defaultValue);
            date.setHours(date.getHours() - 2);

            const shortcuts: DatePickerShortcut[] = [
                {
                    date,
                    includeTime: true,
                    label: "shortcut with time",
                },
            ];
            const { clickShortcut } = wrap(
                <DatePicker3
                    defaultValue={defaultValue}
                    onChange={onChangeSpy}
                    timePrecision="minute"
                    shortcuts={shortcuts}
                />,
            );
            clickShortcut();
            assert.equal(onChangeSpy.firstCall.args[0] as Date, date);
        });
    });

    describe("clearing a selection", () => {
        it("onChange correctly passes a Date and never null when canClearSelection is false", () => {
            const onChange = sinon.spy();
            const { getDay } = wrap(<DatePicker3 {...DEFAULT_PROPS} canClearSelection={false} onChange={onChange} />);
            getDay().simulate("click");
            assert.isNotNull(onChange.firstCall.args[0]);
            getDay().simulate("click");
            assert.isNotNull(onChange.secondCall.args[0]);
        });

        it("onChange correctly passes a Date or null when canClearSelection is true", () => {
            const onChange = sinon.spy();
            const { getDay } = wrap(<DatePicker3 {...DEFAULT_PROPS} canClearSelection={true} onChange={onChange} />);
            getDay().simulate("click");
            assert.isNotNull(onChange.firstCall.args[0]);
            getDay().simulate("click");
            assert.isNull(onChange.secondCall.args[0]);
        });

        it("Clear button disabled when canClearSelection is false", () => {
            const { getClearButton } = wrap(
                <DatePicker3 {...DEFAULT_PROPS} canClearSelection={false} showActionsBar={true} />,
            );
            assert.isTrue(getClearButton().props().disabled);
        });

        it("Clear button enabled when canClearSelection is true", () => {
            const { getClearButton } = wrap(
                <DatePicker3 {...DEFAULT_PROPS} canClearSelection={true} showActionsBar={true} />,
            );
            assert.isFalse(getClearButton().props().disabled);
        });

        it("selects the current day when Today is clicked", () => {
            const { root } = wrap(<DatePicker3 {...DEFAULT_PROPS} showActionsBar={true} />);
            root.find({ className: Classes.DATEPICKER_FOOTER }).find(Button).first().simulate("click");

            const today = new Date();
            const value = root.state("value");
            assert.isNotNull(value);
            assert.equal(value!.getDate(), today.getDate());
            assert.equal(value!.getMonth(), today.getMonth());
            assert.equal(value!.getFullYear(), today.getFullYear());
        });

        it("clears the value when Clear is clicked", () => {
            const { getDay, root } = wrap(<DatePicker3 {...DEFAULT_PROPS} showActionsBar={true} />);
            getDay().simulate("click");
            root.find({ className: Classes.DATEPICKER_FOOTER }).find(Button).last().simulate("click");
            assert.isNull(root.state("value"));
        });
    });

    describe("localization", () => {
        it("accept a statically-loaded date-fns locale and doesn't try to load it again", () => {
            const stub = sinon.stub();
            stub.callsFake(loadDateFnsLocaleFake);
            wrap(<DatePicker3 dateFnsLocaleLoader={stub} locale={enUSLocale} />);
            assert.isTrue(stub.notCalled, "Expected locale loader not to be called");
        });
    });

    function wrap(datepicker: JSX.Element) {
        const wrapper = mount<DatePicker3Props, DatePicker3State>(datepicker, { attachTo: testsContainerElement });
        datePicker3Wrapper = wrapper;
        return {
            /** Asserts that the given days are selected. No arguments asserts that selection is empty. */
            assertSelectedDays: (...days: number[]) =>
                assert.sameMembers(
                    wrapper
                        .find(`.${Classes.DATEPICKER3_DAY_SELECTED}`)
                        .hostNodes()
                        .map(d => +d.text()),
                    days,
                ),
            clickNextMonth: () => wrapper.find(`.${Classes.DATEPICKER3_NAV_BUTTON_NEXT}`).hostNodes().simulate("click"),
            clickPreviousMonth: () =>
                wrapper.find(`.${Classes.DATEPICKER3_NAV_BUTTON_PREVIOUS}`).hostNodes().simulate("click"),
            clickShortcut: (index = 0) => {
                wrapper.find(`.${Classes.DATERANGEPICKER_SHORTCUTS}`).hostNodes().find("a").at(index).simulate("click");
            },
            getClearButton: () => wrapper.find(`.${Classes.DATEPICKER_FOOTER}`).find(Button).last(),
            getDay: (dayNumber = 1) =>
                wrapper
                    .find(`.${Classes.DATEPICKER3_DAY}`)
                    .filterWhere(day => day.text() === "" + dayNumber && !day.hasClass(Classes.DATEPICKER3_DAY_OUTSIDE))
                    .hostNodes(),
            getTodayButton: () => wrapper.find(`.${Classes.DATEPICKER_FOOTER}`).find(Button).first(),
            months: wrapper.find(HTMLSelect).filter(`.${Classes.DATEPICKER_MONTH_SELECT}`).find("select"),
            root: wrapper,
            setTimeInput: (precision: TimePrecision | "hour", value: number) =>
                wrapper.find(`.${Classes.TIMEPICKER}-${precision}`).simulate("blur", { target: { value } }),
            years: wrapper.find(HTMLSelect).filter(`.${Classes.DATEPICKER_YEAR_SELECT}`).find("select"),
        };
    }
});
