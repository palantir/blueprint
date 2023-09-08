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
import { CaptionProps, useDayPicker, useNavigation } from "react-day-picker";

import { Button, DISPLAYNAME_PREFIX, Divider, HTMLSelect, OptionProps } from "@blueprintjs/core";
import { DateUtils } from "@blueprintjs/datetime";
import { ChevronLeft, ChevronRight } from "@blueprintjs/icons";

import { Classes } from "../../classes";
import { DatePicker3Context } from "../date-picker3/datePicker3Context";
import { useMonthSelectRightOffset } from "../../common/useMonthSelectRightOffset";

interface DatePicker3CaptionProps extends CaptionProps {
    hideNextButton?: boolean;
    hidePrevButton?: boolean;
}

const DatePicker3Caption: React.FC<DatePicker3CaptionProps> = props => {
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
            className={classNames(Classes.DATEPICKER_NAV_BUTTON, Classes.DATEPICKER_NAV_BUTTON_PREVIOUS)}
            disabled={!previousMonth}
            icon={<ChevronLeft />}
            minimal={true}
            onClick={handlePreviousClick}
        />
    );
    const nextButton = (
        <Button
            aria-label={labels.labelNext(nextMonth, { locale })}
            className={classNames(Classes.DATEPICKER_NAV_BUTTON, Classes.DATEPICKER_NAV_BUTTON_NEXT)}
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

    // build the list of available months (limiting based on minDate and maxDate) and localize their full names
    const monthsToDisplay = React.useMemo<string[]>(() => {
        const months: string[] = [];
        for (let i = startMonth; i < endMonth; i++) {
            months.push(format(new Date(displayYear, i), "MMMM", { locale }));
        }
        return months;
    }, [displayYear, endMonth, startMonth, locale]);

    const monthOptionElements = monthsToDisplay
        .map<OptionProps>((month, i) => ({ label: month, value: i }))
        .slice(startMonth, endMonth);
    const displayedMonthText = monthsToDisplay[displayMonth];

    const monthSelectRightOffset = useMonthSelectRightOffset(monthSelectElement, containerElement, displayedMonthText);
    const monthSelect = (
        <HTMLSelect
            aria-label={labels.labelMonthDropdown()}
            iconProps={{ style: { right: monthSelectRightOffset } }}
            className={classNames(Classes.DATEPICKER_MONTH_SELECT, rdpClassNames.dropdown_month)}
            key="month"
            minimal={true}
            onChange={handleMonthSelectChange}
            ref={monthSelectElement}
            value={displayMonth}
            options={monthOptionElements}
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
            className={classNames(Classes.DATEPICKER_YEAR_SELECT, rdpClassNames.dropdown_year)}
            key="year"
            minimal={true}
            onChange={handleYearSelectChange}
            value={displayYear}
            options={years}
        />
    );

    const orderedSelects = reverseMonthAndYearMenus ? [yearSelect, monthSelect] : [monthSelect, yearSelect];

    return (
        <>
            <div className={classNames(Classes.DATEPICKER_CAPTION, rdpClassNames.caption)} ref={containerElement}>
                {prevButton}
                {orderedSelects}
                {nextButton}
            </div>
            <Divider />
        </>
    );
};
DatePicker3Caption.defaultProps = {
    hideNextButton: false,
    hidePrevButton: false,
};
DatePicker3Caption.displayName = `${DISPLAYNAME_PREFIX}.DatePicker3Caption`;

/**
 * Custom react-day-picker caption component for a single-month datepicker.
 *
 * @see https://react-day-picker.js.org/guides/custom-components
 */
export function SingleDatePickerCaption(props: CaptionProps) {
    return <DatePicker3Caption {...props} />;
}

/**
 * Custom react-day-picker caption component for the left calendar in a non-contiguous two-month datepicker.
 *
 * @see https://react-day-picker.js.org/guides/custom-components
 */
export function LeftDatePickerCaption(props: CaptionProps) {
    return <DatePicker3Caption {...props} hideNextButton={true} />;
}

/**
 * Custom react-day-picker caption component for the right calendar in a non-contiguous two-month datepicker.
 *
 * @see https://react-day-picker.js.org/guides/custom-components
 */
export function RightDatePickerCaption(props: CaptionProps) {
    return <DatePicker3Caption {...props} hidePrevButton={true} />;
}
