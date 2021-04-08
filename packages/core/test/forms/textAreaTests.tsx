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
import React from "react";

import { TextArea } from "../../src";

describe("<TextArea>", () => {
    it("can resize automatically", () => {
        const wrapper = mount(<TextArea growVertically={true} />);
        const textarea = wrapper.find("textarea");

        textarea.simulate("change", { target: { scrollHeight: 500 } });

        assert.equal((textarea.getDOMNode() as HTMLElement).style.height, "500px");
    });

    it("doesn't resize by default", () => {
        const wrapper = mount(<TextArea />);
        const textarea = wrapper.find("textarea");

        textarea.simulate("change", {
            target: {
                scrollHeight: textarea.getDOMNode().scrollHeight,
            },
        });

        assert.equal((textarea.getDOMNode() as HTMLElement).style.height, "");
    });

    it("doesn't clobber user-supplied styles", () => {
        const wrapper = mount(<TextArea growVertically={true} style={{ marginTop: 10 }} />);
        const textarea = wrapper.find("textarea");

        textarea.simulate("change", { target: { scrollHeight: 500 } });

        assert.equal((textarea.getDOMNode() as HTMLElement).style.marginTop, "10px");
    });

    it("can fit large initial content", () => {
        const initialValue = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Aenean finibus eget enim non accumsan.
        Nunc lobortis luctus magna eleifend consectetur.
        Suspendisse ut semper sem, quis efficitur felis.
        Praesent suscipit nunc non semper tempor.
        Sed eros sapien, semper sed imperdiet sed,
        dictum eget purus. Donec porta accumsan pretium.
        Fusce at felis mattis, tincidunt erat non, varius erat.`;
        const wrapper = mount(<TextArea growVertically={true} value={initialValue} style={{ marginTop: 10 }} />);
        const textarea = wrapper.find("textarea");
        const scrollHeightInPixels = `${(textarea.getDOMNode() as HTMLElement).scrollHeight}px`;
        assert.equal((textarea.getDOMNode() as HTMLElement).style.height, scrollHeightInPixels);
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

        const textAreawrapper = mount(<TextArea id="textarea" inputRef={textAreaRefCallback} />);
        assert.instanceOf(textArea, HTMLTextAreaElement);
        assert.strictEqual(callCount, 1);

        textAreawrapper.setProps({ inputRef: textAreaNewRefCallback });
        textAreawrapper.update();
        assert.strictEqual(callCount, 2);
        assert.isNull(textArea);
        assert.strictEqual(newCallCount, 1);
        assert.instanceOf(textAreaNew, HTMLTextAreaElement);
    });

    if (typeof React.createRef !== "undefined") {
        it("accepts object refs created with React.createRef and updates on change", () => {
            const textAreaRef = React.createRef<HTMLTextAreaElement>();
            const textAreaNewRef = React.createRef<HTMLTextAreaElement>();

            const textAreawrapper = mount(<TextArea id="textarea" inputRef={textAreaRef} />);
            assert.instanceOf(textAreaRef.current, HTMLTextAreaElement);

            textAreawrapper.setProps({ inputRef: textAreaNewRef });
            assert.isNull(textAreaRef.current);
            assert.instanceOf(textAreaNewRef.current, HTMLTextAreaElement);
        });
    }
});
