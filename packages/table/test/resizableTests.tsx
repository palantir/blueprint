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

import { fireEvent, render } from "@testing-library/react";
import { expect } from "chai";
import { mount } from "enzyme";
import { Component } from "react";
import sinon from "sinon";

import * as Classes from "../src/common/classes";
import { Resizable, type ResizableProps, type ResizeableState } from "../src/interactions/resizable";
import { Orientation } from "../src/interactions/resizeHandle";

import { ElementHarness } from "./harness";

interface ResizableDivProps {
    resizeHandle?: React.JSX.Element;
    style?: React.CSSProperties;
}

class ResizableDiv extends Component<ResizableDivProps> {
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
    it("is externally controllable", () => {
        const onSizeChanged = sinon.spy();
        const onResizeEnd = sinon.spy();
        const onLayoutLock = sinon.spy();

        const wrapper = mount<ResizableProps, ResizeableState>(
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

        wrapper.setProps({ size: 120 });

        expect(wrapper.state().size).to.eq(120);
    });

    it("renders at the specified size", () => {
        const onSizeChanged = sinon.spy();
        const onResizeEnd = sinon.spy();
        const onLayoutLock = sinon.spy();

        const { container } = render(
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
        const resizable = new ElementHarness(container);

        expect(resizable.find(".resizable-div").bounds()!.width).to.equal(100);
        expect(onLayoutLock.called).to.be.false;
        expect(onSizeChanged.called).to.be.false;
        expect(onResizeEnd.called).to.be.false;
    });

    it("renders a draggable resize handle", () => {
        const onDoubleClick = sinon.spy();
        const onLayoutLock = sinon.spy();
        const onResizeEnd = sinon.spy();
        const onSizeChanged = sinon.spy();

        const { container } = render(
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
        const target = container.querySelector(`.${Classes.TABLE_RESIZE_HANDLE_TARGET}`);
        expect(target).to.exist;

        // drag resize handle to the right by 10 pixels
        fireEvent.mouseDown(target!);
        fireEvent.mouseMove(target!, { clientX: 10 });
        fireEvent.mouseUp(target!, { clientX: 10 });

        expect(onLayoutLock.called).to.be.true;
        expect(onLayoutLock.lastCall.args[0]).to.be.false;
        expect(onSizeChanged.called).to.be.true;
        expect(onResizeEnd.called).to.be.true;
        expect(onDoubleClick.called).to.be.false;
        expect(container.querySelector(".resizable-div")!.getBoundingClientRect().width).to.equal(110);

        onDoubleClick.resetHistory();
        onLayoutLock.resetHistory();
        onResizeEnd.resetHistory();
        onSizeChanged.resetHistory();

        // double click the resize handle
        fireEvent.mouseDown(target!);
        fireEvent.mouseUp(target!, { clientX: 10 });
        fireEvent.mouseDown(target!);
        fireEvent.mouseUp(target!, { clientX: 10 });

        expect(onLayoutLock.called).to.be.true;
        expect(onSizeChanged.called).to.be.false;
        expect(onResizeEnd.called).to.be.false;
        expect(onDoubleClick.called).to.be.true;
    });
});
