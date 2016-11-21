/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { assert } from "chai";
import * as React from "react";
import * as TestUtils from "react-addons-test-utils";
import * as ReactDOM from "react-dom";

import { Classes, ITreeNode, Tree } from "../../src/index";

/* tslint:disable:object-literal-sort-keys */
describe("<Tree>", () => {
    let testsContainerElement: Element;
    let tree: Tree;

    before(() => {
        // this is essentially what TestUtils.renderIntoDocument does
        testsContainerElement = document.createElement("div");
        document.documentElement.appendChild(testsContainerElement);
    });

    afterEach(() => {
        ReactDOM.unmountComponentAtNode(testsContainerElement);
    });

    it("renders its contents", () => {
        assert.lengthOf(document.getElementsByClassName(Classes.TREE), 0);

        renderTree({contents: [{id: 0, label: "Node"}]});
        assert.lengthOf(document.getElementsByClassName(Classes.TREE), 1);
    });

    it("handles null input well", () => {
        renderTree({contents: null});
        assert.lengthOf(document.getElementsByClassName(Classes.TREE), 1);
    });

    it("handles empty input well", () => {
        renderTree({contents: []});
        assert.lengthOf(document.getElementsByClassName(Classes.TREE), 1);
    });

    it("hasCaret forces a caret to be/not be displayed", () => {
        const contents = createDefaultContents();
        contents[0].hasCaret = contents[1].hasCaret = true;
        contents[2].hasCaret = contents[3].hasCaret = false;
        renderTree({contents});

        assert.isNotNull(document.query(`.c0 > .${Classes.TREE_NODE_CONTENT} .${Classes.TREE_NODE_CARET}`));
        assert.isNotNull(document.query(`.c1 > .${Classes.TREE_NODE_CONTENT} .${Classes.TREE_NODE_CARET}`));
        assert.isNotNull(document.query(`.c2 > .${Classes.TREE_NODE_CONTENT} .${Classes.TREE_NODE_CARET_NONE}`));
        assert.isNotNull(document.query(`.c3 > .${Classes.TREE_NODE_CONTENT} .${Classes.TREE_NODE_CARET_NONE}`));
    });

    it("if not specified, caret visibility is determined by the presence of children", () => {
        renderTree();

        assert.isNotNull(document.query(`.c0 > .${Classes.TREE_NODE_CONTENT} .${Classes.TREE_NODE_CARET_NONE}`));
        assert.isNotNull(document.query(`.c1 > .${Classes.TREE_NODE_CONTENT} .${Classes.TREE_NODE_CARET}`));
        assert.isNotNull(document.query(`.c2 > .${Classes.TREE_NODE_CONTENT} .${Classes.TREE_NODE_CARET_NONE}`));
        assert.isNotNull(document.query(`.c3 > .${Classes.TREE_NODE_CONTENT} .${Classes.TREE_NODE_CARET}`));
    });

    it("caret direction is determined by node expansion", () => {
        const contents = [
            {id: 0, className: "c0", hasCaret: true, isExpanded: true, label: ""},
            {id: 1, className: "c1", hasCaret: true, isExpanded: false, label: "", childNodes: [{id: 4, label: ""}]},
            {id: 2, className: "c2", hasCaret: true, isExpanded: false, label: ""},
            {id: 3, className: "c3", hasCaret: true, isExpanded: true, label: "", childNodes: [{id: 5, label: ""}]},
        ];

        renderTree({contents});

        assert.isNotNull(document.query(`.c0 > .${Classes.TREE_NODE_CONTENT} .${Classes.TREE_NODE_CARET_OPEN}`));
        assert.isNotNull(document.query(`.c1 > .${Classes.TREE_NODE_CONTENT} .${Classes.TREE_NODE_CARET_CLOSED}`));
        assert.isNotNull(document.query(`.c2 > .${Classes.TREE_NODE_CONTENT} .${Classes.TREE_NODE_CARET_CLOSED}`));
        assert.isNotNull(document.query(`.c3 > .${Classes.TREE_NODE_CONTENT} .${Classes.TREE_NODE_CARET_OPEN}`));
    });

    it("event callbacks are fired correctly", () => {
        const onNodeClick = sinon.spy();
        const onNodeCollapse = sinon.spy();
        const onNodeDoubleClick = sinon.spy();
        const onNodeExpand = sinon.spy();

        const contents = createDefaultContents();
        contents[3].isExpanded = true;

        renderTree({contents, onNodeClick, onNodeCollapse, onNodeDoubleClick, onNodeExpand});

        TestUtils.Simulate.click(document.query(`.c0 > .${Classes.TREE_NODE_CONTENT}`));
        assert.isTrue(onNodeClick.calledOnce);
        assert.deepEqual(onNodeClick.args[0][1], [0]);

        TestUtils.Simulate.click(document.query(`.c1 > .${Classes.TREE_NODE_CONTENT} .${Classes.TREE_NODE_CARET}`));
        assert.isTrue(onNodeExpand.calledOnce);
        assert.deepEqual(onNodeExpand.args[0][1], [1]);
        // make sure that onNodeClick isn't fired again, only onNodeExpand should be 
        assert.isTrue(onNodeClick.calledOnce);

        TestUtils.Simulate.doubleClick(document.query(`.c6 > .${Classes.TREE_NODE_CONTENT}`));
        assert.isTrue(onNodeDoubleClick.calledOnce);
        assert.deepEqual(onNodeDoubleClick.args[0][1], [3, 0]);

        TestUtils.Simulate.click(document.query(`.c3 > .${Classes.TREE_NODE_CONTENT} .${Classes.TREE_NODE_CARET}`));
        assert.isTrue(onNodeCollapse.calledOnce);
        assert.deepEqual(onNodeCollapse.args[0][1], [3]);
    });

    it("icons are rendered correctly if present", () => {
        const contents = createDefaultContents();
        contents[1].iconName = "document";
        contents[2].iconName = "pt-icon-document";

        renderTree({contents});

        const iconSelector = `.${Classes.TREE_NODE_ICON}.pt-icon-document`;
        assert.isNull(document.query(`.c0 > .${Classes.TREE_NODE_CONTENT} .${Classes.TREE_NODE_ICON}`));
        assert.isNotNull(document.query(`.c1 > .${Classes.TREE_NODE_CONTENT} ${iconSelector}`));
        assert.isNotNull(document.query(`.c2 > .${Classes.TREE_NODE_CONTENT} ${iconSelector}`));
    });

    it("isExpanded controls node expansion", () => {
        const contents = createDefaultContents();
        contents[3].isExpanded = false;
        contents[4].isExpanded = true;
        renderTree({contents});

        assert.isNull(document.query(`.c1.${Classes.TREE_NODE_EXPANDED}`));
        assert.isNull(document.query(".c5"));

        assert.isNull(document.query(`.c3.${Classes.TREE_NODE_EXPANDED}`));
        assert.isNull(document.query(".c6"));

        assert.isNotNull(document.query(`.c4.${Classes.TREE_NODE_EXPANDED}`));
        assert.isNotNull(document.query(".c7"));
    });

    it("isSelected selects nodes", () => {
        const contents = createDefaultContents();
        contents[1].isSelected = false;
        contents[2].isSelected = true;

        renderTree({contents});

        assert.isNull(document.query(`.c0.${Classes.TREE_NODE_SELECTED}`));
        assert.isNull(document.query(`.c1.${Classes.TREE_NODE_SELECTED}`));
        assert.isNotNull(document.query(`.c2.${Classes.TREE_NODE_SELECTED}`));
    });

    it("secondaryLabel renders correctly", () => {
        const contents = createDefaultContents();
        contents[1].secondaryLabel = "Secondary";
        contents[2].secondaryLabel = <p>Paragraph</p>;

        renderTree({contents});

        const secondaryLabelSelector = `> .${Classes.TREE_NODE_CONTENT} .${Classes.TREE_NODE_SECONDARY_LABEL}`;
        assert.isNull(document.query(`.c0 ${secondaryLabelSelector}`));
        let label: HTMLElement = document.query(`.c1 ${secondaryLabelSelector}`) as HTMLElement;
        assert.strictEqual(label.innerText, "Secondary");
        label = document.query(`.c2 ${secondaryLabelSelector}`).firstChild as HTMLElement;
        assert.strictEqual(label.innerText, "Paragraph");
    });

    function renderTree(props?: any) {
        tree = ReactDOM.render(
            <Tree contents={createDefaultContents()} {...props}/>,
            testsContainerElement,
        ) as Tree;
    }

    function createDefaultContents(): ITreeNode[] {
        return [
            {id: 0, className: "c0", label: "Item 0"},
            {id: 1, className: "c1", label: "Item 1", childNodes: [{id: 5, className: "c5", label: "Item 5"}]},
            {id: 2, className: "c2", label: "Item 2"},
            {id: 3, className: "c3", label: "Item 3", childNodes: [{id: 6, className: "c6", label: "Item 6"}]},
            {id: 4, className: "c4", label: "Item 4", childNodes: [{id: 7, className: "c7", label: "Item 7"}]},
        ];
    }
});
