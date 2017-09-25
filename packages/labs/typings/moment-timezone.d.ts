// Augmented type definitions for moment-timezone
// http://www.typescriptlang.org/docs/handbook/declaration-merging.html

// Need to re-export in order for the types to work out.
// Copied from https://github.com/DefinitelyTyped/DefinitelyTyped/blob/354cec620daccfa0ad167ba046651fb5fef69e8a/types/moment-timezone/index.d.ts#L6-L9
import * as moment from 'moment';
export = moment;

declare module "moment" {
    interface MomentZone {
        // TODO: Remove once the official typings include the population field.
        // https://github.com/DefinitelyTyped/DefinitelyTyped/pull/19947
        population: number;
    }
}
