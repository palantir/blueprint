import * as React from "react";

import { IPageData } from "documentalist/dist/client";

export type TagRenderer = (value: string, key: React.Key, page: IPageData) => JSX.Element | undefined;

export interface IPageProps {
    page: IPageData;
    tagRenderers: { [tag: string]: TagRenderer };
}

export const Page: React.SFC<IPageProps> = ({ tagRenderers, page }) => {
    const pageContents = page.contents.map((node, i) => {
        if (typeof node === "string") {
            return <div className="docs-section" dangerouslySetInnerHTML={{ __html: node }} key={i} />;
        } else {
            const renderer = tagRenderers[node.tag];
            if (renderer === undefined) {
                console.error("Unknown tag '@%s' in '%s'; please supply a renderer.", node.tag, page.reference);
                return undefined;
            }
            return renderer(node.value, i, page);
        }
    });
    return <div>{pageContents}</div>;
};
