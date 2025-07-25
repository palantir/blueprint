/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { DatePickerUtils } from "../date-picker/datePickerUtils";

export const MIN_DATE = DatePickerUtils.getDefaultMinDate();
export const MAX_DATE = DatePickerUtils.getDefaultMaxDate();

export const INVALID_DATE_MESSAGE = "Invalid date";
export const OUT_OF_RANGE_MESSAGE = "Out of range";

export const INVALID_DATE = new Date(undefined!);
