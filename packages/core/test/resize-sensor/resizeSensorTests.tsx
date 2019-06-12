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
import * as React from "react";
import { spy } from "sinon";

import { IResizeSensorProps, ResizeSensor } from "../../src/components/resize-sensor/resizeSensor";

describe("<ResizeSensor>", () => {
    // this scope variable is assigned in mountResizeSensor() and used in resize()
    let wrapper: ReactWrapper<IResizeTesterProps, any> | undefined;
    const testsContainerElement = document.createElement("div");
    document.documentElement.appendChild(testsContainerElement);

    afterEach(() => {
        // clean up wrapper after each test, if it was used
        if (wrapper !== undefined) {
            wrapper.unmount();
            wrapper.detach();
            wrapper = undefined;
        }
    });
    after(() => testsContainerElement.remove());

    it("onResize is called when size changes", async () => {
        const onResize = spy();
        mountResizeSensor(onResize);
        await resize({ width: 200 });
        await resize({ width: 200 }); // this one is ignored
        await resize({ height: 100 });
        await resize({ width: 55 });
        assert.equal(onResize.callCount, 3);
        assertResizeArgs(onResize, ["200x0", "200x100", "55x100"]);
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
        wrapper.setProps({ onResize: onResize2 });
        await resize({ height: 100, id: 2 });
        await resize({ width: 55, id: 3 });

        assert.equal(onResize1.callCount, 1);
        assert.equal(onResize2.callCount, 2);
    });

    function mountResizeSensor(onResize: IResizeSensorProps["onResize"]) {
        return (wrapper = mount<IResizeTesterProps>(
            <ResizeTester onResize={onResize} />,
            // must be in the DOM for measurement
            { attachTo: testsContainerElement },
        ));
    }

    function resize(size: ISizeProps) {
        wrapper.setProps(size);
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

interface ISizeProps {
    /** Used as React `key`, so changing it will force a new element to be created. */
    id?: number;
    width?: number;
    height?: number;
}

type IResizeTesterProps = IResizeSensorProps & ISizeProps;
const ResizeTester: React.SFC<IResizeTesterProps> = ({ id, width, height, ...resizeProps }) => (
    <ResizeSensor {...resizeProps}>
        <div key={id} style={{ width, height }} />
    </ResizeSensor>
);
