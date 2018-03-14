/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
export declare class TagExample extends BaseExample<{
    showTag?: boolean;
}> {
    state: {
        showTag: boolean;
    };
    protected className: string;
    protected renderExample(): JSX.Element;
    private maybeRenderTag();
    private deleteTag;
}
