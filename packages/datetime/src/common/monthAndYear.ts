/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

/* tslint:disable:no-submodule-imports */
import * as addMonths from "date-fns/add_months";
import * as subtractMonths from "date-fns/sub_months";
/* tslint:enable:no-submodule-imports */

export class MonthAndYear {
    public static fromDate(date: Date) {
        return date == null ? undefined : new MonthAndYear(date.getMonth(), date.getFullYear());
    }

    private date: Date;

    constructor(month?: number, year?: number) {
        if (month !== null && year !== null) {
            this.date = new Date(year, month);
        } else {
            this.date = new Date();
        }
    }

    public clone(): MonthAndYear {
        return new MonthAndYear(this.getMonth(), this.getYear());
    }

    public getFullDate(): Date {
        return this.date;
    }

    public getMonth(): number {
        return this.date.getMonth();
    }

    public getYear(): number {
        return this.date.getFullYear();
    }

    public getPreviousMonth(): MonthAndYear {
        const previousMonthDate = subtractMonths(this.date, 1);
        return new MonthAndYear(previousMonthDate.getMonth(), previousMonthDate.getFullYear());
    }

    public getNextMonth(): MonthAndYear {
        const nextMonthDate = addMonths(this.date, 1);
        return new MonthAndYear(nextMonthDate.getMonth(), nextMonthDate.getFullYear());
    }

    public isBefore(monthAndYear: MonthAndYear): boolean {
        return compareMonthAndYear(this, monthAndYear) < 0;
    }

    public isAfter(monthAndYear: MonthAndYear): boolean {
        return compareMonthAndYear(this, monthAndYear) > 0;
    }

    public isSame(monthAndYear: MonthAndYear): boolean {
        return compareMonthAndYear(this, monthAndYear) === 0;
    }
}

// returns negative if left < right
// returns positive if left > right
// returns 0 if left === right
function compareMonthAndYear(firstMonthAndYear: MonthAndYear, secondMonthAndYear: MonthAndYear): number {
    const firstMonth = firstMonthAndYear.getMonth();
    const firstYear = firstMonthAndYear.getYear();
    const secondMonth = secondMonthAndYear.getMonth();
    const secondYear = secondMonthAndYear.getYear();

    if (firstYear === secondYear) {
        return firstMonth - secondMonth;
    } else {
        return firstYear - secondYear;
    }
}
