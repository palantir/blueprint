/*
 * Copyright 2024 Palantir Technologies, Inc. All rights reserved.
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

import { mount, shallow } from "enzyme";

import { assert, beforeEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { sleep } from "../../common/test-utils";
import { AnchorButton, Button } from "../button/buttons";

import { Toast } from "./toast";

describe("<Toast>", () => {
    it("renders only dismiss button by default", () => {
        const { action, dismiss } = wrap(<Toast message="Hello World" />);
        assert.lengthOf(action, 0);
        assert.lengthOf(dismiss, 1);
    });

    it("clicking dismiss button triggers onDismiss callback with `false`", () => {
        const handleDismiss = vi.fn();
        wrap(<Toast message="Hello" onDismiss={handleDismiss} />).dismiss.simulate("click");
        expect(handleDismiss).toHaveBeenCalledOnce();
        expect(handleDismiss).toHaveBeenCalledWith(false);
    });

    it("renders action button when action string prop provided", () => {
        // pluralize cuz now there are two buttons
        const { action } = wrap(<Toast action={{ text: "Undo" }} message="hello world" />);
        assert.lengthOf(action, 1);
        assert.equal(action.prop("text"), "Undo");
    });

    it("clicking action button triggers onClick callback", () => {
        const onClick = vi.fn();
        wrap(<Toast action={{ onClick, text: "Undo" }} message="Hello" />).action.simulate("click");
        expect(onClick).toHaveBeenCalledOnce();
    });

    it("clicking action button also triggers onDismiss callback with `false`", () => {
        const handleDismiss = vi.fn();
        wrap(<Toast action={{ text: "Undo" }} message="Hello" onDismiss={handleDismiss} />).action.simulate("click");
        expect(handleDismiss).toHaveBeenCalledOnce();
        expect(handleDismiss).toHaveBeenCalledWith(false);
    });

    function wrap(toast: React.JSX.Element) {
        const root = shallow(toast);
        return {
            action: root.find(AnchorButton),
            dismiss: root.find(Button),
            root,
        };
    }

    describe("timeout", () => {
        let handleDismiss: ReturnType<typeof vi.fn>;
        beforeEach(() => (handleDismiss = vi.fn()));

        it("calls onDismiss automatically after timeout expires with `true`", async () => {
            // mounting for lifecycle methods to start timeout
            mount(<Toast message="Hello" onDismiss={handleDismiss} timeout={20} />);
            await sleep(20);

            expect(handleDismiss).toHaveBeenCalledOnce();
            expect(handleDismiss.mock.calls[0][0]).toBe(true);
        });

        it("updating with timeout={0} cancels timeout", async () => {
            mount(<Toast message="Hello" onDismiss={handleDismiss} timeout={20} />).setProps({
                timeout: 0,
            });
            await sleep(20);
            expect(handleDismiss).not.toHaveBeenCalled();
        });

        it("updating timeout={0} with timeout={X} starts timeout", async () => {
            mount(<Toast message="Hello" onDismiss={handleDismiss} timeout={0} />).setProps({
                timeout: 20,
            });
            await sleep(20);

            expect(handleDismiss).toHaveBeenCalledOnce();
            expect(handleDismiss.mock.calls[0][0]).toBe(true);
        });
    });
});
