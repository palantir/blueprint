/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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
 * Browser tests for ResizeSensor.
 *
 * These tests require a real browser environment with working ResizeObserver
 * and DOM measurements. They run in Chromium via Playwright.
 */

import { createRef } from "react";
import { render } from "vitest-browser-react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ResizeSensor, type ResizeSensorProps } from "../../src/components/resize-sensor/resizeSensor";

describe("<ResizeSensor> browser tests", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("onResize is called when size changes", async () => {
        const onResize = vi.fn();
        const { getByTestId, rerender } = render(
            <ResizeTester onResize={onResize} width={100} height={50} />,
        );

        // Wait for initial ResizeObserver callback
        await vi.waitFor(() => {
            expect(onResize).toHaveBeenCalled();
        });

        onResize.mockClear();

        // Change width
        rerender(<ResizeTester onResize={onResize} width={200} height={50} />);

        await vi.waitFor(() => {
            expect(onResize).toHaveBeenCalled();
        });

        const entries = onResize.mock.calls[0][0] as ResizeObserverEntry[];
        expect(entries[0].contentRect.width).toBe(200);
    });

    it("onResize is NOT called redundantly when size is unchanged", async () => {
        const onResize = vi.fn();
        const { rerender } = render(
            <ResizeTester onResize={onResize} width={100} height={50} />,
        );

        // Wait for initial callback
        await vi.waitFor(() => {
            expect(onResize).toHaveBeenCalled();
        });

        onResize.mockClear();

        // Re-render with same dimensions
        rerender(<ResizeTester onResize={onResize} width={100} height={50} />);

        // Wait a bit to ensure no extra calls happen
        await new Promise(resolve => setTimeout(resolve, 100));

        expect(onResize).not.toHaveBeenCalled();
    });

    it("still works when user sets their own targetRef", async () => {
        const onResize = vi.fn();
        const targetRef = createRef<HTMLDivElement>();

        render(
            <ResizeSensor onResize={onResize} targetRef={targetRef}>
                <div
                    data-testid="target"
                    ref={targetRef}
                    style={{ width: 150, height: 75 }}
                />
            </ResizeSensor>,
        );

        await vi.waitFor(() => {
            expect(onResize).toHaveBeenCalled();
        });

        expect(targetRef.current).toBeInstanceOf(HTMLDivElement);
        expect(targetRef.current?.clientWidth).toBe(150);
    });
});

// Test helper component
interface ResizeTesterProps extends Omit<ResizeSensorProps, "children"> {
    width?: number;
    height?: number;
}

function ResizeTester({ width = 100, height = 100, ...sensorProps }: ResizeTesterProps) {
    return (
        <ResizeSensor {...sensorProps}>
            <div
                data-testid="resize-target"
                style={{ width, height, backgroundColor: "lightblue" }}
            />
        </ResizeSensor>
    );
}
