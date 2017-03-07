
import { padWithZeroes } from "../../src/common/utils";

/**
 * Converts a date to a "YYYY-MM-DD" string without relying on moment.js.
 */
export function toHyphenatedDateString(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 0-indexed => 1-indexed
    const day = date.getDate();
    return [
        year.toString(),
        padWithZeroes(month.toString(), 2),
        padWithZeroes(day.toString(), 2),
    ].join("-");
}
