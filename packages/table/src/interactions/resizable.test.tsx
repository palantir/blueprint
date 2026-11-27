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
import { mount } from "enzyme";
import { Component } from "react";
import sinon from "sinon";

import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import * as Classes from "../common/classes";
import { ElementHarness } from "../harness";

import { Resizable, type ResizableProps, type ResizeableState } from "./resizable";
import { Orientation } from "./resizeHandle";

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
                isKeyboardResizable={true}
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
                isKeyboardResizable={true}
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

        expect((resizable.find(".resizable-div").element as HTMLElement).style.width).to.equal("100px");
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
                isKeyboardResizable={true}
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
        expect((container.querySelector(".resizable-div")! as HTMLElement).style.width).to.equal("110px");

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

    describe("keyboard resizing", () => {
        it("exposes the handle as a focusable separator", () => {
            const { getByRole } = renderKeyboardResizable({ maxSize: 200, minSize: 50 });
            const handle = getByRole("separator", { name: "Resize column Title" });
            expect(handle.tabIndex).to.equal(0);
            expect(handle.getAttribute("aria-orientation")).to.equal("vertical");
            expect(handle.getAttribute("aria-valuenow")).to.equal("100");
            expect(handle.getAttribute("aria-valuemin")).to.equal("50");
            expect(handle.getAttribute("aria-valuemax")).to.equal("200");
        });

        it("resizes a column handle by 10px with ArrowLeft and ArrowRight, and ignores ArrowUp and ArrowDown", () => {
            const { getByRole, onResizeEnd } = renderKeyboardResizable();
            const handle = getByRole("separator");
            fireEvent.keyDown(handle, { key: "ArrowLeft" });
            fireEvent.keyDown(handle, { key: "ArrowRight" });
            fireEvent.keyDown(handle, { key: "ArrowUp" });
            fireEvent.keyDown(handle, { key: "ArrowDown" });
            expect(onResizeEnd.args).to.deep.equal([[90], [100]]);
        });

        it("resizes a row handle by 10px with ArrowUp and ArrowDown, and ignores ArrowLeft and ArrowRight", () => {
            const { getByRole, onResizeEnd } = renderKeyboardResizable({ orientation: Orientation.HORIZONTAL });
            const handle = getByRole("separator");
            expect(handle.getAttribute("aria-orientation")).to.equal("horizontal");
            fireEvent.keyDown(handle, { key: "ArrowDown" });
            fireEvent.keyDown(handle, { key: "ArrowUp" });
            fireEvent.keyDown(handle, { key: "ArrowLeft" });
            fireEvent.keyDown(handle, { key: "ArrowRight" });
            expect(onResizeEnd.args).to.deep.equal([[110], [100]]);
        });

        it("stops at the minimum and maximum sizes", () => {
            const { getByRole, onResizeEnd } = renderKeyboardResizable({ maxSize: 110, minSize: 100, size: 105 });
            const handle = getByRole("separator");
            fireEvent.keyDown(handle, { key: "ArrowLeft" }); // 95, stopped at 100
            fireEvent.keyDown(handle, { key: "ArrowRight" }); // 110
            fireEvent.keyDown(handle, { key: "ArrowRight" }); // 120, stopped at 110
            expect(onResizeEnd.args).to.deep.equal([[100], [110], [110]]);
        });

        /** Renders a 100px column-style (vertical) resizable whose handle is keyboard operable. */
        function renderKeyboardResizable({
            orientation = Orientation.VERTICAL,
            size = 100,
            ...props
        }: {
            maxSize?: number;
            minSize?: number;
            orientation?: Orientation;
            size?: number;
        } = {}) {
            const onResizeEnd = sinon.spy();
            const result = render(
                <Resizable
                    isKeyboardResizable={true}
                    onLayoutLock={sinon.spy()}
                    onResizeEnd={onResizeEnd}
                    orientation={orientation}
                    resizeHandleAriaLabel="Resize column Title"
                    size={size}
                    {...props}
                >
                    <ResizableDiv />
                </Resizable>,
            );
            return { ...result, onResizeEnd };
        }
    });
});
