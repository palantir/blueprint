/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import * as React from "react";
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

        const target = resizable.find(".bp-table-resize-handle-target");
        expect(target.element).to.exist;

        // drag resize handle to the right by 10 pixels
        target.mouse("mousemove")
            .mouse("mousedown")
            .mouse("mousemove", 10)
            .mouse("mouseup", 10);

        expect(onLayoutLock.called).to.be.true;
        expect(onLayoutLock.lastCall.args[0]).to.be.false;
        expect(onSizeChanged.called).to.be.true;
        expect(onResizeEnd.called).to.be.true;
        expect(onDoubleClick.called).to.be.false;
        expect(resizable.find(".resizable-div").bounds().width).to.equal(110);

        onDoubleClick.reset();
        onLayoutLock.reset();
        onResizeEnd.reset();
        onSizeChanged.reset();

        // double click the resize handle
        target.mouse("mousemove")
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
