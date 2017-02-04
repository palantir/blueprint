/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Months } from "./months";

export class DisplayMonth {
    private date: Date;

    constructor (month: number, year: number) {
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
        const [year, month] = getPreviousMonth([this.date.getFullYear(), this.date.getMonth()]);
        return new DisplayMonth(year, month);
    }

    public getNextMonth(): DisplayMonth {
        const [year, month] = getNextMonth([this.date.getFullYear(), this.date.getMonth()]);
        return new DisplayMonth(year, month);
    }

    public isBefore(displayMonth: DisplayMonth): boolean {
        return compareDisplayMonth(this, displayMonth) === 1;
    }

    public isAfter(displayMonth: DisplayMonth): boolean {
        return compareDisplayMonth(this, displayMonth) === -1;
    }

    public isSame(displayMonth: DisplayMonth): boolean {
        return compareDisplayMonth(this, displayMonth) === 0;
    }
}

type MonthAndYear = [number, number];

function getNextMonth([month, year]: MonthAndYear): MonthAndYear {
    return month === Months.DECEMBER ? [Months.JANUARY, year + 1] : [month + 1, year];
}

function getPreviousMonth([month, year]: MonthAndYear): MonthAndYear {
  return month === Months.JANUARY ? [Months.DECEMBER, year - 1] : [month - 1, year];
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
