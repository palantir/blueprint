/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { getDateNextMonth, getDatePreviousMonth } from "./dateUtils";

export class DisplayMonth {
    private date: Date;

    constructor (month?: number, year?: number) {
        if (month !== null && year !== null) {
            this.date = new Date(year, month);
        } else {
            this.date = new Date();
        }
    }

    public clone(): DisplayMonth {
        return new DisplayMonth(this.getMonth(), this.getYear());
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

    public getPreviousMonth(): DisplayMonth {
        const previousMonth = getDatePreviousMonth(this.date);
        return new DisplayMonth(previousMonth.getFullYear(), previousMonth.getMonth());
    }

    public getNextMonth(): DisplayMonth {
        const nextMonth = getDateNextMonth(this.date);
        return new DisplayMonth(nextMonth.getFullYear(), nextMonth.getMonth());
    }

    public isBefore(displayMonth: DisplayMonth): boolean {
        return compareDisplayMonth(this, displayMonth) > 0;
    }

    public isAfter(displayMonth: DisplayMonth): boolean {
        return compareDisplayMonth(this, displayMonth) < 0;
    }

    public isSame(displayMonth: DisplayMonth): boolean {
        return compareDisplayMonth(this, displayMonth) === 0;
    }
}

// returns 1 if left < right
// returns -1 if left > right
// returns 0 if left === right
function compareDisplayMonth(firstDisplayMonth: DisplayMonth, secondDisplayMonth: DisplayMonth): number {
    const firstMonth = firstDisplayMonth.getMonth();
    const firstYear = firstDisplayMonth.getYear();
    const secondMonth = secondDisplayMonth.getMonth();
    const secondYear = secondDisplayMonth.getYear();

    if (firstYear < secondYear) {
        return 1;
    }

    if (firstYear > secondYear) {
        return -1;
    }

    if (firstYear === secondYear) {
        if (firstMonth < secondMonth) {
            return 1;
        }

        if (firstMonth > secondMonth) {
            return -1;
        }
    }

    return 0;
}
