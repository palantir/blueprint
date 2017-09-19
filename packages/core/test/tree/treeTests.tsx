/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { mount } from "enzyme";
import { Classes, ITreeNode, ITreeProps, Tree } from "../../src/index";

describe("<Tree>", () => {
    let testsContainerElement: Element;

    before(() => {
        // this is essentially what TestUtils.renderIntoDocument does
        testsContainerElement = document.createElement("div");
        document.documentElement.appendChild(testsContainerElement);
    });

    afterEach(() => {
        ReactDOM.unmountComponentAtNode(testsContainerElement);
    });

    it("renders its contents", () => {
        const tree = renderTree({ contents: [{ id: 0, label: "Node" }] });
        assert.lengthOf(tree.find({ className: Classes.TREE }), 1);
    });

    it("handles null input well", () => {
        const tree = renderTree({ contents: null });
        assert.lengthOf(tree.find({ className: Classes.TREE }), 1);
    });

    it("handles empty input well", () => {
        const tree = renderTree({ contents: [] });
        assert.lengthOf(tree.find({ className: Classes.TREE }), 1);
    });

    it("hasCaret forces a caret to be/not be displayed", () => {
        const contents = createDefaultContents();
        contents[0].hasCaret = contents[1].hasCaret = true;
        contents[2].hasCaret = contents[3].hasCaret = false;

        const tree = renderTree({ contents });
        assert.lengthOf(tree.find(`.c0 > .${Classes.TREE_NODE_CONTENT} .${Classes.TREE_NODE_CARET}`), 1);
        assert.lengthOf(tree.find(`.c1 > .${Classes.TREE_NODE_CONTENT} .${Classes.TREE_NODE_CARET}`), 1);
        assert.lengthOf(tree.find(`.c2 > .${Classes.TREE_NODE_CONTENT} .${Classes.TREE_NODE_CARET_NONE}`), 1);
        assert.lengthOf(tree.find(`.c3 > .${Classes.TREE_NODE_CONTENT} .${Classes.TREE_NODE_CARET_NONE}`), 1);
    });

    it("if not specified, caret visibility is determined by the presence of children", () => {
        const tree = renderTree();
        assert.lengthOf(tree.find(`.c0 > .${Classes.TREE_NODE_CONTENT} .${Classes.TREE_NODE_CARET_NONE}`), 1);
        assert.lengthOf(tree.find(`.c1 > .${Classes.TREE_NODE_CONTENT} .${Classes.TREE_NODE_CARET}`), 1);
        assert.lengthOf(tree.find(`.c2 > .${Classes.TREE_NODE_CONTENT} .${Classes.TREE_NODE_CARET_NONE}`), 1);
        assert.lengthOf(tree.find(`.c3 > .${Classes.TREE_NODE_CONTENT} .${Classes.TREE_NODE_CARET}`), 1);
    });

    it("caret direction is determined by node expansion", () => {
        const contents = [
            // tslint:disable-next-line:max-line-length
            {
                id: 1,
                className: "c0",
                hasCaret: true,
                isExpanded: false,
                label: "",
                childNodes: [{ id: 4, label: "" }],
            },
            { id: 0, className: "c1", hasCaret: true, isExpanded: true, label: "" },
            { id: 2, className: "c2", hasCaret: true, isExpanded: false, label: "" },
            { id: 3, className: "c3", hasCaret: true, isExpanded: true, label: "", childNodes: [{ id: 5, label: "" }] },
        ];

        const tree = renderTree({ contents });
        assert.lengthOf(tree.find(`.c0 > .${Classes.TREE_NODE_CONTENT} .${Classes.TREE_NODE_CARET_CLOSED}`), 1);
        assert.lengthOf(tree.find(`.c1 > .${Classes.TREE_NODE_CONTENT} .${Classes.TREE_NODE_CARET_OPEN}`), 1);
        assert.lengthOf(tree.find(`.c2 > .${Classes.TREE_NODE_CONTENT} .${Classes.TREE_NODE_CARET_CLOSED}`), 1);
        assert.lengthOf(tree.find(`.c3 > .${Classes.TREE_NODE_CONTENT} .${Classes.TREE_NODE_CARET_OPEN}`), 1);
    });

    it("event callbacks are fired correctly", () => {
        const onNodeClick = sinon.spy();
        const onNodeCollapse = sinon.spy();
        const onNodeContextMenu = sinon.spy();
        const onNodeDoubleClick = sinon.spy();
        const onNodeExpand = sinon.spy();

        const contents = createDefaultContents();
        contents[3].isExpanded = true;

        const tree = renderTree({
            contents,
            onNodeClick,
            onNodeCollapse,
            onNodeContextMenu,
            onNodeDoubleClick,
            onNodeExpand,
        });

        tree.find(`.c0 > .${Classes.TREE_NODE_CONTENT}`).simulate("click");
        assert.isTrue(onNodeClick.calledOnce);
        assert.deepEqual(onNodeClick.args[0][1], [0]);

        tree.find(`.c1 > .${Classes.TREE_NODE_CONTENT} .${Classes.TREE_NODE_CARET}`).simulate("click");
        assert.isTrue(onNodeExpand.calledOnce);
        assert.deepEqual(onNodeExpand.args[0][1], [1]);
        // make sure that onNodeClick isn't fired again, only onNodeExpand should be
        assert.isTrue(onNodeClick.calledOnce);

        tree.find(`.c6 > .${Classes.TREE_NODE_CONTENT}`).simulate("dblclick");
        assert.isTrue(onNodeDoubleClick.calledOnce);
        assert.deepEqual(onNodeDoubleClick.args[0][1], [3, 0]);

        tree.find(`.c3 > .${Classes.TREE_NODE_CONTENT} .${Classes.TREE_NODE_CARET}`).simulate("click");
        assert.isTrue(onNodeCollapse.calledOnce);
        assert.deepEqual(onNodeCollapse.args[0][1], [3]);

        tree.find(`.c0 > .${Classes.TREE_NODE_CONTENT}`).simulate("contextmenu");
        assert.isTrue(onNodeContextMenu.calledOnce);
        assert.deepEqual(onNodeContextMenu.args[0][1], [0]);
    });

    it("icons are rendered correctly if present", () => {
        const contents = createDefaultContents();
        contents[1].iconName = "document";
        contents[2].iconName = "pt-icon-document";

        const tree = renderTree({ contents });
        const iconSelector = `.${Classes.TREE_NODE_ICON}.pt-icon-document`;
        assert.lengthOf(tree.find(`.c0 > .${Classes.TREE_NODE_CONTENT} .${Classes.TREE_NODE_ICON}`), 0);
        assert.lengthOf(tree.find(`.c1 > .${Classes.TREE_NODE_CONTENT} ${iconSelector}`), 1);
        assert.lengthOf(tree.find(`.c2 > .${Classes.TREE_NODE_CONTENT} ${iconSelector}`), 1);
    });

    it("isExpanded controls node expansion", () => {
        const contents = createDefaultContents();
        contents[3].isExpanded = false;
        contents[4].isExpanded = true;

        const tree = renderTree({ contents });
        assert.lengthOf(tree.find(`.c1.${Classes.TREE_NODE_EXPANDED}`), 0);
        assert.lengthOf(tree.find(".c5"), 0);
        assert.lengthOf(tree.find(`.c3.${Classes.TREE_NODE_EXPANDED}`), 0);
        assert.lengthOf(tree.find(".c6"), 0);
        assert.lengthOf(tree.find(`.c4.${Classes.TREE_NODE_EXPANDED}`), 1);
        assert.lengthOf(tree.find(".c7"), 1);
    });

    it("isSelected selects nodes", () => {
        const contents = createDefaultContents();
        contents[1].isSelected = false;
        contents[2].isSelected = true;

        const tree = renderTree({ contents });

        assert.lengthOf(tree.find(`.c0.${Classes.TREE_NODE_SELECTED}`), 0);
        assert.lengthOf(tree.find(`.c1.${Classes.TREE_NODE_SELECTED}`), 0);
        assert.lengthOf(tree.find(`.c2.${Classes.TREE_NODE_SELECTED}`), 1);
    });

    it("secondaryLabel renders correctly", () => {
        const contents = createDefaultContents();
        contents[1].secondaryLabel = "Secondary";
        contents[2].secondaryLabel = <p>Paragraph</p>;

        const tree = renderTree({ contents });

        const secondaryLabelSelector = `> .${Classes.TREE_NODE_CONTENT} .${Classes.TREE_NODE_SECONDARY_LABEL}`;
        assert.lengthOf(tree.find(`.c0 ${secondaryLabelSelector}`), 0);
        assert.strictEqual(tree.find(`.c1 ${secondaryLabelSelector}`).text(), "Secondary");
        assert.strictEqual(tree.find(`.c2 ${secondaryLabelSelector}`).text(), "Paragraph");
    });

    it("getNodeContentElement returns references to underlying node elements", done => {
        const contents = createDefaultContents();
        contents[1].isExpanded = true;

        const wrapper = renderTree({ contents });
        const tree = wrapper.instance() as Tree;

        assert.strictEqual(
            tree.getNodeContentElement(5),
            ReactDOM.findDOMNode(tree).query(`.c5 > .${Classes.TREE_NODE_CONTENT}`),
        );
        assert.isUndefined(tree.getNodeContentElement(100));

        contents[1].isExpanded = false;
        wrapper.setProps({ contents });
        // wait for animation to finish
        setTimeout(() => {
            assert.isUndefined(tree.getNodeContentElement(5));
            done();
        }, 300);
    });

    it("allows nodes to be removed without throwing", () => {
        const contents = createDefaultContents();
        renderTree({ contents });

        const smallerContents = createDefaultContents().slice(0, -1);
        assert.doesNotThrow(() => renderTree({ contents: smallerContents }));
    });

    function renderTree(props?: Partial<ITreeProps>) {
        return mount(<Tree contents={createDefaultContents()} {...props} />);
    }

    function createDefaultContents(): ITreeNode[] {
        return [
            { id: 0, className: "c0", label: "Item 0" },
            { id: 1, className: "c1", label: "Item 1", childNodes: [{ id: 5, className: "c5", label: "Item 5" }] },
            { id: 2, className: "c2", label: "Item 2" },
            { id: 3, className: "c3", label: "Item 3", childNodes: [{ id: 6, className: "c6", label: "Item 6" }] },
            { id: 4, className: "c4", label: "Item 4", childNodes: [{ id: 7, className: "c7", label: "Item 7" }] },
        ];
    }
});
