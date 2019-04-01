/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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
import * as React from "react";
import * as ReactDOM from "react-dom";
import { spy } from "sinon";

import { mount, ReactWrapper } from "enzyme";
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
        assertNodeHasCaret(tree, "c0", true);
        assertNodeHasCaret(tree, "c1", true);
        assertNodeHasCaret(tree, "c2", false);
        assertNodeHasCaret(tree, "c3", false);
    });

    it("if not specified, caret visibility is determined by the presence of children", () => {
        const tree = renderTree();
        assertNodeHasCaret(tree, "c0", false);
        assertNodeHasCaret(tree, "c1", true);
        assertNodeHasCaret(tree, "c2", false);
        assertNodeHasCaret(tree, "c3", true);
    });

    it("caret direction is determined by node expansion", () => {
        const contents = [
            // tslint:disable-next-line:max-line-length
            {
                childNodes: [{ id: 4, label: "" }],
                className: "c0",
                hasCaret: true,
                id: 1,
                isExpanded: false,
                label: "c0",
            },
            { id: 0, className: "c1", hasCaret: true, isExpanded: true, label: "c1" },
            { id: 2, className: "c2", hasCaret: true, isExpanded: false, label: "c2" },
            {
                childNodes: [{ id: 5, label: "c4" }],
                className: "c3",
                hasCaret: true,
                id: 3,
                isExpanded: true,
                label: "c3",
            },
        ];

        const tree = renderTree({ contents });
        assertNodeHasClass(tree, "c0", Classes.TREE_NODE_CARET_CLOSED);
        assertNodeHasClass(tree, "c1", Classes.TREE_NODE_CARET_OPEN);
        assertNodeHasClass(tree, "c2", Classes.TREE_NODE_CARET_CLOSED);
        assertNodeHasClass(tree, "c3", Classes.TREE_NODE_CARET_OPEN);
    });

    it("event callbacks are fired correctly", () => {
        const onNodeClick = spy();
        const onNodeCollapse = spy();
        const onNodeContextMenu = spy();
        const onNodeDoubleClick = spy();
        const onNodeExpand = spy();
        const onNodeMouseEnter = spy();
        const onNodeMouseLeave = spy();

        const contents = createDefaultContents();
        contents[3].isExpanded = true;

        const tree = renderTree({
            contents,
            onNodeClick,
            onNodeCollapse,
            onNodeContextMenu,
            onNodeDoubleClick,
            onNodeExpand,
            onNodeMouseEnter,
            onNodeMouseLeave,
        });

        tree.find(`.c0 > .${Classes.TREE_NODE_CONTENT}`).simulate("click");
        assert.isTrue(onNodeClick.calledOnce);
        assert.deepEqual(onNodeClick.args[0][1], [0]);

        findNodeClass(tree, "c1", Classes.TREE_NODE_CARET).simulate("click");
        assert.isTrue(onNodeExpand.calledOnce);
        assert.deepEqual(onNodeExpand.args[0][1], [1]);
        // make sure that onNodeClick isn't fired again, only onNodeExpand should be
        assert.isTrue(onNodeClick.calledOnce);

        tree.find(`.c6 > .${Classes.TREE_NODE_CONTENT}`).simulate("dblclick");
        assert.isTrue(onNodeDoubleClick.calledOnce);
        assert.deepEqual(onNodeDoubleClick.args[0][1], [3, 0]);

        findNodeClass(tree, "c3", Classes.TREE_NODE_CARET).simulate("click");
        assert.isTrue(onNodeCollapse.calledOnce);
        assert.deepEqual(onNodeCollapse.args[0][1], [3]);

        tree.find(`.c0 > .${Classes.TREE_NODE_CONTENT}`).simulate("contextmenu");
        assert.isTrue(onNodeContextMenu.calledOnce);
        assert.deepEqual(onNodeContextMenu.args[0][1], [0]);

        tree.find(`.c2 > .${Classes.TREE_NODE_CONTENT}`).simulate("mouseenter");
        assert.isTrue(onNodeMouseEnter.calledOnce);
        assert.deepEqual(onNodeMouseEnter.args[0][1], [2]);

        tree.find(`.c2 > .${Classes.TREE_NODE_CONTENT}`).simulate("mouseleave");
        assert.isTrue(onNodeMouseLeave.calledOnce);
        assert.deepEqual(onNodeMouseLeave.args[0][1], [2]);
    });

    it("if disabled, event callbacks are not fired", () => {
        const onNodeClick = spy();
        const onNodeCollapse = spy();
        const onNodeContextMenu = spy();
        const onNodeDoubleClick = spy();
        const onNodeExpand = spy();
        const onNodeMouseEnter = spy();
        const onNodeMouseLeave = spy();

        const contents = createDefaultContents();
        contents[0].disabled = true;
        contents[0].hasCaret = true;
        contents[0].isExpanded = false;

        const tree = renderTree({
            contents,
            onNodeClick,
            onNodeCollapse,
            onNodeContextMenu,
            onNodeDoubleClick,
            onNodeExpand,
            onNodeMouseEnter,
            onNodeMouseLeave,
        });

        const treeNode = tree.find(`.${Classes.TREE_NODE}.c0`);
        const treeNodeContent = treeNode.find(`.${Classes.TREE_NODE_CONTENT}`);
        const treeNodeCaret = treeNodeContent.find(`.${Classes.TREE_NODE_CARET}`).first();

        treeNodeContent.simulate("click");
        assert.isTrue(onNodeClick.notCalled);

        treeNodeContent.simulate("dblclick");
        assert.isTrue(onNodeDoubleClick.notCalled);

        treeNodeContent.simulate("contextmenu");
        assert.isTrue(onNodeContextMenu.notCalled);

        treeNodeContent.simulate("mouseenter");
        assert.isTrue(onNodeMouseEnter.notCalled);

        treeNodeContent.simulate("mouseleave");
        assert.isTrue(onNodeMouseLeave.notCalled);

        treeNodeCaret.simulate("click");
        assert.isTrue(onNodeExpand.notCalled);

        treeNodeCaret.simulate("click");
        assert.isTrue(onNodeCollapse.notCalled);
    });

    it("disabled nodes are rendered correctly", () => {
        const contents = createDefaultContents();
        contents[0].disabled = true;

        const tree = renderTree({ contents });
        const disabledTreeNode = tree.find(`.${Classes.TREE_NODE}.c0.${Classes.DISABLED}`);

        assert.equal(disabledTreeNode.length, 1);
    });

    it("icons are rendered correctly if present", () => {
        const contents = createDefaultContents();
        contents[1].icon = "document";
        contents[2].icon = "document";

        const tree = renderTree({ contents });
        assertNodeHasClass(tree, "c0", Classes.TREE_NODE_ICON, false);
        assertNodeHasClass(tree, "c1", Classes.TREE_NODE_ICON);
        assertNodeHasClass(tree, "c2", Classes.TREE_NODE_ICON);
    });

    it("isExpanded controls node expansion", () => {
        const contents = createDefaultContents();
        contents[3].isExpanded = false;
        contents[4].isExpanded = true;

        const nodes = renderTree({ contents }).find("li");
        assert.lengthOf(nodes.filter(`.c1.${Classes.TREE_NODE_EXPANDED}`), 0);
        assert.lengthOf(nodes.filter(".c5"), 0);
        assert.lengthOf(nodes.filter(`.c3.${Classes.TREE_NODE_EXPANDED}`), 0);
        assert.lengthOf(nodes.filter(".c6"), 0);
        assert.lengthOf(nodes.filter(`.c4.${Classes.TREE_NODE_EXPANDED}`), 1);
        assert.lengthOf(nodes.filter(".c7"), 1);
    });

    it("isSelected selects nodes", () => {
        const contents = createDefaultContents();
        contents[1].isSelected = false;
        contents[2].isSelected = true;

        const nodes = renderTree({ contents }).find("li");
        assert.lengthOf(nodes.filter(`.c0.${Classes.TREE_NODE_SELECTED}`), 0);
        assert.lengthOf(nodes.filter(`.c1.${Classes.TREE_NODE_SELECTED}`), 0);
        assert.lengthOf(nodes.filter(`.c2.${Classes.TREE_NODE_SELECTED}`), 1);
    });

    it("secondaryLabel renders correctly", () => {
        const contents = createDefaultContents();
        contents[1].secondaryLabel = "Secondary";
        contents[2].secondaryLabel = <p>Paragraph</p>;

        const tree = renderTree({ contents }).find("li");
        assertNodeHasClass(tree, "c0", Classes.TREE_NODE_SECONDARY_LABEL, false);
        assert.strictEqual(findNodeClass(tree, "c1", Classes.TREE_NODE_SECONDARY_LABEL).text(), "Secondary");
        assert.strictEqual(findNodeClass(tree, "c2", Classes.TREE_NODE_SECONDARY_LABEL).text(), "Paragraph");
    });

    it("getNodeContentElement returns references to underlying node elements", done => {
        const contents = createDefaultContents();
        contents[1].isExpanded = true;

        const wrapper = renderTree({ contents });
        const tree = wrapper.instance() as Tree;

        assert.strictEqual(
            tree.getNodeContentElement(5),
            wrapper.getDOMNode().querySelector(`.c5 > .${Classes.TREE_NODE_CONTENT}`),
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

    function findNodeClass(tree: ReactWrapper, nodeClass: string, childClass: string) {
        return tree.find(`.${nodeClass} > .${Classes.TREE_NODE_CONTENT} .${childClass}`).hostNodes();
    }

    function assertNodeHasClass(tree: ReactWrapper, nodeClass: string, childClass: string, expected = true) {
        assert.equal(findNodeClass(tree, nodeClass, childClass).exists(), expected);
    }

    function assertNodeHasCaret(tree: ReactWrapper, nodeClass: string, hasCaret: boolean) {
        return assertNodeHasClass(tree, nodeClass, hasCaret ? Classes.TREE_NODE_CARET : Classes.TREE_NODE_CARET_NONE);
    }

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
