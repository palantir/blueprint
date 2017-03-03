/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { getDateNextMonth, getDatePreviousMonth } from "./dateUtils";

export class MonthAndYear {
    private date: Date;

    constructor (month?: number, year?: number) {
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
        const previousMonthDate = getDatePreviousMonth(this.date);
        return new MonthAndYear(previousMonthDate.getMonth(), previousMonthDate.getFullYear());
    }

    public getNextMonth(): MonthAndYear {
        const nextMonthDate = getDateNextMonth(this.date);
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
