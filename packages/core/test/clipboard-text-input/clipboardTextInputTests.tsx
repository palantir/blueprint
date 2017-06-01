/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-dom/test-utils";

import { ClipboardTextInput } from "../../src/index";

describe("ClipboardTextInput", () => {
    let testsContainerElement: Element;

    const getDisplayText = (component: React.Component<any, any>) => {
        return (TestUtils.findRenderedDOMComponentWithClass(component, "clipboard-text") as HTMLInputElement).value;
    };

    const render = (contents: string) => {
        return ReactDOM.render(
            <ClipboardTextInput contents={contents} />,
            testsContainerElement
        ) as ClipboardTextInput;
    };

    beforeEach(() => {
        testsContainerElement = document.createElement("div");
        document.documentElement.appendChild(testsContainerElement);
    });

    afterEach(() => {
        ReactDOM.unmountComponentAtNode(testsContainerElement);
    });

    it("Displays full contents", () => {
        const contents = "5f65b5ca-64f6-41e7-bc5e-11390fba476f";
        assert.strictEqual(getDisplayText(render(contents)), contents);
    });
});
