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

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { IconPaths } from "../iconTypes";

import type { IconsNext as IconsNextClass } from "./iconLoaderNext";
import type { IconNextName } from "./iconNextNames";

describe("IconsNext", () => {
    let IconsNext: typeof IconsNextClass;

    beforeEach(async () => {
        // IconsNext intentionally stores its loader and cache globally. Give each test an isolated
        // module instance so test loaders and cached paths cannot leak between cases.
        vi.resetModules();
        ({ IconsNext } = await import("./iconLoaderNext"));
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllEnvs();
    });

    it("rejects invalid runtime names without starting any loads", async () => {
        const loader = vi.fn();
        IconsNext.setLoaderOptions({ loader });

        await expect(IconsNext.load(["anchor", "not-an-icon"] as unknown as IconNextName[])).rejects.toThrow(
            "[Blueprint] Unknown next icon 'not-an-icon'",
        );
        expect(loader).not.toHaveBeenCalled();
    });

    it("propagates loader failures without logging them", async () => {
        const loadError = new Error("loader failed");
        const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
        IconsNext.setLoaderOptions({ loader: vi.fn().mockRejectedValue(loadError) });

        await expect(IconsNext.load("anchor")).rejects.toBe(loadError);
        expect(consoleError).not.toHaveBeenCalled();
    });

    it("caches successfully loaded paths", async () => {
        const paths: IconPaths = ["M0 0h16v16H0z"];
        const loader = vi.fn().mockResolvedValue(paths);
        IconsNext.setLoaderOptions({ loader });

        await IconsNext.load("anchor");
        await IconsNext.load("anchor");

        expect(loader).toHaveBeenCalledOnce();
        expect(loader).toHaveBeenCalledWith("anchor", "outlined");
        expect(IconsNext.getPaths("anchor")).toBe(paths);
    });

    it("falls back to outlined and warns only once for each unavailable filled variant", async () => {
        const paths: IconPaths = ["M0 0h16v16H0z"];
        const loader = vi.fn().mockResolvedValue(paths);
        const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
        IconsNext.setLoaderOptions({ loader });

        await IconsNext.load("anchor", "filled");
        expect(IconsNext.getPaths("anchor", "filled")).toBe(paths);
        await IconsNext.load("anchor", "filled");

        expect(loader).toHaveBeenCalledOnce();
        expect(loader).toHaveBeenCalledWith("anchor", "outlined");
        expect(consoleWarn).toHaveBeenCalledOnce();
        expect(consoleWarn).toHaveBeenCalledWith(
            '[Blueprint] Icon "anchor" does not have a filled variant. Falling back to outlined.',
        );
    });

    it("loads available filled variants without warning", async () => {
        const loader = vi.fn().mockResolvedValue(["M0 0h16v16H0z"]);
        const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
        IconsNext.setLoaderOptions({ loader });

        await IconsNext.load("airplane", "filled");

        expect(loader).toHaveBeenCalledWith("airplane", "filled");
        expect(consoleWarn).not.toHaveBeenCalled();
    });

    it("does not warn about filled fallbacks in production", async () => {
        vi.stubEnv("NODE_ENV", "production");
        const loader = vi.fn().mockResolvedValue(["M0 0h16v16H0z"]);
        const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
        IconsNext.setLoaderOptions({ loader });

        await IconsNext.load("anchor", "filled");

        expect(loader).toHaveBeenCalledWith("anchor", "outlined");
        expect(consoleWarn).not.toHaveBeenCalled();
    });

    it("rejects loadAll when the configured loader fails", async () => {
        const loadError = new Error("loader failed");
        IconsNext.setLoaderOptions({ loader: vi.fn().mockRejectedValue(loadError) });

        await expect(IconsNext.loadAll()).rejects.toBe(loadError);
    });
});
