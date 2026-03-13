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

import enUSLocale from "date-fns/locale/en-US";
import { mount, type ReactWrapper } from "enzyme";
import { Day } from "react-day-picker";

import { Button, Classes as CoreClasses, HTMLSelect, Menu, MenuItem } from "@blueprintjs/core";
import { assertDatesEqual } from "@blueprintjs/test-commons";
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import {
    Classes,
    type DatePickerShortcut,
    DatePickerShortcutMenu,
    DateUtils,
    Errors,
    Months,
    TimePicker,
    TimePrecision,
} from "../..";
import { assertDayDisabled, assertDayHidden } from "../../common/dayPickerTestUtils";
import { loadDateFnsLocaleFake } from "../../common/loadDateFnsLocaleFake";

import { DatePicker, type DatePickerProps } from "./datePicker";
import type { DatePickerState } from "./datePickerState";

const LOCALE_LOADER: DatePickerProps = {
    dateFnsLocaleLoader: loadDateFnsLocaleFake,
};

describe("<DatePicker>", () => {
    let testsContainerElement: HTMLElement;
    let datePickerWrapper: ReactWrapper<DatePickerProps, DatePickerState>;

    beforeEach(() => {
        testsContainerElement = document.createElement("div");
        document.body.appendChild(testsContainerElement);
    });

    afterEach(() => {
        datePickerWrapper?.unmount();
        datePickerWrapper?.detach();
        testsContainerElement.remove();
    });

    it(`should render .${Classes.DATEPICKER}`, () => {
        expect(wrap(<DatePicker {...LOCALE_LOADER} />).root.find(`.${Classes.DATEPICKER}`)).toHaveLength(1);
    });

    it("should not select any day by default", () => {
        const { assertSelectedDays, root } = wrap(<DatePicker {...LOCALE_LOADER} />);
        assertSelectedDays();
        expect(root.state("selectedDay")).toBeNull();
    });

    it("should not highlight the current day by default", () => {
        const { root } = wrap(<DatePicker {...LOCALE_LOADER} />);
        expect(root.find(`.${Classes.DATEPICKER3_HIGHLIGHT_CURRENT_DAY}`)).toHaveLength(0);
    });

    it("current day should be highlighted when highlightCurrentDay={true}", () => {
        const { root } = wrap(<DatePicker {...LOCALE_LOADER} highlightCurrentDay={true} />);
        expect(root.find(`.${Classes.DATEPICKER3_HIGHLIGHT_CURRENT_DAY}`)).toHaveLength(1);
    });

    describe("reconciliates dayPickerProps", () => {
        it("should show outside days by default", () => {
            const defaultValue = new Date(2017, Months.SEPTEMBER, 1);
            const firstDayInView = new Date(2017, Months.AUGUST, 27, 12, 0);
            const { root } = wrap(<DatePicker {...LOCALE_LOADER} defaultValue={defaultValue} />);
            // TODO: refactor this to avoid knowing about react-day-picker's internal component names
            const firstDay = root.find(Day).first();
            assertDatesEqual(new Date(firstDay.prop("date")), firstDayInView);
        });

        it("should not show outside days if enableOutsideDays=false", () => {
            const defaultValue = new Date(2017, Months.SEPTEMBER, 1, 12);
            const { root } = wrap(
                <DatePicker
                    {...LOCALE_LOADER}
                    defaultValue={defaultValue}
                    dayPickerProps={{ showOutsideDays: false }}
                />,
            );
            const days = root.find(Day);

            assertDayHidden(days.at(0).getDOMNode<HTMLElement>());
            assertDayHidden(days.at(1).getDOMNode<HTMLElement>());
            assertDayHidden(days.at(2).getDOMNode<HTMLElement>());
            assertDayHidden(days.at(3).getDOMNode<HTMLElement>());
            assertDayHidden(days.at(4).getDOMNode<HTMLElement>());
            assertDayHidden(days.at(5).getDOMNode<HTMLElement>(), false);
        });

        it("should disable days according to custom modifiers in addition to default modifiers", () => {
            const defaultValue = new Date(2017, Months.SEPTEMBER, 1);
            const disableFridays = { dayOfWeek: [5] };
            const { getDay } = wrap(
                <DatePicker
                    {...LOCALE_LOADER}
                    defaultValue={defaultValue}
                    maxDate={new Date(2017, Months.SEPTEMBER, 20)}
                    dayPickerProps={{ disabled: disableFridays }}
                />,
            );
            assertDayDisabled(getDay(15).getDOMNode<HTMLElement>());
            assertDayDisabled(getDay(21).getDOMNode<HTMLElement>());
            assertDayDisabled(getDay(10).getDOMNode<HTMLElement>(), false);
        });

        it("should disable out-of-range max dates", () => {
            const defaultValue = new Date(2017, Months.SEPTEMBER, 1);
            const { getDay } = wrap(
                <DatePicker
                    {...LOCALE_LOADER}
                    defaultValue={defaultValue}
                    maxDate={new Date(2017, Months.SEPTEMBER, 20)}
                />,
            );
            assertDayDisabled(getDay(21).getDOMNode<HTMLElement>());
            assertDayDisabled(getDay(10).getDOMNode<HTMLElement>(), false);
        });

        it("should disable out-of-range min dates", () => {
            const defaultValue = new Date(2017, Months.SEPTEMBER, 1);
            const { getDay, clickPreviousMonth } = wrap(
                <DatePicker
                    {...LOCALE_LOADER}
                    defaultValue={defaultValue}
                    minDate={new Date(2017, Months.AUGUST, 20)}
                />,
            );
            clickPreviousMonth();
            assertDayDisabled(getDay(10).getDOMNode<HTMLElement>());
            assertDayDisabled(getDay(21).getDOMNode<HTMLElement>(), false);
        });

        describe("event handlers", () => {
            // use a date that lets us navigate forward and backward in the same year
            const defaultValue = new Date(2017, Months.SEPTEMBER, 1);

            it("should call onMonthChange on button next click", () => {
                const onMonthChange = vi.fn();
                const { root } = wrap(
                    <DatePicker {...LOCALE_LOADER} defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />,
                );
                root.find(`.${Classes.DATEPICKER3_NAV_BUTTON_NEXT}`).first().simulate("click");
                expect(onMonthChange).toHaveBeenCalled();
            });

            it("should call onMonthChange on button prev click", () => {
                const onMonthChange = vi.fn();
                const { root } = wrap(
                    <DatePicker {...LOCALE_LOADER} defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />,
                );
                root.find(`.${Classes.DATEPICKER3_NAV_BUTTON_PREVIOUS}`).first().simulate("click");
                expect(onMonthChange).toHaveBeenCalled();
            });

            it("should call onMonthChange on month select change", () => {
                const onMonthChange = vi.fn();
                const { root } = wrap(
                    <DatePicker {...LOCALE_LOADER} defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />,
                );
                root.find(`.${Classes.DATEPICKER_MONTH_SELECT}`).first().find("select").simulate("change");
                expect(onMonthChange).toHaveBeenCalled();
            });

            it("should call onMonthChange on year select change", () => {
                const onMonthChange = vi.fn();
                const { root } = wrap(
                    <DatePicker {...LOCALE_LOADER} defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />,
                );
                root.find(`.${Classes.DATEPICKER_YEAR_SELECT}`).first().find("select").simulate("change");
                expect(onMonthChange).toHaveBeenCalled();
            });

            it("should call onDayClick", () => {
                const onDayClick = vi.fn();
                const { getDay } = wrap(
                    <DatePicker {...LOCALE_LOADER} defaultValue={defaultValue} dayPickerProps={{ onDayClick }} />,
                );
                getDay().simulate("click");
                expect(onDayClick).toHaveBeenCalled();
            });
        });
    });

    it("should apply user-provided modifiers", () => {
        const ODD_CLASS = "test-odd";
        const oddifier = (d: Date) => d.getDate() % 2 === 1;
        const { getDay } = wrap(
            <DatePicker
                {...LOCALE_LOADER}
                dayPickerProps={{ modifiers: { odd: oddifier }, modifiersClassNames: { odd: ODD_CLASS } }}
            />,
        );

        expect(getDay(4).hasClass(ODD_CLASS)).toBe(false);
        expect(getDay(5).hasClass(ODD_CLASS)).toBe(true);
    });

    it("should render the actions bar when showActionsBar=true", () => {
        const { root } = wrap(<DatePicker {...LOCALE_LOADER} showActionsBar={true} />);
        expect(root.find({ className: Classes.DATEPICKER_FOOTER })).toHaveLength(1);
    });

    describe("initially displayed month", () => {
        it("should be defaultValue", () => {
            const defaultValue = new Date(2007, Months.APRIL, 4);
            const { root } = wrap(<DatePicker {...LOCALE_LOADER} defaultValue={defaultValue} />);
            expect(root.state("displayYear")).toBe(2007);
            expect(root.state("displayMonth")).toBe(Months.APRIL);
        });

        it("should be initialMonth if set (overrides defaultValue)", () => {
            const defaultValue = new Date(2007, Months.APRIL, 4);
            const initialMonth = new Date(2002, Months.MARCH, 1);
            const { root } = wrap(
                <DatePicker {...LOCALE_LOADER} defaultValue={defaultValue} initialMonth={initialMonth} />,
            );
            expect(root.state("displayYear")).toBe(2002);
            expect(root.state("displayMonth")).toBe(Months.MARCH);
        });

        it("should be value if set and initialMonth not set", () => {
            const value = new Date(2007, Months.APRIL, 4);
            const { root } = wrap(<DatePicker {...LOCALE_LOADER} value={value} />);
            expect(root.state("displayYear")).toBe(2007);
            expect(root.state("displayMonth")).toBe(Months.APRIL);
        });

        it("should be today if today is within date range", () => {
            const today = new Date();
            const { root } = wrap(<DatePicker {...LOCALE_LOADER} />);
            expect(root.state("displayYear")).toBe(today.getFullYear());
            expect(root.state("displayMonth")).toBe(today.getMonth());
        });

        it("should be a day between minDate and maxDate if today is not in range", () => {
            const maxDate = new Date(2005, Months.JANUARY);
            const minDate = new Date(2000, Months.JANUARY);
            const { root } = wrap(<DatePicker {...LOCALE_LOADER} maxDate={maxDate} minDate={minDate} />);
            expect(
                DateUtils.isDayInRange(new Date(root.state("displayYear"), root.state("displayMonth")), [
                    minDate,
                    maxDate,
                ]),
            ).toBe(true);
        });

        it("should set selectedDay to the day of the value", () => {
            const value = new Date(2007, Months.APRIL, 4);
            const { root } = wrap(<DatePicker {...LOCALE_LOADER} value={value} />);
            expect(root.state("selectedDay")).toBe(value.getDate());
        });

        it("should set selectedDay to the day of the defaultValue", () => {
            const defaultValue = new Date(2007, Months.APRIL, 4);
            const { root } = wrap(<DatePicker {...LOCALE_LOADER} defaultValue={defaultValue} />);
            expect(root.state("selectedDay")).toBe(defaultValue.getDate());
        });
    });

    describe("minDate/maxDate bounds", () => {
        const MIN_DATE = new Date(2015, Months.JANUARY, 7);
        const MAX_DATE = new Date(2015, Months.JANUARY, 12);

        describe("validation", () => {
            const consoleError = vi.spyOn(console, "error").mockImplementation(vi.fn());
            afterEach(() => consoleError.mockClear());
            afterAll(() => consoleError.mockRestore());

            it("should require maxDate to be later than minDate", () => {
                wrap(<DatePicker {...LOCALE_LOADER} maxDate={MIN_DATE} minDate={MAX_DATE} />);
                expect(consoleError).toHaveBeenCalledWith(Errors.DATEPICKER_MAX_DATE_INVALID);
            });

            it("should log an error if defaultValue is outside bounds", () => {
                wrap(
                    <DatePicker
                        {...LOCALE_LOADER}
                        defaultValue={new Date(2015, Months.JANUARY, 5)}
                        maxDate={MAX_DATE}
                        minDate={MIN_DATE}
                    />,
                );
                expect(consoleError).toHaveBeenCalledWith(Errors.DATEPICKER_DEFAULT_VALUE_INVALID);
            });

            it("should log an error if value is outside bounds", () => {
                wrap(
                    <DatePicker
                        {...LOCALE_LOADER}
                        value={new Date(2015, Months.JANUARY, 20)}
                        maxDate={MAX_DATE}
                        minDate={MIN_DATE}
                    />,
                );
                expect(consoleError).toHaveBeenCalledWith(Errors.DATEPICKER_VALUE_INVALID);
            });

            it("should log an error if initialMonth is outside month bounds", () => {
                wrap(
                    <DatePicker
                        {...LOCALE_LOADER}
                        initialMonth={new Date(2015, Months.FEBRUARY, 12)}
                        maxDate={MAX_DATE}
                        minDate={MIN_DATE}
                    />,
                );
                expect(consoleError).toHaveBeenCalledWith(Errors.DATEPICKER_INITIAL_MONTH_INVALID);
            });

            it("should not log an error if initialMonth is outside day bounds but inside month bounds", () => {
                wrap(
                    <DatePicker
                        {...LOCALE_LOADER}
                        initialMonth={new Date(2015, Months.JANUARY, 12)}
                        minDate={MIN_DATE}
                        maxDate={MAX_DATE}
                    />,
                );
                expect(consoleError).not.toHaveBeenCalled();
            });
        });

        describe("today button validation", () => {
            const today = new Date();
            const MIN_DATE_BEFORE_TODAY = MIN_DATE;
            const MAX_DATE_BEFORE_TODAY = MAX_DATE;

            const MIN_DATE_AFTER_TODAY = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
            const MAX_DATE_AFTER_TODAY = new Date(today.getFullYear() + 2, today.getMonth(), today.getDate());

            it("should have disabled button when min/max are before today", () => {
                const { getTodayButton } = wrap(
                    <DatePicker
                        {...LOCALE_LOADER}
                        minDate={MIN_DATE_BEFORE_TODAY}
                        maxDate={MAX_DATE_BEFORE_TODAY}
                        showActionsBar={true}
                    />,
                );

                expect(getTodayButton().props().disabled).toBe(true);
            });

            it("should have disabled button when min/max are after today", () => {
                const { getTodayButton } = wrap(
                    <DatePicker
                        {...LOCALE_LOADER}
                        minDate={MIN_DATE_AFTER_TODAY}
                        maxDate={MAX_DATE_AFTER_TODAY}
                        showActionsBar={true}
                    />,
                );

                expect(getTodayButton().props().disabled).toBe(true);
            });

            it("should have enabled button when today is within valid min/max", () => {
                const { getTodayButton } = wrap(
                    <DatePicker
                        {...LOCALE_LOADER}
                        minDate={MIN_DATE_BEFORE_TODAY}
                        maxDate={MAX_DATE_AFTER_TODAY}
                        showActionsBar={true}
                    />,
                );

                expect(getTodayButton().props().disabled).toBe(false);
            });
        });

        it("should only disable days outside bounds", () => {
            const minDate = new Date(2000, Months.JANUARY, 10);
            const { getDay } = wrap(<DatePicker {...LOCALE_LOADER} initialMonth={minDate} minDate={minDate} />);
            // 8 is before min date, 12 is after
            expect(getDay(8).hasClass(Classes.DATEPICKER3_DAY_DISABLED)).toBe(true);
            expect(getDay(12).hasClass(Classes.DATEPICKER3_DAY_DISABLED)).toBe(false);
        });

        it("should not fire onChange when a day outside of bounds is clicked", () => {
            const onChange = vi.fn();
            const { getDay } = wrap(
                <DatePicker {...LOCALE_LOADER} maxDate={MAX_DATE} minDate={MIN_DATE} onChange={onChange} />,
            );
            expect(onChange).not.toHaveBeenCalled();
            getDay(4).simulate("click");
            getDay(16).simulate("click");
            expect(onChange).not.toHaveBeenCalled();
            getDay(8).simulate("click");
            expect(onChange).toHaveBeenCalledOnce();
        });

        it("should constrain time picker when minDate is selected", () => {
            const { root } = wrap(
                <DatePicker
                    {...LOCALE_LOADER}
                    maxDate={MAX_DATE}
                    minDate={MIN_DATE}
                    timePrecision={TimePrecision.MINUTE}
                    value={MIN_DATE}
                />,
            );
            const timePicker = root.find(TimePicker).first();
            expect(timePicker.props().minTime).toBe(MIN_DATE);
        });

        it("should constrain time picker when max date is selected", () => {
            const { root } = wrap(
                <DatePicker
                    {...LOCALE_LOADER}
                    maxDate={MAX_DATE}
                    minDate={MIN_DATE}
                    timePrecision={TimePrecision.MINUTE}
                    value={MAX_DATE}
                />,
            );
            const timePicker = root.find(TimePicker).first();
            expect(timePicker.props().maxTime).toBe(MAX_DATE);
        });
    });

    describe("when controlled", () => {
        it("should initially select a day from value", () => {
            const value = new Date(2010, Months.JANUARY, 1);
            const { assertSelectedDays } = wrap(
                <DatePicker {...LOCALE_LOADER} defaultValue={new Date(2010, Months.FEBRUARY, 2)} value={value} />,
            );
            assertSelectedDays(value.getDate());
        });

        it("should not update selection automatically", () => {
            const { getDay, assertSelectedDays } = wrap(<DatePicker {...LOCALE_LOADER} value={null} />);
            assertSelectedDays();
            getDay().simulate("click");
            assertSelectedDays();
        });

        it("should not update selected day on current month view change", () => {
            const value = new Date(2010, Months.JANUARY, 2);
            const { assertSelectedDays, clickPreviousMonth, months, years } = wrap(
                <DatePicker {...LOCALE_LOADER} value={value} />,
            );
            clickPreviousMonth();

            assertSelectedDays(2);

            months.simulate("change", { target: { value: Months.JUNE } });
            assertSelectedDays();

            years.simulate("change", { target: { value: 2014 } });
            assertSelectedDays();
        });

        it("should fire onChange when a day is clicked", () => {
            const onChange = vi.fn();
            const { getDay } = wrap(<DatePicker {...LOCALE_LOADER} onChange={onChange} value={null} />);
            getDay().simulate("click");
            expect(onChange).toHaveBeenCalledOnce();
            expect(onChange.mock.calls[0][1]).toBe(true);
        });

        it("should fire onChange when month is changed", () => {
            const value = new Date(2010, Months.JANUARY, 2);
            const onChange = vi.fn();
            const { months, clickPreviousMonth } = wrap(
                <DatePicker {...LOCALE_LOADER} onChange={onChange} value={value} />,
            );

            clickPreviousMonth();
            expect(onChange).toHaveBeenCalledOnce();
            expect(onChange.mock.calls[0][1]).toBe(false);

            months.simulate("change", { target: { value: Months.JUNE } });
            expect(onChange).toHaveBeenCalledTimes(2);
            expect(onChange.mock.calls[1][1]).toBe(false);
        });

        it("should change displayed date with the dropdowns in the caption", () => {
            const { months, root, years } = wrap(
                <DatePicker {...LOCALE_LOADER} initialMonth={new Date(2015, Months.MARCH, 2)} value={null} />,
            );
            expect(root.state("displayMonth")).toBe(Months.MARCH);
            expect(root.state("displayYear")).toBe(2015);

            months.simulate("change", { target: { value: Months.JANUARY } });
            years.simulate("change", { target: { value: 2014 } });
            expect(root.state("displayMonth")).toBe(Months.JANUARY);
            expect(root.state("displayYear")).toBe(2014);
        });

        it("should fire onChange with correct values from shortcuts", () => {
            const today = new Date();
            const aWeekAgo = DateUtils.clone(today);
            aWeekAgo.setDate(today.getDate() - 6);
            const onChange = vi.fn();
            const { clickShortcut } = wrap(
                <DatePicker {...LOCALE_LOADER} onChange={onChange} value={today} shortcuts={true} />,
            );
            clickShortcut(2);

            expect(onChange).toHaveBeenCalledOnce();
            const value = onChange.mock.calls[0][0];
            expect(DateUtils.isSameDay(aWeekAgo, value)).toBe(true);
        });

        it("should display all shortcuts as inactive when none are selected", () => {
            const { root } = wrap(<DatePicker {...LOCALE_LOADER} shortcuts={true} />);

            expect(
                root.find(DatePickerShortcutMenu).find(Menu).find(MenuItem).find(`.${CoreClasses.ACTIVE}`).exists(),
            ).toBe(false);
        });

        it("should display corresponding shortcut as active when selected", () => {
            const selectedShortcut = 0;
            const { root } = wrap(
                <DatePicker {...LOCALE_LOADER} shortcuts={true} selectedShortcutIndex={selectedShortcut} />,
            );

            expect(
                root.find(DatePickerShortcutMenu).find(Menu).find(MenuItem).find(`.${CoreClasses.ACTIVE}`).exists(),
            ).toBe(true);

            expect(
                root.find(DatePickerShortcutMenu).find(Menu).find(MenuItem).find(`.${CoreClasses.ACTIVE}`),
            ).toHaveLength(1);

            expect(root.state("selectedShortcutIndex") === selectedShortcut).toBe(true);
        });

        it("should call onShortcutChangeSpy on selecting a shortcut ", () => {
            const selectedShortcut = 0;
            const onShortcutChangeSpy = vi.fn();
            const onChangeSpy = vi.fn();
            const { clickShortcut } = wrap(
                <DatePicker
                    {...LOCALE_LOADER}
                    onChange={onChangeSpy}
                    shortcuts={true}
                    onShortcutChange={onShortcutChangeSpy}
                />,
            );

            clickShortcut(selectedShortcut);

            expect(onChangeSpy).toHaveBeenCalledOnce();
            expect(onShortcutChangeSpy).toHaveBeenCalledOnce();
            expect(onShortcutChangeSpy.mock.calls[onShortcutChangeSpy.mock.calls.length - 1][0].label === "Today").toBe(
                true,
            );
            expect(
                onShortcutChangeSpy.mock.calls[onShortcutChangeSpy.mock.calls.length - 1][1] === selectedShortcut,
            ).toBe(true);
        });

        it("should select the correct values from custom shortcuts", () => {
            const date = new Date(2015, Months.JANUARY, 1);
            const onChangeSpy = vi.fn();
            const { clickShortcut, assertSelectedDays } = wrap(
                <DatePicker
                    {...LOCALE_LOADER}
                    onChange={onChangeSpy}
                    shortcuts={[{ date, label: "custom shortcut" }]}
                />,
            );
            clickShortcut();
            expect(onChangeSpy).toHaveBeenCalledOnce();
            const value = onChangeSpy.mock.calls[0][0];
            expect(DateUtils.isSameDay(date, value)).toBe(true);
            assertSelectedDays(date.getDate());
        });
    });

    describe("when uncontrolled", () => {
        it("should initially select a day from defaultValue", () => {
            const today = new Date();
            const { assertSelectedDays } = wrap(<DatePicker {...LOCALE_LOADER} defaultValue={today} />);
            assertSelectedDays(today.getDate());
        });

        it("should fire onChange when a day is clicked", () => {
            const onChange = vi.fn();
            const { getDay } = wrap(<DatePicker {...LOCALE_LOADER} onChange={onChange} />);
            expect(onChange).not.toHaveBeenCalled();
            getDay().simulate("click");
            expect(onChange).toHaveBeenCalledOnce();
        });

        it("should fire onChange when month is changed", () => {
            const onChange = vi.fn();
            // must use an initial month otherwise clicking next month in december will fail
            const { getDay, clickNextMonth } = wrap(
                <DatePicker {...LOCALE_LOADER} initialMonth={new Date(2015, Months.JANUARY, 12)} onChange={onChange} />,
            );
            expect(onChange).not.toHaveBeenCalled();
            getDay().simulate("click");
            expect(onChange).toHaveBeenCalledOnce();
            clickNextMonth();
            expect(onChange).toHaveBeenCalledTimes(2);
        });

        it("should automatically update selected day", () => {
            const { assertSelectedDays, getDay } = wrap(<DatePicker {...LOCALE_LOADER} />);
            assertSelectedDays();
            getDay(3).simulate("click");
            assertSelectedDays(3);
        });

        it("should preserve selected day when selections are changed", () => {
            const initialMonth = new Date(2015, Months.JULY, 1);
            const { assertSelectedDays, getDay, months } = wrap(
                <DatePicker {...LOCALE_LOADER} initialMonth={initialMonth} />,
            );
            getDay(31).simulate("click");
            months.simulate("change", { target: { value: Months.AUGUST } });
            assertSelectedDays(31);
        });

        it("should change selected day if necessary when selections are changed", () => {
            const initialMonth = new Date(2015, Months.JULY, 1);
            const { assertSelectedDays, getDay, clickPreviousMonth } = wrap(
                <DatePicker {...LOCALE_LOADER} initialMonth={initialMonth} />,
            );
            getDay(31).simulate("click");
            clickPreviousMonth();
            assertSelectedDays(30);
            // remembers actual date that was clicked and restores if possible
            clickPreviousMonth();
            assertSelectedDays(31);
        });

        it("should change selected day to minDate or maxDate if selections are changed outside bounds", () => {
            const initialMonth = new Date(2015, Months.JULY, 1);
            const minDate = new Date(2015, Months.MARCH, 13);
            const maxDate = new Date(2015, Months.NOVEMBER, 21);
            const { assertSelectedDays, getDay, months } = wrap(
                <DatePicker {...LOCALE_LOADER} initialMonth={initialMonth} minDate={minDate} maxDate={maxDate} />,
            );

            getDay(1).simulate("click");
            months.simulate("change", { target: { value: Months.MARCH } });
            assertSelectedDays(minDate.getDate());

            getDay(25).simulate("click");
            months.simulate("change", { target: { value: Months.NOVEMBER } });
            assertSelectedDays(maxDate.getDate());
        });

        it("should change displayed date with the dropdowns in the caption", () => {
            const { months, root, years } = wrap(
                <DatePicker {...LOCALE_LOADER} initialMonth={new Date(2015, Months.MARCH, 2)} />,
            );
            expect(root.state("displayMonth")).toBe(Months.MARCH);
            expect(root.state("displayYear")).toBe(2015);

            months.simulate("change", { target: { value: Months.JANUARY } });
            years.simulate("change", { target: { value: 2014 } });
            expect(root.state("displayMonth")).toBe(Months.JANUARY);
            expect(root.state("displayYear")).toBe(2014);
        });

        it("should select values from shortcuts", () => {
            const { root, clickShortcut } = wrap(<DatePicker {...LOCALE_LOADER} shortcuts={true} />);
            clickShortcut(2);

            const today = new Date();
            const aWeekAgo = DateUtils.clone(today);
            aWeekAgo.setDate(today.getDate() - 6);

            const value = root.state("value");
            expect(DateUtils.isSameDay(aWeekAgo, value!)).toBe(true);
        });

        it("should select the correct values from custom shortcuts", () => {
            const date = new Date(2010, Months.JANUARY, 10);
            const { clickShortcut, assertSelectedDays } = wrap(
                <DatePicker {...LOCALE_LOADER} shortcuts={[{ date, label: "custom shortcut" }]} />,
            );
            clickShortcut();
            assertSelectedDays(date.getDate());
        });
    });

    describe("time selection", () => {
        const defaultValue = new Date(2012, 2, 5, 6, 5, 40);

        it("should show a TimePicker when timePrecision is set", () => {
            const { root } = wrap(<DatePicker {...LOCALE_LOADER} />);
            expect(root.find(TimePicker).exists()).toBe(false);
            root.setProps({ timePrecision: "minute" });
            expect(root.find(TimePicker).exists()).toBe(true);
        });

        it("should show a TimePicker when timePickerProps is set", () => {
            const { root } = wrap(<DatePicker {...LOCALE_LOADER} timePickerProps={{}} />);
            expect(root.find(TimePicker).exists()).toBe(true);
        });

        it("should fire onChange when the time is changed", () => {
            const onChangeSpy = vi.fn();
            const { root } = wrap(
                <DatePicker
                    {...LOCALE_LOADER}
                    defaultValue={defaultValue}
                    onChange={onChangeSpy}
                    timePickerProps={{ showArrowButtons: true }}
                />,
            );
            expect(onChangeSpy).not.toHaveBeenCalled();
            root.find(`.${Classes.TIMEPICKER_ARROW_BUTTON}.${Classes.TIMEPICKER_HOUR}`).first().simulate("click");
            expect(onChangeSpy).toHaveBeenCalledOnce();
            const cbHour = onChangeSpy.mock.calls[0][0].getHours();
            expect(cbHour).toBe(defaultValue.getHours() + 1);
        });

        it("should not change time when changing date", () => {
            const onChangeSpy = vi.fn();
            wrap(
                <DatePicker
                    {...LOCALE_LOADER}
                    defaultValue={defaultValue}
                    onChange={onChangeSpy}
                    timePrecision="minute"
                />,
            )
                .getDay(16)
                .simulate("click");
            expect(DateUtils.isSameTime(onChangeSpy.mock.calls[0][0] as Date, defaultValue)).toBe(true);
        });

        it("should not change date when changing time", () => {
            const onChangeSpy = vi.fn();
            const { setTimeInput } = wrap(
                <DatePicker
                    {...LOCALE_LOADER}
                    defaultValue={defaultValue}
                    onChange={onChangeSpy}
                    timePrecision="minute"
                />,
            );
            setTimeInput("minute", 45);
            expect(DateUtils.isSameDay(onChangeSpy.mock.calls[0][0] as Date, defaultValue)).toBe(true);
        });

        it("should use today when changing time without date", () => {
            const onChangeSpy = vi.fn();
            // no date set via props
            const { setTimeInput } = wrap(
                <DatePicker {...LOCALE_LOADER} onChange={onChangeSpy} timePrecision="minute" />,
            );
            setTimeInput("minute", 45);
            expect(DateUtils.isSameDay(onChangeSpy.mock.calls[0][0] as Date, new Date())).toBe(true);
        });

        it("should change time when clicking a shortcut with includeTime=true", () => {
            const onChangeSpy = vi.fn();
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
                <DatePicker
                    {...LOCALE_LOADER}
                    defaultValue={defaultValue}
                    onChange={onChangeSpy}
                    timePrecision="minute"
                    shortcuts={shortcuts}
                />,
            );
            clickShortcut();
            expect(onChangeSpy.mock.calls[0][0] as Date).toBe(date);
        });
    });

    describe("clearing a selection", () => {
        const MOCK_TODAY = new Date("2020-12-24T15:45:00Z");
        beforeEach(() => {
            vi.useFakeTimers();
            vi.setSystemTime(MOCK_TODAY);
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it("should correctly pass a Date and never null in onChange when canClearSelection is false", () => {
            const onChange = vi.fn();
            const { getDay } = wrap(<DatePicker {...LOCALE_LOADER} canClearSelection={false} onChange={onChange} />);
            getDay().simulate("click");
            expect(onChange.mock.calls[0][0]).not.toBeNull();
            getDay().simulate("click");
            expect(onChange.mock.calls[1][0]).not.toBeNull();
        });

        it("should correctly pass a Date or null in onChange when canClearSelection is true", () => {
            const onChange = vi.fn();
            const { getDay } = wrap(<DatePicker {...LOCALE_LOADER} canClearSelection={true} onChange={onChange} />);
            getDay().simulate("click");
            expect(onChange.mock.calls[0][0]).not.toBeNull();
            getDay().simulate("click");
            expect(onChange.mock.calls[1][0]).toBeNull();
        });

        it("should disable Clear button when canClearSelection is false", () => {
            const { getClearButton } = wrap(
                <DatePicker {...LOCALE_LOADER} canClearSelection={false} showActionsBar={true} />,
            );
            expect(getClearButton().props().disabled).toBe(true);
        });

        it("should enable Clear button when canClearSelection is true", () => {
            const { getClearButton } = wrap(
                <DatePicker {...LOCALE_LOADER} canClearSelection={true} showActionsBar={true} />,
            );
            expect(getClearButton().props().disabled).toBe(false);
        });

        it("should select the current day when Today is clicked", () => {
            const { root } = wrap(<DatePicker {...LOCALE_LOADER} showActionsBar={true} />);
            root.find({ className: Classes.DATEPICKER_FOOTER }).find(Button).first().simulate("click");

            const today = new Date();
            const value = root.state("value");
            expect(value).not.toBeNull();
            expect(value!.getDate()).toBe(today.getDate());
            expect(value!.getMonth()).toBe(today.getMonth());
            expect(value!.getFullYear()).toBe(today.getFullYear());
        });

        it("should select the current day in the given timezone when Today is clicked", () => {
            const { root } = wrap(<DatePicker {...LOCALE_LOADER} showActionsBar={true} timezone="Asia/Tokyo" />);
            root.find({ className: Classes.DATEPICKER_FOOTER }).find(Button).first().simulate("click");

            const value = root.state("value")!;
            expect(value).not.toBeNull();
            // Asia/Tokyo is UTC+9, so 2020-12-24T15:45:00Z becomes 2020-12-25T00:45:00 in Tokyo
            expect(value.getDate()).toBe(MOCK_TODAY.getDate() + 1);
            expect(value.getMonth()).toBe(MOCK_TODAY.getMonth());
            expect(value.getFullYear()).toBe(MOCK_TODAY.getFullYear());
            expect(value.getHours()).toBe(0);
            expect(value.getMinutes()).toBe(45);
        });

        it("should clear the value when Clear is clicked", () => {
            const { getDay, root } = wrap(<DatePicker {...LOCALE_LOADER} showActionsBar={true} />);
            getDay().simulate("click");
            root.find({ className: Classes.DATEPICKER_FOOTER }).find(Button).last().simulate("click");
            expect(root.state("value")).toBeNull();
        });
    });

    describe("localization", () => {
        it("should accept a statically-loaded date-fns locale and not try to load it again", () => {
            const stub = vi.fn().mockImplementation(loadDateFnsLocaleFake);
            wrap(<DatePicker dateFnsLocaleLoader={stub} locale={enUSLocale} />);
            expect(stub).not.toHaveBeenCalled();
        });
    });

    function wrap(datepicker: React.JSX.Element) {
        const wrapper = mount<DatePickerProps, DatePickerState>(datepicker, { attachTo: testsContainerElement });
        datePickerWrapper = wrapper;
        return {
            /** Asserts that the given days are selected. No arguments asserts that selection is empty. */
            assertSelectedDays: (...days: number[]) => {
                const selectedDays = wrapper
                    .find(`.${Classes.DATEPICKER3_DAY_SELECTED}`)
                    .hostNodes()
                    .map(d => +d.text());
                expect(selectedDays.sort()).toEqual([...days].sort());
            },
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
