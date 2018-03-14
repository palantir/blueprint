/// <reference types="react" />
import { ITreeNode } from "@blueprintjs/core";
import { BaseExample, IBaseExampleProps } from "@blueprintjs/docs-theme";
export interface ITreeExampleState {
    nodes: ITreeNode[];
}
export declare class TreeExample extends BaseExample<ITreeExampleState> {
    constructor(props: IBaseExampleProps);
    shouldComponentUpdate(): boolean;
    protected renderExample(): JSX.Element;
    private handleNodeClick;
    private handleNodeCollapse;
    private handleNodeExpand;
    private forEachNode(nodes, callback);
}
