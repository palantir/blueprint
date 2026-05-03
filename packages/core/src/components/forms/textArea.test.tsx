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

import { fireEvent, render } from "@testing-library/react";
import { createRef } from "react";

import { afterEach, assert, beforeEach, describe, it } from "@blueprintjs/test-commons/vitest";

import { TextArea } from "./textArea";

describe("<TextArea>", () => {
    let containerElement: HTMLElement;

    beforeEach(() => {
        containerElement = document.createElement("div");
        containerElement.setAttribute("style", "width: 1000px; height: 1000px;");
        document.body.appendChild(containerElement);
    });

    afterEach(() => {
        containerElement.remove();
    });

    function renderTextArea(ui: React.ReactElement) {
        return render(ui, { container: containerElement });
    }

    it("No manual resizes when autoResize enabled", () => {
        const { container } = renderTextArea(<TextArea autoResize={true} />);
        const textarea = container.querySelector<HTMLTextAreaElement>("textarea")!;
        Object.defineProperty(textarea, "scrollHeight", { configurable: true, value: 500 });
        fireEvent.change(textarea);
        assert.notEqual(textarea.style.height, "500px");
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
        const { container } = renderTextArea(<TextArea value={initialValue} autoResize={true} />);
        const textarea = container.querySelector<HTMLTextAreaElement>("textarea")!;
        const scrollHeightInPixels = `${textarea.scrollHeight}px`;
        assert.equal(textarea.style.height, scrollHeightInPixels);
    });

    // Skip: jsdom doesn't compute real scroll heights
    it.skip("resizes with long text input when autoResize enabled", () => {
        const initialValue = "A";
        const nextValue = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Aenean finibus eget enim non accumsan.
        Nunc lobortis luctus magna eleifend consectetur.
        Suspendisse ut semper sem, quis efficitur felis.
        Praesent suscipit nunc non semper tempor.
        Sed eros sapien, semper sed imperdiet sed,
        dictum eget purus. Donec porta accumsan pretium.
        Fusce at felis mattis, tincidunt erat non, varius erat.`;
        const { container, rerender } = renderTextArea(<TextArea value={initialValue} autoResize={true} />);
        const textarea = container.querySelector<HTMLTextAreaElement>("textarea")!;
        const before = `${textarea.scrollHeight}px`;
        rerender(<TextArea value={nextValue} autoResize={true} />);
        const after = `${textarea.scrollHeight}px`;
        assert.notEqual(before, after);
    });

    it("doesn't resize by default", () => {
        const { container } = renderTextArea(<TextArea />);
        const textarea = container.querySelector<HTMLTextAreaElement>("textarea")!;
        fireEvent.change(textarea);
        assert.equal(textarea.style.height, "");
    });

    it("doesn't clobber user-supplied styles", () => {
        const { container } = renderTextArea(<TextArea autoResize={true} style={{ marginTop: 10 }} />);
        const textarea = container.querySelector<HTMLTextAreaElement>("textarea")!;
        Object.defineProperty(textarea, "scrollHeight", { configurable: true, value: 500 });
        fireEvent.change(textarea);
        assert.equal(textarea.style.marginTop, "10px");
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

        const { rerender } = renderTextArea(<TextArea inputRef={textAreaRefCallback} />);
        assert.instanceOf(textArea, HTMLTextAreaElement);
        assert.strictEqual(callCount, 1);

        rerender(<TextArea inputRef={textAreaNewRefCallback} />);
        assert.strictEqual(callCount, 2);
        assert.isNull(textArea);
        assert.strictEqual(newCallCount, 1);
        assert.instanceOf(textAreaNew, HTMLTextAreaElement);
    });

    it("accepts object refs created with createRef and updates on change", () => {
        const textAreaRef = createRef<HTMLTextAreaElement>();
        const textAreaNewRef = createRef<HTMLTextAreaElement>();

        const { rerender } = renderTextArea(<TextArea inputRef={textAreaRef} />);
        assert.instanceOf(textAreaRef.current, HTMLTextAreaElement);

        rerender(<TextArea inputRef={textAreaNewRef} />);
        assert.isNull(textAreaRef.current);
        assert.instanceOf(textAreaNewRef.current, HTMLTextAreaElement);
    });
});
