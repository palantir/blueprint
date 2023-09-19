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
import { format } from "date-fns";
import * as React from "react";
import { CaptionLabel, CaptionProps, useDayPicker, useNavigation } from "react-day-picker";

import { Button, DISPLAYNAME_PREFIX, Divider, HTMLSelect, OptionProps } from "@blueprintjs/core";
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
    const { classNames: rdpClassNames, fromDate, toDate, labels } = useDayPicker();
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

    const years: Array<number | OptionProps> = [minYear];
    for (let year = minYear + 1; year <= maxYear; ++year) {
        years.push(year);
    }
    // allow out-of-bounds years but disable the option. this handles the Dec 2016 case in #391.
    if (displayYear > maxYear) {
        years.push({ value: displayYear, disabled: true });
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

    // build the list of available months and localize their full names
    const allMonths = React.useMemo<string[]>(() => {
        const months: string[] = [];
        for (let i = Months.JANUARY; i <= Months.DECEMBER; i++) {
            months.push(format(new Date(displayYear, i), "LLLL", { locale }));
        }
        return months;
    }, [displayYear, locale]);
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
            options={years}
        />
    );

    const orderedSelects = reverseMonthAndYearMenus ? [yearSelect, monthSelect] : [monthSelect, yearSelect];

    const hiddenCaptionLabel = (
        <div className={ReactDayPickerClasses.RDP_VHIDDEN}>
            <CaptionLabel displayMonth={props.displayMonth} id={props.id} />
        </div>
    );

    return (
        <>
            <div
                className={classNames(CaptionClasses.DATEPICKER3_CAPTION, rdpClassNames.caption)}
                ref={containerElement}
            >
                {hiddenCaptionLabel}
                {prevButton}
                {orderedSelects}
                {nextButton}
            </div>
            <Divider />
        </>
    );
};
DatePicker3Caption.displayName = `${DISPLAYNAME_PREFIX}.DatePicker3Caption`;
