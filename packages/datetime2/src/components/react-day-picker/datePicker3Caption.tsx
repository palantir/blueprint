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

import classNames from "classnames";
import * as React from "react";
import { CaptionLabel, type CaptionProps, useDayPicker, useNavigation } from "react-day-picker";
import innerText from "react-innertext";

import { Button, DISPLAYNAME_PREFIX, HTMLSelect, type OptionProps } from "@blueprintjs/core";
import { DateUtils, Months } from "@blueprintjs/datetime";
import { ChevronLeft, ChevronRight } from "@blueprintjs/icons";

import { DatePicker3CaptionClasses as CaptionClasses, ReactDayPickerClasses } from "../../classes";
import { useMonthSelectRightOffset } from "../../common/useMonthSelectRightOffset";
import { DatePicker3Context } from "../date-picker3/datePicker3Context";

/**
 * Custom react-day-picker caption component used in non-contiguous two-month date range pickers.
 *
 * We need to override the whole caption instead of its lower-level components because react-day-picker
 * does not have built-in support for non-contiguous range pickers.
 *
 * @see https://react-day-picker.js.org/guides/custom-components
 */
export const DatePicker3Caption: React.FC<CaptionProps> = props => {
    const { classNames: rdpClassNames, formatters, fromDate, toDate, labels } = useDayPicker();
    const { locale, reverseMonthAndYearMenus } = React.useContext(DatePicker3Context);

    // non-null assertion because we define these values in defaultProps
    const minYear = fromDate!.getFullYear();
    const maxYear = toDate!.getFullYear();

    const displayMonth = props.displayMonth.getMonth();
    const displayYear = props.displayMonth.getFullYear();

    const containerElement = React.useRef<HTMLDivElement>(null);
    const monthSelectElement = React.useRef<HTMLSelectElement>(null);
    const { currentMonth, goToMonth, nextMonth, previousMonth } = useNavigation();

    const handlePreviousClick = React.useCallback(
        () => previousMonth && goToMonth(previousMonth),
        [previousMonth, goToMonth],
    );
    const handleNextClick = React.useCallback(() => nextMonth && goToMonth(nextMonth), [nextMonth, goToMonth]);

    const prevButton = (
        <Button
            aria-label={labels.labelPrevious(previousMonth, { locale })}
            className={classNames(
                CaptionClasses.DATEPICKER3_NAV_BUTTON,
                CaptionClasses.DATEPICKER3_NAV_BUTTON_PREVIOUS,
            )}
            disabled={!previousMonth}
            icon={<ChevronLeft />}
            minimal={true}
            onClick={handlePreviousClick}
        />
    );
    const nextButton = (
        <Button
            aria-label={labels.labelNext(nextMonth, { locale })}
            className={classNames(CaptionClasses.DATEPICKER3_NAV_BUTTON, CaptionClasses.DATEPICKER3_NAV_BUTTON_NEXT)}
            disabled={!nextMonth}
            icon={<ChevronRight />}
            minimal={true}
            onClick={handleNextClick}
        />
    );

    // build the list of available years, relying on react-day-picker's default date-fns formatter or a
    // user-provided formatter to localize the year "names"
    const { formatYearCaption } = formatters;
    const allYearOptions = React.useMemo<OptionProps[]>(() => {
        const years: OptionProps[] = [];
        for (let year = minYear; year <= maxYear; year++) {
            const yearDate = new Date(year, 0);
            const yearCaption = formatYearCaption(yearDate, { locale });
            years.push({ label: innerText(yearCaption), value: year });
        }
        return years;
    }, [formatYearCaption, maxYear, minYear, locale]);

    // allow out-of-bounds years but disable the option.
    // this handles the Dec 2016 case in https://github.com/palantir/blueprint/issues/391
    if (displayYear > maxYear) {
        const displayYearDate = new Date(displayYear, 0);
        const displayYearCaption = formatYearCaption(displayYearDate, { locale });
        allYearOptions.push({ label: innerText(displayYearCaption), value: displayYear, disabled: true });
    }

    const handleMonthSelectChange = React.useCallback(
        (e: React.FormEvent<HTMLSelectElement>) => {
            const newMonth = parseInt((e.target as HTMLSelectElement).value, 10);
            // ignore change events with invalid values to prevent crash on iOS Safari (#4178)
            if (isNaN(newMonth)) {
                return;
            }
            const newDate = DateUtils.clone(currentMonth);
            newDate.setMonth(newMonth);
            goToMonth(newDate);
        },
        [currentMonth, goToMonth],
    );

    const startMonth = displayYear === minYear ? fromDate!.getMonth() : 0;
    const endMonth = displayYear === maxYear ? toDate!.getMonth() + 1 : 12;

    // build the list of available months, relying on react-day-picker's default date-fns formatter or a
    // user-provided formatter to localize the month names
    const { formatMonthCaption } = formatters;
    const allMonths = React.useMemo<string[]>(() => {
        const months: string[] = [];
        for (let i = Months.JANUARY; i <= Months.DECEMBER; i++) {
            const monthDate = new Date(displayYear, i);
            const formattedMonth = formatMonthCaption(monthDate, { locale });
            months.push(innerText(formattedMonth));
        }
        return months;
    }, [displayYear, formatMonthCaption, locale]);
    const allMonthOptions = allMonths.map<OptionProps>((month, i) => ({ label: month, value: i }));
    const availableMonthOptions = allMonthOptions.slice(startMonth, endMonth);
    const displayedMonthText = allMonths[displayMonth];

    const monthSelectRightOffset = useMonthSelectRightOffset(monthSelectElement, containerElement, displayedMonthText);
    const monthSelect = (
        <HTMLSelect
            aria-label={labels.labelMonthDropdown()}
            iconProps={{ style: { right: monthSelectRightOffset } }}
            className={classNames(CaptionClasses.DATEPICKER3_DROPDOWN_MONTH, rdpClassNames.dropdown_month)}
            key="month"
            minimal={true}
            onChange={handleMonthSelectChange}
            ref={monthSelectElement}
            value={displayMonth}
            options={availableMonthOptions}
        />
    );

    const handleYearSelectChange = React.useCallback(
        (e: React.FormEvent<HTMLSelectElement>) => {
            const newYear = parseInt((e.target as HTMLSelectElement).value, 10);
            // ignore change events with invalid values to prevent crash on iOS Safari (#4178)
            if (isNaN(newYear)) {
                return;
            }
            const newDate = DateUtils.clone(currentMonth);
            newDate.setFullYear(newYear);
            goToMonth(newDate);
        },
        [currentMonth, goToMonth],
    );

    const yearSelect = (
        <HTMLSelect
            aria-label={labels.labelYearDropdown()}
            className={classNames(CaptionClasses.DATEPICKER3_DROPDOWN_YEAR, rdpClassNames.dropdown_year)}
            key="year"
            minimal={true}
            onChange={handleYearSelectChange}
            value={displayYear}
            options={allYearOptions}
        />
    );

    const orderedSelects = reverseMonthAndYearMenus ? [yearSelect, monthSelect] : [monthSelect, yearSelect];

    const hiddenCaptionLabel = (
        <div className={ReactDayPickerClasses.RDP_VHIDDEN}>
            <CaptionLabel displayMonth={props.displayMonth} id={props.id} />
        </div>
    );

    return (
        <div className={classNames(CaptionClasses.DATEPICKER3_CAPTION, rdpClassNames.caption)} ref={containerElement}>
            {hiddenCaptionLabel}
            {prevButton}
            {orderedSelects}
            {nextButton}
        </div>
    );
};
DatePicker3Caption.displayName = `${DISPLAYNAME_PREFIX}.DatePicker3Caption`;
