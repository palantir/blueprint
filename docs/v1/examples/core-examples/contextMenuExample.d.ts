/// <reference types="react" />
import * as React from "react";
import { BaseExample } from "@blueprintjs/docs-theme";
/**
 * This component uses the decorator API and implements the IContextMenuTarget interface.
 */
export declare class ContextMenuExample extends BaseExample<{}> {
    className: string;
    renderContextMenu(e: React.MouseEvent<HTMLElement>): JSX.Element;
    renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element;
}
