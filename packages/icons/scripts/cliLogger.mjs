/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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

// @ts-check

const ANSI = {
    blue: "\u001B[34m",
    bold: "\u001B[1m",
    green: "\u001B[32m",
    red: "\u001B[31m",
    reset: "\u001B[0m",
    yellow: "\u001B[33m",
};

function shouldUseColor() {
    if (process.env.NO_COLOR != null) {
        return false;
    }
    if (process.env.FORCE_COLOR === "0") {
        return false;
    }
    return process.stdout.isTTY === true;
}

/**
 * @param {string} text
 * @param {string} color
 */
function colorize(text, color) {
    if (!shouldUseColor()) {
        return text;
    }
    return `${ANSI.bold}${color}${text}${ANSI.reset}`;
}

/**
 * @param {string} scope
 */
export function createCliLogger(scope) {
    const prefix = `[${scope}]`;
    return {
        error(message) {
            console.error(`${colorize("✗", ANSI.red)} ${prefix} ${message}`);
        },
        header(message) {
            console.info(`${colorize(prefix, ANSI.blue)} ${colorize(message, ANSI.blue)}`);
        },
        info(message) {
            console.info(`${prefix} ${message}`);
        },
        item(message) {
            console.info(`  • ${message}`);
        },
        success(message) {
            console.info(`${colorize("✓", ANSI.green)} ${prefix} ${message}`);
        },
        warn(message) {
            console.warn(`${colorize("!", ANSI.yellow)} ${prefix} ${message}`);
        },
    };
}
