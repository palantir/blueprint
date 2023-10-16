/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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

import { Position } from "../../common";

export const PopoverPosition = {
    ...Position,
    AUTO: "auto" as "auto",
    AUTO_END: "auto-end" as "auto-end",
    AUTO_START: "auto-start" as "auto-start",
};
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PopoverPosition = (typeof PopoverPosition)[keyof typeof PopoverPosition];
