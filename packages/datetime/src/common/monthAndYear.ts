/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { getDateNextMonth, getDatePreviousMonth } from "./dateUtils";

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

    public isSameMonth(monthAndYear: MonthAndYear): boolean {
        return this.getMonth() === monthAndYear.getMonth();
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
