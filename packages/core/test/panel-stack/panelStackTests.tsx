/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { mount } from 'enzyme';
import * as React from 'react';

import { PanelStack, IPanel, IPanelProps } from "../../src/index";
import { assert } from 'chai';

class TestPanel extends React.Component<IPanelProps> {
    public render() {
        return(
            <div> Test </div>
        );
    }
}

describe("<PanelStack>", () => {
    it("attaches succesfully to document.body", () => {
        const initialPanel: IPanel = {
            component: TestPanel,
            props: {},
            title: "Test Title",
        };
        const containerElement = mount(<PanelStack initialPanel={initialPanel} />);
        assert.exists(containerElement);
    })
});
