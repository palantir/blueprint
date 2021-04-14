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

import { assert } from "chai";
import { mount, ReactWrapper } from "enzyme";
import React from "react";
import { spy } from "sinon";

import { ResizeSensorProps, ResizeSensor } from "../../src/components/resize-sensor/resizeSensor";

describe("<ResizeSensor>", () => {
    // this scope variable is assigned in mountResizeSensor() and used in resize()
    let wrapper: ReactWrapper<ResizeTesterProps, any> | undefined;
    const testsContainerElement = document.createElement("div");
    document.documentElement.appendChild(testsContainerElement);

    afterEach(() => {
        // clean up wrapper after each test, if it was used
        wrapper?.unmount();
        wrapper?.detach();
    });
    after(() => testsContainerElement.remove());

    it("onResize is called when size changes", async () => {
        const onResize = spy();
        mountResizeSensor(onResize);
        await resize({ width: 200 });
        await resize({ height: 100 });
        await resize({ width: 55 });
        assert.equal(onResize.callCount, 3);
        assertResizeArgs(onResize, ["200x0", "200x100", "55x100"]);
    });

    it("onResize is NOT called redundantly when size is unchanged", async () => {
        const onResize = spy();
        mountResizeSensor(onResize);
        await resize({ width: 200 });
        await resize({ width: 200 }); // this one should be ignored
        assert.equal(onResize.callCount, 1);
        assertResizeArgs(onResize, ["200x0"]);
    });

    it("onResize is called when element changes", async () => {
        const onResize = spy();
        mountResizeSensor(onResize);
        await resize({ width: 200, id: 1 });
        await resize({ width: 200, id: 2 }); // not ignored bc element recreated
        await resize({ width: 55, id: 3 });
        assertResizeArgs(onResize, ["200x0", "200x0", "55x0"]);
    });

    it("onResize can be changed", async () => {
        const onResize1 = spy();
        mountResizeSensor(onResize1);
        await resize({ width: 200, id: 1 });

        const onResize2 = spy();
        wrapper!.setProps({ onResize: onResize2 });
        await resize({ height: 100, id: 2 });
        await resize({ width: 55, id: 3 });

        assert.equal(onResize1.callCount, 1, "first callback should have been called exactly once");
        assert.equal(onResize2.callCount, 2, "second callback should have been called exactly twice");
    });

    function mountResizeSensor(onResize: ResizeSensorProps["onResize"]) {
        return (wrapper = mount<ResizeTesterProps>(
            <ResizeTester id={0} onResize={onResize} />,
            // must be in the DOM for measurement
            { attachTo: testsContainerElement },
        ));
    }

    function resize(size: SizeProps) {
        wrapper!.setProps(size);
        return new Promise(resolve => setTimeout(resolve, 30));
    }

    function assertResizeArgs(onResize: sinon.SinonSpy, sizes: string[]) {
        assert.sameMembers(
            onResize.args
                .map(args => (args[0] as ResizeObserverEntry[])[0].contentRect)
                .map(r => `${r.width}x${r.height}`),
            sizes,
        );
    }
});

interface SizeProps {
    /** Used as React `key`, so changing it will force a new element to be created. */
    id?: number;
    width?: number;
    height?: number;
}

type ResizeTesterProps = Omit<ResizeSensorProps, "children"> & SizeProps;
const ResizeTester: React.FC<ResizeTesterProps> = ({ id, width, height, ...sensorProps }) => (
    <ResizeSensor {...sensorProps}>
        <div key={id} style={{ width, height }} />
    </ResizeSensor>
);
