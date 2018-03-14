/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
export declare class Tooltip2Example extends BaseExample<{
    isOpen: boolean;
}> {
    state: {
        isOpen: boolean;
    };
    protected renderExample(): JSX.Element;
    private toggleControlledTooltip2;
}
