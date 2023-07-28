/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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
import { mount } from "enzyme";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { TextArea } from "../../src";

describe("<TextArea>", () => {
    let containerElement: HTMLElement | undefined;

    beforeEach(() => {
        containerElement = document.createElement("div");
        containerElement.setAttribute("style", "width: 1000px; height: 1000px;");
        document.body.appendChild(containerElement);
    });

    afterEach(() => {
        ReactDOM.unmountComponentAtNode(containerElement!);
        containerElement!.remove();
    });

    it("No manual resizes when autoResize enabled", () => {
        const wrapper = mount(<TextArea autoResize={true} />, { attachTo: containerElement });
        const textarea = wrapper.find("textarea");

        textarea.simulate("change", { target: { scrollHeight: 500 } });

        assert.notEqual(textarea.getDOMNode<HTMLElement>().style.height, "500px");
    });

    it("resizes with large initial input when autoResize enabled", () => {
        const initialValue = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Aenean finibus eget enim non accumsan.
        Nunc lobortis luctus magna eleifend consectetur.
        Suspendisse ut semper sem, quis efficitur felis.
        Praesent suscipit nunc non semper tempor.
        Sed eros sapien, semper sed imperdiet sed,
        dictum eget purus. Donec porta accumsan pretium.
        Fusce at felis mattis, tincidunt erat non, varius erat.`;
        const wrapper = mount(<TextArea value={initialValue} autoResize={true} />, { attachTo: containerElement });
        const textarea = wrapper.find("textarea");

        const scrollHeightInPixels = `${textarea.getDOMNode<HTMLElement>().scrollHeight}px`;

        assert.equal(textarea.getDOMNode<HTMLElement>().style.height, scrollHeightInPixels);
    });

    it("resizes with long text input when autoResize enabled", () => {
        const initialValue = "A";
        const nextValue = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Aenean finibus eget enim non accumsan.
        Nunc lobortis luctus magna eleifend consectetur.
        Suspendisse ut semper sem, quis efficitur felis.
        Praesent suscipit nunc non semper tempor.
        Sed eros sapien, semper sed imperdiet sed,
        dictum eget purus. Donec porta accumsan pretium.
        Fusce at felis mattis, tincidunt erat non, varius erat.`;
        const wrapper = mount(<TextArea value={initialValue} autoResize={true} />, { attachTo: containerElement });
        const textarea = wrapper.find("textarea");

        const scrollHeightInPixelsBefore = `${textarea.getDOMNode<HTMLElement>().scrollHeight}px`;
        wrapper.setProps({ value: nextValue }).update();
        const scrollHeightInPixelsAfter = `${textarea.getDOMNode<HTMLElement>().scrollHeight}px`;

        assert.notEqual(scrollHeightInPixelsBefore, scrollHeightInPixelsAfter);
    });

    // HACKHACK: skipped test, see https://github.com/palantir/blueprint/issues/5976
    // Note that growVertically is deprecated as of 28/07/2023
    it.skip("can resize automatically", () => {
        const wrapper = mount(<TextArea growVertically={true} />, { attachTo: containerElement });
        const textarea = wrapper.find("textarea");

        textarea.simulate("change", { target: { scrollHeight: 500 } });

        assert.equal(textarea.getDOMNode<HTMLElement>().style.height, "500px");
    });

    it("doesn't resize by default", () => {
        const wrapper = mount(<TextArea />, { attachTo: containerElement });
        const textarea = wrapper.find("textarea");

        textarea.simulate("change", {
            target: {
                scrollHeight: textarea.getDOMNode().scrollHeight,
            },
        });

        assert.equal(textarea.getDOMNode<HTMLElement>().style.height, "");
    });

    it("doesn't clobber user-supplied styles", () => {
        const wrapper = mount(<TextArea autoResize={true} style={{ marginTop: 10 }} />, {
            attachTo: containerElement,
        });
        const textarea = wrapper.find("textarea");

        textarea.simulate("change", { target: { scrollHeight: 500 } });

        assert.equal(textarea.getDOMNode<HTMLElement>().style.marginTop, "10px");
    });

    // HACKHACK: skipped test, see https://github.com/palantir/blueprint/issues/5976
    // Note that growVertically is deprecated as of 28/07/2023
    it.skip("can fit large initial content", () => {
        const initialValue = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Aenean finibus eget enim non accumsan.
        Nunc lobortis luctus magna eleifend consectetur.
        Suspendisse ut semper sem, quis efficitur felis.
        Praesent suscipit nunc non semper tempor.
        Sed eros sapien, semper sed imperdiet sed,
        dictum eget purus. Donec porta accumsan pretium.
        Fusce at felis mattis, tincidunt erat non, varius erat.`;
        const wrapper = mount(<TextArea growVertically={true} value={initialValue} style={{ marginTop: 10 }} />, {
            attachTo: containerElement,
        });
        const textarea = wrapper.find("textarea");
        const scrollHeightInPixels = `${textarea.getDOMNode<HTMLElement>().scrollHeight}px`;
        assert.equal(textarea.getDOMNode<HTMLElement>().style.height, scrollHeightInPixels);
    });

    it("updates on ref change", () => {
        let textArea: HTMLTextAreaElement | null = null;
        let textAreaNew: HTMLTextAreaElement | null = null;
        let callCount = 0;
        let newCallCount = 0;
        const textAreaRefCallback = (ref: HTMLTextAreaElement | null) => {
            callCount += 1;
            textArea = ref;
        };
        const textAreaNewRefCallback = (ref: HTMLTextAreaElement | null) => {
            newCallCount += 1;
            textAreaNew = ref;
        };

        const textAreawrapper = mount(<TextArea inputRef={textAreaRefCallback} />, { attachTo: containerElement });
        assert.instanceOf(textArea, HTMLTextAreaElement);
        assert.strictEqual(callCount, 1);

        textAreawrapper.setProps({ inputRef: textAreaNewRefCallback });
        textAreawrapper.update();
        assert.strictEqual(callCount, 2);
        assert.isNull(textArea);
        assert.strictEqual(newCallCount, 1);
        assert.instanceOf(textAreaNew, HTMLTextAreaElement);
    });

    it("accepts object refs created with React.createRef and updates on change", () => {
        const textAreaRef = React.createRef<HTMLTextAreaElement>();
        const textAreaNewRef = React.createRef<HTMLTextAreaElement>();

        const textAreawrapper = mount(<TextArea inputRef={textAreaRef} />, { attachTo: containerElement });
        assert.instanceOf(textAreaRef.current, HTMLTextAreaElement);

        textAreawrapper.setProps({ inputRef: textAreaNewRef });
        assert.isNull(textAreaRef.current);
        assert.instanceOf(textAreaNewRef.current, HTMLTextAreaElement);
    });

    // HACKHACK: skipped test, see https://github.com/palantir/blueprint/issues/5976
    // Note that growVertically is deprecated as of 28/07/2023
    it.skip("resizes when props change if growVertically is true", () => {
        const initialText = "A";
        const longText = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
        const wrapper = mount(<TextArea growVertically={true} value={initialText} />, { attachTo: containerElement });
        const initialHeight = wrapper.find("textarea").getDOMNode<HTMLElement>().style.height;
        wrapper.setProps({ value: longText }).update();
        const newHeight = wrapper.find("textarea").getDOMNode<HTMLElement>().style.height;
        assert.notEqual(newHeight, initialHeight);
    });
});
