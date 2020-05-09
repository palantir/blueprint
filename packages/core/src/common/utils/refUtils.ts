export interface IRefObject<T> {
    readonly current: T | null;
}

export type IRefCallback<T> = (ref: T | null) => any;

export function getRef<T>(ref: T | IRefObject<T>) {
    if (
        ref &&
        (ref as IRefObject<T>).current
    ) {
        return (ref as IRefObject<T>).current;
    }

    return ref as T;
}
