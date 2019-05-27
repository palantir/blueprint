/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import * as fs from "fs";
import * as moment from "moment-timezone";
import { ITimezoneStaticMap } from "../src/data/timezoneStaticMetadata";

/**
 * Get a list of all timezone items.
 * @param date the date to use when determining timezone offsets
 */
function getAllTimezoneMetadata(): ITimezoneStaticMap {
    return moment.tz.names().reduce<ITimezoneStaticMap>((mapInProgress, timezone) => {
        const zone = moment.tz.zone(timezone);
        const { population } = zone;
        mapInProgress[timezone] = { population };
        return mapInProgress;
    }, {});
}

function writeAllTimezoneMetadataToFile(path: string) {
    const allTimezoneMetadata = getAllTimezoneMetadata();
    const allTimezoneMetadataString = `export default ${JSON.stringify(allTimezoneMetadata)}`;
    fs.writeFileSync(path, allTimezoneMetadataString, { encoding: "utf8" });
}

const filePath = process.argv[2];
if (filePath == null) {
    console.error("Have to provide a path for the generated timezone metadata file.");
    process.exit(1);
}
writeAllTimezoneMetadataToFile(filePath);
