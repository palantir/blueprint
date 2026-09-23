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

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";

import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import { TextArea } from "./textArea";

describe("<TextArea>", () => {
    it("does not manually resize when autoResize enabled", async () => {
        const user = userEvent.setup();
        render(<TextArea autoResize={true} />);
        const textarea = screen.getByRole<HTMLTextAreaElement>("textbox");

        await user.type(textarea, "new text");

        // In jsdom, scrollHeight is 0, so height should be "0px" (from autoResize)
        expect(textarea).toHaveStyle({ height: "0px" });
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
        render(<TextArea value={initialValue} autoResize={true} />);
        const textarea = screen.getByRole<HTMLTextAreaElement>("textbox");

        const scrollHeightInPixels = `${textarea.scrollHeight}px`;
        expect(textarea).toHaveStyle({ height: scrollHeightInPixels });
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
        const { rerender } = render(<TextArea value={initialValue} autoResize={true} />);
        const textarea = screen.getByRole<HTMLTextAreaElement>("textbox");

        const scrollHeightBefore = `${textarea.scrollHeight}px`;
        rerender(<TextArea value={nextValue} autoResize={true} />);
        const scrollHeightAfter = `${textarea.scrollHeight}px`;

        expect(scrollHeightBefore).not.toBe(scrollHeightAfter);
    });

    it("doesn't resize by default", async () => {
        const user = userEvent.setup();
        render(<TextArea />);
        const textarea = screen.getByRole<HTMLTextAreaElement>("textbox");

        await user.type(textarea, "some text");

        expect(textarea).toHaveStyle({ height: "" });
    });

    it("doesn't clobber user-supplied styles", async () => {
        const user = userEvent.setup();
        render(<TextArea autoResize={true} style={{ marginTop: 10 }} />);
        const textarea = screen.getByRole<HTMLTextAreaElement>("textbox");

        await user.type(textarea, "some text");

        expect(textarea).toHaveStyle({ marginTop: "10px" });
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

        const { rerender } = render(<TextArea inputRef={textAreaRefCallback} />);
        expect(textArea).toBeInstanceOf(HTMLTextAreaElement);
        expect(callCount).toBe(1);

        rerender(<TextArea inputRef={textAreaNewRefCallback} />);
        expect(callCount).toBe(2);
        expect(textArea).toBeNull();
        expect(newCallCount).toBe(1);
        expect(textAreaNew).toBeInstanceOf(HTMLTextAreaElement);
    });

    it("accepts object refs created with createRef and updates on change", () => {
        const textAreaRef = createRef<HTMLTextAreaElement>();
        const textAreaNewRef = createRef<HTMLTextAreaElement>();

        const { rerender } = render(<TextArea inputRef={textAreaRef} />);
        expect(textAreaRef.current).toBeInstanceOf(HTMLTextAreaElement);

        rerender(<TextArea inputRef={textAreaNewRef} />);
        expect(textAreaRef.current).toBeNull();
        expect(textAreaNewRef.current).toBeInstanceOf(HTMLTextAreaElement);
    });
});
