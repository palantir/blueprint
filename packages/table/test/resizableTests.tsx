/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { expect } from "chai";
import * as React from "react";
import * as sinon from "sinon";

import * as Classes from "../src/common/classes";
import { Resizable } from "../src/interactions/resizable";
import { Orientation, ResizeHandle } from "../src/interactions/resizeHandle";
import { ReactHarness } from "./harness";

interface IResizableDivProps {
    resizeHandle?: ResizeHandle;
    style?: React.CSSProperties;
}

class ResizableDiv extends React.Component<IResizableDivProps, {}> {
    public render() {
        const { style } = this.props;
        return (
            <div className="resizable-div" style={style}>
                Yo
                {this.props.resizeHandle}
            </div>
        );
    }
}

describe("Resizable", () => {
    const harness = new ReactHarness();

    afterEach(() => {
        harness.unmount();
    });

    after(() => {
        harness.destroy();
    });

    it("renders at the specified size", () => {
        const onSizeChanged = sinon.spy();
        const onResizeEnd = sinon.spy();
        const onLayoutLock = sinon.spy();

        const resizable = harness.mount(
            <Resizable
                maxSize={150}
                minSize={50}
                size={100}
                orientation={Orientation.VERTICAL}
                onLayoutLock={onLayoutLock}
                onSizeChanged={onSizeChanged}
                onResizeEnd={onResizeEnd}
            >
                <ResizableDiv />
            </Resizable>,
        );

        expect(resizable.find(".resizable-div").bounds().width).to.equal(100);
        expect(onLayoutLock.called).to.be.false;
        expect(onSizeChanged.called).to.be.false;
        expect(onResizeEnd.called).to.be.false;
    });

    it("renders a draggable resize handle", () => {
        const onDoubleClick = sinon.spy();
        const onLayoutLock = sinon.spy();
        const onResizeEnd = sinon.spy();
        const onSizeChanged = sinon.spy();

        const resizable = harness.mount(
            <Resizable
                maxSize={150}
                minSize={50}
                onDoubleClick={onDoubleClick}
                onLayoutLock={onLayoutLock}
                onResizeEnd={onResizeEnd}
                onSizeChanged={onSizeChanged}
                orientation={Orientation.VERTICAL}
                size={100}
            >
                <ResizableDiv />
            </Resizable>,
        );

        const target = resizable.find(`.${Classes.TABLE_RESIZE_HANDLE_TARGET}`);
        expect(target.element).to.exist;

        // drag resize handle to the right by 10 pixels
        target
            .mouse("mousemove")
            .mouse("mousedown")
            .mouse("mousemove", 10)
            .mouse("mouseup", 10);

        expect(onLayoutLock.called).to.be.true;
        expect(onLayoutLock.lastCall.args[0]).to.be.false;
        expect(onSizeChanged.called).to.be.true;
        expect(onResizeEnd.called).to.be.true;
        expect(onDoubleClick.called).to.be.false;
        expect(resizable.find(".resizable-div").bounds().width).to.equal(110);

        onDoubleClick.resetHistory();
        onLayoutLock.resetHistory();
        onResizeEnd.resetHistory();
        onSizeChanged.resetHistory();

        // double click the resize handle
        target
            .mouse("mousemove")
            .mouse("mousedown")
            .mouse("mouseup", 10)
            .mouse("mousedown")
            .mouse("mouseup", 10);

        expect(onLayoutLock.called).to.be.true;
        expect(onSizeChanged.called).to.be.false;
        expect(onResizeEnd.called).to.be.false;
        expect(onDoubleClick.called).to.be.true;
    });
});
