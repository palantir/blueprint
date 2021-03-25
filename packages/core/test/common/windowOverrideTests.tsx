/*
 * Copyright 2020 Palantir Technologies, Inc. All rights reserved.
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
import { spy } from "sinon";

import { Button, NumericInput } from "../../src";
import { IWindowOverrideContext, windowOverrideContextTypes } from "../../src/common/windowOverrideContext";

/**
 * This test suite uses the legacy context API, documented here: https://reactjs.org/docs/legacy-context.html.
 * Blueprint currently supports React 15 and 16, so we can't use the newer API introduced in React 16.3.
 */
describe.skip("Window override on React context (legacy API)", () => {
    const addEventSpy = spy();
    const windowOverride: any = {
        ...window,
        document: window.document,
    };
    windowOverride.document.addEventListener = addEventSpy.bind(window.document);

    it("NumericInput renders with custom window", () => {
        const wrapper = mount(<NumericInputWrapper />);
        wrapper.find(Button).first().simulate("mousedown");
        assert.isTrue(addEventSpy.calledOnce, "custom document.addEventListener should be called on button mousedown");
    });

    class NumericInputWrapper extends React.Component {
        public static childContextTypes = windowOverrideContextTypes;

        public getChildContext(): IWindowOverrideContext {
            return { windowOverride };
        }

        public render() {
            return <NumericInput />;
        }
    }
});
