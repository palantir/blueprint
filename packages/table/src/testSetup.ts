/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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

/**
 * jsdom workarounds for @blueprintjs/table tests.
 *
 * 1. HTMLCanvasElement.getContext("2d") returns null in jsdom — mock it so
 *    Utils.measureElementTextContent doesn't throw.
 * 2. navigator.clipboard may not exist in jsdom — provide a stub.
 */

HTMLCanvasElement.prototype.getContext = (() => ({
    font: "",
    measureText: () => ({ width: 0 }),
})) as unknown as typeof HTMLCanvasElement.prototype.getContext;

Object.defineProperty(navigator, "clipboard", {
    value: {
        readText: () => Promise.resolve(""),
        writeText: () => Promise.resolve(),
    },
    writable: true,
});
