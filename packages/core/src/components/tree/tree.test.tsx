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

import { fireEvent, render, type RenderResult, waitFor } from "@testing-library/react";
import { createRef } from "react";

import { afterEach, assert, beforeEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";

import { Tree, type TreeProps } from "./tree";
import { type TreeNodeInfo } from "./treeTypes";

describe("<Tree>", () => {
    let containerElement: HTMLElement;
    let result: RenderResult | undefined;

    beforeEach(() => {
        containerElement = document.createElement("div");
        document.documentElement.appendChild(containerElement);
    });

    afterEach(() => {
        result?.unmount();
        result = undefined;
        containerElement.remove();
    });

    function renderTree(props?: Partial<TreeProps>) {
        const ref = createRef<Tree>();
        result = render(<Tree ref={ref} contents={createDefaultContents()} {...props} />, {
            container: containerElement,
        });
        return { container: result.container, instance: ref.current!, ref, rerender: result.rerender };
    }

    function findNodeChildClass(container: HTMLElement, nodeClass: string, childClass: string): HTMLElement | null {
        return container.querySelector<HTMLElement>(`.${nodeClass} > .${Classes.TREE_NODE_CONTENT} .${childClass}`);
    }

    function assertNodeHasClass(container: HTMLElement, nodeClass: string, childClass: string, expected = true) {
        assert.equal(findNodeChildClass(container, nodeClass, childClass) != null, expected);
    }

    function assertNodeHasCaret(container: HTMLElement, nodeClass: string, hasCaret: boolean) {
        return assertNodeHasClass(
            container,
            nodeClass,
            hasCaret ? Classes.TREE_NODE_CARET : Classes.TREE_NODE_CARET_NONE,
        );
    }

    it("renders its contents", () => {
        const { container } = renderTree({ contents: [{ id: 0, label: "Node" }] });
        assert.lengthOf(container.querySelectorAll(`.${Classes.TREE}`), 1);
    });

    it("handles undefined input well", () => {
        const { container } = renderTree({ contents: undefined });
        assert.lengthOf(container.querySelectorAll(`.${Classes.TREE}`), 1);
    });

    it("handles empty input well", () => {
        const { container } = renderTree({ contents: [] });
        assert.lengthOf(container.querySelectorAll(`.${Classes.TREE}`), 1);
    });

    it("hasCaret forces a caret to be/not be displayed", () => {
        const contents = createDefaultContents();
        contents[0].hasCaret = contents[1].hasCaret = true;
        contents[2].hasCaret = contents[3].hasCaret = false;

        const { container } = renderTree({ contents });
        assertNodeHasCaret(container, "c0", true);
        assertNodeHasCaret(container, "c1", true);
        assertNodeHasCaret(container, "c2", false);
        assertNodeHasCaret(container, "c3", false);
    });

    it("if not specified, caret visibility is determined by the presence of children", () => {
        const { container } = renderTree();
        assertNodeHasCaret(container, "c0", false);
        assertNodeHasCaret(container, "c1", true);
        assertNodeHasCaret(container, "c2", false);
        assertNodeHasCaret(container, "c3", true);
    });

    it("caret direction is determined by node expansion", () => {
        const contents = [
            {
                childNodes: [{ id: 4, label: "" }],
                className: "c0",
                hasCaret: true,
                id: 1,
                isExpanded: false,
                label: "c0",
            },
            { className: "c1", hasCaret: true, id: 0, isExpanded: true, label: "c1" },
            { className: "c2", hasCaret: true, id: 2, isExpanded: false, label: "c2" },
            {
                childNodes: [{ id: 5, label: "c4" }],
                className: "c3",
                hasCaret: true,
                id: 3,
                isExpanded: true,
                label: "c3",
            },
        ];

        const { container } = renderTree({ contents });
        assertNodeHasClass(container, "c0", Classes.TREE_NODE_CARET_CLOSED);
        assertNodeHasClass(container, "c1", Classes.TREE_NODE_CARET_OPEN);
        assertNodeHasClass(container, "c2", Classes.TREE_NODE_CARET_CLOSED);
        assertNodeHasClass(container, "c3", Classes.TREE_NODE_CARET_OPEN);
    });

    it("event callbacks are fired correctly", () => {
        const onNodeClick = vi.fn();
        const onNodeCollapse = vi.fn();
        const onNodeContextMenu = vi.fn();
        const onNodeDoubleClick = vi.fn();
        const onNodeExpand = vi.fn();
        const onNodeMouseEnter = vi.fn();
        const onNodeMouseLeave = vi.fn();

        const contents = createDefaultContents();
        contents[3].isExpanded = true;

        const { container } = renderTree({
            contents,
            onNodeClick,
            onNodeCollapse,
            onNodeContextMenu,
            onNodeDoubleClick,
            onNodeExpand,
            onNodeMouseEnter,
            onNodeMouseLeave,
        });

        fireEvent.click(container.querySelector(`.c0 > .${Classes.TREE_NODE_CONTENT}`)!);
        expect(onNodeClick).toHaveBeenCalledOnce();
        expect(onNodeClick.mock.calls[0][1]).toEqual([0]);

        fireEvent.click(findNodeChildClass(container, "c1", Classes.TREE_NODE_CARET)!);
        expect(onNodeExpand).toHaveBeenCalledOnce();
        expect(onNodeExpand.mock.calls[0][1]).toEqual([1]);
        expect(onNodeClick).toHaveBeenCalledOnce();

        fireEvent.doubleClick(container.querySelector(`.c6 > .${Classes.TREE_NODE_CONTENT}`)!);
        expect(onNodeDoubleClick).toHaveBeenCalledOnce();
        expect(onNodeDoubleClick.mock.calls[0][1]).toEqual([3, 0]);

        fireEvent.click(findNodeChildClass(container, "c3", Classes.TREE_NODE_CARET)!);
        expect(onNodeCollapse).toHaveBeenCalledOnce();
        expect(onNodeCollapse.mock.calls[0][1]).toEqual([3]);

        fireEvent.contextMenu(container.querySelector(`.c0 > .${Classes.TREE_NODE_CONTENT}`)!);
        expect(onNodeContextMenu).toHaveBeenCalledOnce();
        expect(onNodeContextMenu.mock.calls[0][1]).toEqual([0]);

        fireEvent.mouseEnter(container.querySelector(`.c2 > .${Classes.TREE_NODE_CONTENT}`)!);
        expect(onNodeMouseEnter).toHaveBeenCalledOnce();
        expect(onNodeMouseEnter.mock.calls[0][1]).toEqual([2]);

        fireEvent.mouseLeave(container.querySelector(`.c2 > .${Classes.TREE_NODE_CONTENT}`)!);
        expect(onNodeMouseLeave).toHaveBeenCalledOnce();
        expect(onNodeMouseLeave.mock.calls[0][1]).toEqual([2]);
    });

    it("if disabled, event callbacks are not fired", () => {
        const onNodeClick = vi.fn();
        const onNodeCollapse = vi.fn();
        const onNodeContextMenu = vi.fn();
        const onNodeDoubleClick = vi.fn();
        const onNodeExpand = vi.fn();
        const onNodeMouseEnter = vi.fn();
        const onNodeMouseLeave = vi.fn();

        const contents = createDefaultContents();
        contents[0].disabled = true;
        contents[0].hasCaret = true;
        contents[0].isExpanded = false;

        const { container } = renderTree({
            contents,
            onNodeClick,
            onNodeCollapse,
            onNodeContextMenu,
            onNodeDoubleClick,
            onNodeExpand,
            onNodeMouseEnter,
            onNodeMouseLeave,
        });

        const treeNodeContent = container.querySelector<HTMLElement>(
            `.${Classes.TREE_NODE}.c0 .${Classes.TREE_NODE_CONTENT}`,
        )!;
        const treeNodeCaret = treeNodeContent.querySelector<HTMLElement>(`.${Classes.TREE_NODE_CARET}`)!;

        fireEvent.click(treeNodeContent);
        expect(onNodeClick).not.toHaveBeenCalled();

        fireEvent.doubleClick(treeNodeContent);
        expect(onNodeDoubleClick).not.toHaveBeenCalled();

        fireEvent.contextMenu(treeNodeContent);
        expect(onNodeContextMenu).not.toHaveBeenCalled();

        fireEvent.mouseEnter(treeNodeContent);
        expect(onNodeMouseEnter).not.toHaveBeenCalled();

        fireEvent.mouseLeave(treeNodeContent);
        expect(onNodeMouseLeave).not.toHaveBeenCalled();

        fireEvent.click(treeNodeCaret);
        expect(onNodeExpand).not.toHaveBeenCalled();

        fireEvent.click(treeNodeCaret);
        expect(onNodeCollapse).not.toHaveBeenCalled();
    });

    it("disabled nodes are rendered correctly", () => {
        const contents = createDefaultContents();
        contents[0].disabled = true;

        const { container } = renderTree({ contents });
        const disabled = container.querySelectorAll(`.${Classes.TREE_NODE}.c0.${Classes.DISABLED}`);
        assert.lengthOf(disabled, 1);
    });

    it("icons are rendered correctly if present", () => {
        const contents = createDefaultContents();
        contents[1].icon = "document";
        contents[2].icon = "document";

        const { container } = renderTree({ contents });
        assertNodeHasClass(container, "c0", Classes.TREE_NODE_ICON, false);
        assertNodeHasClass(container, "c1", Classes.TREE_NODE_ICON);
        assertNodeHasClass(container, "c2", Classes.TREE_NODE_ICON);
    });

    it("isExpanded controls node expansion", () => {
        const contents = createDefaultContents();
        contents[3].isExpanded = false;
        contents[4].isExpanded = true;

        const { container } = renderTree({ contents });
        const nodes = container.querySelectorAll("li");
        const filter = (cls: string) =>
            Array.from(nodes).filter(n => cls.split(".").every(c => c === "" || n.classList.contains(c)));
        assert.lengthOf(filter(`c1.${Classes.TREE_NODE_EXPANDED}`), 0);
        assert.lengthOf(filter("c5"), 0);
        assert.lengthOf(filter(`c3.${Classes.TREE_NODE_EXPANDED}`), 0);
        assert.lengthOf(filter("c6"), 0);
        assert.lengthOf(filter(`c4.${Classes.TREE_NODE_EXPANDED}`), 1);
        assert.lengthOf(filter("c7"), 1);
    });

    it("isSelected selects nodes", () => {
        const contents = createDefaultContents();
        contents[1].isSelected = false;
        contents[2].isSelected = true;

        const { container } = renderTree({ contents });
        const nodes = container.querySelectorAll("li");
        const filter = (cls: string) =>
            Array.from(nodes).filter(n => cls.split(".").every(c => c === "" || n.classList.contains(c)));
        assert.lengthOf(filter(`c0.${Classes.TREE_NODE_SELECTED}`), 0);
        assert.lengthOf(filter(`c1.${Classes.TREE_NODE_SELECTED}`), 0);
        assert.lengthOf(filter(`c2.${Classes.TREE_NODE_SELECTED}`), 1);
    });

    it("secondaryLabel renders correctly", () => {
        const contents = createDefaultContents();
        contents[1].secondaryLabel = "Secondary";
        contents[2].secondaryLabel = <p>Paragraph</p>;

        const { container } = renderTree({ contents });
        assertNodeHasClass(container, "c0", Classes.TREE_NODE_SECONDARY_LABEL, false);
        assert.strictEqual(
            findNodeChildClass(container, "c1", Classes.TREE_NODE_SECONDARY_LABEL)?.textContent,
            "Secondary",
        );
        assert.strictEqual(
            findNodeChildClass(container, "c2", Classes.TREE_NODE_SECONDARY_LABEL)?.textContent,
            "Paragraph",
        );
    });

    it("getNodeContentElement returns references to underlying node elements", async () => {
        const contents = createDefaultContents();
        contents[1].isExpanded = true;

        const { container, instance, rerender } = renderTree({ contents });

        assert.strictEqual(
            instance.getNodeContentElement(5),
            container.querySelector<HTMLElement>(`.c5 > .${Classes.TREE_NODE_CONTENT}`),
        );
        assert.isUndefined(instance.getNodeContentElement(100));

        contents[1].isExpanded = false;
        rerender(<Tree contents={contents} />);
        await waitFor(() => {
            assert.isUndefined(instance.getNodeContentElement(5));
        });
    });

    it("allows nodes to be removed without throwing", () => {
        renderTree({ contents: createDefaultContents() });
        const smallerContents = createDefaultContents().slice(0, -1);
        assert.doesNotThrow(() => renderTree({ contents: smallerContents }));
    });

    /* eslint-disable sort-keys */
    function createDefaultContents(): TreeNodeInfo[] {
        return [
            { id: 0, className: "c0", label: "Item 0" },
            {
                id: 1,
                className: "c1",
                label: "Item 1",
                childNodes: [{ id: 5, className: "c5", label: "Item 5" }],
            },
            { id: 2, className: "c2", label: "Item 2" },
            {
                id: 3,
                className: "c3",
                label: "Item 3",
                childNodes: [{ id: 6, className: "c6", label: "Item 6" }],
            },
            {
                id: 4,
                className: "c4",
                label: "Item 4",
                childNodes: [{ id: 7, className: "c7", label: "Item 7" }],
            },
        ];
    }
});
