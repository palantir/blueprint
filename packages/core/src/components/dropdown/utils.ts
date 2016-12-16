/*
 * TODO: move these elsewherej
 */

export function findIndex<T>(array: T[], value: T): number {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === value) {
            return i;
        }
    }
    return -1;
}

export function findIndexByPredicate<T>(array: T[], predicate: (val: T) => boolean): number {
    for (let i = 0; i < array.length; i++) {
        if (predicate(array[i])) {
            return i;
        }
    }
    return -1;
}
