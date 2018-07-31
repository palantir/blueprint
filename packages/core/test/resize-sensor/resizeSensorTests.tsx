/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
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
        // clean up list after each test, if it was used
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
        await resize({ height: 100 });
        await resize({ width: 55 });
        assert.equal(onResize.callCount, 3);
        assertResizeArgs(onResize, ["200x0", "200x100", "55x100"]);
    });

    it("onResize is called when size changes", async () => {
        const onResize = spy();
        mountResizeSensor(onResize);
        await resize({ width: 200, id: 1 });
        await resize({ height: 100, id: 2 });
        await resize({ width: 55, id: 3 });
        assertResizeArgs(onResize, ["200x0", "200x100", "55x100"]);
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
