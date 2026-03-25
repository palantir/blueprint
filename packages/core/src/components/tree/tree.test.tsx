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

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";

import { Tree } from "./tree";
import { type TreeNodeInfo } from "./treeTypes";

describe("<Tree>", () => {
    it("renders its contents", () => {
        const { container } = render(<Tree contents={[{ id: 0, label: "Node" }]} />);
        expect(container.querySelector(`.${Classes.TREE}`)).toBeInTheDocument();
        expect(screen.getByText("Node")).toBeInTheDocument();
    });

    it("handles undefined input well", () => {
        const { container } = render(<Tree contents={undefined as any} />);
        expect(container.querySelector(`.${Classes.TREE}`)).toBeInTheDocument();
    });

    it("handles empty input well", () => {
        const { container } = render(<Tree contents={[]} />);
        expect(container.querySelector(`.${Classes.TREE}`)).toBeInTheDocument();
    });

    it("hasCaret forces a caret to be/not be displayed", () => {
        const contents: TreeNodeInfo[] = [
            { hasCaret: true, id: 0, label: "Item 0" },
            { childNodes: [{ id: 5, label: "Item 5" }], hasCaret: true, id: 1, label: "Item 1" },
            { hasCaret: false, id: 2, label: "Item 2" },
            { childNodes: [{ id: 6, label: "Item 6" }], hasCaret: false, id: 3, label: "Item 3" },
            { childNodes: [{ id: 7, label: "Item 7" }], id: 4, label: "Item 4" },
        ];
        render(<Tree contents={contents} />);

        expectHasCaret(screen.getByText("Item 0"), true);
        expectHasCaret(screen.getByText("Item 1"), true);
        expectHasCaret(screen.getByText("Item 2"), false);
        expectHasCaret(screen.getByText("Item 3"), false);
    });

    it("if not specified, caret visibility is determined by the presence of children", () => {
        const contents: TreeNodeInfo[] = [
            { id: 0, label: "Item 0" },
            { childNodes: [{ id: 5, label: "Item 5" }], id: 1, label: "Item 1" },
            { id: 2, label: "Item 2" },
            { childNodes: [{ id: 6, label: "Item 6" }], id: 3, label: "Item 3" },
            { childNodes: [{ id: 7, label: "Item 7" }], id: 4, label: "Item 4" },
        ];
        render(<Tree contents={contents} />);

        expectHasCaret(screen.getByText("Item 0"), false);
        expectHasCaret(screen.getByText("Item 1"), true);
        expectHasCaret(screen.getByText("Item 2"), false);
        expectHasCaret(screen.getByText("Item 3"), true);
    });

    it("caret direction is determined by node expansion", () => {
        const contents: TreeNodeInfo[] = [
            { childNodes: [{ id: 5, label: "Item 5" }], hasCaret: true, id: 0, isExpanded: false, label: "Item 0" },
            { hasCaret: true, id: 1, isExpanded: true, label: "Item 1" },
            { hasCaret: true, id: 2, isExpanded: false, label: "Item 2" },
            { childNodes: [{ id: 4, label: "Item 4" }], hasCaret: true, id: 3, isExpanded: true, label: "Item 3" },
        ];
        render(<Tree contents={contents} />);

        expectIsExpanded(screen.getByText("Item 0"), false);
        expectIsExpanded(screen.getByText("Item 1"), true);
        expectIsExpanded(screen.getByText("Item 2"), false);
        expectIsExpanded(screen.getByText("Item 3"), true);
    });

    it("event callbacks are fired correctly", async () => {
        const user = userEvent.setup();
        const onNodeClick = vi.fn();
        const onNodeCollapse = vi.fn();
        const onNodeContextMenu = vi.fn();
        const onNodeDoubleClick = vi.fn();
        const onNodeExpand = vi.fn();
        const onNodeMouseEnter = vi.fn();
        const onNodeMouseLeave = vi.fn();

        const contents: TreeNodeInfo[] = [
            { id: 0, label: "Item 0" },
            { childNodes: [{ id: 5, label: "Item 5" }], id: 1, label: "Item 1" },
            { id: 2, label: "Item 2" },
            { childNodes: [{ id: 6, label: "Item 6" }], id: 3, isExpanded: true, label: "Item 3" },
            { childNodes: [{ id: 7, label: "Item 7" }], id: 4, label: "Item 4" },
        ];

        render(
            <Tree
                contents={contents}
                onNodeClick={onNodeClick}
                onNodeCollapse={onNodeCollapse}
                onNodeContextMenu={onNodeContextMenu}
                onNodeDoubleClick={onNodeDoubleClick}
                onNodeExpand={onNodeExpand}
                onNodeMouseEnter={onNodeMouseEnter}
                onNodeMouseLeave={onNodeMouseLeave}
            />,
        );

        const item0Content = screen.getByText("Item 0").closest(`.${Classes.TREE_NODE_CONTENT}`);
        expect(item0Content).not.toBeNull();
        await user.click(item0Content!);
        expect(onNodeClick).toHaveBeenCalledOnce();
        expect(onNodeClick.mock.calls[0][1]).toEqual([0]);

        const item1Content = screen.getByText("Item 1").closest(`.${Classes.TREE_NODE_CONTENT}`);
        const item1Caret = item1Content!.querySelector(`.${Classes.TREE_NODE_CARET}`);
        expect(item1Caret).not.toBeNull();
        await user.click(item1Caret!);
        expect(onNodeExpand).toHaveBeenCalledOnce();
        // make sure that onNodeClick isn't fired again, only onNodeExpand should be
        expect(onNodeClick).toHaveBeenCalledTimes(1);
        expect(onNodeExpand.mock.calls[0][1]).toEqual([1]);

        const item6Content = screen.getByText("Item 6").closest(`.${Classes.TREE_NODE_CONTENT}`);
        expect(item6Content).not.toBeNull();
        await user.dblClick(item6Content!);
        expect(onNodeDoubleClick).toHaveBeenCalledOnce();
        expect(onNodeDoubleClick.mock.calls[0][1]).toEqual([3, 0]);

        const item3Content = screen.getByText("Item 3").closest(`.${Classes.TREE_NODE_CONTENT}`);
        const item3Caret = item3Content!.querySelector(`.${Classes.TREE_NODE_CARET}`);
        expect(item3Caret).not.toBeNull();
        await user.click(item3Caret!);
        expect(onNodeCollapse).toHaveBeenCalledOnce();
        expect(onNodeCollapse.mock.calls[0][1]).toEqual([3]);

        fireEvent.contextMenu(item0Content!);
        expect(onNodeContextMenu).toHaveBeenCalledOnce();
        expect(onNodeContextMenu.mock.calls[0][1]).toEqual([0]);

        const item2Content = screen.getByText("Item 2").closest(`.${Classes.TREE_NODE_CONTENT}`);
        expect(item2Content).not.toBeNull();
        onNodeMouseEnter.mockClear();
        onNodeMouseLeave.mockClear();
        fireEvent.mouseEnter(item2Content!);
        expect(onNodeMouseEnter).toHaveBeenCalledOnce();
        expect(onNodeMouseEnter.mock.calls[0][1]).toEqual([2]);

        fireEvent.mouseLeave(item2Content!);
        expect(onNodeMouseLeave).toHaveBeenCalledOnce();
        expect(onNodeMouseLeave.mock.calls[0][1]).toEqual([2]);
    });

    it("if disabled, event callbacks are not fired", async () => {
        const user = userEvent.setup();
        const onNodeClick = vi.fn();
        const onNodeCollapse = vi.fn();
        const onNodeContextMenu = vi.fn();
        const onNodeDoubleClick = vi.fn();
        const onNodeExpand = vi.fn();
        const onNodeMouseEnter = vi.fn();
        const onNodeMouseLeave = vi.fn();

        const contents: TreeNodeInfo[] = [
            { disabled: true, hasCaret: true, id: 0, isExpanded: false, label: "Item 0" },
        ];

        render(
            <Tree
                contents={contents}
                onNodeClick={onNodeClick}
                onNodeCollapse={onNodeCollapse}
                onNodeContextMenu={onNodeContextMenu}
                onNodeDoubleClick={onNodeDoubleClick}
                onNodeExpand={onNodeExpand}
                onNodeMouseEnter={onNodeMouseEnter}
                onNodeMouseLeave={onNodeMouseLeave}
            />,
        );

        const item0Content = screen.getByText("Item 0").closest(`.${Classes.TREE_NODE_CONTENT}`);
        expect(item0Content).not.toBeNull();
        const item0Caret = item0Content!.querySelector<HTMLElement>(`.${Classes.TREE_NODE_CARET}`);
        expect(item0Caret).not.toBeNull();

        await user.click(item0Content!);
        expect(onNodeClick).not.toHaveBeenCalled();

        await user.dblClick(item0Content!);
        expect(onNodeDoubleClick).not.toHaveBeenCalled();

        await user.pointer([{ keys: "[MouseRight]", target: item0Content! }]);
        expect(onNodeContextMenu).not.toHaveBeenCalled();

        await user.hover(item0Content!);
        expect(onNodeMouseEnter).not.toHaveBeenCalled();

        await user.unhover(item0Content!);
        expect(onNodeMouseLeave).not.toHaveBeenCalled();

        await user.click(item0Caret!);
        expect(onNodeExpand).not.toHaveBeenCalled();

        await user.click(item0Caret!);
        expect(onNodeCollapse).not.toHaveBeenCalled();
    });

    it("disabled nodes are rendered correctly", () => {
        const contents: TreeNodeInfo[] = [
            { disabled: true, id: 0, label: "Item 0" },
            { id: 1, label: "Item 1" },
        ];
        render(<Tree contents={contents} />);

        expect(screen.getByText("Item 0").closest(`.${Classes.TREE_NODE}`)).toHaveClass(Classes.DISABLED);
        expect(screen.getByText("Item 1").closest(`.${Classes.TREE_NODE}`)).not.toHaveClass(Classes.DISABLED);
    });

    it("icons are rendered correctly if present", () => {
        const contents: TreeNodeInfo[] = [
            { id: 0, label: "Item 0" },
            { icon: <div data-testid="custom-icon-1" />, id: 1, label: "Item 1" },
        ];
        render(<Tree contents={contents} />);

        expect(
            screen
                .getByText("Item 0")
                .closest(`.${Classes.TREE_NODE_CONTENT}`)!
                .querySelector(`.${Classes.TREE_NODE_ICON}`),
        ).toBeNull();
        expect(screen.getByText("Item 1").closest(`.${Classes.TREE_NODE}`)).toContainElement(
            screen.getByTestId("custom-icon-1"),
        );
    });

    it("isExpanded controls node expansion", () => {
        const contents: TreeNodeInfo[] = [
            { id: 0, label: "Item 0" },
            { childNodes: [{ id: 5, label: "Item 5" }], id: 1, label: "Item 1" },
            { id: 2, label: "Item 2" },
            { childNodes: [{ id: 6, label: "Item 6" }], id: 3, isExpanded: false, label: "Item 3" },
            { childNodes: [{ id: 7, label: "Item 7" }], id: 4, isExpanded: true, label: "Item 4" },
        ];
        const { container } = render(<Tree contents={contents} />);
        const nodes = container.querySelectorAll("li");

        // 5 nodes should be visible: 0,1,2,3,4 and only 7 as child of 4
        expect(nodes).toHaveLength(6);

        expect(nodes[0]).not.toHaveClass(Classes.TREE_NODE_EXPANDED);
        expect(nodes[1]).not.toHaveClass(Classes.TREE_NODE_EXPANDED);
        expect(nodes[2]).not.toHaveClass(Classes.TREE_NODE_EXPANDED);
        expect(nodes[3]).not.toHaveClass(Classes.TREE_NODE_EXPANDED);
        expect(nodes[4]).toHaveClass(Classes.TREE_NODE_EXPANDED);
        expect(nodes[5].querySelector(`.${Classes.TREE_NODE_LABEL}`)).toHaveTextContent("Item 7");
    });

    it("isSelected selects nodes", () => {
        const contents: TreeNodeInfo[] = [
            { id: 0, isSelected: false, label: "Item 0" },
            { id: 1, isSelected: true, label: "Item 1" },
        ];

        const { container } = render(<Tree contents={contents} />);
        const nodes = container.querySelectorAll("li");

        expect(nodes).toHaveLength(2);
        expect(nodes[0]).not.toHaveClass(Classes.TREE_NODE_SELECTED);
        expect(nodes[1]).toHaveClass(Classes.TREE_NODE_SELECTED);
    });

    it("secondaryLabel renders correctly", () => {
        const contents: TreeNodeInfo[] = [
            { id: 0, label: "Item 0" },
            { id: 1, label: "Item 1", secondaryLabel: "Secondary" },
            { id: 2, label: "Item 2", secondaryLabel: <p>Paragraph</p> },
        ];
        render(<Tree contents={contents} />);

        const item0Content = screen.getByText("Item 0").closest(`.${Classes.TREE_NODE_CONTENT}`);
        expect(item0Content).not.toBeNull();
        expect(item0Content!.querySelector(`.${Classes.TREE_NODE_SECONDARY_LABEL}`)).toBeNull();

        const item1Content = screen.getByText("Item 1").closest(`.${Classes.TREE_NODE_CONTENT}`);
        expect(item1Content).toContainElement(screen.getByText("Secondary"));

        const item2Content = screen.getByText("Item 2").closest(`.${Classes.TREE_NODE_CONTENT}`);
        expect(item2Content).toContainElement(screen.getByText("Paragraph"));
    });

    it("getNodeContentElement returns references to underlying node elements", async () => {
        const contents: TreeNodeInfo[] = [
            { id: 0, label: "Item 0" },
            { childNodes: [{ id: 5, label: "Item 5" }], id: 1, isExpanded: true, label: "Item 1" },
        ];

        const treeRef = createRef<Tree>();
        const { rerender } = render(<Tree ref={treeRef} contents={contents} />);

        expect(treeRef.current).not.toBeNull();
        expect(treeRef.current!.getNodeContentElement(5)).toContainElement(screen.getByText("Item 5"));
        expect(treeRef.current!.getNodeContentElement(100)).toBeUndefined();

        contents[1].isExpanded = false;
        rerender(<Tree ref={treeRef} contents={contents} />);
        // wait for animation to finish
        await waitFor(() => {
            expect(treeRef.current!.getNodeContentElement(5)).toBeUndefined();
        });
    });

    it("allows nodes to be removed without throwing", () => {
        const contents: TreeNodeInfo[] = [
            { id: 0, label: "Item 0" },
            { id: 1, label: "Item 1" },
        ];
        const { rerender } = render(<Tree contents={contents} />);

        const smallerContents = contents.slice(0, -1);
        expect(() => rerender(<Tree contents={smallerContents} />)).not.toThrow();
    });
});

function expectHasCaret(element: HTMLElement, hasCaret: boolean) {
    const treeNodeContent = element.closest(`.${Classes.TREE_NODE_CONTENT}`);
    expect(treeNodeContent).not.toBeNull();
    if (hasCaret) {
        expect(treeNodeContent!.querySelector(`.${Classes.TREE_NODE_CARET}`)).toBeInTheDocument();
    } else {
        expect(treeNodeContent!.querySelector(`.${Classes.TREE_NODE_CARET_NONE}`)).toBeInTheDocument();
    }
}

function expectIsExpanded(element: HTMLElement, isExpanded: boolean) {
    const treeNode = element.closest(`.${Classes.TREE_NODE}`);
    expect(treeNode).not.toBeNull();
    if (isExpanded) {
        expect(treeNode).toHaveClass(Classes.TREE_NODE_EXPANDED);
    } else {
        expect(treeNode).not.toHaveClass(Classes.TREE_NODE_EXPANDED);
    }
}
